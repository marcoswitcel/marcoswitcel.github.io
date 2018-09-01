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

var left = false,
    right = false,
    down = false,
    up = false;

function delegate(who, to) {
    who.__proto__ = to;
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
        CTX.fillRect(this.xPos, this.yPos, this.width, this.height);
    }
};

var PLAYER = {
    color: "Blue",
    width: 10,
    height: 10,
    speed: 1,
    xPos: CONFIG.width / 2,
    radius: 5,
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
    color: "rgba(0,187,255,.5)",
    thickness: 5,
    spacing: 50,
    speed: .5,
    stripes: [],
    init: function init() {
        var nstripes = CONFIG.height / (this.spacing + this.thickness);
        for (var i = 0; i < nstripes; i++) {

            this.stripes.push((this.spacing + this.thickness) * i - 20);
        }
    },
    render: function render() {
        CTX.fillStyle = this.color;

        for (var i = 0; i < this.stripes.length; i++) {
            this.stripes[i] += this.speed;
            if (this.stripes[i] > CONFIG.height) {
                this.stripes[i] = 0;
            }
            CTX.fillRect(0, this.stripes[i], CONFIG.width, this.thickness);
        }
    }
}
BACKGROUND.init();

// Agora PLAYER pode fazer uso dos métodos de renderizibles
delegate(PLAYER, renderizibles);

var enemies = [];

for (var i = 0; i < 5; i++) {
    enemies.push(new Enemies("Blue", 10, 10, Math.random() * 10, CONFIG.width * Math.random(), 0, 5));
}
TIMER.init();

function main() {
    // Background color
    CTX.fillStyle = "White";
    CTX.fillRect(0, 0, CONFIG.width, CONFIG.height);

    // Checa se pegou o player
    Enemies.caughtPlayer(enemies);

    // renderiza
    BACKGROUND.render();
    PLAYER.render();
    Enemies.renderAll(enemies);
    TIMER.render();

    // Invoca funções dali tantos segundos
    setTimeout(main, FRAMES_PER_SECOND);
}

window.addEventListener('keydown', keydowns);
window.addEventListener('keyup', keyups);

main();

function keydowns(evt) {
    switch (evt.key) {
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

function keyups(evt) {
    switch (evt.key) {
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