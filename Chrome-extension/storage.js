function saveData(key, data) {
  chrome.storage.sync.set({ [key]: data });
}

function loadData(key, callback) {
  chrome.storage.sync.get(key, function(result) {
    callback(result[key]);
  });
}
