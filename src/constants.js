export const formStatuses = {
  valid: 'valid',
  invalid: 'invalid',
  default: 'default',
  load: 'load',
};

export const handledErrors = {
  'Parser Error': 'parserError',
  'Request failed with status code 404': 'notFound',
  'Network Error': 'networkError',
  'Is not URL': 'isNotUrl',
  'Alredy exist': 'alredyExist',
  'Unknown Error': 'unknownError',
};

export const errorMessages = {
  parserError: 'Ошибка парсинга',
  notFound: 'Введенный URL не сущаетсвует',
  networkError: 'Проблемы с сетью',
  isNotUrl: 'Введенный адрес не является URl',
  alredyExist: 'Введенный адрес уже добавлен',
  unknownError: 'Неизвестная ошибка',
};

export const proxy = 'https://cors-anywhere.herokuapp.com/';

export const interval = 5000;
