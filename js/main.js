"use strict";

// Globais
const CANVAS = document.querySelector("#canvas");
const CTX = CANVAS.getContext("2d");
const CONFIG = {
    width: 1200,
    height: 600
};

const FRAMES_PER_SECOND = 1000 / 600;


var left = false,
    right = false,
    down = false,
    up = false;

CANVAS.width = CONFIG.width;
CANVAS.height = CONFIG.height;

// Escolher a cor que vai ser usada na 'renderização'
// CTX.fillStyle = "Red";
// desenha um retângulo da cor do valor do 'fillStyle' do CTX (context)
// posição hor, ver; largura e altura
// CTX.fillRect(0, 0, 100, 100);

// Funçãozinha que vincula objetos a outro objetos
// assim permitindo o lookup de atributos
function delegate(who, to) {
    who.__proto__ = to;
}

function notUndefined(...arg) {
    for (var value of arg)
        if (typeof value == "undefined") throw {
            message: "Valor não definido"
        };
}

const renderizibles = {

    update: function update() {
        var acel = 1;



        if (left) {

            PLAYER.xPos -= acel;
        }
        if (right) {
            PLAYER.xPos += acel;
        }
        if (up) {
            PLAYER.yPos -= acel;
        }
        if (down) {
            PLAYER.yPos += acel;
        }


    },

    render: function render(obj = this) {
        let {
            color,
            xPos,
            yPos,
            width,
            height
        } = obj;

        CTX.fillStyle = color;
        CTX.fillRect(xPos, yPos, width, height);
    }
};

const PLAYER = {
    color: "Blue",
    width: 10,
    height: 10,
    xPos: CONFIG.width / 2,
    yPos: CONFIG.height * 0.9
};

const BOUNDARIES = {
    right: CONFIG.width - PLAYER.width,
    left: 0,
    up: 0,
    down: CONFIG.height - PLAYER.height
}

const BACKGROUND = {
    color: "rgba(0,187,255,.5)",
    thickness: 5,
    spacing: 50,
    speed: .5,
    stripes: [],
    init() {
        var nstripes = CONFIG.height / (this.spacing + this.thickness);

        for (var i = 0; i < nstripes; i++) {

            this.stripes.push((this.spacing + this.thickness) * i - 20);
        }
    },
    render() {
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

function main() {
    CTX.fillStyle = "White";
    CTX.fillRect(0, 0, CONFIG.width, CONFIG.height);

    BACKGROUND.render();
    // @TODo update no render
    PLAYER.update();
    PLAYER.render();



    // @TODO implementar um timer que leva o tempo de processamento dem consideração
    // caso a quantidade de processamento aumentar
    setTimeout(main, FRAMES_PER_SECOND);

    window.addEventListener('keydown', keydowns);
    window.addEventListener('keyup', keyups);
}

// Run game
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