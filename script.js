document.addEventListener("DOMContentLoaded", (event) => {
  loadLevel(currentLevel); // 遊戲開始時load第一題
  document.getElementById("image1").addEventListener("click", markDifference);
  document.getElementById("image2").addEventListener("click", markDifference);
  startTimer(); // 開始計時
  document.querySelector(".close").addEventListener("click", hideQuestion);
});
document.addEventListener("click", function (event) {
  // 確認點擊事件是在 img 標籤上發生的
  if (event.target.tagName === "IMG") {
    // 獲取點擊位置相對於圖片的 XY 座標
    let x = event.offsetX;
    let y = event.offsetY;
    // 將座標顯示在控制台上
    console.log("X Position: " + x + ", Y Position: " + y);
  }
});
let currentLevel = 0; // 當前關卡索引
let differences = []; // 當前關卡的差異點數據
const levels = [
  {
    images: ["/images/復活節找碴-1.jpg", "/images/復活節找碴-2.jpg"],
    differences: [
      { x: 270, y: 60, found: false },
      { x: 415, y: 65, found: false },
      { x: 385, y: 275, found: false },
      { x: 480, y: 350, found: false },
      { x: 350, y: 225, found: false },
    ],
  },
  {
    images: ["/images/萬聖節找碴-1.jpg", "/images/萬聖節找碴-2.jpg"],
    differences: [
      { x: 230, y: 320, found: false },
      { x: 255, y: 320, found: false },
      { x: 325, y: 300, found: false },
      { x: 390, y: 300, found: false },
      { x: 423, y: 86, found: false },
      { x: 585, y: 180, found: false },
    ],
  },
];
function loadLevel(levelIndex) {
  const level = levels[levelIndex];
  console.log("Loading images:", level.images[0], level.images[1]);
  const image1 = document.getElementById("image1");
  const image2 = document.getElementById("image2");
  image1.src = level.images[0] + "?v=" + new Date().getTime();
  image2.src = level.images[1] + "?v=" + new Date().getTime();
  console.log("Updated src attributes:", image1.src, image2.src);
  differences = level.differences.map((diff) => ({ ...diff, found: false }));
  clearMarkers();
  console.log(image1.src); // 應該顯示新的src
  console.log(image2.src); // 應該顯示新的src
  image1.style.display = "none"; // 隱藏圖片
  image1.offsetHeight; // 強制瀏覽器重繪
  image1.style.display = "block"; // 重新顯示圖片
  image2.style.display = "none";
  image2.offsetHeight;
  image2.style.display = "block";
}
function clearMarkers() {
  document.querySelectorAll(".marker").forEach((marker) => marker.remove());
}
function markDifference(event) {
  const clickX = event.offsetX;
  const clickY = event.offsetY;
  const target = event.target;
  if (target.tagName !== "IMG") return;
  const imageId = target.id;
  const otherImageId = imageId === "image1" ? "image2" : "image1";
  const otherImage = document.getElementById(otherImageId);
  const tolerance = 10;
  for (let diff of differences) {
    const distance = Math.sqrt((diff.x - clickX) ** 2 + (diff.y - clickY) ** 2);
    if (distance < tolerance && !diff.found) {
      diff.found = true;
      createMarker(target, diff.x, diff.y);
      createMarker(otherImage, diff.x, diff.y);
      checkGameCompletion();
      break;
    }
  }
}
function createMarker(image, x, y) {
  const marker = document.createElement("div");
  marker.classList.add("marker");
  marker.style.cssText = `width: 20px; height: 20px; border-radius: 50%; border: 2px solid red; position: absolute; transform: translate(-50%, -50%);`;
  const rect = image.getBoundingClientRect();
  marker.style.left = `${rect.left + window.scrollX + x}px`;
  marker.style.top = `${rect.top + window.scrollY + y}px`;
  document.body.appendChild(marker);
}

function checkGameCompletion() {
  console.log("Checking game completion");
  if (differences.every((diff) => diff.found)) {
    console.log("All differences found");

    // 刪除原本的 confirm 對話框，改為調用 showQuestion 來顯示選擇題
    showQuestion(); // 顯示選擇型問題
  }
}

let timer = 60; // 設定計時器
let intervalId;
function startTimer() {
  const timerElement = document.getElementById("timer");
  intervalId = setInterval(() => {
    timer -= 1;
    timerElement.textContent = timer;
    if (timer <= 0) {
      clearInterval(intervalId);
      alert("時間到！遊戲結束!");
      resetGame();
    }
  }, 1000);
}
function resetGame() {
  clearInterval(intervalId); // 確保清除當前計時器
  timer = 60;
  currentLevel = 0;
  loadLevel(currentLevel);
  startTimer(); // 重新開始計時器
}

// 關卡題目
function showQuestion() {
  document.getElementById("myModal").style.display = "block";
}

function hideQuestion() {
  document.getElementById("myModal").style.display = "none";
}

// 當用戶選擇答案時調用這個函數
function validateAnswer(selectedAnswer) {
  const correctAnswer = 20;
  if (selectedAnswer === correctAnswer) {
    hideQuestion();
    // 正確答案，進行下一關
    currentLevel++;
    if (currentLevel < levels.length) {
      loadLevel(currentLevel);
    } else {
      alert("恭喜！你完成了所有題目！");
      resetGame(); // 選項性地重置遊戲
    }
  } else {
    alert("答案錯誤，請重新嘗試！");
  }
}
