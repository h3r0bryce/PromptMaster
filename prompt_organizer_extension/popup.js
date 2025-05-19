const darkModeToggle = document.getElementById('darkModeToggle');
const htmlEl = document.documentElement;

function setDarkMode(enabled) {
  if (enabled) {
    htmlEl.classList.add('dark');
    darkModeToggle.textContent = '☀️';
    localStorage.setItem('darkMode', 'true');
  } else {
    htmlEl.classList.remove('dark');
    darkModeToggle.textContent = '🌙';
    localStorage.setItem('darkMode', 'false');
  }
}

// Initialize dark mode from localStorage
const savedDarkMode = localStorage.getItem('darkMode') === 'true';
setDarkMode(savedDarkMode);

darkModeToggle.addEventListener('click', () => {
  setDarkMode(!htmlEl.classList.contains('dark'));
});

const promptListEl = document.getElementById('promptList');
const searchInput = document.getElementById('searchInput');
const addPromptBtn = document.getElementById('addPromptBtn');
const openChatGPTBtn = document.getElementById('openChatGPTBtn');

let prompts = [];

// Load prompts from storage
function loadPrompts() {
  chrome.storage.local.get(['prompts'], (result) => {
    prompts = result.prompts || [];
    renderPrompts(prompts);
  });
}

// Save prompts to storage
function savePrompts() {
  chrome.storage.local.set({ prompts });
}

// Render the prompt list with optional filter
function renderPrompts(filter = '') {
  const filtered = prompts.filter(p =>
    p.text.toLowerCase().includes(filter.toLowerCase()) ||
    (p.tags && p.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())))
  );

  if (filtered.length === 0) {
    promptListEl.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-600">No prompts found.</p>';
    return;
  }

  promptListEl.innerHTML = '';
  filtered.forEach((prompt, i) => {
    const promptDiv = document.createElement('div');
    promptDiv.className = 'p-3 bg-gray-100 dark:bg-gray-800 rounded-md flex flex-col space-y-1';

    const textP = document.createElement('p');
    textP.textContent = prompt.text;
    textP.className = 'break-words';
    promptDiv.appendChild(textP);

    if (prompt.tags && prompt.tags.length > 0) {
      const tagsDiv = document.createElement('div');
      tagsDiv.className = 'flex space-x-2 flex-wrap';
      prompt.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.textContent = `#${tag}`;
        tagSpan.className = 'text-xs bg-blue-300 dark:bg-blue-700 text-blue-900 dark:text-blue-200 rounded px-2 py-0.5';
        tagsDiv.appendChild(tagSpan);
      });
      promptDiv.appendChild(tagsDiv);
    }

    // Buttons container
    const btnContainer = document.createElement('div');
    btnContainer.className = 'mt-2 flex space-x-2';

    // Copy button
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.className = 'text-sm bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded';
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(prompt.text);
    };
    btnContainer.appendChild(copyBtn);

    // Open ChatGPT button
    const chatBtn = document.createElement('button');
    chatBtn.textContent = 'Use';
    chatBtn.className = 'text-sm bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded';
    chatBtn.onclick = () => {
      const url = `https://chat.openai.com/chat?prompt=${encodeURIComponent(prompt.text)}`;
      window.open(url, '_blank');
    };
    btnContainer.appendChild(chatBtn);

    promptDiv.appendChild(btnContainer);

    promptListEl.appendChild(promptDiv);
  });
}

// Add new prompt
addPromptBtn.onclick = () => {
  const newPrompt = prompt('Enter your prompt:');
  if (!newPrompt) return;

  const tagsStr = prompt('Enter tags (comma separated, optional):');
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(t => t) : [];

  prompts.push({ text: newPrompt, tags });
  savePrompts();
  renderPrompts(searchInput.value);
};

// Search filter
searchInput.addEventListener('input', () => {
  renderPrompts(searchInput.value);
});

// Open ChatGPT (blank chat page)
openChatGPTBtn.onclick = () => {
  window.open('https://chat.openai.com/chat', '_blank');
};

loadPrompts();
