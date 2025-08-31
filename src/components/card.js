// components/card.js
import { openPopup, closePopup } from './modal.js';
import { deleteCardRequest, putLike, removeLike } from './api.js';

const template = document.querySelector('#card-template').content;
let pendingDelete = { cardElement: null, cardId: null };

const popupConfirm = document.querySelector('#popup-confirm');
const confirmForm = popupConfirm ? popupConfirm.querySelector('form[name="confirm-delete"]') : null;
const closeButton = popupConfirm ? popupConfirm.querySelector('.popup__close') : null;

if (closeButton) {
  closeButton.addEventListener('click', () => {
    pendingDelete = { cardElement: null, cardId: null };
    closePopup(popupConfirm);
  });
}

if (popupConfirm) {
  popupConfirm.addEventListener('click', (evt) => {

    if (evt.target === popupConfirm) {
      pendingDelete = { cardElement: null, cardId: null };
      closePopup(popupConfirm);
    }
  });
}

if (confirmForm) {
  confirmForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const { cardElement, cardId } = pendingDelete;

    if (!cardElement || !cardId) {
      pendingDelete = { cardElement: null, cardId: null };
      closePopup(popupConfirm);
      return;
    }

    deleteCardRequest(cardId)
      .then(() => {
        cardElement.remove();
        pendingDelete = { cardElement: null, cardId: null };
        closePopup(popupConfirm);
      })
      .catch(err => {
        console.error('Ошибка при удалении карточки:', err);
        pendingDelete = { cardElement: null, cardId: null };
        closePopup(popupConfirm);
      });
  });
}

export function createCard(data, openPopupImage, currentUserId) {
  const cardElement = template.querySelector('.card').cloneNode(true);

  const imageElement = cardElement.querySelector('.card__image');
  const titleElement = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likesCountEl = cardElement.querySelector('.card__likes-count');

  imageElement.src = data.link;
  imageElement.alt = data.name;
  titleElement.textContent = data.name;

  const likesArray = Array.isArray(data.likes) ? data.likes : [];
  likesCountEl.textContent = String(likesArray.length);

  const isLikedByCurrentUser = () => {
    return likesArray.some(item => {
      if (!item) return false;
      return (item._id && item._id === currentUserId) || (typeof item === 'string' && item === currentUserId);
    });
  };

  if (currentUserId && isLikedByCurrentUser()) {
    likeButton.classList.add('card__like-button_is-active');
  } else {
    likeButton.classList.remove('card__like-button_is-active');
  }

  likeButton.addEventListener('click', () => {
    const cardId = data._id;
    const currentlyActive = likeButton.classList.contains('card__like-button_is-active');

    likeButton.disabled = true;

    const request = currentlyActive ? removeLike(cardId) : putLike(cardId);

    request
      .then(updatedCard => {
        const newLikes = Array.isArray(updatedCard.likes) ? updatedCard.likes : [];
        likesCountEl.textContent = String(newLikes.length);

        likesArray.length = 0;
        newLikes.forEach(l => likesArray.push(l));

        if (newLikes.some(li => (li._id && li._id === currentUserId) || (typeof li === 'string' && li === currentUserId))) {
          likeButton.classList.add('card__like-button_is-active');
        } else {
          likeButton.classList.remove('card__like-button_is-active');
        }
      })
      .catch(err => {
        console.error('Ошибка при обновлении лайка:', err);
      })
      .finally(() => {
        likeButton.disabled = false;
      });
  });

  const ownerId = data.owner ? (data.owner._id || data.owner) : null;
  if (ownerId && currentUserId && ownerId === currentUserId) {
    deleteButton.style.display = '';
    deleteButton.addEventListener('click', (evt) => {
      const cardEl = evt.currentTarget.closest('.card');
      pendingDelete = { cardElement: cardEl, cardId: data._id };
      if (popupConfirm) openPopup(popupConfirm);
      else {
        deleteCardRequest(data._id)
          .then(() => cardEl.remove())
          .catch(err => console.error('Ошибка при удалении карточки (без попапа):', err));
      }
    });
  } else {
    deleteButton.style.display = 'none';
  }

  imageElement.addEventListener('click', () => {
    openPopupImage(data.link, data.name);
  });

  return cardElement;
}