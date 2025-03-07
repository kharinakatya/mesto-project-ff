import initialCards from './scripts/cards.js';
import { openModal } from './components/modal.js'
import { closeModal } from './components/modal.js'
import './pages/index.css';
import avatarImage from './images/avatar.jpg';

const cardsContainer = document.querySelector('.places__list');
const template = document.querySelector('#card-template').content; 

function deleteCard(event) {
    const cardElement = event.currentTarget.closest('.card');
    if (cardElement) {
        cardElement.remove();
    }
}

function createCard(data, deleteCard, handleLike) {
    const cardElement = template.querySelector('.card').cloneNode(true);
    
    const imageElement = cardElement.querySelector('.card__image');
    const titleElement = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');

    imageElement.src = data.link;
    imageElement.alt = data.name;
    titleElement.textContent = data.name;

    deleteButton.addEventListener('click', deleteCard);
    likeButton.addEventListener('click', handleLike);
    
    return cardElement;
}

function renderCards(initialCards, handleLike) {
    initialCards.forEach(cardData => {
        const cardElement = createCard(cardData, deleteCard, handleLike);
        cardsContainer.append(cardElement);
    });
}

// Пример функции обработчика лайка
function handleLike(event) {
    const likeButton = event.currentTarget;
    likeButton.classList.toggle('card__like-button_is-active');
}

// Передайте функцию обработчика лайка при рендеринге карточек
renderCards(initialCards, handleLike);


const profileImageElement = document.querySelector('.profile__image');
profileImageElement.style.backgroundImage = `url(${avatarImage})`;

