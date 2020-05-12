
class ClickBox {
    constructor(x, y, width, height, onClick) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.onClick = onClick;
    }
    tryClick() {
        if((mouseX > this.x && mouseX < this.x+this.width) && (mouseY > this.y && mouseY < this.y+this.height)) {
            this.onClick();
        }
    }
    render(canvasCtx) {
        canvasCtx.fillStyle = "#FF0000";
        canvasCtx.fillRect(this.x, this.y, this.width, this.height);
    }
}

var canvas = document.getElementById("menuCanvas");
var context = canvas.getContext("2d");
var centerX = canvas.width/2;
var centerY = canvas.height/2;

var activeClickBoxes = [];

var mouseX;
var mouseY;

canvas.addEventListener("click", function() {
    for(let i = 0; i < activeClickBoxes.length; i++) {
        activeClickBoxes[i].tryClick();
    }
});
canvas.addEventListener("mousemove", function(evt) {
    let rect = canvas.getBoundingClientRect();
    mouseX = evt.clientX - rect.left;
    mouseY = evt.clientY - rect.top;
}, false);

var ox = 80;
var oy = 80;

var selectedTab = 6; // 0-7

//-------------

for (let j = 0; j < 8; j++) {
    activeClickBoxes.push(new ClickBox(ox+3+(j*22), oy, 22, 22, (function() {
        selectedTab = j;
        draw();
    })));
}

//-------------

var panelBack = document.getElementById("panel_back");
var panelFront = document.getElementById("panel_front");
var hotbar = document.getElementById("hotbar");
var tab = document.getElementById("tab");
var tabSel = document.getElementById("tab_sel");

function draw() {
    context.drawImage(panelBack, ox+0, oy+21);
    context.drawImage(panelFront, ox+2, oy+24);
    context.drawImage(hotbar, ox-1, oy+135);
    for (let k = 0; k < 8; k++) {
        if(k == selectedTab) {
            context.drawImage(tabSel, ox+3+(22*k), oy+0);
        } else {
            context.drawImage(tab, ox+3+(22*k), oy+0);
        }
    }
}

draw();
