var canvas = document.getElementById('canvas'); // 取得畫布元素
var ctx = canvas.getContext('2d'); // 使用2D繪圖
ctx.fillRect(300,100,500,500); //畫了一個座標為(300,100)的500px * 500px的矩形
ctx.clearRect(400,150,100,100); //再清除一個座標為(350,150)的100px * 100px的矩形形狀
ctx.strokeRect(425,175,50,50); //最後畫一個座標為(42,175)的50px * 50px的矩形邊框
ctx.clearRect(500,400,100,100); //再清除一個座標為(500,300)的100px * 100px的矩形形狀

var toshow = document.getElementById('toshow'); // 按鈕產生圖
var show = document.getElementById('show'); 	// 顯示圖
var clear = document.getElementById('clear'); // 按鈕清除
var drawing = false;	//判斷是否正在繪圖
var queue = [];		//佇列結構依序產生筆畫
//自訂繪圖函式，x,y起始、x1,y1結束
function drawLine(ctx,x,y,x1,y1) {
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x1,y1);
    ctx.closePath();
    ctx.stroke();
}
//滑鼠左鍵按下
canvas.addEventListener('mousedown', function(e) {
    if(!drawing) { 		//預設為false，加!變相反
        drawing = true;	//繪圖狀態啟動true
	  // e為事件者(游標)的當下位置，偏移位置讓落點好看
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;
        drawLine(ctx,x,y,x,y);	//起始位置繪圖
        queue.push([x,y]);	//依序將經過的路徑放入佇列
    }
});
//滑鼠移動
canvas.addEventListener('mousemove', function(e) {
    if(drawing) {	//按著滑鼠時為true
        var old = queue.shift();	//依序移除佇列，取得剛剛路徑
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;
        drawLine(ctx,old[0],old[1],x,y);	//持續繪圖(舊>新)
        queue.push([x,y]);	//持續更新新位置
    }
});
//滑鼠左鍵起來
canvas.addEventListener('mouseup', function(e) {
    if(drawing) {
        var old = queue.shift();		//依序移除佇列
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;
        drawLine(ctx,old[0], old[1], x, y);	//最後位置繪圖
        drawing = false;	//結束繪圖狀態
    }
});
var color = document.getElementById("color");		//顏色
var lineWidth = document.getElementById("lineWidth");	//拉桿
const value = document.getElementById("value");	//顯示拉桿值欄位
value.textContent = lineWidth.value;			//取得拉桿值
ctx.strokeStyle = color.value;			//預設顏色
// 設定顏色
color.addEventListener("input", (e) => {
    ctx.strokeStyle = e.target.value;
  }); 
// 設定粗細
lineWidth.addEventListener("input", (e) => {
    value.textContent = e.target.value;
    ctx.lineWidth = e.target.value;
});
// 設定顏色
color.addEventListener("input", function() {
    ctx.strokeStyle = color.value;
  }); 
// 設定粗細
lineWidth.addEventListener("input", function() {
    value.textContent = lineWidth.value;
    ctx.lineWidth = lineWidth.value;
});
//生成圖片按鈕
toshow.addEventListener('click', function() {
    //把canvas轉成DataURL
    var url = canvas.toDataURL();
    show.src =url;
});
//清除畫布按鈕
clear.addEventListener('click', function() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
});


