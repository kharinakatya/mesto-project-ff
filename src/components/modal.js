export function openPopup(popup) {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', closePopupByEsc);
}
  
export function closePopup(popup) {
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closePopupByEsc);
}

export function closePopupByEsc(event) {
    if (event.key === 'Escape') {
        if (popupEdit.classList.contains('popup_is-opened')) {
            closePopupEdit();
        } else if (popupNewCard.classList.contains('popup_is-opened')) {
            closePopupNewCard();
        } else if (popupImage.classList.contains('popup_is-opened')) {
            closePopupImage();
        }
    }
}