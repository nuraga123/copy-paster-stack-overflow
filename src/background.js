chrome.commands.onCommand.addListener((command) => {
  console.log("background.js click");

  if (command === "copy-all") {
    console.log(command);

    getCurrentTabId().then((tabId) => {
      chrome.tabs.sendMessage(tabId, { action: "copy-all" }, (codeAll) => {
        console.log(codeAll);
      });
    });
  }
});

async function getCurrentTabId() {
  let queryOptions = { active: true, currentWindow: true };

  let [tab] = await chrome.tabs.query(queryOptions);

  return tab.id;
}
