const form = document.getElementById("entry-form");
const moodPicker = document.getElementById("mood-picker");
const filterPicker = document.getElementById("filter-picker");
const entryList = document.getElementById("entry-list");
const template = document.getElementById("entry-template");
const songTitleInput = document.getElementById("song-title");
const artistNameInput = document.getElementById("artist-name");
const songNoteInput = document.getElementById("song-note");

const storageKey = "mood-mix-entries";

let selectedMood = "Euphoric";
let activeFilter = "All";
let entries = loadEntries();

renderEntries();

moodPicker.addEventListener("click", (event) => {
  const clickedChip = event.target.closest(".mood-chip");

  if (!clickedChip) {
    return;
  }

  selectedMood = clickedChip.dataset.mood;

  document.querySelectorAll(".mood-chip").forEach((chip) => {
    chip.classList.toggle("selected", chip === clickedChip);
  });
});

filterPicker.addEventListener("click", (event) => {
  const clickedFilter = event.target.closest(".filter-chip");

  if (!clickedFilter) {
    return;
  }

  activeFilter = clickedFilter.dataset.filter;

  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.classList.toggle("selected", chip === clickedFilter);
  });

  renderEntries();

});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const songTitle = songTitleInput.value.trim();
  const artistName = artistNameInput.value.trim();
  const songNote = songNoteInput.value.trim();

  if (!songTitle || !artistName) {
    return;
  }

  const newEntry = {
    id: crypto.randomUUID(),
    mood: selectedMood,
    songTitle,
    artistName,
    songNote,
  };

  entries.unshift(newEntry);
  saveEntries();
  renderEntries();
  form.reset();
});

entryList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-button");

  if (!deleteButton) {
    return;
  }

  const { entryId } = deleteButton.dataset;
  entries = entries.filter((entry) => entry.id !== entryId);
  saveEntries();
  renderEntries();
});

function renderEntries() {
  entryList.innerHTML = "";

  if (entries.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-state";
    emptyMessage.textContent =
      "Your songs will show up here. Start with one song that feels honest today.";
    entryList.append(emptyMessage);
    return;
  }

const visibleEntries = activeFilter === "All"
  ? entries
  : entries.filter((entry) => entry.mood === activeFilter);

  if (visibleEntries.length === 0) {
  const emptyMessage = document.createElement("p");
  emptyMessage.className = "empty-state";
  emptyMessage.textContent = `No ${activeFilter} songs saved yet.`;
  entryList.append(emptyMessage);
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

    const deleteButton = entryNode.querySelector(".delete-button");
    deleteButton.dataset.entryId = entry.id;

    entryList.append(entryNode);
  });
}

function loadEntries() {
  const savedEntries = localStorage.getItem(storageKey);
  return savedEntries ? JSON.parse(savedEntries) : [];
}

function saveEntries() {
  localStorage.setItem(storageKey, JSON.stringify(entries));
}
