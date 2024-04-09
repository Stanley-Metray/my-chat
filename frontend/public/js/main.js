function getCookie(name) {
  const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return cookieValue ? cookieValue.pop() : '';
}

const user = getCookie('user');
const token = getCookie('token');




// document.getElementById('btn-hide-sidebar').addEventListener('click', (e) => {
//   document.getElementById('chat-body').style.display = 'block';
//   document.getElementById('sidebar').style.display = 'none';
//   document.getElementById('controlls').style.display = 'none';
// });


const getChats = async () => {
  const fetch = localStorage.getItem('fetch');
  if (fetch === 'false')
    return;
  try {
    const response = await axios.get('/get-chats');
    const data = await response.data;
    if (data.success) {
      localStorage.setItem('chats', JSON.stringify(data));
      localStorage.setItem('fetch', 'false');
      setChats();
    } else {
      document.getElementById('chats-list').innerHTML = `<div class="alert alert-primary" role="alert">
            <i class="bi bi-ban"></i> Nothing to show
          </div>`;
    }
  } catch (error) {
    console.log(error);
  }
}

function setChats() {
  const chats = JSON.parse(localStorage.getItem('chats')).chats;

  let html = '';
  chats.forEach((chat) => {
    html += `<li class="list-group-item d-flex justify-content-between align-items-start" id=${chat.id}>
                    <div class="ms-2 me-auto">
                        <div class="fw-bold truncate">${chat.group_name}</div>
                        <p class='truncate'><small>${chat.group_description}</small></p>
                    </div>
                    <span class="badge text-bg-primary rounded-pill">${chat.total_members}</span>
                </li>`;
  });

  document.getElementById('chats-list').innerHTML = html;
  document.getElementById('chats-list').addEventListener('click', showChat);
}

async function showChat(e) {
  if (e.target.tagName === 'LI') {
    try {

      const chatId = e.target.id;
      const chats = JSON.parse(localStorage.getItem('chats')).chats;
      let chat = chats.filter((chat) => {
        return chat.id === chatId;
      });

      setChat(chat[0]);
      if (window.screen.width < 768) {
        document.getElementById('chat-body').style.display = 'block';
        document.getElementById('sidebar').style.display = 'none';
        document.getElementById('controlls').style.display = 'none';
      }

    } catch (error) {
      alert('Something went wrong');
      console.log(error);
    }
  }
}


document.addEventListener('DOMContentLoaded', async (e) => {
  getChats();
  setChats();
});

const chatBody = document.getElementById('chat-body');
chatBody.style.visibility = 'hidden';

function setChat(chat) {
  localStorage.setItem('ci', chat.id);
  const html = `<div class="row">
    <div class="col" id="chat">
      <div class="template text-white" id="template">
        <div class="chat-box mb-3" id="chat-box">
          <div class="chat-head bg-dark p-2 ps-3 d-flex gap-2">
            <div class="group-icon text-white fs-2">
              <i class="bi bi-person-circle"></i>
            </div>
            <div class="group-status d-flex flex-column">
              <p class="m-0 p-0">${chat.group_name}</p>
              <p class="m-0 p-0"><small>${chat.group_description}</small></p>
            </div>
            <div>
              <i class="bi bi-sliders" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="groupControlls(event)"></i>

            </div>
            <i class="bi bi-x text-danger fs-4 d-none " id="btn-show-sidebar" onclick="showSideBar(event)"></i>
          </div>
          <div class="chat">
            <div id="message-box" class="message-box d-flex flex-column align-items-start p-3 gap-3">

            </div>
          </div>
        </div>
        <form id="message-form" onsubmit="sendMessage(event)">
          <div class="input-group w-100 mb-3 px-3">
            <input type="text" name="message" id="message" autocomplete="off" class="form-control"
              placeholder="Type Message" aria-label="Recipient's username" aria-describedby="button-addon2">
            <button class="btn btn-primary" type="submit" id="button-addon2"><strong><i class="bi bi-send"></i>
                Send</strong></button>
          </div>
        </form>
      </div>
    </div>
  </div>`;



  let messages = ``;

  chat.messages.forEach((msg) => {
    messages += `<div class="message d-flex flex-column">
    <span class="fs-user">${msg.sender}</span>
    <span>${msg.content}</span>
    </div>`;
  });

  chatBody.innerHTML = html;
  document.getElementById('message-box').innerHTML = messages;
  chatBody.style.visibility = 'visible';
}

const showSideBar = (e) => {
  document.getElementById('chat-body').style.display = 'none';
  document.getElementById('sidebar').style.display = 'block';
  document.getElementById('controlls').style.display = 'flex';
};

