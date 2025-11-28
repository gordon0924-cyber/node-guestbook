const guessSubmit = document.querySelector(".guessSubmit");
const guessField = document.querySelector(".guessField");
const result = document.querySelector(".result");
const count = document.querySelector(".count");
const guesses = document.querySelector(".guesses");
const restartBtn = document.querySelector(".restartBtn");

let countNum = 0;   // 廣域變數
let randomNumber;

function initGame() {
    // 初始化遊戲
    countNum = 0;
    count.textContent = "猜測次數：0";
    guesses.textContent = "";
    result.textContent = "猜測結果：";
    result.style.backgroundColor = "";
    guessField.disabled = false;
    guessSubmit.disabled = false;
    guessField.value = "";
    guessField.focus();
    randomNumber = Math.floor(Math.random() * 100) + 1; // 1-100 隨機數
    console.log("觀察隨機的數字：", randomNumber);
}

function checkGuess() {
    countNum++;
    count.textContent = "猜測次數：" + countNum;
    const userGuess = Number(guessField.value);  // 取得欄位值並轉為數字
    guesses.textContent += userGuess + " ";

    if (userGuess === randomNumber) {
        result.textContent = "猜測結果：Congratulations!";
        result.style.backgroundColor = "lightgreen";
        setGameOver();
    } else if (userGuess < randomNumber) {
        result.textContent = "猜測結果：數字太小!";
    } else if (userGuess > randomNumber) {
        result.textContent = "猜測結果：數字太大!";
    }

    guessField.value = "";
    guessField.focus();
}

function setGameOver() {
    guessField.disabled = true; // 停止輸入功能
    guessSubmit.disabled = true; // 停止按鈕功能
}

guessSubmit.addEventListener("click", checkGuess);   // 當按鈕被點擊，執行函式
restartBtn.addEventListener("click", initGame);

// 啟動遊戲
initGame();
