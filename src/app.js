import { watch } from 'melanke-watchjs';
import '@babel/polyfill';
import axios from 'axios';
import validator from 'validator';

// https://lorem-rss.herokuapp.com/feed

export default () => {
  const state = {
    rssLinks: [],
    addingProcess: 'default',
    posts: [],
  };

  const buttonElement = document.querySelector('button');
  const inputElement = document.querySelector('input');
  const postsElement = document.querySelector('.posts');
  const linksElement = document.querySelector('.links');

  watch(state, 'addingProcess', () => {
    if (state.addingProcess === 'default') {
      inputElement.classList.remove('is-invalid');
      buttonElement.disabled = true;
      inputElement.value = '';
    } else if (state.addingProcess === 'invalid') {
      inputElement.classList.add('is-invalid');
      buttonElement.disabled = true;
    } else {
      inputElement.classList.remove('is-invalid');
      buttonElement.disabled = false;
    }
  });

  watch(state, 'rssLinks', () => {
    if (state.posts.length === 0) {
      linksElement.innerHTML = '';
    } else {
      const links = state.rssLinks.map((link) => (
        `<li class="list-group-item"><h5 class="mb-1">${link.title}</h5><p class="mb-1">${link.description}</p></li>`
      ));
      linksElement.innerHTML = `<h4>Список потоков</h4><ul class="list-group">${links.join('')}</ul>`;
    }
  });

  watch(state, 'posts', () => {
    if (state.posts.length === 0) {
      postsElement.innerHTML = '';
    } else {
      const posts = state.posts.map((post) => `<li class="list-group-item"><a href="${post.link}">${post.title}</a></li>`);
      postsElement.innerHTML = `<h4>Список постов</h4><ul class="list-group">${posts.join('')}</ul>`;
    }
  });

  inputElement.addEventListener('input', ({ target }) => {
    const { value } = target;
    if (value.length === 0) {
      state.addingProcess = 'default';
    } else if (validator.isURL(value) && !validator.isIn(value, state.rssLinks)) {
      state.addingProcess = 'valid';
    } else {
      state.addingProcess = 'invalid';
    }
  });

  buttonElement.addEventListener('click', async (e) => {
    e.preventDefault();

    const { value } = inputElement;
    state.addingProcess = 'default';

    const response = await axios.get(`https://cors-anywhere.herokuapp.com/${value}`);
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data, 'application/xml');

    const channelTitle = doc.querySelector('channel > title').textContent;
    const channelDescription = doc.querySelector('channel > description').textContent;
    state.rssLinks = [...state.rssLinks, { title: channelTitle, description: channelDescription }];

    const nodes = doc.querySelectorAll('channel > item');
    const items = [...nodes].map((item) => {
      const title = item.querySelector('title').textContent;
      const link = item.querySelector('link').textContent;
      return { title, link };
    });
    state.posts = [...state.posts, ...items];
  });
};
