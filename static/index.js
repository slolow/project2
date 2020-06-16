if (!localStorage.getItem('username')) {
  // redirect to '/name'
  location.replace('name');
}
else {
  // counterChatRoom and quantityChatRoom for load function
  var counterChatRoom = 1;
  var quantityChatRoom = 40;
  var counterMessage = 1;
  var quantityMessage = 10;

  document.addEventListener('DOMContentLoaded', () => {

    // welcome user, load page and active Buttons
    document.querySelector('#header-title').innerHTML = 'Welcome ' + localStorage.getItem('username') + '!';
    loadChatRooms();
    loadMessages();
    activateCreateNewChatButton();

    // If menu scrolled to bottom, load next chat-rooms.
    const menu = document.querySelector('#menu');
    menu.onscroll = () => {
      if ((menu.clientHeight + menu.scrollTop) >= menu.scrollHeight) {
        loadChatRooms();
      }
    };

    // If message-container scrolled to bottom, load next messages.
    const messageContainer = document.querySelector('#message-container');
    messageContainer.onscroll = () => {
      if ((messageContainer.clientHeight + messageContainer.scrollTop) >= messageContainer.scrollHeight) {
        loadMessages();
      }
    };

  });
}


// functions
function activateCreateNewChatButton () {
  document.querySelector('#create-new-chat').onclick = () => {
    location.replace('new-chat');
    return false;
  };
}


function loadChatRooms() {

  // Set start and end chat-rooms numbers, and update counterChatRoom.
  const start = counterChatRoom;
  const end = start + quantityChatRoom - 1;
  counterChatRoom = end + 1;

  // Open new request to get chat-rooms.
  const request = new XMLHttpRequest();
  request.open('POST', '/chats');
  request.onload = () => {
      const data = JSON.parse(request.responseText);
      data.forEach(add_chat_room);
  };

  // Add start and end points to request data.
  const data = new FormData();
  data.append('start', start);
  data.append('end', end);

  // Send request.
  request.send(data);
};

function loadMessages() {

  // Set start and end message numbers, and update counterMessage.
  const start = counterMessage;
  const end = start + quantityMessage - 1;
  counterMessage = end + 1;

  // Open new request to get messages.
  const request = new XMLHttpRequest();
  request.open('POST', '/messages');
  request.onload = () => {
      const data = JSON.parse(request.responseText);
      data.forEach(add_message);
  };

  // Add start and end points to request data.
  const data = new FormData();
  data.append('start', start);
  data.append('end', end);

  // Send request.
  request.send(data);

}


// Add a new chat-room with given contents to DOM.
const chat_room_template = Handlebars.compile(document.querySelector('#chat-room').innerHTML);
function add_chat_room(contents) {

    // Create new chat-room.
    const chatRoom = chat_room_template({'contents': contents});

    // Add chat-room to DOM.
    document.querySelector('#chat-container').innerHTML += chatRoom;
}

// Add a new message with given contents to DOM.
const message_template = Handlebars.compile(document.querySelector('#message').innerHTML);
function add_message(contents) {

    // Create new chat-room.
    if (localStorage.getItem('username') === contents['user']) {
      var message = message_template({'contents': contents['message'], 'info': contents['user'] + " " + contents['time'], 'class': 'own-message'});
    }
    else {
      var message = message_template({'contents': contents['message'], 'info': contents['user'] + " " + contents['time'], 'class': 'friends-message'});
    }

    // Add chat-room to DOM.
    document.querySelector('#message-container').innerHTML += message;
}




