function savePrompt(prompt) {
    chrome.runtime.sendMessage({ action: 'savePrompt', prompt });
  }
  
  function getPrompts(callback) {
    chrome.runtime.sendMessage({ action: 'getPrompts' }, callback);
  }
  
  function deletePrompt(promptId) {
    chrome.runtime.sendMessage({ action: 'deletePrompt', promptId });
  }
  