const template = document.querySelector('#card-template').content;

function createCard(data) {
    const cardElement = template.cloneNode(true);
    
    const imageElement = cardElement.querySelector('.card__image');
    const titleElement = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');

    imageElement.src = data.link;
    imageElement.alt = data.name;
    titleElement.textContent = data.name;

    const placesList = document.querySelector('.places__list');
    placesList.append(cardElement);

    deleteButton.addEventListener('click', function () {
        deleteButton.closest('.places__list .places__item').remove();
    });
    
    return cardElement;
}

function renderCards(initialCards) {
    initialCards.forEach(createCard);
}

renderCards(initialCards);