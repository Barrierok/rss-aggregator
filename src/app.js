import { watch } from 'melanke-watchjs';
import '@babel/polyfill';
import { handleInput, handleSubmit, handlePostClick } from './handlers';
import {
  renderForm,
  renderChannels,
  renderPosts,
  renderModal,
} from './renderes';

// https://lorem-rss.herokuapp.com/feed

export default () => {
  const state = {
    channels: [],
    posts: [],
    formStatus: 'default',
    modalData: {
      title: '',
      description: '',
    },
  };

  watch(state, 'formStatus', renderForm(state));
  watch(state, 'channels', renderChannels(state));
  watch(state, 'posts', renderPosts(state));
  watch(state, 'modalData', renderModal(state));

  const formElement = document.querySelector('#formRss');
  const inputElement = document.querySelector('#inputForm');
  const postsList = document.querySelector('#posts');

  postsList.addEventListener('click', handlePostClick(state));
  inputElement.addEventListener('input', handleInput(state));
  formElement.addEventListener('submit', handleSubmit(state));
};
