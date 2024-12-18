const STORAGE_KEY = "registeredPages";

// 初期化：右クリックメニュー
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "register-page",
    title: "このページを登録",
    contexts: ["page"]
  });

  chrome.contextMenus.create({
    id: "unregister-page",
    title: "このページの登録を解除",
    contexts: ["page"]
  });

  chrome.contextMenus.create({
    id: "jump-to-page",
    title: "登録ページにジャンプ",
    contexts: ["page"]
  });

  chrome.contextMenus.create({
    id: "translate-selection",
    title: "選択部分を翻訳",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "count-characters",
    title: "選択部分の文字数を表示",
    contexts: ["selection"]
  });
});

// 右クリックメニューのクリックイベント
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab || !tab.url) return;

  const currentUrl = tab.url;

  if (info.menuItemId === "register-page") {
    // ページ登録
    chrome.storage.sync.get(STORAGE_KEY, (data) => {
      const pages = data[STORAGE_KEY] || [];
      if (!pages.includes(currentUrl)) {
        pages.push(currentUrl);
        chrome.storage.sync.set({ [STORAGE_KEY]: pages });
        alert("このページを登録しました！");
      } else {
        alert("このページは既に登録されています。");
      }
    });
  } else if (info.menuItemId === "unregister-page") {
    // ページ登録解除
    chrome.storage.sync.get(STORAGE_KEY, (data) => {
      let pages = data[STORAGE_KEY] || [];
      if (pages.includes(currentUrl)) {
        pages = pages.filter((page) => page !== currentUrl);
        chrome.storage.sync.set({ [STORAGE_KEY]: pages });
        alert("このページの登録を解除しました！");
      } else {
        alert("このページは登録されていません。");
      }
    });
  } else if (info.menuItemId === "jump-to-page") {
    // 登録ページにジャンプ
    chrome.storage.sync.get(STORAGE_KEY, (data) => {
      const pages = data[STORAGE_KEY] || [];
      if (pages.length > 0) {
        chrome.tabs.create({ url: pages[0] }); // 最初に登録されたページにジャンプ
      } else {
        alert("登録されているページがありません。");
      }
    });
  } else if (info.menuItemId === "translate-selection") {
    // 翻訳機能
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: translateSelection
    });
  } else if (info.menuItemId === "count-characters") {
    // 文字数カウント機能
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: countCharacters
    });
  }
});

// 翻訳処理
function translateSelection() {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(selectedText)}&langpair=en|ja`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        alert(`翻訳結果: ${data.responseData.translatedText}`);
      })
      .catch(() => {
        alert("翻訳中にエラーが発生しました。");
      });
  } else {
    alert("翻訳するテキストを選択してください。");
  }
}

// 文字数カウント処理
function countCharacters() {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    alert(`選択部分の文字数: ${selectedText.length}`);
  } else {
    alert("文字数をカウントするテキストを選択してください。");
  }
}
