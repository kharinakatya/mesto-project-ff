export function openModal(popup) {
    popup.classList.add('popup_is-animated', 'popup_is-opened');
}


export function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
}