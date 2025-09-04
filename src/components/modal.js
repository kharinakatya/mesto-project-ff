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
        const openPopup = document.querySelector('.popup_is-opened');
        if (openPopup) {
            closePopup(openPopup);
        }
    } 
}

export function closePopupOnOverlay(event, popup) {
  if (event.target === popup) {
    closePopup(popup);
  }
}