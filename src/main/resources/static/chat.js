function setConnected(connected) {
    document.getElementById('sendBtn').disabled = !connected;
}

function showMessage(message) {
    const messageArea = document.getElementById('messageArea');
    const messageElement = document.createElement('p');
    messageElement.textContent = message.sender + ": " + message.content;
    messageElement.class = "mb-1";
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function sendMessage() {
    const sender = document.getElementById('senderInput').value;
    const content = document.getElementById('contentInput').value;

    if (!sender.trim()) {
        alert('Lütfen adınızı girin!');
        return;
    }

    if (!content.trim()) {
        alert('Lütfen bir mesaj girin!');
        return;
    }

    const message =
        {
            sender: sender,
            content: content
        }
    stompClient.send("/app/sendMessage", {}, JSON.stringify(message));
    document.getElementById('contentInput').value = '';
}

function connect() {
    const socket = new SockJS('/chat');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        stompClient.subscribe('/topic/messages', function (message) {
            showMessage(JSON.parse(message.body));
        });
    })
}

const toggleBtn = document.getElementById('themeToggle');
const htmlTag = document.getElementById('htmlTag');

// Daha önce seçilmiş tema varsa uygula
if (localStorage.getItem('theme') === 'dark') {
    htmlTag.classList.add('dark');
    toggleBtn.textContent = '☀️ Light Mode';
}

toggleBtn.addEventListener('click', () => {
    htmlTag.classList.toggle('dark');
    const isDark = htmlTag.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    toggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

window.onload = () => {
    connect();
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('contentInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

};

