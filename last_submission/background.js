// 右クリックメニューを作成
chrome.runtime.onInstalled.addListener(() => {
    // 翻訳機能
    chrome.contextMenus.create({
      id: "translate-text",
      title: "選択したテキストを翻訳",
      contexts: ["selection"]
    });
  
    // 特定のページにジャンプ
    chrome.contextMenus.create({
      id: "jump-to-page",
      title: "登録ページにジャンプ",
      contexts: ["page"]
    });
  });
  
  // 右クリックメニューがクリックされたときの処理
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "translate-text") {
      const selectedText = info.selectionText;
      if (selectedText) {
        // MyMemory APIで翻訳
        fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(selectedText)}&langpair=en|ja`)
          .then((response) => response.json())
          .then((data) => {
            const translatedText = data.responseData.translatedText;
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: (text) => alert(`翻訳結果: ${text}`),
              args: [translatedText]
            });
          })
          .catch((error) => console.error("翻訳エラー:", error));
      }
    } else if (info.menuItemId === "jump-to-page") {
      chrome.tabs.create({ url: "https://example.com" }); // 登録ページのURL
    }
  });
  