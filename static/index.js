// function definitions
function alertName() {
  alert('Hello friend make sure to submit a user name! Otherwise you\'ll not be able to chat');
}

function fillInNameForm() {
  const form = createForm(id="form-name", classList="form-header");
  const input = createInput(id='name', autocomplete='off', autofocus=true, placeholder='name');
  const submit = createSubmit(id='submit-name', disbaled=true);
  document.querySelector('#header').appendChild(form);
  form.appendChild(input);
  form.appendChild(submit);
  form.scrollIntoView();
  // disable submit button if no text in input
  disableButton(inputId='#name', submitId='#submit-name');
  // Add user name to local storage and remove form-name
  document.querySelector('#form-name').onsubmit = function() {
    const name = document.querySelector('#name').value;
    localStorage.setItem('name', name);
    document.querySelector('#form-name').remove();
    alert('Gracias Amigo! Meet interesting people in our chatroom or create a new chatroom with a topic of your choice');
    showUserName();
    return false;
  }
}

function showUserName() {
  const h4 = document.createElement('h4');
  h4.id = "welcome"
  h4.innerHTML = "Welcome " + localStorage.getItem('name') + "!"
  document.querySelector('#header').appendChild(h4);
}

function createDiv(id, classList) {
  const div = document.createElement('div');
  div.id = id;
  div.classList.add(classList);
  return div;
}

function createForm(id, classList) {
  const form = document.createElement('form');
  form.id = id;
  form.classList.add(classList);
  return form;
}

function createSpan(id, classList, innerHTML) {
  const span = document.createElement('span');
  span.id = id;
  span.classList.add(classList);
  span.innerHTML = innerHTML;
  return span;
}

function createInput(id, autocomplete, autofocus, placeholder) {
  const input = document.createElement('input');
  input.id = id;
  input.autocomplete = autocomplete;
  input.autofocus = autofocus;
  input.placeholder = placeholder;
  return input;
}

function createSubmit(id, disabled) {
  const submit = document.createElement('input');
  submit.type = 'submit';
  submit.id = id;
  submit.disabled = disabled;
  return submit;
}

function disableButton(inputId, submitId) {
  document.querySelector(inputId).onkeyup = () => {
    if (document.querySelector(inputId).value.length > 0) {
      document.querySelector(submitId).disabled = false;
    }
    else {
      document.querySelector(submitId).disabled = true;
    }
  };
}

function initializeLocalStorage(name, value) {
  if (!localStorage.getItem(name))
      localStorage.setItem(name, value);
}

function linkChatMenuToChatCarousel() {
  document.querySelectorAll('.chatLinkItem').forEach(link => {
    link.onclick = function () {
      carouselNumber = parseInt(link.id.substr(-1));
      $('.carousel').carousel(carouselNumber);
    }
  });
}


initializeLocalStorage(name='counter', value=1);

document.addEventListener('DOMContentLoaded', function() {

  // Show form for user name if no name in local storage
  if (!localStorage.getItem('name')) {
    alertName();
    fillInNameForm();
  }
  else {
    showUserName();
  }

  //create a new chat
  document.querySelector('#create-new-chat').onclick = function() {
    document.querySelector('#create-new-chat').disabled = true;
    if (!localStorage.getItem('name')) {
      alertName();
  }
    else {
      alert('Fill out the form to create a new chat');
      const form = createForm(id='form-create-new-chat', classList='form-header');
      const inputChat = createInput(id='chat-name', autocomplete='off', autofocus=true, placeholder='chat name');
      const inputTopic = createInput(id='topic', autocomplete='off', autofocus=true, placeholder='topic');
      const submit = createSubmit(id='submit-chat-name', disbaled=true);
      document.querySelector('#welcome').remove();
      document.querySelector('#header').appendChild(form);
      form.appendChild(inputChat);
      form.appendChild(inputTopic);
      form.appendChild(submit);
      disableButton(inputId='#chat-name', submitId='#submit-chat-name');
      inputChat.scrollIntoView();
      form.onsubmit = function() {
        const chatName = inputChat.value;
        form.remove();
        showUserName();
        let counter = localStorage.getItem('counter');
        const divCarouselItem = createDiv(id="carousel-item-" + counter, classList="carousel-item");
        document.querySelector('.carousel-inner').appendChild(divCarouselItem);
        const h1 = document.createElement('h1');
        h1.innerHTML = chatName;
        document.querySelector('#carousel-item-' + counter).appendChild(h1);

        // add chat link in menu bar
        const span = createSpan(id="link-" + counter, classList='chatLinkItem', innerHTML=chatName)
        document.querySelector('#chatLinkContainer').appendChild(span);

        localStorage.setItem('chat-name-' + counter, chatName);
        counter++;
        localStorage.setItem('counter', counter);

        document.querySelector('#create-new-chat').disabled = false;

        linkChatMenuToChatCarousel();
    }
  }
  };
});