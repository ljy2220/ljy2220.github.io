document.addEventListener('DOMContentLoaded', () => {
    const storedMessages = localStorage.getItem('messages');
    const messageList = document.getElementById('messageList');

    if (storedMessages) {
        const messages = JSON.parse(storedMessages);
        messages.forEach((message, index) => {
            addMessageToList(message, index);
        });
    }
});

function sendMessage() {
    const message = document.getElementById('message').value;

    if (message.trim() !== '') {
        const storedMessages = localStorage.getItem('messages');
        const messages = storedMessages ? JSON.parse(storedMessages) : [];
        messages.push(message);
        localStorage.setItem('messages', JSON.stringify(messages));

        addMessageToList(message, messages.length - 1);

        document.getElementById('message').value = '';
        alert('응원 메시지가 추가되었습니다!');
    } else {
        alert('메시지를 입력해주세요!');
    }
}

function addMessageToList(message, index) {
    const messageList = document.getElementById('messageList');
    const newMessage = document.createElement('li');

    newMessage.innerHTML = `
        ${message}
        <button onclick="deleteMessage(${index})" style="margin-left: 10px; padding: 5px 10px; background-color: #ff8fab; color: white; border: none; border-radius: 5px; cursor: pointer;">삭제</button>
    `;

    messageList.appendChild(newMessage);
}

function deleteMessage(index) {
    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
        const messages = JSON.parse(storedMessages);
        messages.splice(index, 1);
        localStorage.setItem('messages', JSON.stringify(messages));

        
        refreshMessageList();
    }
}

function refreshMessageList() {
    const storedMessages = localStorage.getItem('messages');
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = '';

    if (storedMessages) {
        const messages = JSON.parse(storedMessages);
        messages.forEach((message, index) => {
            addMessageToList(message, index);
        });
    }
}
