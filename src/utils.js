import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const translator = () => (
  i18next
    .use(LanguageDetector)
    .init({
      resources: {
        'ru-RU': {
          translation: {
            parserError: 'Ошибка парсинга',
            notFound: 'Введенный URL не сущетсвует',
            networkError: 'Проблемы с сетью',
            isNotUrl: 'Введенный адрес не является URl',
            alredyExist: 'Введенный адрес уже добавлен',
            unknownError: 'Неизвестная ошибка',
          },
        },
        en: {
          translation: {
            parserError: 'Parsing error',
            notFound: 'The URL you entered does not exist',
            networkError: 'Network problem',
            isNotUrl: 'The address entered is not a URl',
            alredyExist: 'The entered address has already been added',
            unknownError: 'Unknown error',
          },
        },
      },
    })
);

export const formStatuses = {
  valid: 'valid',
  invalid: 'invalid',
  empty: 'empty',
  load: 'load',
};

export const handledErrors = {
  parserError: 'parserError',
  notFound: 'notFound',
  networkError: 'networkError',
  isNotUrl: 'isNotUrl',
  alredyExist: 'alredyExist',
  unknownError: 'unknownError',
};

export const proxy = 'https://cors-anywhere.herokuapp.com/';

export const intervalUpdate = 5000;

export const parseFeed = (data, value) => {
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

export const validate = (isExisting, isUrl, currentState) => {
  const state = currentState;
  if (!isExisting && isUrl) {
    state.formStatus = formStatuses.valid;
    return;
  }
  state.error = isExisting ? handledErrors.alredyExist : handledErrors.isNotUrl;
  state.formStatus = formStatuses.invalid;
};
