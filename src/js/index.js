// キャンバスとコンテキストを取得
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// キャンバスのサイズ設定
canvas.width = 600;
canvas.height = 600;

// プレイヤー（カゴ）の情報
const player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    width: 100,
    height: 20,
    color: '#4CAF50',
    speed: 10,
    image: new Image(),
};
player.image.src = './images/fly.png';

// スイカ画像のリスト
const watermelonImages = [
    './images/niku_tori.png',             // 肉
    './images/tamanegi_onion.png',        // 玉ねぎ
    './images/salt.png',                  // 塩
    './images/cooking_kosyou_pepper.png', // コショウ
    './images/food_gohan_hakumai.png',    // ごはん
    './images/cooking_ketchp_kakeru.png', // ケチャップ
    './images/egg_ware_white.png',        // 卵
];

// 正しい順番（ゲームクリア条件）
const correctOrder = [
    './images/niku_tori.png',             // 肉
    './images/tamanegi_onion.png',        // 玉ねぎ
    './images/salt.png',                  // 塩
    './images/cooking_kosyou_pepper.png', // コショウ
    './images/food_gohan_hakumai.png',    // ごはん
    './images/cooking_ketchp_kakeru.png', // ケチャップ
    './images/egg_ware_white.png',        // 卵
];

// アイテムの情報
const items = [];
let spawnInterval = 1000;

// キー入力状態を追跡
const keys = {
    left: false,
    right: false,
};

// タイマー関連
let remainingTime = 60;
let timerInterval;
let animationFrameId;

// 音声ファイル
const bgm = new Audio("./assets/music/back-bgm.mp3");
const catchSound = new Audio('./assets/music/select.mp3');
const missSound = new Audio('./assets/music/miss.mp3');

// BGM設定
bgm.loop = true;
bgm.volume = 0.5;

// プレイヤーがキャッチした順番
let collectedOrder = [];

// キーが押された時
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
});

// キーが離された時
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
});

// プレイヤーを描画
function drawPlayer() {
    if (player.image.complete) {
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    } else {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
}

// アイテムを描画して動かす
function drawItems() {
    items.forEach((item, index) => {
        item.y += item.speed;
        if (item.image.complete) {
            const size = 40;
            ctx.drawImage(item.image, item.x - size / 2, item.y - size / 2, size, size);
        } else {
            ctx.beginPath();
            ctx.arc(item.x, item.y, 15, 0, Math.PI * 2);
            ctx.fillStyle = '#FF5722';
            ctx.fill();
            ctx.closePath();
        }

        // アイテムが画面外に出たら削除
        if (item.y > canvas.height) {
            items.splice(index, 1);
        }
    });
}

// アイテムの衝突判定
function checkCollision(item) {
    if (
        item.x > player.x &&
        item.x < player.x + player.width &&
        item.y > player.y &&
        item.y < player.y + player.height
    ) {
        collectedOrder.push(item.image.src); // キャッチしたアイテムを記録
        catchSound.play();
        return true;
    } else if (item.y > canvas.height) {
        missSound.play();
        return false;
    }
}

// ゲームクリア条件をチェック
function checkClearCondition() {
    if (collectedOrder.length === correctOrder.length) {
        for (let i = 0; i < correctOrder.length; i++) {
            if (collectedOrder[i] !== correctOrder[i]) {
                endGame('失敗しました！順番が違います！');
                return;
            }
        }
        endGame('ゲームクリア！正しい順番でスイカを集めました！');
    }
}

// アイテムを生成
function spawnItem() {
    const randomIndex = Math.floor(Math.random() * watermelonImages.length);
    const newItem = {
        x: Math.random() * canvas.width,
        y: 0,
        speed: Math.random() * 2 + 2,
        image: new Image(),
    };
    newItem.image.src = watermelonImages[randomIndex];
    items.push(newItem);
}

// タイマーを更新する関数
function updateTimer() {
    if (remainingTime > 0) {
        remainingTime--;
        document.getElementById('timer').textContent = `Time: ${remainingTime}`;
    } else {
        clearInterval(timerInterval);
        endGame('時間切れです！');
    }
}

// タイマーを開始する関数
function startTimer() {
    remainingTime = 60;
    document.getElementById('timer').textContent = `Time: ${remainingTime}`;
    timerInterval = setInterval(updateTimer, 1000);
}

// ゲーム終了処理
function endGame(message) {
    cancelAnimationFrame(animationFrameId);
    clearInterval(timerInterval);
    alert(message);
    location.reload();
}

// ゲームロジック
function update() {
    if (keys.left && player.x > 0) player.x -= player.speed;
    if (keys.right && player.x + player.width < canvas.width) player.x += player.speed;

    items.forEach((item, index) => {
        if (checkCollision(item)) {
            items.splice(index, 1);
        }
    });

    checkClearCondition();
}

// ゲーム画面の更新
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawItems();
}

// ゲームループ
function gameLoop() {
    update();
    draw();
    animationFrameId = requestAnimationFrame(gameLoop);
}

// ゲーム開始処理
function startGame() {
    bgm.play();
    startTimer();
    setInterval(spawnItem, spawnInterval);
    gameLoop();
}

// ゲーム開始
startGame();
