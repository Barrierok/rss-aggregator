import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export default () => (
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
