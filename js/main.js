"use strict";
var CONFIG = {
    width: 1050,
    height: 600
};
var CANVAS = document.querySelector("#canvas");
var CTX = CANVAS.getContext("2d");
CANVAS.width = CONFIG.width;
CANVAS.height = CONFIG.height
var FRAMES_PER_SECOND = 1000 / 600;
var gameOver = false;

var left = false,
    right = false,
    down = false,
    up = false;

var TIMER = {
    initialTime: 0,
    lastTime:0,
    init: function init() {
        this.initialTime = (new Date()).getTime();
    },
    getCurrentTime: function getCurrentTime() {
        return (((new Date()).getTime() - this.initialTime) / 1000).toFixed(2);
    },
    render: function render() {
        CTX.fillStyle = "White";
        CTX.font = "30px Arial";
        this.lastTime = this.getCurrentTime();
        CTX.fillText(this.lastTime, 40, CONFIG.height * .95);
    }
}

var renderizibles = {
    update: function update() {
        var speed = this.speed;

        if (left && BOUNDARIES.withinHorSpace(PLAYER.xPos - speed)) {
            PLAYER.xPos -= speed;
        }
        if (right && BOUNDARIES.withinHorSpace(PLAYER.xPos + speed)) {
            PLAYER.xPos += speed;
        }
        if (up && BOUNDARIES.withinVerSpace(PLAYER.yPos - speed)) {
            PLAYER.yPos -= speed;
        }
        if (down && BOUNDARIES.withinVerSpace(PLAYER.yPos + speed)) {
            PLAYER.yPos += speed;
        }
    },

    render: function render() {
        this.update();
        CTX.fillStyle = this.color;
        //CTX.fillRect(this.xPos, this.yPos, this.width, this.height);
        CTX.beginPath();
        CTX.arc(this.xPos + this.radius, this.yPos + this.radius, this.radius, 0, 2 * Math.PI);
        CTX.fill();
    }
};

var PLAYER = {
    color: "Yellow",
    width: 10,
    height: 10,
    speed: 1,
    xPos: CONFIG.width / 2,
    radius: 10,
    yPos: CONFIG.height * 0.9
};

var BOUNDARIES = {
    right: CONFIG.width - PLAYER.width,
    left: 0,
    up: 0,
    down: CONFIG.height - PLAYER.height,
    withinVerSpace: function withinVerSpace(value) {
        return value >= this.up && value <= this.down;
    },
    withinHorSpace: function withinHorSpace(value) {
        return value >= this.left && value <= this.right;
    }
}

var BACKGROUND = {
    color: "White",
    thickness: 5,
    spacing: 50,
    speed: .1,
    stripes: [],
    render: function render() {
        /* Função aposentada */
        CTX.fillStyle = this.color;
        var rw = Math.floor(Math.random() * (CONFIG.width + 1));
        var rh = Math.floor(Math.random() * (CONFIG.height + 1));
        //var sl = this.stripes.length;
        for (var j = 0; j < 10; j++) {
            rw = Math.floor(Math.random() * (CONFIG.width + 1));
            rh = Math.floor(Math.random() * (CONFIG.height + 1));
            CTX.fillRect(rw, rh, this.thickness, this.thickness);
        }
    }
}

// Agora PLAYER pode fazer uso dos métodos de renderizibles
delegate(PLAYER, renderizibles);

TIMER.init();

var a = true;
function main() {
    if (gameOver) {
        CTX.fillStyle = "white";
        CTX.fillRect(CONFIG.width * .18, CONFIG.height*.3, CONFIG.width * .65, 150);
        CTX.fillStyle = "Black";
        CTX.font = "50px Arial";
        CTX.fillText("Game Over: " + TIMER.lastTime + " segundos", CONFIG.width * .20, CONFIG.height*.4);
    } else  {
        // Background color
        CTX.fillStyle = "Black";
        CTX.fillRect(0, 0, CONFIG.width, CONFIG.height);

        // Checa se pegou o player
        Enemies.caughtPlayer();

        // renderiza
        PLAYER.render();
        Particles.renderAll();
        Enemies.renderAll();
        TIMER.render();
    }
    
    // Invoca funções dali tantos segundos
    setTimeout(main, FRAMES_PER_SECOND);
}

window.addEventListener('keydown', keydowns);
window.addEventListener('keyup', keyups);
window.addEventListener('click', click);

main();

function click(event) {
    if (gameOver) {
        gameOver = false;
     
        // reset do PLAYER
        PLAYER.xPos = CONFIG.width / 2;
        PLAYER.yPos = CONFIG.height * 0.9;

        // Reset Enemies
        Enemies.list = [];
    }
}

function keydowns(event) {
    switch (event.key) {
        case "ArrowLeft":
            left = true;
            break;
        case "ArrowRight":
            right = true;
            break;
        case "ArrowUp":
            up = true;
            break;
        case "ArrowDown":
            down = true;
            break;
    }
}

function keyups(event) {
    switch (event.key) {
        case "ArrowLeft":
            left = false;
            break;
        case "ArrowRight":
            right = false;
            break;
        case "ArrowUp":
            up = false;
            break;
        case "ArrowDown":
            down = false;
            break;
    }
}