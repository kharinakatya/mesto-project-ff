import './pages/index.css';
import { createCard } from './components/card.js';
import { openPopup, closePopup, closePopupOnOverlay } from './components/modal.js';
import { enableValidation, clearValidation, validateUrl } from './components/validation.js';
import { fetchUserProfile, fetchCards, updateProfile, postCard, patchAvatar } from './components/api.js';

let currentUserId = null;

const cardsContainer = document.querySelector('.places__list');

Promise.all([fetchUserProfile(), fetchCards()])
  .then(([user, cards]) => {
    currentUserId = user._id;
    document.querySelector('.profile__title').textContent = user.name;
    document.querySelector('.profile__description').textContent = user.about;
    const profileImageEl = document.querySelector('.profile__image');

    if (profileImageEl.tagName === 'IMG') {
      profileImageEl.src = user.avatar;
    } else {
      profileImageEl.style.backgroundImage = `url(${user.avatar})`;
    }

    cards.forEach(cardData => {
      if (cardData && cardData.link && cardData.name && cardData._id) {
        // Убрал openConfirm из параметров
        const cardElement = createCard(cardData, openPopupImage, currentUserId);
        cardsContainer.appendChild(cardElement);
      } else {
        console.error('Некорректные данные карточки:', cardData);
      }
    });
  })
  .catch(err => {
    console.error(`Ошибка загрузки данных: ${err}`);
  });

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(validationConfig);

const popupEditAvatar = document.querySelector('#popupEditAvatar');
const formEditAvatar = popupEditAvatar ? popupEditAvatar.querySelector('form[name="formEditAvatar"]') : null;
const input = formEditAvatar ? formEditAvatar.querySelector('#avatar-link-input') : null;
const submitButton = formEditAvatar ? formEditAvatar.querySelector('.form__submit') : null;
const errorSpan = formEditAvatar ? formEditAvatar.querySelector('#avatar-link-input-error') : null;
const closeButton = popupEditAvatar ? popupEditAvatar.querySelector('.popup__close') : null;

if (closeButton) {
  closeButton.addEventListener('click', () => closePopup(popupEditAvatar));
}
if (popupEditAvatar) {
  popupEditAvatar.addEventListener('click', (evt) => {
    if (evt.target === popupEditAvatar) closePopup(popupEditAvatar);
  });
}

const imageButton = document.querySelector('.image-button');

if (imageButton && popupEditAvatar) {
  imageButton.addEventListener('click', () => {
    if (input) input.value = '';
    if (formEditAvatar) clearValidation(formEditAvatar, validationConfig);
    openPopup(popupEditAvatar);
  });
}

if (formEditAvatar) {
  formEditAvatar.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const url = input.value.trim();

    if (!url || !validateUrl(url)) {
      input.reportValidity();
      return;
    }

    if (!submitButton) return;

    submitButton.active = true;
    submitButton.textContent = 'Сохранение...';

    const avatarImage = document.querySelector('.profile__image');
    if (avatarImage) avatarImage.style.backgroundImage = `url('${url}')`;

    new Promise(resolve => setTimeout(resolve, 300))
      .then(() => patchAvatar(url))
      .then(updatedUser => {
        if (updatedUser && updatedUser.avatar) {
          avatarImage.style.backgroundImage = `url('${updatedUser.avatar}')`;
        } else {
          avatarImage.style.backgroundImage = `url('${url}')`;
        }
        closePopup(popupEditAvatar);
        if (errorSpan) errorSpan.textContent = '';
      })
      .catch(err => {
        console.error('Ошибка обновления аватара:', err);
        if (errorSpan) errorSpan.textContent = typeof err === 'string' ? err : 'Ошибка при обновлении аватара';
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Сохранить';
      });
  });
}

const profileForm = document.querySelector('form[name="edit-profile"]');
const newPlaceForm = document.querySelector('form[name="new-place"]');

const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');

const popupImageElement = popupImage.querySelector('.popup__image');
const popupCaptionElement = popupImage.querySelector('.popup__caption');

