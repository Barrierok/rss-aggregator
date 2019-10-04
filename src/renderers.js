import { formStatuses, translator } from './utils';

const validForm = (...args) => {
  const [inputElement, buttonElement] = args;
  inputElement.classList.remove('is-invalid');
  inputElement.classList.add('is-valid');
  buttonElement.disabled = false;
};

const emptyForm = (...args) => {
  const [inputElement, buttonElement, buttonElementSpinner] = args;
  inputElement.value = '';
  inputElement.disabled = false;
  inputElement.classList.remove('is-valid');
  inputElement.classList.remove('is-invalid');
  buttonElement.disabled = true;
  buttonElementSpinner.classList.add('d-none');
};

const invalidForm = (...args) => {
  const [inputElement, buttonElement, buttonElementSpinner] = args;
  inputElement.disabled = false;
  inputElement.classList.remove('is-valid');
  inputElement.classList.add('is-invalid');
  buttonElement.disabled = true;
  buttonElementSpinner.classList.add('d-none');
};

const loadForm = (...args) => {
  const [inputElement, buttonElement, buttonElementSpinner] = args;
  inputElement.disabled = true;
  buttonElement.disabled = true;
  buttonElementSpinner.classList.remove('d-none');
};

const selectStatus = {
  [formStatuses.empty]: emptyForm,
  [formStatuses.valid]: validForm,
  [formStatuses.invalid]: invalidForm,
  [formStatuses.load]: loadForm,
};

export const renderForm = (state) => () => {
  const inputElement = document.querySelector('#inputForm');
  const buttonElement = document.querySelector('#buttonForm');
  const buttonElementSpinner = buttonElement.querySelector('#buttonFormSpinner');

  selectStatus[state.formStatus](inputElement, buttonElement, buttonElementSpinner);
};

export const renderError = (state) => () => (
  translator()
    .then((translate) => {
      const errorElement = document.querySelector('#feedBack');
      errorElement.innerHTML = translate(state.error);
    })
);

export const renderChannels = (state) => () => {
  const channelsList = document.querySelector('#channels');
  const channels = state.channels.map((feed) => (
    `<li class="list-group-item">
      <h5>${feed.title}</h5>
      <p>${feed.description}</p>
    </li>`
  ));
  channelsList.innerHTML = channels.join('');
};

export const renderPosts = (state) => () => {
  const postsList = document.querySelector('#posts');
  const posts = state.posts.map(({ title, link }) => (
    `<div class="col-sm-6 mb-3">
      <div class="card">
        <div class="card-body w-100">
          <a href=${link} class="card-title">${title}</a>
        </div>
        <div class="card-footer w-100">
          <a href="#" class="w-100 btn btn-primary" data-toggle="modal" data-target="#postModal" data-href="${link}">Больше</a>
        </div>
      </div>
    </div>`
  ));
  postsList.innerHTML = posts.join('');
};

export const renderModal = (state) => () => {
  const postModalTitle = document.querySelector('#postModalTitle');
  const postModalBody = document.querySelector('#postModalBody');

  postModalTitle.textContent = state.modalData.title;
  postModalBody.textContent = state.modalData.description;
};
