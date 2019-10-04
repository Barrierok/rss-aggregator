import validator from 'validator';
import {
  formStatuses,
  proxy,
  intervalUpdate,
  validate,
} from './utils';
import fetchFeed from './workingWithFeed';

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
