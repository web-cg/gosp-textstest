const contentForm = document.getElementById('contentForm');
const contentBoxes = document.getElementById('contentBoxes');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const removeImage = document.getElementById('removeImage');
const confirmationDialog = document.getElementById('confirmationDialog');
const clearAllButton = document.getElementById('clearAll');

// Modal für das vergrößerte Bild
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');

// Funktion: Vorschau anzeigen
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.src = reader.result;
      imagePreview.style.display = 'block';
      removeImage.style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
  }
});

// Funktion: Vorschau entfernen
removeImage.addEventListener('click', () => {
  imageInput.value = '';
  imagePreview.style.display = 'none';
  removeImage.style.display = 'none';
});

// Funktion: Box hinzufügen
contentForm.addEventListener('submit', e => {
  e.preventDefault();

  const title = document.getElementById('titleInput').value;
  const text = document.getElementById('textInput').value;
  const image = imagePreview.src || '';
  const date = new Date().toLocaleDateString('de-DE');

  createBox({ title, text, image, date });
  saveBox({ title, text, image, date });

  // Input-Felder leeren
  document.getElementById('titleInput').value = '';
  document.getElementById('textInput').value = '';
  imageInput.value = '';
  imagePreview.style.display = 'none';
  removeImage.style.display = 'none';
});

// Funktion: Box erstellen
function createBox({ title, text, image, date }) {
  const box = document.createElement('div');
  box.className = 'content-box';

  const titleElem = document.createElement('div');
  titleElem.className = 'content-title';
  titleElem.textContent = title;

  const imageElem = document.createElement('img');
  imageElem.className = 'content-image';
  imageElem.src = image;

  // Klick auf Bild, um es zu vergrößern
  imageElem.addEventListener('click', () => {
    modalImage.src = image; // Bild ins Modal setzen
    imageModal.classList.remove('hidden'); // Modal anzeigen
  });

  const textElem = document.createElement('div');
  textElem.className = 'content-text';
  textElem.textContent = text;

  const dateElem = document.createElement('div');
  dateElem.className = 'content-date';
  dateElem.textContent = date;

  // Löschen-Button für jede Box
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-box';
  deleteButton.textContent = 'Löschen';
  deleteButton.addEventListener('click', () => {
    const confirmed = confirm('Möchten Sie diese Box wirklich löschen?');
    if (confirmed) {
      box.remove();
      deleteBoxData(title); // Löscht die Box aus localStorage
    }
  });

  box.append(titleElem, imageElem, textElem, dateElem, deleteButton);
  contentBoxes.appendChild(box);
}

// Funktion: Gespeicherte Boxen laden
function loadBoxes() {
  const savedBoxes = JSON.parse(localStorage.getItem('contentBoxes')) || [];
  savedBoxes.forEach(createBox);
}

// Funktion: Löschen einer Box aus localStorage
function deleteBoxData(title) {
  const savedBoxes = JSON.parse(localStorage.getItem('contentBoxes')) || [];
  const updatedBoxes = savedBoxes.filter(box => box.title !== title);
  localStorage.setItem('contentBoxes', JSON.stringify(updatedBoxes));
}

// Funktion: Box speichern
function saveBox(data) {
  const savedBoxes = JSON.parse(localStorage.getItem('contentBoxes')) || [];
  savedBoxes.push(data);
  localStorage.setItem('contentBoxes', JSON.stringify(savedBoxes));
}

// Event Listener zum Schließen des Modals
closeModal.addEventListener('click', () => {
  imageModal.classList.add('hidden'); // Modal schließen
});

// Initialisieren
loadBoxes();
