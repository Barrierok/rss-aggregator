import validator from 'validator';

export const proxy = 'https://cors-anywhere.herokuapp.com/';

export const intervalUpdate = 5000;

export const formStatuses = {
  valid: 'valid',
  invalid: 'invalid',
  empty: 'empty',
  load: 'load',
};

export const errorMessages = {
  parserError: 'Parser Erorr',
  notFound: 'Request failed with status code 404',
  networkError: 'Network Error',
};

export const handledErrors = {
  parserError: 'parserError',
  notFound: 'notFound',
  networkError: 'networkError',
  isNotUrl: 'isNotUrl',
  alredyExist: 'alredyExist',
  unknownError: 'unknownError',
};

export const validate = (currentState, value) => {
  const state = currentState;
  const isExisting = state.channels.some((channel) => channel.link === value);
  const isUrl = validator.isURL(value);

  const result = { formStatus: null, error: '' };

  if (!isExisting && isUrl) {
    return { ...result, formStatus: formStatuses.valid };
  }

  result.error = isExisting ? handledErrors.alredyExist : handledErrors.isNotUrl;
  result.formStatus = formStatuses.invalid;
  return result;
};
