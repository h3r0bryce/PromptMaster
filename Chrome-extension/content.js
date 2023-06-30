// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "savePrompt") {
    // Save the prompt
    savePrompt(message.prompt);
    sendResponse({ status: "success", message: "Prompt saved successfully!" });
  } else if (message.action === "retrievePrompt") {
    // Retrieve a prompt
    var prompt = retrievePrompt();
    sendResponse({ status: "success", prompt: prompt });
  }
});

// Function to save a prompt
function savePrompt(prompt) {
  // Perform the save operation here
  // Replace this with your actual save logic
  console.log("Prompt saved:", prompt);
}

// Function to retrieve a prompt
function retrievePrompt() {
  // Perform the retrieve operation here
  // Replace this with your actual retrieve logic
  var prompt = "Sample prompt";
  console.log("Prompt retrieved:", prompt);
  return prompt;
}
