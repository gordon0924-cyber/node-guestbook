var canvas = document.getElementById('canvas'); // 取得畫布元素
var ctx = canvas.getContext('2d'); // 使用2D繪圖

var toshow = document.getElementById('toshow'); // 按鈕產生圖
var show = document.getElementById('show'); 	// 顯示圖
var clear = document.getElementById('clear'); // 按鈕清除
var drawing = false;	//判斷是否正在繪圖
var tool = 'pen'; // 當前工具：pen, eraser, rectangle, circle
var startX, startY; // 繪圖起始點

// 自訂繪圖函式，x,y起始、x1,y1結束
function drawLine(ctx,x,y,x1,y1) {
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x1,y1);
    ctx.closePath();
    ctx.stroke();
}

// 繪製矩形
function drawRectangle(ctx, x, y, width, height) {
    ctx.strokeRect(x, y, width, height);
}

// 繪製圓形
function drawCircle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

// 獲取滑鼠位置相對於canvas
function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

//滑鼠左鍵按下
canvas.addEventListener('mousedown', function(e) {
    var pos = getMousePos(e);
    startX = pos.x;
    startY = pos.y;
    drawing = true;
    if (tool === 'pen' || tool === 'eraser') {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
    }
});

//滑鼠移動
canvas.addEventListener('mousemove', function(e) {
    if (!drawing) return;
    var pos = getMousePos(e);
    if (tool === 'pen') {
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    } else if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, ctx.lineWidth / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    }
});

//滑鼠左鍵起來
canvas.addEventListener('mouseup', function(e) {
    if (!drawing) return;
    var pos = getMousePos(e);
    if (tool === 'rectangle') {
        drawRectangle(ctx, startX, startY, pos.x - startX, pos.y - startY);
    } else if (tool === 'circle') {
        var radius = Math.sqrt(Math.pow(pos.x - startX, 2) + Math.pow(pos.y - startY, 2));
        drawCircle(ctx, startX, startY, radius);
    }
    drawing = false;
});

var color = document.getElementById("color");		//顏色
var lineWidth = document.getElementById("lineWidth");	//拉桿
const value = document.getElementById("value");	//顯示拉桿值欄位
value.textContent = lineWidth.value;			//取得拉桿值
ctx.strokeStyle = color.value;			//預設顏色
ctx.lineWidth = lineWidth.value;        // 預設線寬
ctx.lineCap = 'round';                  // 線條圓潤
ctx.lineJoin = 'round';

// 設定顏色
color.addEventListener("input", function() {
    ctx.strokeStyle = color.value;
}); 

// 設定粗細
lineWidth.addEventListener("input", function() {
    value.textContent = lineWidth.value;
    ctx.lineWidth = lineWidth.value;
});

// 工具選擇
document.getElementById('pen').addEventListener('click', () => tool = 'pen');
document.getElementById('eraser').addEventListener('click', () => tool = 'eraser');
document.getElementById('rectangle').addEventListener('click', () => tool = 'rectangle');
document.getElementById('circle').addEventListener('click', () => tool = 'circle');

//生成圖片按鈕
toshow.addEventListener('click', function() {
    //把canvas轉成DataURL
    var url = canvas.toDataURL();
    show.src = url;
});

//清除畫布按鈕
clear.addEventListener('click', function() {
    if (confirm('確定要清除畫布嗎？')) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

// 保存圖片
document.getElementById('save').addEventListener('click', function() {
    var link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
});


