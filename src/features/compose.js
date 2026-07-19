import { MOODS } from "../lib/moods.js";
import { getEntries, saveEntries, newId } from "../lib/storage.js";
import { openReflectionModal } from "./reflectionModal.js";

export function initCompose() {
  const form = document.getElementById("entry-form");
  const moodPicker = document.getElementById("mood-picker");
  const entryList = document.getElementById("entry-list");
  const template = document.getElementById("entry-template");
  const songTitleInput = document.getElementById("song-title");
  const artistNameInput = document.getElementById("artist-name");
  const songNoteInput = document.getElementById("song-note");
  const selectedMoodLabel = document.getElementById("selected-mood-label");
  const libraryFilterLabel = document.getElementById("library-filter-label");

  let selectedMood = MOODS[0].name;
  let activeFilter = "All";
  let entries = getEntries();

  for (const mood of MOODS) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "mood-chip";
    chip.dataset.mood = mood.name;
    chip.textContent = mood.name;
    moodPicker.append(chip);
  }
  selectedMoodLabel.textContent = selectedMood;

  renderEntries();

  moodPicker.addEventListener("click", (event) => {
    const clickedChip = event.target.closest(".mood-chip");
    if (!clickedChip) return;

    if (clickedChip.dataset.filter === "All") {
      activeFilter = "All";
    } else {
      selectedMood = clickedChip.dataset.mood;
      activeFilter = selectedMood;
      selectedMoodLabel.textContent = selectedMood;
    }

    moodPicker.querySelectorAll(".mood-chip").forEach((chip) => {
      chip.classList.toggle("selected", chip === clickedChip);
    });

    renderEntries();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const songTitle = songTitleInput.value.trim();
    const artistName = artistNameInput.value.trim();
    const songNote = songNoteInput.value.trim();

    if (!songTitle || !artistName) return;

    entries.unshift({
      id: newId(),
      mood: selectedMood,
      songTitle,
      artistName,
      songNote,
      createdAt: Date.now(),
    });

    saveEntries(entries);
    renderEntries();
    form.reset();
  });

  entryList.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-button");
    if (deleteButton) {
      const { entryId } = deleteButton.dataset;
      entries = entries.filter((entry) => entry.id !== entryId);
      saveEntries(entries);
      renderEntries();
      return;
    }

    const reflectButton = event.target.closest(".reflect-button");
    if (reflectButton) {
      const { entryId } = reflectButton.dataset;
      const entry = entries.find((e) => e.id === entryId);
      if (!entry) return;
      openReflectionModal({
        targetType: "entry",
        targetId: entry.id,
        targetMood: entry.mood,
        label: entry.songTitle,
      });
    }
  });

  function renderEntries() {
    entryList.innerHTML = "";
    libraryFilterLabel.textContent =
      activeFilter === "All" ? "Showing all songs" : `Showing ${activeFilter} songs`;

    if (entries.length === 0) {
      showEmptyState("Your songs will show up here. Start with one song that feels honest today.");
      return;
    }

    const visibleEntries =
      activeFilter === "All" ? entries : entries.filter((entry) => entry.mood === activeFilter);

    if (visibleEntries.length === 0) {
      showEmptyState(`No ${activeFilter} songs saved yet.`);
      return;
    }

    visibleEntries.forEach((entry) => {
      const entryNode = template.content.firstElementChild.cloneNode(true);

      entryNode.querySelector(".entry-mood").textContent = entry.mood;
      entryNode.querySelector(".entry-song").textContent = entry.songTitle;
      entryNode.querySelector(".entry-artist").textContent = entry.artistName;

      const noteNode = entryNode.querySelector(".entry-note");
      if (entry.songNote) {
        noteNode.textContent = entry.songNote;
      } else {
        noteNode.remove();
      }

      entryNode.querySelector(".delete-button").dataset.entryId = entry.id;
      entryNode.querySelector(".reflect-button").dataset.entryId = entry.id;

      entryList.append(entryNode);
    });
  }

  function showEmptyState(message) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-state";
    emptyMessage.textContent = message;
    entryList.append(emptyMessage);
  }

  return {
    getLibrarySnapshot: () => entries,
    filterToMood: (moodName) => {
      const chip = [...moodPicker.querySelectorAll(".mood-chip")].find((c) => c.dataset.mood === moodName);
      chip?.click();
    },
  };
}
