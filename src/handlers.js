import validator from 'validator';
import axios from 'axios';
import _ from 'lodash';
import {
  formStatuses,
  proxy,
  intervalUpdate,
  handledErrors,
  parseFeed,
  validate,
} from './utils';

const updateState = (data, currentState, link) => {
  const state = currentState;
  const channel = state.channels.find((item) => item.link === link);

  if (channel) {
    const newPosts = _.differenceWith(data.posts, state.posts, _.isEqual);
    state.posts = [...newPosts, ...state.posts];
    return;
  }

  state.channels = [...state.channels, data.channel];
  state.posts = [...data.posts, ...state.posts];
  state.formStatus = formStatuses.empty;
};

const fetchFeed = (inputLink, currentState, currentProxy, currentInterval) => {
  const state = currentState;
  return axios.get(`${currentProxy}${inputLink}`)
    .then(({ data }) => {
      const feed = parseFeed(data, inputLink);
      updateState(feed, state, inputLink);
    })
    .then(() => setTimeout(() => (
      fetchFeed(inputLink, state, currentProxy, currentInterval)
    ), currentInterval))
    .catch((err) => {
      switch (err.message) {
        case 'Request failed with status code 404':
          state.error = handledErrors.notFound;
          break;
        case 'Network Error':
          state.error = handledErrors.networkError;
          break;
        case 'Parser Error':
          state.error = handledErrors.parserError;
          break;
        default:
          state.error = handledErrors.unknownError;
      }
      state.formStatus = formStatuses.invalid;
    });
};

export const handleSubmit = (currentState) => (event) => {
  event.preventDefault();
  const { target } = event;
  const { value } = target.inputForm;

  const state = currentState;
  state.formStatus = formStatuses.load;

  fetchFeed(value, state, proxy, intervalUpdate);
};

export const handleInput = (currentState) => ({ target }) => {
  const state = currentState;
  const { value } = target;
  if (value === '') {
    state.formStatus = formStatuses.empty;
    return;
  }

  const isExisting = state.channels.some((channel) => channel.link === value);
  const isUrl = validator.isURL(value);
  validate(isExisting, isUrl, state);
};

export const handlePostClick = (currentState) => (event) => {
  const state = currentState;
  const { target } = event;

  if (!target.dataset.toggle) return;

  const test = state.posts.find((post) => post.link === target.dataset.href);
  state.modalData = test;
};
