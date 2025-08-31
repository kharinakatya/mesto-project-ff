import initialCards from './scripts/cards.js';
import './pages/index.css';
import { createCard } from './components/card.js';
import { openPopup, closePopup } from './components/modal.js';
import { enableValidation, clearValidation, validateUrl } from './components/validation.js';
import { fetchUserProfile, fetchCards, updateProfile, postCard, patchAvatar } from './components/api.js';

let currentUserId = null;

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

const popupEditAvatar = document.querySelector('#popupEditAvatar');
const form = popupEditAvatar ? popupEditAvatar.querySelector('form[name="edit-avatar"]') : null;
const input = form ? form.querySelector('#avatar-link-input') : null;
const submitButton = form ? form.querySelector('.form__submit') : null;
const errorSpan = form ? form.querySelector('#avatar-link-input-error') : null;
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
    if (input) {
      input.value = '';
      input.setCustomValidity('');
    }
    if (errorSpan) {
      errorSpan.textContent = '';
    }
    if (submitButton) {
      submitButton.active = true;
      submitButton.textContent = 'Сохранить';
    }
    openPopup(popupEditAvatar);
  });
}

if (form) {
    input.addEventListener('input', () => {
    const val = input.value.trim();
    if (!val) {
      input.setCustomValidity('Поле обязательно');
      errorSpan.textContent = 'Поле обязательно';
    } else if (!validateUrl(val)) {
      input.setCustomValidity('Введите корректный URL');
      errorSpan.textContent = 'Введите корректный URL';
    } else {
      input.setCustomValidity('');
      errorSpan.textContent = '';
    }
  });

  form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const url = input.value.trim();

    if (!url || !validateUrl(url)) {
      input.reportValidity();
      return;
    }

    if (!submitButton) return;

    try {
      submitButton.active = true;

      await new Promise(resolve => setTimeout(resolve, 300));
      submitButton.textContent = 'Сохранение...';

      const avatarImage = document.querySelector('.profile__image');
      if (avatarImage) avatarImage.style.backgroundImage = `url('${url}')`;

      const updatedUser = await patchAvatar(url);

      if (updatedUser && updatedUser.avatar) {
        avatarImage.style.backgroundImage = `url('${updatedUser.avatar}')`;
      } else {
        avatarImage.style.backgroundImage = `url('${url}')`;
      }

      closePopup(popupEditAvatar);
      errorSpan.textContent = '';

    } catch (err) {
      console.error('Ошибка обновления аватара:', err);
      errorSpan.textContent = typeof err === 'string' ? err : 'Ошибка при обновлении аватара';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Сохранить';
    }
  });
}

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(validationConfig);

const profileForm = document.querySelector('form[name="edit-profile"]');
const newPlaceForm = document.querySelector('form[name="new-place"]');

document.querySelector('.popup_type_edit').addEventListener('open', () => {
  clearValidation(profileForm, validationConfig);
});

document.querySelector('.popup_type_new-card').addEventListener('open', () => {
  clearValidation(newPlaceForm, validationConfig);
});

const cardsContainer = document.querySelector('.places__list');

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

function renderCards(initialCards, cardsContainer, openPopupImage) {
  initialCards.forEach(cardData => {
    const cardElement = createCard(cardData, openPopupImage);
    cardsContainer.append(cardElement);
  });
}

function openPopupEdit() {
  nameInput.value = profileNameElement.textContent;
  descriptionInput.value = profileDescriptionElement.textContent;
  clearValidation(profileForm, validationConfig);
  openPopup(popupEdit);
}

function closePopupEdit() {
  closePopup(popupEdit);
}

async function savePopupEdit(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const about = descriptionInput.value.trim();

  if (!name) {
    return;
  }

  const submitButton = profileForm.querySelector('button[type="submit"]');
  const prevButtonText = submitButton ? submitButton.textContent : null;

  try {
    if (submitButton) {
      submitButton.active = true;
      await new Promise(resolve => setTimeout(resolve, 300));
      submitButton.textContent = 'Сохранение...';
    }

    const updatedUser = await updateProfile(name, about);

    if (updatedUser) {
      profileNameElement.textContent = updatedUser.name ?? name;
      profileDescriptionElement.textContent = updatedUser.about ?? about;
    }

    closePopupEdit();
  } catch (err) {
    console.error('Ошибка при обновлении профиля:', err);
    alert(typeof err === 'string' ? err : 'Ошибка при сохранении профиля');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = prevButtonText || 'Сохранить';
    }
  }
}

function openPopupNewCard() {
  cardNameInput.value = '';
  cardLinkInput.value = '';
  clearValidation(newPlaceForm, validationConfig);
  newPlaceForm.reset();
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
  setTimeout(() => {
    submitButton.textContent = 'Сохранение...';

    postCard(newCardData)
      .then(createdCard => {
        const cardElement = createCard(createdCard, openPopupImage, currentUserId);
        cardsContainer.prepend(cardElement);
        closePopupNewCard();
      })
      .catch(err => {
        console.error('Ошибка создания карточки:', err);
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Сохранить';
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

renderCards(initialCards, cardsContainer, openPopupImage);

document.querySelector('.profile__edit-button').addEventListener('click', openPopupEdit);
popupEdit.querySelector('.popup__close').addEventListener('click', closePopupEdit);
popupEdit.querySelector('.popup__button').addEventListener('click', savePopupEdit);

document.querySelector('.profile__add-button').addEventListener('click', openPopupNewCard);
popupNewCard.querySelector('.popup__close').addEventListener('click', closePopupNewCard);
popupNewCard.querySelector('.popup__button').addEventListener('click', savePopupNewCard);
popupImage.querySelector('.popup__close').addEventListener('click', closePopupImage);

function closePopupOnOverlay(event, popup) {
  if (event.target === popup) {
    closePopup(popup);
  }
}

popupEdit.addEventListener('mousedown', (event) => closePopupOnOverlay(event, popupEdit));
popupNewCard.addEventListener('mousedown', (event) => closePopupOnOverlay(event, popupNewCard));
popupImage.addEventListener('mousedown', (event) => closePopupOnOverlay(event, popupImage));