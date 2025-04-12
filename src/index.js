import initialCards from './scripts/cards.js';
import './pages/index.css';
import avatarImage from './images/avatar.jpg';
import { createCard } from './components/card.js';
import { openPopup, closePopup } from './components/modal.js';

const profileImageElement = document.querySelector('.profile__image'); 
profileImageElement.style.backgroundImage = `url(${avatarImage})`;

const cardsContainer = document.querySelector('.places__list'); 

const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');

const profileNameElement = document.querySelector('.profile__title');
const profileDescriptionElement = document.querySelector('.profile__description');

const nameInput = popupEdit.querySelector('.popup__input_type_name');
const descriptionInput = popupEdit.querySelector('.popup__input_type_description');

const cardNameInput = popupNewCard.querySelector('.popup__input_type_card-name');
const cardLinkInput = popupNewCard.querySelector('.popup__input_type_url');

function renderCards(initialCards, cardsContainer, openPopupImage) {
  initialCards.forEach(cardData => {
      const cardElement = createCard(cardData, openPopupImage);
      cardsContainer.append(cardElement);
  });
}

function openPopupEdit() {
  nameInput.value = profileNameElement.textContent;
  descriptionInput.value = profileDescriptionElement.textContent;
  openPopup(popupEdit);
}

function closePopupEdit() {
  closePopup(popupEdit);
}

function savePopupEdit(event) {
  event.preventDefault();
  profileNameElement.textContent = nameInput.value;
  profileDescriptionElement.textContent = descriptionInput.value;
  closePopupEdit();
}

function openPopupNewCard() {
  cardNameInput.value = '';
  cardLinkInput.value = '';
  openPopup(popupNewCard);
}

function closePopupNewCard() {
  closePopup(popupNewCard);
}

function savePopupNewCard(event) {
  event.preventDefault();
  if (!cardNameInput.value || !cardLinkInput.value) {
      return;
  }
  const newCardData = {
      name: cardNameInput.value,
      link: cardLinkInput.value
  };

  const cardElement = createCard(newCardData, openPopupImage);
  cardsContainer.prepend(cardElement);
  closePopupNewCard();
}

function openPopupImage(imageSrc, imageAlt) {
  const popupImageElement = popupImage.querySelector('.popup__image');
  const popupCaptionElement = popupImage.querySelector('.popup__caption');
  popupImageElement.src = imageSrc;
  popupImageElement.alt = imageAlt;
  popupCaptionElement.textContent = imageAlt;
  openPopup(popupImage);
}

function closePopupImage() {
  closePopup(popupImage);
}

renderCards(initialCards, cardsContainer, openPopupImage);

document.querySelector('.profile__edit-button').addEventListener('click', openPopupEdit);
popupEdit.querySelector('.popup__close').addEventListener('click', closePopupEdit);
popupEdit.querySelector('.popup__button').addEventListener('click', savePopupEdit);

document.querySelector('.profile__add-button').addEventListener('click', openPopupNewCard);
popupNewCard.querySelector('.popup__close').addEventListener('click', closePopupNewCard);
popupNewCard.querySelector('.popup__button').addEventListener('click', savePopupNewCard);

document.querySelector('.popup_type_image').querySelector('.popup__close').addEventListener('click', closePopupImage);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closePopupEdit();
    closePopupNewCard();
    closePopupImage();
  }
});

function closePopupOnOverlay(event, popup) {
  if (event.target === popup) {
    closePopup(popup);
  }
}

popupEdit.addEventListener('mousedown', (event) => closePopupOnOverlay(event, popupEdit));
popupNewCard.addEventListener('mousedown', (event) => closePopupOnOverlay(event, popupNewCard));
popupImage.addEventListener('mousedown', (event) => closePopupOnOverlay(event, popupImage));