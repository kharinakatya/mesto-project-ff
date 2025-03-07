const arkhyz = new URL('https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg', import.meta.url);
const chelyabinskOblast = new URL('https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg', import.meta.url);
const ivanovo = new URL('https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg', import.meta.url)
const kamchatka = new URL('https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg', import.meta.url);
const kholmogorskyRayon = new URL('https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg', import.meta.url);
const baikal = new URL('https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg', import.meta.url);


const initialCards = [
    {
      name: "Архыз",
      link: arkhyz,
    },
    {
      name: "Челябинская область",
      link: chelyabinskOblast,
    },
    {
      name: "Иваново",
      link: ivanovo,
    },
    {
      name: "Камчатка",
      link: kamchatka,
    },
    {
      name: "Холмогорский район",
      link: kholmogorskyRayon,
    },
    {
      name: "Байкал",
      link: baikal,
    }
];

export default initialCards;

//лайк карточек
const likeButtons = document.querySelectorAll('.card__like-button');

likeButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Переключаем класс 'liked' у кнопки
        this.classList.toggle('liked');
    });
});

function addCard(imageSrc, title) {
    const template = document.getElementById('card-template');
    const cardElement = template.content.cloneNode(true);
    const img = cardElement.querySelector('.card__image');
    const titleElem = cardElement.querySelector('.card__title');
    const likeButton = cardElement.querySelector('.card__like-button');

    img.src = imageSrc;
    titleElem.textContent = title;

    // Добавляем обработчик для нового лайка
    likeButton.addEventListener('click', function() {
        this.classList.toggle('liked');
    });

    document.querySelector('.places__list').appendChild(cardElement);
};