const groupControlls = async (event) => {
  try {
    const chatId = localStorage.getItem('ci');
    const response = await axios.get(`/get-chat/${chatId}`);
    const data = response.data;
    const chat = data.chat;
    const members = data.members;
    let memberHtml = '';

    members.forEach((member, index) => {
      if (member.isAdmin) {
        memberHtml += `<li class="list-group-item bg-light text-dark">${index + 1}. <strong>${member.user_name}</strong> <small class='text-success'> ~admin</small></li>`;
      } else {
        memberHtml += `<li class="list-group-item bg-light text-dark">${index + 1}. <strong>${member.user_name} - <div class="btn-group" role="group" aria-label="Basic mixed styles example">
        <button data-bs-ci=${member.chatId} data-bs-ui=${member.userId} onclick="makeAdmin(event)" type="button" class="btn btn-sm btn-warning">Make Admin</button>
        <button data-bs-ci=${member.chatId} data-bs-ui=${member.userId} onclick="removeMember(event)" type="button" class="btn btn-sm btn-danger"><i data-bs-ci=${member.chatId} data-bs-ui=${member.userId} onclick="removeMember(event)" class="bi bi-trash3-fill"></i></button>
      </div></li>`;
      }
    });

    if (data.success) {
      let html = `<div class="modal-content">
    <div class="modal-header">
      <h1 class="modal-title fs-5" id="staticBackdropLabel">${chat.group_name}</h1>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
    <p><strong>Description:<br/> </strong>${chat.group_description}</p>
    <p><strong>Share Join Link:<br/> </strong><a href="#" class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">${data.joinLink}</a></p>
    </div>
    <fieldset>
    <legend class="fs-6 text-center">Add New Member</legend>
    <form class="w-75 border border-1 p-2 ms-auto me-auto mx-3" onsubmit="searchUserByPhone(event)">
        <div class="input-group">
            <input type="text" class="form-control" name="phone" id="phone" placeholder="Phone Number" required>
            <button type="submit" class="input-group-text btn btn-warning">Search</button>
        </div>
        <div class='d-flex flex-column my-2 gap-1' id="search-result"></div>
    </form>
</fieldset>

    <h5 class='p-2'><strong>Members</strong></h5>
    <ul id="members" class="list-group border border-1 p-2">${memberHtml}</ul>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </div>
  </div>`;

      document.getElementById('modal-dialog').innerHTML = html;
    }
    else alert("Something went wrong");
  } catch (error) {
    console.log(error);
    alert("Internal server error");
  }
}

async function sendMessage(e) {
  e.preventDefault();
  try {
    const formData = {
      content: document.getElementById('message').value,
      sender: user,
      chatId: localStorage.getItem('ci')
    }

    const response = await axios.post('/send-message', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.data;
    if (data.success)
      setLastMessage(data);
  } catch (error) {
    console.log(error);
  }
}

const setLastMessage = (data) => {
  const allChats = JSON.parse(localStorage.getItem('chats'));

  allChats.chats.forEach((chat) => {
    if (chat.id === localStorage.getItem('ci'))
      chat.messages.push(data.message);
  });

  localStorage.setItem('chats', JSON.stringify(allChats));
  let html = `<div class="message d-flex flex-column">
  <span class="fs-user">${data.message.sender}</span>
  <span>${data.message.content}</span>
</div>`;

  document.getElementById('message-box').innerHTML += html;
  let chatBox = document.getElementById('chat-box');
  chatBox.scrollTop = chatBox.scrollHeight;
}

const makeAdmin = async (event) => {
  const chatId = event.target.getAttribute("data-bs-ci");
  const makeAdminId = event.target.getAttribute("data-bs-ui");

  try {
    const response = await axios.post('/make-admin', { chatId, makeAdminId }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;
    if (data.success) {
      alert(data.message + ", Please wait");
      setTimeout(() => { window.location.href = '/'; }, 500);
    }
    else
      alert(data.message);
  } catch (error) {
    console.log(error);
    alert(await error.response.data.message);
  }
}

const removeMember = async (event) => {
  event.stopPropagation();
  const chatId = event.target.getAttribute("data-bs-ci");
  const removeMemberId = event.target.getAttribute("data-bs-ui");
  try {
    const response = await axios.post('/remove-member', { chatId, removeMemberId }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;
    if (data.success) {
      alert(data.message);
      setTimeout(() => { window.location.href = '/'; }, 500);
    }
    else
      alert(data.message);
  } catch (error) {
    console.log(error);
    alert(await error.response.data.message);
  }
}

const searchUserByPhone = async (evet) => {
  evet.preventDefault();
  try {
    const phoneNumber = document.getElementById('phone').value;
    if (phoneNumber.length < 10 || phoneNumber.length > 10)
      return alert("Please enter valid phone number");

    const response = await axios.post('/search-member-by-phone', { "phone": phoneNumber }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.data;
    document.getElementById('search-result').innerHTML = `
    <h6>Search Result:</h6><br/>
    <p><button onclick="addMember(event)" class='btn btn-outline-success'>${data.member.first_name}</button></p>
  `;
  } catch (error) {
    console.log(error);
    alert(await error.response.data.message);
  }
}


const addMember = async (event) => {
  try {
    const chatId = localStorage.getItem('ci');
    const phone = document.getElementById('phone').value;

    const response = await axios.post('/add-member', {chatId, phone}, {
      headers : {
        'Content-Type' : 'application/json'
      }
    });
    const data = await response.data;
    if (data.success) {
      let html = `<li class="list-group-item bg-light text-dark">*. <strong>${data.member.user_name} - <div class="btn-group" role="group" aria-label="Basic mixed styles example">
        <button data-bs-ci=${data.member.chatId} data-bs-ui=${data.member.userId} onclick="makeAdmin(event)" type="button" class="btn btn-sm btn-warning">Make Admin</button>
        <button data-bs-ci=${data.member.chatId} data-bs-ui=${data.member.userId} onclick="removeMember(event)" type="button" class="btn btn-sm btn-danger"><i data-bs-ci=${data.member.chatId} data-bs-ui=${data.member.userId} onclick="removeMember(event)" class="bi bi-trash3-fill"></i></button>
      </div></li>`
      document.getElementById('members').innerHTML += html;
      alert(data.message);
    }
    else
      alert(data.message);
  } catch (error) {
    console.log(error);
  }
}