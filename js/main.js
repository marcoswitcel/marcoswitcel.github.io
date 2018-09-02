"use strict";
var CONFIG = {
    width: 500,
    height: 600
};
var CANVAS = document.querySelector("#canvas");
var CTX = CANVAS.getContext("2d");
CANVAS.width = CONFIG.width;
CANVAS.height = CONFIG.height
var FRAMES_PER_SECOND = 1000 / 600;
var gameOver = false;
var mainMenu = true;

var left = false,
    right = false,
    down = false,
    up = false;

var TIMER = {
    initialTime: 0,
    lastTime: 0,
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
        if (!left && !right && this.speedX !==  0) {
            this.speedX += -1 * this.desc * (this.speedX/Math.abs(this.speedX));
        }
        if (!up && !down && this.speedY !==  0) {
            this.speedY += -1 * this.desc * (this.speedY/Math.abs(this.speedY));
        }
        if (left) {
            this.speedX -= this.accel;
        }
        if (right) {
            this.speedX += this.accel;
        }
        if (up) {
            this.speedY -= this.accel;
        }
        if (down) {
            this.speedY += this.accel;
        }

        if (Math.abs(this.speedX) > this.maxSpeed) {
            this.speedX = this.maxSpeed * (this.speedX/Math.abs(this.speedX));
        }
        if (Math.abs(this.speedY) > this.maxSpeed) {
            this.speedY = this.maxSpeed * (this.speedY/Math.abs(this.speedY));
        }

        if (BOUNDARIES.withinHorSpace(PLAYER.xPos + this.speedX)) {
            PLAYER.xPos += this.speedX;
        }
        if (BOUNDARIES.withinVerSpace(PLAYER.yPos + this.speedY)) {
            PLAYER.yPos += this.speedY;
        }
    },

    render: function render() {
        this.update();
        CTX.fillStyle = this.color;
        //CTX.fillRect(this.xPos, this.yPos, this.width, this.height);
        CTX.beginPath();
        CTX.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
        CTX.fill();
    }
};

var PLAYER = {
    color: "#135050",
    width: 10,
    height: 10,
    accel: .1,
    desc: .03,    
    speedX: 0,
    speedY: 0,
    maxSpeed: 2,
    xPos: CONFIG.width / 2,
    radius: 10,
    yPos: CONFIG.height * 0.9
};

var BOUNDARIES = {
    right: CONFIG.width - PLAYER.radius,
    left: 0  + PLAYER.radius,
    up: 0  + PLAYER.radius,
    down: CONFIG.height - PLAYER.radius,
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

var spriteNames = ["ufoRed", "ufoGreen", "ufoBlue", "ufoYellow", "player"];
var sprites = [];
var globalLoaded = false;
var sl = spriteNames.length;

function main() {

    if (mainMenu) {
        CTX.fillStyle = "White";
        CTX.fillRect(0, 0, CONFIG.width, CONFIG.height);
        CTX.fillStyle = "Black";
        CTX.font = "30px Arial";
        CTX.fillText("SPACE EVADERS", CONFIG.width * .05, CONFIG.height * .2);
        CTX.fillText("ARROW KEYS TO MOVE", CONFIG.width * .05, CONFIG.height * .4);
        CTX.fillText("PRESS ENTER TO PLAY", CONFIG.width * .05, CONFIG.height * .6);
        CTX.font = "20px Arial";
        CTX.fillText("Music by SpiderDave, SFX by TinyWorlds", CONFIG.width * .05, CONFIG.height * .8);
    } else if (gameOver) {
        CTX.fillStyle = "white";
        CTX.fillRect(CONFIG.width * .18, CONFIG.height * .3, CONFIG.width * .75, 150);
        CTX.fillStyle = "Black";
        CTX.font = "35px Arial";
        CTX.fillText("GAME OVER: " + TIMER.lastTime + " S", CONFIG.width * .2, CONFIG.height*.4);
        CTX.fillText("PRESS ENTER", CONFIG.width * .2, CONFIG.height * .5);
    } else {
        // Background color
        CTX.fillStyle = "#281b3d";
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
window.addEventListener('click', menuInteraction);

main();

function menuInteraction(event) {
    if (mainMenu) {
        mainMenu = false;
        reset();
    } else if (gameOver) {
        gameOver = false;
        reset();
    }
}

function reset() {
    // reset do PLAYER
    PLAYER.xPos = CONFIG.width / 2;
    PLAYER.yPos = CONFIG.height * 0.9;

    // Reset Enemies
    Enemies.list = [];

    //Reset timer
    TIMER.init();
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
        case "Enter":
            menuInteraction(null);
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