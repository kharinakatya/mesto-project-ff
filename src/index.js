import initialCards from './scripts/cards.js';
import './pages/index.css';
import avatarImage from './images/avatar.jpg';
import { renderCards, createCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';


const profileImageElement = document.querySelector('.profile__image'); 
profileImageElement.style.backgroundImage = `url(${avatarImage})`;

const cardsContainer = document.querySelector('.places__list'); 

const popupEdit = document.querySelector('.popup_type_edit');
const popupCloseButtonEdit = popupEdit.querySelector('.popup__close');
const popupOpenButtonEdit = document.querySelector('.profile__edit-button');
const saveButtonEdit = popupEdit.querySelector('.popup__button');

const profileNameElement = document.querySelector('.profile__title');
const profileDescriptionElement = document.querySelector('.profile__description');
const nameInput = popupEdit.querySelector('.popup__input_type_name');
const descriptionInput = popupEdit.querySelector('.popup__input_type_description');

function openPopupEdit() {
  nameInput.value = profileNameElement.textContent;
  descriptionInput.value = profileDescriptionElement.textContent;
  popupEdit.classList.add('popup_is-animated', 'popup_is-opened');
};

function closePopupEdit() {
  popupEdit.classList.remove('popup_is-opened');
};


function savePopupEdit(event) {
  event.preventDefault();
  profileNameElement.textContent = nameInput.value;
  profileDescriptionElement.textContent = descriptionInput.value;
  closePopupEdit();
};


popupOpenButtonEdit.addEventListener('click', openPopupEdit);
popupCloseButtonEdit.addEventListener('click', closePopupEdit);
saveButtonEdit.addEventListener('click', savePopupEdit);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closePopupEdit();
  }
});


const popupNewCard = document.querySelector('.popup_type_new-card');
const popupCloseButtonNewCard = popupNewCard.querySelector('.popup__close');
const popupOpenButtonNewCard = document.querySelector('.profile__add-button');
const saveButtonNewCard = popupNewCard.querySelector('.popup__button');

const cardNameInput = popupNewCard.querySelector('.popup__input_type_card-name');
const cardLinkInput = popupNewCard.querySelector('.popup__input_type_url');

function openPopupNewCard() {
  cardNameInput.value = '';
  cardLinkInput.value = '';
  popupNewCard.classList.add('popup_is-animated', 'popup_is-opened');
};

function closePopupNewCard() {
  popupNewCard.classList.remove('popup_is-opened');
};


function savePopupNewCard(event) {
  event.preventDefault();

  const newCardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value
  };

  const cardElement = createCard(newCardData);

  cardsContainer.prepend(cardElement);

  closePopupNewCard();

  const imageElement = cardElement.querySelector('.card__image');
  imageElement.addEventListener('click', () => {
    openPopupImage(newCardData.link, newCardData.name);
  });
}

popupOpenButtonNewCard.addEventListener('click', openPopupNewCard);
popupCloseButtonNewCard.addEventListener('click', closePopupNewCard);
saveButtonNewCard.addEventListener('click', savePopupNewCard);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closePopupNewCard();
  }
});


popupNewCard.addEventListener('mousedown', (event) => {
  if (event.target === popupNewCard) {
    closePopupNewCard();
  }
});


const popupImage = document.querySelector('.popup_type_image');
const popupImageElement = popupImage.querySelector('.popup__image');
const popupCaptionElement = popupImage.querySelector('.popup__caption');
const popupCloseButtonImage = popupImage.querySelector('.popup__close');


function openPopupImage(imageSrc, imageAlt) {
  popupImageElement.src = imageSrc;
  popupImageElement.alt = imageAlt;
  popupCaptionElement.textContent = imageAlt;
  popupImage.classList.add('popup_is-animated', 'popup_is-opened');
}

renderCards(initialCards, cardsContainer, openPopupImage);

function closePopupImage() {
  popupImage.classList.remove('popup_is-opened');
}

popupCloseButtonImage.addEventListener('click', closePopupImage);

const openImageButtons = document.querySelectorAll('.card__image');

openImageButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const imageSrc = initialCards[index].link;
    const imageAlt = initialCards[index].name;
    openPopupImage(imageSrc, imageAlt);
  })
});


document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closePopupImage();
  }
});

