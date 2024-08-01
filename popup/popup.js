browser.tabs.query({active: true, currentWindow: true})
  .then(beastify)
  .catch(reportError);


function beastify(tabs) {
  fetch('transactions-reader.js')
    .then(response => response.text())
    .then(scriptContent => {
      return browser.tabs.executeScript(tabs[0].id, {
        code: scriptContent
      });
    })
    .catch(error => console.error('Error fetching the script:', error))
    .catch(error => console.error(`Error injecting script: ${error}`));
}
