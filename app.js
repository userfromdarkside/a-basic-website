function showAlert() {
  alert('Welcome! Feel free to explore the site.');
}

function handleSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const response = document.getElementById('form-response');

  if (name && email && message) {
    response.textContent = `Thanks, ${name}! Your message has been received.`;
    event.target.reset();
  }
}

// Chat widget
function toggleChat() {
  document.getElementById('chat-box').classList.toggle('open');
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';

  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.textContent = text;
  messages.appendChild(userMsg);
  messages.scrollTop = messages.scrollHeight;

  const typing = document.createElement('div');
  typing.className = 'chat-msg bot';
  typing.textContent = '...';
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  try {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    typing.textContent = data.reply || 'Sorry, something went wrong.';
  } catch {
    typing.textContent = 'Error: Could not reach the server.';
  }

  messages.scrollTop = messages.scrollHeight;
}

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
