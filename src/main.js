
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
    display(canvasCtx) {
        canvasCtx.fillStyle = "#FF0000";
        canvasCtx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class SlotArray {

    calculatedMinY = 0;
    calculatedMaxY = 0;

    constructor(length, topBounds, bottomBounds) {
        this.length = length;
        this.scrollPct = 0;
        this.topBounds = topBounds;
        this.bottomBounds = bottomBounds;
        this.scrollAmount = 0;
    }

    display(canvasCtx, img, width, x, y) {
        this.calculatedMinY = y;
        this.calculatedMaxY = y - ((Math.round(this.length / width)-5)*18);
        let px = x;
        let py = y;
        if((y + this.scrollAmount < this.calculatedMinY) /*&& (y + this.scrollAmount > this.calculatedMaxY)*/){
            py = y + this.scrollAmount;
        }
        if(y + this.scrollAmount > this.calculatedMinY) {
            this.scrollAmount = 0;
        }
        for (let p = 0; p < this.length; p++) {
            if(py > this.topBounds && py < this.bottomBounds) {
                canvasCtx.drawImage(img, px, py);
            }
            px += 18;
            if((p+1) % width == 0) {
                py += 18;
                px = x;
            }
        }
    }

    scroll(amount) {
        this.scrollAmount += amount;
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
canvas.addEventListener("wheel", function(evt) {
    slots.scroll((evt.deltaY/100) * 6);
    draw();
});

var ox = 80;
var oy = 80;

var selectedTab = 6; // 0-7

//-------------

for (let j = 0; j < 8; j++) {
    activeClickBoxes.push(new ClickBox(ox+3+(j*22), oy, 22, 22, (function() {
        selectedTab = j;
        slots.scrollAmount = 0;
        draw();
    })));
}

//-------------

var slots = new SlotArray(71, oy+19, oy+130);

var panelBack = document.getElementById("panel_back");
var panelFront = document.getElementById("panel_front");
var hotbar = document.getElementById("hotbar");
var tab = document.getElementById("tab");
var slot = document.getElementById("slot");
var tabSel = document.getElementById("tab_sel");

var icons = []

for (let i = 0; i < 8; i++) {
    icons.push(
        document.getElementById("icon_"+i.toString())
    );
}

function draw() {
    context.fillStyle = "#5E5E5E";
    context.fillRect(ox+9, oy+42, 162, 90);
    slots.display(context, slot, 9, ox+9, oy+42)
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
    for (let m = 0; m < icons.length; m++) {
        context.drawImage(icons[m], ox+(m*22)+3, oy);
    }
    slots.display(context, slot, ox+10, oy+10);
}

draw();
