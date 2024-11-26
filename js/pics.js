const imageForm = document.getElementById('imageForm');
const imageInput = document.getElementById('imageInput');
const fileNamesDisplay = document.getElementById('fileNames');
const imageGallery = document.getElementById('imageGallery');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');

// Dateinamen anzeigen, wenn Dateien ausgewählt werden
imageInput.addEventListener('change', () => {
  const files = Array.from(imageInput.files);
  if (files.length > 0) {
    const fileNames = files.map(file => file.name).join(', ');
    fileNamesDisplay.textContent = `Ausgewählte Dateien: ${fileNames}`;
  } else {
    fileNamesDisplay.textContent = 'Keine Datei ausgewählt';
  }
});

// Bilder aus localStorage laden
function loadImages() {
  const savedImages = JSON.parse(localStorage.getItem('images')) || [];
  savedImages.forEach(createGalleryItem);
}

// Galerie-Item erstellen
function createGalleryItem(imageData) {
  const galleryItem = document.createElement('div');
  galleryItem.className = 'gallery-item';

  const img = document.createElement('img');
  img.src = imageData;
  img.alt = 'Hochgeladenes Bild';

  // Klick auf Bild für Vergrößerung
  img.addEventListener('click', () => {
    modalImage.src = imageData;
    imageModal.classList.remove('hidden');
  });

  // Löschen-Button erstellen
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-image';
  deleteButton.textContent = '✕';
  deleteButton.addEventListener('click', () => {
    const confirmed = confirm('Sind Sie sicher, dass Sie dieses Bild löschen möchten?');
    if (confirmed) {
      galleryItem.remove(); // Bild aus Galerie entfernen
      deleteImageFromStorage(imageData); // Bild aus localStorage entfernen
    }
  });

  galleryItem.appendChild(img);
  galleryItem.appendChild(deleteButton);
  imageGallery.appendChild(galleryItem);
}

// Bilder in localStorage speichern
function saveImageToStorage(imageData) {
  const savedImages = JSON.parse(localStorage.getItem('images')) || [];
  savedImages.push(imageData);
  localStorage.setItem('images', JSON.stringify(savedImages));
}

// Bild aus localStorage entfernen
function deleteImageFromStorage(imageData) {
  const savedImages = JSON.parse(localStorage.getItem('images')) || [];
  const updatedImages = savedImages.filter(img => img !== imageData);
  localStorage.setItem('images', JSON.stringify(updatedImages));
}

// Event: Bilder hochladen
imageForm.addEventListener('submit', e => {
  e.preventDefault();

  const files = Array.from(imageInput.files);

  if (files.length > 5) {
    alert('Sie können maximal 5 Bilder auf einmal hochladen.');
    return;
  }

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result;
      createGalleryItem(imageData); // Bild zur Galerie hinzufügen
      saveImageToStorage(imageData); // Bild in localStorage speichern
    };
    reader.readAsDataURL(file);
  });

  // Formular zurücksetzen
  imageForm.reset();
  fileNamesDisplay.textContent = 'Keine Datei ausgewählt';
});

// Modal schließen
closeModal.addEventListener('click', () => {
  imageModal.classList.add('hidden');
});

// Initialisieren: Bilder laden
loadImages();
