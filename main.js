// DOM
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatSend = document.querySelector('#chat-send');
const messageContainer = document.querySelector('.messages');
const sendImg = document.querySelector('#send-img');
const loader = document.querySelector('.loader');

// OpenAI API
const OPENAI_MODEL = 'gpt-3.5-turbo-0301'; // gpt-3.5-turbo, gpt-3.5-turbo-0301
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
// Input Your OpenAI API Key Here. 
// You can sign up and get API Key from here 
// https://platform.openai.com/account/api-keys
let apiKey = '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'; 
const messages = []; // store previous messages to remember whole conversation

// Function to add a chat message to the container
function addMessage(message, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    messageDiv.textContent = message;
    messageContainer.appendChild(messageDiv);

    // Scroll to the bottom of the chat container
    messageContainer.scrollTop = messageContainer.scrollHeight;
}


// Function to handle user input
function handleUserInput(event) {
    event.preventDefault();
    const message = chatInput.value.trim();
    messages.push({
            'role': 'system',
            'content': 'Sie sind nun in der Rolle eines geschäftstüchtigen und harten Einkäufers. Sie haben fünf spezifische Kriterien, die Sie bei dieser Softwareverhandlung erfüllen müssen: 1. Benutzerfreundlichkeit der Software ist ein Muss-Kriterium, hierfür haben Sie ein maximales Budget von 10.000 Euro. 2. Ein 24/7 Kundensupport ist ein kann-Kriterium, das Budget hierfür beträgt maximal 5.000 Euro. 3. Multi-Plattform-Kompatibilität der Software ist ein Muss-Kriterium, hierfür ist das maximale Budget 15.000 Euro. 4. Gestaffelte Bezahlmodelle je nach Nutzerzahl sind ein kann-Kriterium, hierfür beträgt das Budget maximal 8.000 Euro. 5. Regelmäßige Updates und Sicherheitspatches sind ein Muss-Kriterium, das maximale Budget hierfür ist 12.000 Euro. Sie sind bereit, hart zu verhandeln und den bestmöglichen Preis herauszuholen. Falls der Verkäufer IhreAnforderungen nicht erfüllt oder bei den Preisen nicht nachgibt, scheuen Sie sich nicht, die Verhandlung sofort zu beenden. Sie sind eher unfreundlich und ein scharfer Verhandlungsführer. Beginnen Sie nun die Verhandlung.'
              });
    if (message !== '') {
        messages.push({
            'role': 'user',
            'content': message
        });
        addMessage(message, true);
        chatInput.value = '';
        showLoader();
        // Other request body from here https://platform.openai.com/docs/api-reference/chat/create
        fetch(OPENAI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({ 
                'model': OPENAI_MODEL,
                'messages': messages
            })
        })
        .then(response => response.json())
        .then(data => {
            hideLoader();
            const responseMessage = data.choices[0].message;
            addMessage(responseMessage.content, false);
            messages.push(responseMessage);
        })
        .catch(() => {
            hideLoader();
            addMessage('Oops! Something went wrong. Please try again later.', false);
        });
    }
}


// Function to show the loader icon
function showLoader() {
    loader.style.display = 'inline-block';
    chatSend.disabled = true;
}

// Function to hide the loader icon
function hideLoader() {
    loader.style.display = 'none';
    chatSend.disabled = false;
}

// Ask user to input his/her API Key
function checkAPIKey() {
    if (!apiKey) apiKey = prompt('Please input OpenAI API Key.');
    if (!apiKey) alert('You have not entered the API Key. The application will not work.');
}

// Add an event listener to the form
chatForm.addEventListener('submit', handleUserInput);

// check
checkAPIKey();
