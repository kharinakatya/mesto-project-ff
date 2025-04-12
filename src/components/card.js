const template = document.querySelector('#card-template').content;

export function deleteCard(event) {
    const cardElement = event.currentTarget.closest('.card');
    if (cardElement) {
        cardElement.remove();
    }
};

export function createCard(data, openPopupImage) {
    const cardElement = template.querySelector('.card').cloneNode(true);
    
    const imageElement = cardElement.querySelector('.card__image');
    const titleElement = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');

    imageElement.src = data.link;
    imageElement.alt = data.name;
    titleElement.textContent = data.name;

    deleteButton.addEventListener('click', deleteCard);

    likeButton.addEventListener('click', () => {
        likeButton.classList.toggle('card__like-button_is-active');
    });

    imageElement.addEventListener('click', () => {
        openPopupImage(data.link, data.name);
    });

    return cardElement;
}