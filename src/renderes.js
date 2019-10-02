import formStatuses from './constants';

export const renderForm = (state) => () => {
  const inputElement = document.querySelector('#inputForm');
  const buttonElement = document.querySelector('#buttonForm');
  const buttonElementSpinner = buttonElement.querySelector('#buttonFormSpinner');

  switch (state.formStatus) {
    case formStatuses.default:
      inputElement.value = '';
      inputElement.disabled = false;
      inputElement.classList.remove('is-valid');
      inputElement.classList.remove('is-invalid');
      buttonElement.disabled = true;
      buttonElementSpinner.classList.add('d-none');
      break;
    case formStatuses.valid:
      inputElement.classList.remove('is-invalid');
      inputElement.classList.add('is-valid');
      buttonElement.disabled = false;
      break;
    case formStatuses.invalid:
      inputElement.disabled = false;
      inputElement.classList.remove('is-valid');
      inputElement.classList.add('is-invalid');
      buttonElement.disabled = true;
      buttonElementSpinner.classList.add('d-none');
      break;
    case formStatuses.load:
      inputElement.disabled = true;
      buttonElement.disabled = true;
      buttonElementSpinner.classList.remove('d-none');
      break;
    default:
  }
};

export const renderChannels = (state) => () => {
  const channelsList = document.querySelector('#channels');
  const channels = state.channels.map((feed) => (
    `<li class="list-group-item">
      <h6>${feed.title}</h6>
      <p>${feed.description}</p>
    </li>`
  ));
  channelsList.innerHTML = channels.join('');
};

export const renderPosts = (state) => () => {
  const postsList = document.querySelector('#posts');
  const posts = state.posts.map(({ title, link }) => (
    `<div class="col-sm-6 mb-3">
      <div class="card text-center">
        <div class="card-body">
          <a href=${link} class="card-title">${title}</a>
          <a href="#" class="btn btn-primary" data-toggle="modal" data-target="#postModal" data-href="${link}">Больше</a>
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
