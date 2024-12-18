let countDisplay;
let isRealtimeCountEnabled = false;

// 初期化関数
function initialize() {
  // 文字数表示用要素を作成
  countDisplay = document.createElement("div");
  countDisplay.id = "realtime-count-display";
  countDisplay.style.position = "fixed";
  countDisplay.style.bottom = "10px";
  countDisplay.style.left = "10px";
  countDisplay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  countDisplay.style.color = "white";
  countDisplay.style.padding = "5px 10px";
  countDisplay.style.borderRadius = "5px";
  countDisplay.style.fontSize = "14px";
  countDisplay.style.zIndex = "10000";
  countDisplay.style.display = "none"; // 初期は非表示
  document.body.appendChild(countDisplay);

  // 設定の変更を監視
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.realtimeCountEnabled) {
      isRealtimeCountEnabled = changes.realtimeCountEnabled.newValue;
    }
  });

  // 初期状態を取得
  chrome.storage.sync.get("realtimeCountEnabled", (data) => {
    isRealtimeCountEnabled = data.realtimeCountEnabled || false;
  });

  // イベントリスナー追加
  document.addEventListener("selectionchange", updateCountDisplay);
}

// 選択文字数を更新
function updateCountDisplay() {
  if (!isRealtimeCountEnabled) {
    countDisplay.style.display = "none";
    return;
  }

  const selection = window.getSelection();
  const text = selection ? selection.toString().trim() : "";
  const charCount = text.length;

  if (charCount > 0) {
    countDisplay.textContent = `文字数: ${charCount}`;
    countDisplay.style.display = "block";
  } else {
    countDisplay.style.display = "none";
  }
}

// 初期化実行
initialize();
