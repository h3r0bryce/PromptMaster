// Background script

// Handle storage and communication with the content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'savePrompt') {
    savePrompt(request.prompt);
  } else if (request.action === 'getPrompts') {
    getPrompts(sendResponse);
  } else if (request.action === 'deletePrompt') {
    deletePrompt(request.promptId);
  }
  return true;
});

function savePrompt(prompt) {
  chrome.storage.sync.get('prompts', ({ prompts }) => {
    const updatedPrompts = prompts ? [...prompts, prompt] : [prompt];
    chrome.storage.sync.set({ prompts: updatedPrompts });
  });
}

function getPrompts(callback) {
  chrome.storage.sync.get('prompts', ({ prompts }) => {
    const fetchedPrompts = prompts || [];
    callback(fetchedPrompts);
  });
}

function deletePrompt(promptId) {
  chrome.storage.sync.get('prompts', ({ prompts }) => {
    const updatedPrompts = prompts ? prompts.filter((prompt) => prompt.id !== promptId) : [];
    chrome.storage.sync.set({ prompts: updatedPrompts });
  });
}
