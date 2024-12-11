let db;
const dbName = 'contactsDB';

document.addEventListener('DOMContentLoaded', () => {
  const request = indexedDB.open(dbName, 1);

  request.onupgradeneeded = (event) => {
    db = event.target.result;
    const objectStore = db.createObjectStore('contacts', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('name', 'name', { unique: false }); // 이름 인덱스 추가
    objectStore.createIndex('reason', 'reason', { unique: false }); // 이유 인덱스 추가
    console.log('Database setup complete');
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    console.log('Database opened successfully');
  };

  request.onerror = (event) => {
    console.error('Database error:', event.target.errorCode);
  };
});

function addContact() {
  const name = document.getElementById('name').value.trim();
  const reason = document.getElementById('why').value.trim();

  if (!name || !reason) {
    alert('모든 필드를 채워주세요!');
    return;
  }

  const transaction = db.transaction(['contacts'], 'readwrite');
  const objectStore = transaction.objectStore('contacts');

  const request = objectStore.add({ name: name, reason: reason });

  request.onsuccess = () => {
    console.log('Contact added successfully');
    document.getElementById('name').value = '';
    document.getElementById('why').value = '';
    displayAllContacts();
  };

  request.onerror = (event) => {
    console.error('Error adding contact:', event.target.errorCode);
  };
}

function displayAllContacts() {
  const transaction = db.transaction(['contacts'], 'readonly');
  const objectStore = transaction.objectStore('contacts');
  const request = objectStore.openCursor();
  const contactsTable = document.getElementById('contactsTable');

  contactsTable.innerHTML = ''; // 테이블 초기화

  request.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      const contact = cursor.value;
      const row = contactsTable.insertRow();
      row.insertCell(0).textContent = contact.name;
      row.insertCell(1).textContent = contact.reason; 

      const deleteCell = row.insertCell();
      const deleteButton = document.createElement('button');
      deleteButton.textContent = '삭제';
      deleteButton.onclick = () => deleteContact(contact.id);
      deleteCell.appendChild(deleteButton);

      cursor.continue();
    } else {
      console.log('All contacts displayed');
    }
  };

  request.onerror = (event) => {
    console.error('Error displaying contacts:', event.target.errorCode);
  };
}

function deleteContact(id) {
  const transaction = db.transaction(['contacts'], 'readwrite');
  const objectStore = transaction.objectStore('contacts');
  const request = objectStore.delete(id);

  request.onsuccess = () => {
    console.log(`Contact with ID ${id} deleted successfully`);
    displayAllContacts();
  };

  request.onerror = (event) => {
    console.error(`Error deleting contact: ${event.target.errorCode}`);
  };
}

