// キャンバスとコンテキストの取得
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// キャンバスサイズをウィンドウに合わせる
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// スイカの設定
const watermelon = {
    x: canvas.width / 2,
    y: 0,
    radius: 30,
    color: 'green',
    speedY: 2, // 垂直速度
    gravity: 0.2, // 重力
    bounce: 0.8 // バウンド係数
};

// 地面の設定
const groundHeight = 50;

// 描画関数
function draw() {
    // 背景をクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 地面を描画
    ctx.fillStyle = '#228B22'; // 緑色
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

    // スイカを描画
    ctx.beginPath();
    ctx.arc(watermelon.x, watermelon.y, watermelon.radius, 0, Math.PI * 2);
    ctx.fillStyle = watermelon.color;
    ctx.fill();
    ctx.closePath();
}

// 更新関数
function update() {
    // スイカの位置を更新
    watermelon.y += watermelon.speedY;
    watermelon.speedY += watermelon.gravity;

    // 地面に衝突した場合
    if (watermelon.y + watermelon.radius > canvas.height - groundHeight) {
        watermelon.y = canvas.height - groundHeight - watermelon.radius; // 地面の上に位置調整
        watermelon.speedY *= -watermelon.bounce; // バウンドさせる
    }
}

// メインループ
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// ゲーム開始
gameLoop();
