const STORAGE_KEY = "registeredPages";
const COUNT_TOGGLE_KEY = "realtimeCountEnabled";
const pageList = document.getElementById("page-list");
const clearButton = document.getElementById("clear-pages");
const realtimeToggle = document.getElementById("realtime-count-toggle");

// ページリストを更新
function updatePageList() {
  chrome.storage.sync.get(STORAGE_KEY, (data) => {
    const pages = data[STORAGE_KEY] || [];
    pageList.innerHTML = "";

    if (pages.length === 0) {
      pageList.innerHTML = "<li>登録されたページはありません。</li>";
      return;
    }

    pages.forEach((page, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${index + 1}: ${page}`;
      pageList.appendChild(listItem);
    });
  });
}

// すべての登録を解除
clearButton.addEventListener("click", () => {
  chrome.storage.sync.set({ [STORAGE_KEY]: [] }, () => {
    updatePageList();
    alert("すべての登録を解除しました。");
  });
});

// リアルタイム文字数カウントトグルの状態を保存
realtimeToggle.addEventListener("change", (event) => {
  const isEnabled = event.target.checked;
  chrome.storage.sync.set({ [COUNT_TOGGLE_KEY]: isEnabled });
});

// 初期化
document.addEventListener("DOMContentLoaded", () => {
  updatePageList();

  // トグルの初期状態を設定
  chrome.storage.sync.get(COUNT_TOGGLE_KEY, (data) => {
    realtimeToggle.checked = data[COUNT_TOGGLE_KEY] || false;
  });
});