const profileNameElement = document.querySelector('.profile__title');
const profileDescriptionElement = document.querySelector('.profile__description');

const nameInput = popupEdit.querySelector('.popup__input_type_name');
const descriptionInput = popupEdit.querySelector('.popup__input_type_description');

const cardNameInput = popupNewCard.querySelector('.popup__input_type_card-name');
const cardLinkInput = popupNewCard.querySelector('.popup__input_type_url');

function openPopupEdit() {
  nameInput.value = profileNameElement.textContent;
  descriptionInput.value = profileDescriptionElement.textContent;
  clearValidation(profileForm, validationConfig);
  openPopup(popupEdit);
}

function closePopupEdit() {
  closePopup(popupEdit);
}

function savePopupEdit(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const about = descriptionInput.value.trim();

  if (!name) {
    return;
  }

  const submitButton = profileForm.querySelector('button[type="submit"]');
  const prevButtonText = submitButton ? submitButton.textContent : null;

  if (submitButton) {
    submitButton.active = true;
    submitButton.textContent = 'Сохранение...';
  }

  new Promise(resolve => setTimeout(resolve, 300))
    .then(() => updateProfile(name, about))
    .then(updatedUser => {
      if (updatedUser) {
        profileNameElement.textContent = updatedUser.name ?? name;
        profileDescriptionElement.textContent = updatedUser.about ?? about;
      }
      closePopupEdit();
    })
    .catch(err => {
      console.error('Ошибка при обновлении профиля:', err);
      alert(typeof err === 'string' ? err : 'Ошибка при сохранении профиля');
    })
    .finally(() => {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = prevButtonText || 'Сохранить';
      }
    });
}

function openPopupNewCard() {
  openPopup(popupNewCard);
}

function closePopupNewCard() {
  closePopup(popupNewCard);
}

function savePopupNewCard(event) {
  event.preventDefault();
  if (!cardNameInput.value || !cardLinkInput.value) return;

  const submitButton = popupNewCard.querySelector('.popup__button');
  const newCardData = { name: cardNameInput.value, link: cardLinkInput.value };

  if (!submitButton) return;

  submitButton.active = true;
  submitButton.textContent = 'Сохранение...';

  setTimeout(() => {
    postCard(newCardData)
      .then(createdCard => {
        const cardElement = createCard(createdCard, openPopupImage, currentUserId);
        cardsContainer.prepend(cardElement);

        closePopupNewCard();

        if (newPlaceForm) {
          newPlaceForm.reset();
          clearValidation(newPlaceForm, validationConfig);
        }

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = 'Сохранить';
        }
      })
      .catch(err => {
        console.error('Ошибка создания карточки:', err);
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Сохранить';
        }
      });
  }, 300);
}

function openPopupImage(imageSrc, imageAlt) {
  popupImageElement.src = imageSrc;
  popupImageElement.alt = imageAlt;
  popupCaptionElement.textContent = imageAlt;
  openPopup(popupImage);
}

function closePopupImage() {
  closePopup(popupImage);
}

document.querySelector('.profile__edit-button').addEventListener('click', openPopupEdit);
popupEdit.querySelector('.popup__close').addEventListener('click', closePopupEdit);
profileForm.addEventListener('submit', savePopupEdit);

document.querySelector('.profile__add-button').addEventListener('click', openPopupNewCard);
popupNewCard.querySelector('.popup__close').addEventListener('click', closePopupNewCard);
popupNewCard.querySelector('.popup__button').addEventListener('click', savePopupNewCard);
popupImage.querySelector('.popup__close').addEventListener('click', closePopupImage);

popupEdit.addEventListener('mousedown', (event) => closePopupOnOverlay(event, popupEdit));
popupNewCard.addEventListener('mousedown', (event) => closePopupOnOverlay(event, popupNewCard));
popupImage.addEventListener('mousedown', (event) => closePopupOnOverlay(event, popupImage));