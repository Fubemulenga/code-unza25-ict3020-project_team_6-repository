// Background script for manifest v3 (service worker)
// Not used for analysis, but required for extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('Page Analyzer Extension installed.');
});
