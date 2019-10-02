import validator from 'validator';
import axios from 'axios';
import _ from 'lodash';
import { formStatuses, proxy, interval } from './constants';

const parseFeed = (data, value) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');

  const channelTitle = doc.querySelector('channel > title').textContent;
  const channelDescription = doc.querySelector('channel > description').textContent;

  const channel = {
    title: channelTitle,
    description: channelDescription,
    link: value,
  };

  const nodes = doc.querySelectorAll('channel > item');
  const posts = [...nodes].map((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;
    return { title, link, description };
  });

  return { channel, posts };
};

const setState = (data, currentState, link) => {
  const state = currentState;
  const channel = state.channels.find((item) => item.link === link);

  if (channel) {
    const newPosts = _.differenceWith(data.posts, state.posts, _.isEqual);
    state.posts = [...newPosts, ...state.posts];
    return;
  }

  state.channels = [...state.channels, data.channel];
  state.posts = [ ...data.posts, ...state.posts];
  state.formStatus = formStatuses.default;
};

const fetchFeed = (inputLink, state, currentProxy, currentInterval) => (
  axios.get(`${currentProxy}${inputLink}`)
    .then(({ data }) => {
      const feed = parseFeed(data, inputLink);
      setState(feed, state, inputLink);
    })
    .then(() => setTimeout(() => (
      fetchFeed(inputLink, state, currentProxy, currentInterval)
    ), currentInterval))
    .catch((err) => {
      throw err;
    })
);

export const handleSubmit = (currentState) => (event) => {
  event.preventDefault();
  const { target } = event;
  const { value } = target.inputForm;

  const state = currentState;
  state.formStatus = formStatuses.load;

  fetchFeed(value, state, proxy, interval);
};

export const handleInput = (currentState) => ({ target }) => {
  const state = currentState;
  const { value } = target;
  if (value.length === 0) {
    state.formStatus = formStatuses.default;
    return;
  }

  const isExisting = state.channels.some((channel) => channel.link === value);
  const isUrl = validator.isURL(value);
  if (!isExisting && isUrl) {
    state.formStatus = formStatuses.valid;
    return;
  }
  state.formStatus = formStatuses.invalid;
};

export const handlePostClick = (currentState) => (event) => {
  const state = currentState;
  const { target } = event;

  if (!target.dataset.toggle) return;

  const test = state.posts.find((post) => post.link === target.dataset.href);
  state.modalData = test;
};