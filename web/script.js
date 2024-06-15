document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    appendMessage('You', userInput);
    document.getElementById('user-input').value = '';

    const response = await eel.get_chat_response(userInput)();
    appendMessage('ChatGPT', response);

    saveChatHistory();
}

function appendMessage(sender, message) {
    const messageContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    if (message.includes('```')) {
        const parts = message.split('```');
        messageElement.innerHTML = `<strong>${sender}:</strong> `;
        parts.forEach((part, index) => {
            if (index % 2 === 1) {
                const lines = part.trim().split('\n');
                const language = lines[0].trim();
                const code = lines.slice(1).join('\n');

                const codeBlockContainer = document.createElement('div');
                codeBlockContainer.classList.add('code-block-container');

                const codeBlock = document.createElement('div');
                codeBlock.classList.add('code-block');

                const codeBlockHeader = document.createElement('div');
                codeBlockHeader.classList.add('code-block-header');

                const languageLabel = document.createElement('span');
                languageLabel.textContent = language || 'Code';

                const copyButton = document.createElement('button');
                copyButton.textContent = 'Copy';
                copyButton.classList.add('copy-button');
                copyButton.onclick = function() {
                    copyToClipboard(code, copyButton);
                };

                codeBlockHeader.appendChild(languageLabel);
                codeBlockHeader.appendChild(copyButton);

                const codeContent = document.createElement('pre');
                codeContent.classList.add('code-content');
                codeContent.textContent = code;

                codeBlock.appendChild(codeBlockHeader);
                codeBlock.appendChild(codeContent);

                codeBlockContainer.appendChild(codeBlock);
                messageElement.appendChild(codeBlockContainer);
            } else {
                const textNode = document.createTextNode(part);
                messageElement.appendChild(textNode);
            }
        });
    } else {
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    }

    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    } catch (err) {
        console.error('Could not copy text: ', err);
    }
}

function saveChatHistory() {
    const messages = Array.from(document.getElementById('messages').children).map(messageElement => ({
        content: messageElement.innerHTML
    }));
    localStorage.setItem('chatHistory', JSON.stringify(messages));
}

function loadChatHistory() {
    const messages = JSON.parse(localStorage.getItem('chatHistory'));
    if (messages) {
        messages.forEach(({ content }) => {
            appendMessageFromHistory(content);
        });
    }
}

function appendMessageFromHistory(content) {
    const messageContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = content;
    messageContainer.appendChild(messageElement);

    const copyButton = messageElement.querySelector('.copy-button');
    if (copyButton) {
        copyButton.onclick = function() {
            const codeContent = messageElement.querySelector('.code-content');
            copyToClipboard(codeContent.textContent, copyButton);
        };
    }
}

window.onload = loadChatHistory;
