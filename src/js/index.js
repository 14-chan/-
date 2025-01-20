// キャンバスとコンテキストを取得
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// キャンバスのサイズ設定
canvas.width = 600;
canvas.height = 600;

// プレイヤー(カゴ)の情報
const player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    width: 100,
    height: 20,
    color: '#4CAF50',
    speed: 10,
};

// スイカの情報
const watermelon = {
    x: Math.random() * (canvas.width - 30),
    y: 0,
    radius: 15,
    color: '#FF5722',
    speed: 3,
};

// アイテムの情報
const items = []; // 落ちてくるアイテムを管理する配列
let spawnInterval = 1000; // 新しいアイテムを出現させる間隔（ミリ秒）

// キー入力状態を追跡
const keys = {
    left: false,
    right: false,
};

// タイマー関連
let remainingTime = 60; // 残り時間
let timerInterval; // タイマーのインターバルID

// ゲームループの管理
let animationFrameId;

// 音声ファイル
const bgm = new Audio("./assets/music/back-bgm.mp3");
const catchSound = new Audio('./assets/music/select.mp3');
const missSound = new Audio('./assets/music/select.mp3');

// BGM設定
bgm.loop = true;
bgm.volume = 0.5;

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
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// スイカを描画
function drawWatermelon() {
    ctx.beginPath();
    ctx.arc(watermelon.x, watermelon.y, watermelon.radius, 0, Math.PI * 2);
    ctx.fillStyle = watermelon.color;
    ctx.fill();
    ctx.closePath();
}

// アイテムを描画して動かす
function drawItems() {
    items.forEach((item, index) => {
        item.y += item.speed;
        ctx.beginPath();
        ctx.arc(item.x, item.y, 10, 0, Math.PI * 2); // アイテムを円として描画
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();

        // 画面外に出たアイテムを削除
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
        catchSound.play(); // キャッチ音
        return true;
    } else if (item.y > canvas.height) {
        missSound.play(); // ミス音
        return false;
    }
}

// アイテムを生成
function spawnItem() {
    const newItem = {
        x: Math.random() * canvas.width, // ランダムなX座標
        y: 0, // 初期位置は上部
        speed: Math.random() * 2 + 2, // ランダムな速度
    };
    items.push(newItem);
}

// タイマーを更新する関数
function updateTimer() {
    if (remainingTime > 0) {
        remainingTime--;
        document.getElementById('timer').textContent = `Time: ${remainingTime}`;
    } else {
        clearInterval(timerInterval); // タイマー停止
        endGame(); // ゲーム終了
    }
}

// タイマーを開始する関数
function startTimer() {
    remainingTime = 60;
    document.getElementById('timer').textContent = `Time: ${remainingTime}`;
    timerInterval = setInterval(updateTimer, 1000);
}

// ゲーム終了処理
function endGame() {
    // キャンバスの更新停止
    cancelAnimationFrame(animationFrameId);

    // ボタンを表示
    const gameOverButtons = document.getElementById('gameOverButtons');
    gameOverButtons.style.display = 'block';

    // イベントリスナー追加
    document.getElementById('retryButton').addEventListener('click', () => location.reload());
    document.getElementById('stageSelectButton').addEventListener('click', () => alert('ステージ選択に戻るを実装してください'));
    document.getElementById('homeButton').addEventListener('click', () => alert('ホームに戻るを実装してください'));
}

// ゲームロジック
function update() {
    // プレイヤーの移動
    if (keys.left && player.x > 0) player.x -= player.speed;
    if (keys.right && player.x + player.width < canvas.width) player.x += player.speed;

    // スイカの移動
    watermelon.y += watermelon.speed;

    // スイカが下に到達したらリセット
    if (watermelon.y - watermelon.radius > canvas.height) {
        watermelon.x = Math.random() * (canvas.width - 30);
        watermelon.y = 0;
    }

    // スイカとプレイヤーの衝突判定
    if (
        watermelon.y + watermelon.radius > player.y &&
        watermelon.x > player.x &&
        watermelon.x < player.x + player.width
    ) {
        watermelon.x = Math.random() * (canvas.width - 30);
        watermelon.y = 0; // スイカをリセット
    }

    // アイテムの衝突判定と描画
    drawItems();
    items.forEach((item, index) => {
        if (checkCollision(item)) {
            items.splice(index, 1); // 衝突したアイテムを削除
        }
    });
}

// ゲーム画面の更新
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 画面クリア
    drawPlayer(); // プレイヤーを描画
    drawWatermelon(); // スイカを描画
}

// ゲームループ
function gameLoop() {
    update(); // ロジックの更新
    draw(); // 描画の更新
    animationFrameId = requestAnimationFrame(gameLoop); // 次のフレームを登録
}

// ゲーム開始処理
function startGame() {
    bgm.play(); // BGM再生
    startTimer(); // タイマー開始
    gameLoop(); // ゲームループ開始
}

// 定期的にアイテムを生成
setInterval(spawnItem, spawnInterval);

// ゲーム開始
startGame();
