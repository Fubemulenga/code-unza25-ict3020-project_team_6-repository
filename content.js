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
