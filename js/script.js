let contacts = [];

const contactList = document.getElementById('contactList');
const contactForm = document.getElementById('contactForm');
const searchInput = document.getElementById('searchInput');

// Поиск контактов
searchInput.addEventListener('input', () => {
    const searchQuery = searchInput.value.toLowerCase();
    const filteredContacts = contacts.filter(contact => {
        return contact.name.toLowerCase().includes(searchQuery) || contact.phone.includes(searchQuery);
    });
    updateContactsList(filteredContacts);
});

// Добавление контакта
const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const updateContactsList = (filteredContacts = contacts) => {
    filteredContacts.sort((a, b) => {
        if (a.isFavorite === b.isFavorite) {
            return a.name.localeCompare(b.name);
        }
        return a.isFavorite ? -1 : 1;
    });

    contactList.innerHTML = '';

    filteredContacts.forEach(contact => {
        const card = document.createElement('tr');
        card.classList.add('contact');
        const contactImage = contact.picture ? 
            `<img src="${contact.picture}" alt="Фото" class="contact__image-picture">` : 
            `<div class="contact__image-picture" style="background-color: ${generateRandomColor()}">${contact.name.charAt(0)}</div>`;
        card.innerHTML = `
        <th class="contact__image">
            ${contactImage}
        </th>
        <th class="contact__info">
            <div class="contact__name">${contact.name}</div>
            <div class="contact__phone">${contact.phone}</div>
        </th>
        <th class="contact__buttons">
            <button class="contact__del" onclick="deleteContact(${contact.id})">
                <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 11V17" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M14 11V17" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M4 7H20" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </button>
            <button class="contact__favorite" onclick="favoriteContact(${contact.id})">
                ${contact.isFavorite ? 
                    `<svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.0489 4.92705C11.3483 4.00574 12.6517 4.00574 12.9511 4.92705L14.2451 8.90983C14.379 9.32185 14.763 9.60081 15.1962 9.60081H19.3839C20.3527 9.60081 20.7554 10.8404 19.9717 11.4098L16.5838 13.8713C16.2333 14.126 16.0866 14.5773 16.2205 14.9894L17.5146 18.9721C17.8139 19.8934 16.7595 20.6596 15.9757 20.0902L12.5878 17.6287C12.2373 17.374 11.7627 17.374 11.4122 17.6287L8.02426 20.0902C7.24054 20.6596 6.18607 19.8934 6.48542 18.9721L7.7795 14.9894C7.91338 14.5773 7.76672 14.126 7.41623 13.8713L4.02827 11.4098C3.24456 10.8404 3.64734 9.60081 4.61606 9.60081H8.8038C9.23703 9.60081 9.62099 9.32185 9.75486 8.90983L11.0489 4.92705Z" stroke="#ffff80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>` : 
                    `<svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.0489 4.92705C11.3483 4.00574 12.6517 4.00574 12.9511 4.92705L14.2451 8.90983C14.379 9.32185 14.763 9.60081 15.1962 9.60081H19.3839C20.3527 9.60081 20.7554 10.8404 19.9717 11.4098L16.5838 13.8713C16.2333 14.126 16.0866 14.5773 16.2205 14.9894L17.5146 18.9721C17.8139 19.8934 16.7595 20.6596 15.9757 20.0902L12.5878 17.6287C12.2373 17.374 11.7627 17.374 11.4122 17.6287L8.02426 20.0902C7.24054 20.6596 6.18607 19.8934 6.48542 18.9721L7.7795 14.9894C7.91338 14.5773 7.76672 14.126 7.41623 13.8713L4.02827 11.4098C3.24456 10.8404 3.64734 9.60081 4.61606 9.60081H8.8038C9.23703 9.60081 9.62099 9.32185 9.75486 8.90983L11.0489 4.92705Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>`}
            </button>
        </th>`;
        contactList.appendChild(card);
    });
}

contactForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const pictureInput = document.getElementById('picture');
    const pictureBase64 = pictureInput.files.length > 0 ? await getBase64(pictureInput.files[0]) : '';
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const isFavorite = document.getElementById('isFavorite').checked;

    const newContact = {
        id: Date.now(),
        picture: pictureBase64,
        name,
        phone,
        isFavorite
    };

    contacts.push(newContact);
    contactForm.classList.toggle('contactForm-visible');
    updateContactsList();
    saveContactsToCookies();
});


// Управление контактами
const deleteContact = (id) => {
    contacts = contacts.filter(contact => contact.id !== id);
    updateContactsList();
    saveContactsToCookies();
};

const favoriteContact = (id) => {
    const contact = contacts.find(contact => contact.id === id);
    if (contact) {
        contact.isFavorite = !contact.isFavorite;
        updateContactsList();
        saveContactsToCookies();
    }
};


// Добавление фото
document.getElementById('contact_add').addEventListener('click', () => {
    document.querySelector('.picture-file').textContent = 'Добавить фото';
    contactForm.reset();
    contactForm.classList.toggle('contactForm-visible');
});

document.getElementById('picture').addEventListener('change', (input) => {
    const fileName = input.target.files[0]?.name || "Файл не выбран";
    document.querySelector('.picture-file').textContent = fileName;
});

const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});


// Куки
const saveContactsToCookies = () => {
    const contactsWithoutPictures = contacts.map(contact => {
        const { picture, ...contactWithoutPicture } = contact;
        return contactWithoutPicture;
    });
    document.cookie = `contacts=${JSON.stringify(contactsWithoutPictures)}; path=/; max-age=99999999`;
};
const loadContactsFromCookies = () => {
    const cookies = document.cookie.split('; ');
    const contactsCookie = cookies.find(cookie => cookie.startsWith('contacts='));
    
    if (contactsCookie) {
        const contactsData = JSON.parse(contactsCookie.split('=')[1]);
        contacts = contactsData || [];
    }
};

//

window.addEventListener('load', () => {
    loadContactsFromCookies();
    updateContactsList();
});