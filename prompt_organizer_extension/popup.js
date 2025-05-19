document.getElementById('saveBtn').addEventListener('click', async () => {
  const prompt = document.getElementById('promptInput').value;
  const tags = document.getElementById('tagsInput').value.split(',').map(t => t.trim());
  if (!prompt) return;

  const { prompts = [] } = await chrome.storage.local.get('prompts');
  prompts.push({ prompt, tags, timestamp: Date.now() });
  await chrome.storage.local.set({ prompts });

  document.getElementById('promptInput').value = '';
  document.getElementById('tagsInput').value = '';
  renderPrompts();
});

async function renderPrompts() {
  const { prompts = [] } = await chrome.storage.local.get('prompts');
  const list = document.getElementById('promptList');
  list.innerHTML = '';
  prompts.forEach(p => {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${p.prompt}</strong><br><small>${p.tags.join(', ')}</small><hr>`;
    list.appendChild(div);
  });
}

renderPrompts();