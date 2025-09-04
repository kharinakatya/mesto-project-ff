const cohortId = 'wff-cohort-42';
const token = '40da0db7-490e-4674-9460-ee104bc87e71';
const baseUrl = `https://nomoreparties.co/v1/${cohortId}`;

const defaultHeaders = {
  authorization: token,
  'Content-Type': 'application/json'
};

function checkResponse(res) {
  if (res.ok) {
    if (res.status === 204) return Promise.resolve({});
    return res.json().catch(() => ({}));
  }

  return res.json()
    .then(errBody => {
      const error = new Error(errBody.message || `Ошибка ${res.status}`);
      error.status = res.status;
      error.body = errBody;
      throw error;
    })
    .catch(() => {
      const error = new Error(`Ошибка ${res.status}`);
      error.status = res.status;
      throw error;
    });
}

export function fetchUserProfile() {
  return fetch(`${baseUrl}/users/me`, {
    headers: defaultHeaders
  }).then(checkResponse);
}

export function fetchCards() {
  return fetch(`${baseUrl}/cards`, {
    headers: defaultHeaders
  }).then(checkResponse);
}

export function updateProfile(name, about) {
  return fetch(`${baseUrl}/users/me`, {
    method: 'PATCH',
    headers: defaultHeaders,
    body: JSON.stringify({ name, about })
  }).then(checkResponse);
}

export function postCard(cardData) {
  return fetch(`${baseUrl}/cards`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(cardData)
  }).then(checkResponse);
}

export function patchAvatar(avatarUrl) {
  return fetch(`${baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: defaultHeaders,
    body: JSON.stringify({ avatar: avatarUrl })
  }).then(checkResponse);
}

export function deleteCardRequest(cardId) {
  return fetch(`${baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: defaultHeaders
  }).then(checkResponse);
}

export function putLike(cardId) {
  return fetch(`${baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: defaultHeaders
  }).then(checkResponse);
}

export function removeLike(cardId) {
  return fetch(`${baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: defaultHeaders
  }).then(checkResponse);
}