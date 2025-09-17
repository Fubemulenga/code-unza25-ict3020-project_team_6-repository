// Handles UI and triggers analysis

document.getElementById('analyzeBtn').addEventListener('click', async () => {
  // Request content script to analyze the page
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      files: ['content.js']
    });
  });
});

// Listen for results from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'analysisResult') {
    document.getElementById('summary').innerHTML = message.html;
  }
});