/*// function definitions
function showUserName() {
  const h4 = document.createElement('h4');
  h4.id = "welcome"
  h4.innerHTML = "Welcome " + localStorage.getItem('name') + "!"
  document.querySelector('#header').append(h4);
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

function createChatRoomLink(chatRoomName) {
  // add chat link in menu bar
  //const span = createSpan(id="link-" + chatRoomName, classList='chatLinkItem', innerHTML=chatRoomName);
  const button = document.createElement('button');
  button.id = "link-" + chatRoomName;
  button.classList.add("chatLinkItem", "btn", "btn-outline-info");

  button.innerHTML = chatRoomName;
  //document.querySelector('#chatLinkContainer').append(span);
  document.querySelector('#chatLinkContainer').append(button);
}

function disableButtonUntilFormFilledOut(inputId, submitId) {
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

function loadChatRoom(chatRoomName) {
  const chatContent = document.querySelector('#chatContent');
  if (chatContent.children.length > 1) {
    const child = chatContent.firstChild;
    child.remove();
  }
  const chatRoom = createDiv(id=chatRoomName, classList="chatRoom");
  const h1 = document.createElement('h1');
  h1.innerHTML = chatRoomName;
  chatRoom.append(h1);
  chatContent.append(chatRoom);
  chatContent.insertBefore(chatRoom, chatContent.firstChild);
  localStorage.setItem('actualChatRoom', chatRoomName);
}

function storeNewChatInLocalStorage(chatRoomName) {
  const chats = JSON.parse(localStorage.getItem("chats")) || [];
  chats.push(chatRoomName);
  console.log(chats);
  localStorage.setItem("chats", JSON.stringify(chats));
}

function loadMessages(messageId, message, time, user, chatRoomName) {
  const div = createDiv(id="message-" + messageId, classList="messages");
  div.innerHTML = message + ' at \n' + time + ' from ' + user;
  const chatRoom = document.querySelector('#' + chatRoomName);
  chatRoom.append(div);
}

function loadLocalChatLinks() {
  var storedChats = JSON.parse(localStorage.getItem("chats"));
  storedChats.forEach((chat, i) => {
    createChatRoomLink(chat);
  });
}


document.addEventListener('DOMContentLoaded', () => {
  // Show prompt for user name until user filled it out if no name in local storage
  if (!localStorage.getItem('name')) {
    var proceed = false;
    while(!proceed) {
      var user = prompt('Amigo! Choose a user name of at leat 3 characters');
      if (user != null && user.length > 2) {
        localStorage.setItem('name', user);
        proceed = true;
      }
    }
  }

  else {
    proceed = true;
  }
  if (proceed) {
    showUserName();
    disableButtonUntilFormFilledOut(inputId='#messageInput', submitId='#messageSubmit')

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected
    socket.on('connect', () => {
      if (localStorage.getItem('chats')) {
        loadLocalChatLinks();
        socket.emit('chat room request', {'chatRoomName': localStorage.getItem('actualChatRoom')});
        document.querySelectorAll('.chatLinkItem').forEach(button => {
          button.onclick = () => {
            const chatRoomName  = button.innerHTML;
            //alert(`request for chat room: ${chatRoomName}`);
            console.log(chatRoomName);
            socket.emit('chat room request', {'chatRoomName': chatRoomName});
            return false;
          };
        });
      }
      // configure submit message
      const sendMessage = document.querySelector('#messageSubmit');
      sendMessage.onclick = () => {
        const chatRoomName = localStorage.getItem('actualChatRoom');
        const message = document.querySelector('#messageInput').value;
        const localUser = localStorage.getItem('name');
        socket.emit('new message', {'message': message, 'chatRoomName': chatRoomName, 'user': localUser});
        //alert(`send message: ${message} and chatroom-id: ${chatRoomName}`);
        return false;
      };
      // and create a new chat
      const createNewChat = document.querySelector('#createNewChat');
      createNewChat.onclick = () => {
        const localUser = localStorage.getItem('name');
        createNewChat.disabled = true;
        alert('Fill out the form to create a new chat. No non alphabetic charcaters and no white space allowed!');
        const form = createForm(id='form-create-new-chat', classList='form-header');
        const inputChat = createInput(id='chat-name', autocomplete='off', autofocus=true, placeholder='chat name');
        const inputTopic = createInput(id='topic', autocomplete='off', autofocus=true, placeholder='topic');
        const submit = createSubmit(id='submit-chat-name', disbaled=true);
        document.querySelector('#welcome').remove();
        document.querySelector('#header').append(form);
        form.append(inputChat);
        form.append(inputTopic);
        form.append(submit);
        disableButtonUntilFormFilledOut(inputId='#chat-name', submitId='#submit-chat-name');
        inputChat.scrollIntoView();
        form.onsubmit = function() {
          const userInputChatName = inputChat.value;
          // replace every white space by '-' and filter out every non alphabetic sign
          const chatRoomNameFiltered = userInputChatName.split(' ').join('-').replace(/[\W_]+/g,"");
          const chatRoomName = chatRoomNameFiltered.replace(/[0-9]/g, "");
          form.remove();
          showUserName();
          loadChatRoom(chatRoomName);
          document.querySelector('#createNewChat').disabled = false;

          socket.emit('create new chat room', {'chatRoomName': chatRoomName, 'user': localUser});
          //alert(`send new chat: ${chatRoomName}`);
          return false;
        };
      };
      return false;

    });

    // When a new message is send, add to chatroom and show the 100 latest messages
    socket.on('latest messages', data => {

      //alert(`received message: ${data.message} with message id: ${data.messageId} and chat room id: ${data.chatRoomName} from user: ${data.user}`);
      loadMessages(messageId=data.messageId, message=data.message, time=data.time, user=data.user, chatRoomName=data.chatRoomName);
      const messageInput = document.querySelector('#messageInput');
      messageInput.value = '';
      return false;
    });

    socket.on('new chat room created', data => {
      const localUser = localStorage.getItem('name');
      if (data.nameIsAvaible) {
        createChatRoomLink(data.chatRoomName);
        if (data.user === localUser) {
          storeNewChatInLocalStorage(data.chatRoomName);
        }
      }
      else {
        alert('chat room name is not available');
        socket.emit('chat room request', {'chatRoomName': localStorage.getItem('actualChatRoom')});
        return false;
      }
      document.querySelectorAll('.chatLinkItem').forEach(button => {
        button.onclick = () => {
          const chatRoomName  = button.innerHTML;
          alert(`request for chat room: ${chatRoomName}`);
          console.log(chatRoomName);
          socket.emit('chat room request', {'chatRoomName': chatRoomName});
          return false;
        };
      });
      //alert(`received new chat: ${data.chatRoomName}`);
      return false;
    });

    socket.on('chat room access', data => {
      //alert(`new chat acces: ${data.chatRoomName}`);
      loadChatRoom(data.chatRoomName);
      data.messages.forEach(function(messageInfo, index) {
        const time = messageInfo.time;
        const user = messageInfo.user;
        const message = messageInfo.message;
        loadMessages(messageId=index, message, time, user, chatRoomName=data.chatRoomName);
        console.log('time: ' + time + ' message ' + message + 'user: ' + user + 'index: ' + index);
      });
      const storedChats = JSON.parse(localStorage.getItem("chats"));
      if (!storedChats.includes(data.chatRoomName)) {
        console.log('workes');
        storeNewChatInLocalStorage(data.chatRoomName);
      }
      return false;
    });

  }
});

*/
