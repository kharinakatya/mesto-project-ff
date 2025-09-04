export function validateUrl(value) {
  const pattern = /^(https?:\/\/)([^\s]+)/;
   return pattern.test(value);
}


function showError(input, message, config) {
  const errorElement = input.closest(config.formSelector)?.querySelector(`.${input.id}-error`) ||
                       document.querySelector(`#${input.id}-error`) ||
                       document.querySelector(`#${input.name}-error`);
  if (errorElement) {
    input.classList.add(config.inputErrorClass);
    errorElement.textContent = message;
    errorElement.classList.add(config.errorClass);
  }
}

function hideError(input, config) {
  const errorElement = input.closest(config.formSelector)?.querySelector(`.${input.id}-error`) ||
                       document.querySelector(`#${input.id}-error`) ||
                       document.querySelector(`#${input.name}-error`);
  if (errorElement) {
    input.classList.remove(config.inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(config.errorClass);
  }
}

function checkInputValidity(input, config) {
  const value = input.value.trim();
  const valueLength = value.length;
  input.setCustomValidity('');

  if (input.validity.valueMissing) {
    input.setCustomValidity('Вы пропустили это поле.');
  }

  if (input.name === 'name' && !input.validity.valueMissing) {
    if (valueLength < 2 || valueLength > 40) {
      input.setCustomValidity('Минимальное количество символов: 2. Максимум: 40.');
    }
  }

  if (input.name === 'description' && !input.validity.valueMissing) {
    if (valueLength < 2 || valueLength > 200) {
      input.setCustomValidity('Минимальное количество символов: 2. Максимум: 200.');
    } else if (!validateCustom(value)) {
      input.setCustomValidity('Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы.');
    }
  }

  if (input.name === 'place-name' && !input.validity.valueMissing) {
    if (valueLength < 2 || valueLength > 30) {
      input.setCustomValidity('Минимальное количество символов: 2. Максимум: 30.');
    } else if (!validateCustom(value)) {
      input.setCustomValidity('Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы.');
    }
  }

  if (input.name === 'link' && !input.validity.valueMissing) {
    if (!validateUrl(value)) {
      input.setCustomValidity('Введите корректный адрес сайта.');
    }
  }

  if (!input.validity.valid) {
    showError(input, input.validationMessage, config);
  } else {
    hideError(input, config);
  }
}

function validateCustom(value) {
  const regex = /^[а-яА-ЯЁёa-zA-Z\s-]+$/;
  return regex.test(value);
}

function enableButtonState(inputs, button, inactiveButtonClass) {
  const isValid = Array.from(inputs).every(input => input.validity.valid);
  button.disabled = !isValid;
  button.classList.toggle(inactiveButtonClass, !isValid);
}

function setEventListeners(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const button = form.querySelector(config.submitButtonSelector);

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      checkInputValidity(input, config);
      enableButtonState(inputs, button, config.inactiveButtonClass);
    });

    input.addEventListener('focus', () => hideError(input, config));
    input.addEventListener('click', () => hideError(input, config));
  });

  enableButtonState(inputs, button, config.inactiveButtonClass);
}

// Основная функция включения валидации
export function enableValidation(config) {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach(form => setEventListeners(form, config));
}

export function clearValidation(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const button = form.querySelector(config.submitButtonSelector);

  inputs.forEach(input => {
    input.setCustomValidity('');
    hideError(input, config);
  });

  button.classList.add(config.inactiveButtonClass);
  button.disabled = true;
}