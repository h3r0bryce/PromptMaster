// background.js
// Create a context menu item to save selected text as a prompt

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'save-prompt',
    title: 'Save selected text as prompt',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'save-prompt' && info.selectionText) {
    chrome.storage.local.get(['prompts'], (result) => {
      const prompts = result.prompts || [];
      prompts.push({ text: info.selectionText, tags: [] });
      chrome.storage.local.set({ prompts });
    });
  }
});
