# code-unza25-ict3020-project_team_6-repository
#functional_requirements
#manifest.json
"manifest_version": 3,
  "name": "Page Analyzer Extension",
  "version": "1.0",
  "description": "Analyzes web pages for stubs, empty sections, completeness, and more.",
  "permissions": ["scripting", "activeTab"],
  "host_permissions": ["<all_urls>"],
  "action": {
  "default_popup": "popup.html"
  },
  "background": {
    "service_worker": "background.js"
  }
}
#icon128.jnp
#icon48.jnp
#icon16.jnp
#background.js
// Background script for manifest v3 (service worker)
// Not used for analysis, but required for extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('Page Analyzer Extension installed.');
});
#content.js
// Content script: analyzes the current page

function analyzePage() {
  // 1. Stub tag detection (e.g., <stub>, or text like 'stub')
  const stubs = Array.from(document.querySelectorAll('stub, [data-stub], .stub')).length;
  const stubText = (document.body.innerText.match(/stub/gi) || []).length;

  // 2. Empty section detection (e.g., <section> with little or no content)
  const emptySections = Array.from(document.querySelectorAll('section')).filter(sec => sec.innerText.trim().length < 10).length;

  // 3. NLP completeness check (simple heuristic: count sections with >100 chars)
  const completeSections = Array.from(document.querySelectorAll('section')).filter(sec => sec.innerText.trim().length > 100).length;

  // 4. Reference suggestion (find places with 'citation needed' or missing references)
  const citationNeeded = (document.body.innerText.match(/citation needed/gi) || []).length;

  // 5. Custom analysis (e.g., count images, links, headings)
  const images = document.images.length;
  const links = document.links.length;
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).length;

  // 6. Performance (simple: page load time)
  const perf = window.performance.timing;
  const loadTime = (perf.loadEventEnd - perf.navigationStart) / 1000;

  // Prepare summary view
  const html = `
    <div class='section'><b>Stub Tags:</b> ${stubs + stubText}</div>
    <div class='section'><b>Empty Sections:</b> ${emptySections}</div>
    <div class='section'><b>Complete Sections:</b> ${completeSections}</div>
    <div class='section'><b>Citation Needed:</b> ${citationNeeded}</div>
    <div class='section'><b>Images:</b> ${images}</div>
    <div class='section'><b>Links:</b> ${links}</div>
    <div class='section'><b>Headings:</b> ${headings}</div>
    <div class='section'><b>Page Load Time:</b> ${loadTime} sec</div>
  `;

  // Send result to popup
  chrome.runtime.sendMessage({type: 'analysisResult', html});
}

// Run analysis when injected
analyzePage();
#popup.js
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
#popup.html
<!DOCTYPE html>
<html>
<head>
  <title>Page Analyzer</title>
  <style>
    body { font-family: Arial, sans-serif; width: 350px; padding: 10px; }
    #summary { margin-top: 10px; }
    .section { margin-bottom: 10px; }
    .btn { margin: 5px 0; padding: 5px 10px; }
  </style>
</head>
<body>
  <h2>Page Analyzer</h2>
  <button id="analyzeBtn" class="btn">Analyze Page</button>
  <div id="summary"></div>
  <script src="popup.js"></script>
</body>
</html>
