document.addEventListener('DOMContentLoaded', () => {
    const profileEditThumbnails = document.querySelectorAll('.profile__edit-button');
    const profileAddThumbnails = document.querySelectorAll('.profile__add-button');

    // Переменные для первого модального окна (редактирование профиля)
    const profilePopup = document.querySelector('.popup_type_edit');
    const profilePopupForm = profilePopup.querySelector('.popup__form');
    const profileNameInput = profilePopupForm.querySelector('.popup__input_type_name');
    const profileDescriptionInput = profilePopupForm.querySelector('.popup__input_type_description');
    const profileName = document.querySelector('.profile__title');
    const profileDescription = document.querySelector('.profile__description');

    // Переменные для второго модального окна (добавление карточки)
    const cardPopup = document.querySelector('.popup_type_new-card');
    const cardPopupForm = cardPopup.querySelector('.popup__form');
    const cardNameInput = cardPopupForm.querySelector('.popup__input_type_card-name');
    const cardLinkInput = cardPopupForm.querySelector('.popup__input_type_url');
    const cardsContainer = document.querySelector('.places__list');

    // Функция для открытия окна
    function openPopup(popup) {
        popup.style.display = 'flex';
    }

    // Функция для закрытия окна
    function closePopup(popup) {
        popup.style.display = 'none';
    }

    // Обработчик для редактирования профиля
    profileEditThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            openPopup(profilePopup);
            // Заполняем входные поля текущими значениями
            profileNameInput.value = profileName.textContent;
            profileDescriptionInput.value = profileDescription.textContent;
        });
    });

    // Обработчик для добавления новой карточки
    profileAddThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            openPopup(cardPopup);
            cardNameInput.value = '';
            cardLinkInput.value = '';
        });
    });

    // Закрытие модальных окон
    document.querySelectorAll('.popup__close').forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            closePopup(closeButton.closest('.popup'));
        });
    });

    document.querySelectorAll('.popup').forEach(popup => {
        popup.addEventListener('click', (event) => {
            if (event.target === popup) {
                closePopup(popup);
            }
        });
    });

    // Обработчик для отправки формы редактирования профиля
    profilePopupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = profileNameInput.value;
        const description = profileDescriptionInput.value;

        if (!name || !description) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        profileName.textContent = name;
        profileDescription.textContent = description;
        closePopup(profilePopup);
    });

    // Обработчик для отправки формы добавления карточки
    cardPopupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const cardName = cardNameInput.value;
        const cardLink = cardLinkInput.value;

        if (!cardName || !cardLink) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        // Получаем шаблон карточки
        const cardTemplate = document.querySelector('#card-template');
        const newCardElement = cardTemplate.content.cloneNode(true);

        // Заполняем карточку данными
        const cardImage = newCardElement.querySelector('.card__image');
        const cardTitle = newCardElement.querySelector('.card__title');

        cardImage.src = cardLink;
        cardImage.alt = cardName;
        cardTitle.textContent = cardName;

        // Добавляем новую карточку в контейнер
        cardsContainer.prepend(newCardElement);

        // Закрываем модальное окно
        closePopup(cardPopup);
    });

    // Закрытие окон по клавише ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const openPopup = document.querySelector('.popup[style*="display: flex"]');
            if (openPopup) {
                closePopup(openPopup);
            }
        }
    });
});



document.addEventListener('DOMContentLoaded', () => {
    const popup = document.querySelector('.popup_type_image');
    const popupImage = popup.querySelector('.popup__image');
    const popupCaption = popup.querySelector('.popup__caption');
    const popupCloseButton = popup.querySelector('.popup__close');

    function openPopup(imageSrc, imageAlt) {
        popupImage.src = imageSrc;
        popupImage.alt = imageAlt;
        popupCaption.textContent = imageAlt;
        popup.style.display = 'flex';  // Сделаем попап видимым
    }

    function closePopup() {
        console.log('Popup closed'); // Отладочный вывод
        popup.style.display = 'none';  // Скрываем попап
    }

    popupCloseButton.addEventListener('click', closePopup);

    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const image = card.querySelector('.card__image');
        if (image) {
            image.addEventListener('click', () => {
                console.log('image clicked', image.src, image.alt); // Отладочный вывод
                openPopup(image.src, image.alt);
            });
        }
    });

    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            closePopup();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && popup.style.display === 'block') {
            closePopup();
        }
    });
});