console.log("JavaScript is connected!");

const saveButton = document.getElementById("save-button");
const savedMessage = document.getElementById("saved-message");
const songInput = document.getElementById("song-input");

saveButton.addEventListener("click", function () {
  savedMessage.textContent = "Saved: " + songInput.value;
});