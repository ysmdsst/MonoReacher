// 左下に文字数を表示する要素を作成
const counterDiv = document.createElement("div");
counterDiv.id = "char-counter";
document.body.appendChild(counterDiv);

// 選択テキストの文字数を更新
function updateCharCount() {
  const selection = window.getSelection().toString();
  if (selection.length > 0) {
    counterDiv.textContent = `文字数: ${selection.length}`;
    counterDiv.classList.add("visible");
  } else {
    counterDiv.classList.remove("visible");
  }
}

// マウスやキーボードの操作で選択範囲を監視
document.addEventListener("mouseup", updateCharCount);
document.addEventListener("keyup", updateCharCount);
