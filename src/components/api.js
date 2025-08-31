const cohortId = 'wff-cohort-42'; // ваш cohortId
const token = '40da0db7-490e-4674-9460-ee104bc87e71'; // ваш токен
const baseUrl = `https://nomoreparties.co/v1/${cohortId}`;

export function fetchUserProfile() {
  return fetch(`${baseUrl}/users/me`, {
    headers: { authorization: token }
  }).then(res => {
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    return res.json();
  });
}

export function fetchCards() {
  return fetch(`${baseUrl}/cards`, {
    headers: { authorization: token }
  }).then(res => {
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    return res.json();
  });
}

export async function updateProfile(name, about) {
  const res = await fetch(`${baseUrl}/users/me`, {
    method: 'PATCH',
    headers: { authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, about })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || `Ошибка: ${res.status}`);
  return data;
}

export async function postCard(cardData) {
  const res = await fetch(`${baseUrl}/cards`, {
    method: 'POST',
    headers: { authorization: token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: cardData.name, link: cardData.link })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || `Ошибка: ${res.status}`);
  return data;
}

export function deleteCardRequest(cardId) {
  return fetch(`${baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: { authorization: token }
  }).then(res => {
    if (!res.ok) return Promise.reject(`Ошибка удаления: ${res.status}`);
    return res.json();
  });
}

export function putLike(cardId) {
  return fetch(`${baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: { authorization: token }
  }).then(res => {
    if (!res.ok) return Promise.reject(`Ошибка постановки лайка: ${res.status}`);
    return res.json();
  });
}

export function removeLike(cardId) {
  return fetch(`${baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: { authorization: token }
  }).then(res => {
    if (!res.ok) return Promise.reject(`Ошибка снятия лайка: ${res.status}`);
    return res.json();
  });
}

export function patchAvatar(avatarUrl) {
  return fetch(`${baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ avatar: avatarUrl })
  }).then(res => {
    if (!res.ok) return res.json().then(err => Promise.reject(err.message || `Ошибка: ${res.status}`));
    return res.json();
  });
}
