import validator from 'validator';
import axios from 'axios';
import formStatuses from './constants';

const proxy = 'https://cors-anywhere.herokuapp.com/';

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

const updateState = ({ channel, posts }, currentState) => {
  const state = currentState;
  state.channels = [...state.channels, channel];
  state.posts = [...state.posts, ...posts];
  state.formStatus = formStatuses.default;
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

export const handleSubmit = (currentState) => (event) => {
  event.preventDefault();
  const { target } = event;
  const { value } = target.inputForm;

  const state = currentState;
  state.formStatus = formStatuses.load;

  axios.get(`${proxy}${value}`)
    .then(({ data }) => {
      const feed = parseFeed(data, value);
      updateState(feed, state);
    })
    .catch((err) => {
      throw err;
    });
};

export const handlePostClick = (currentState) => (event) => {
  const state = currentState;
  const { target } = event;

  if (!target.dataset.toggle) return;

  const test = state.posts.find((post) => post.link === target.dataset.href);
  state.modalData = test;
};
