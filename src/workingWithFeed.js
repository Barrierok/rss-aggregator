import _ from 'lodash';
import axios from 'axios';
import { handledErrors, formStatuses } from './utils';

const parseFeed = (data, value) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');

  if (doc.querySelector('parsererror')) {
    throw new Error('Parser Error');
  }

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

export default fetchFeed;
