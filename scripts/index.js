const cardsContainer = document.querySelector('.places__list');
const template = document.querySelector('#card-template').content; 

function deleteCard(event) {
    const cardElement = event.currentTarget.closest('.card');
    if (cardElement) {
        cardElement.remove();
    }
}

function createCard(data, deleteCard) {
    const cardElement = template.querySelector('.card').cloneNode(true);
    
    const imageElement = cardElement.querySelector('.card__image');
    const titleElement = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');

    imageElement.src = data.link;
    imageElement.alt = data.name;
    titleElement.textContent = data.name;

    deleteButton.addEventListener('click', deleteCard);
    
    return cardElement;
}

function renderCards(initialCards) {
    initialCards.forEach(cardData => {
        const cardElement = createCard(cardData, deleteCard);
        cardsContainer.append(cardElement);
    });
}

renderCards(initialCards);