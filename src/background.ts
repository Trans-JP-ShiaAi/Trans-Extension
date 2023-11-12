chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    contexts: ["selection"],
    title: "Translate this word",
    id: "Translate",
  });
});


chrome.contextMenus.onClicked.addListener(async (event) => {
});


