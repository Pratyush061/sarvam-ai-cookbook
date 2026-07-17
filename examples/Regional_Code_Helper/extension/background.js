chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "explain-code",
    title: "Explain selected code with Sarvam",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "explain-code" && info.selectionText) {
    const code = encodeURIComponent(info.selectionText);
    const webAppUrl = "http://localhost:3000"; // Or production URL later

    chrome.tabs.create({ url: `${webAppUrl}?code=${code}` });
  }
});
