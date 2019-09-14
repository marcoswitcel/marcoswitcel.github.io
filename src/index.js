/* globals require */
var CONFIG = {
    width: window.innerWidth > 500 ? 500 : window.innerWidth,//500,
    height: window.innerWidth * 1.2 > 600 ? 600 : window.innerHeight//600
};
/**
@import './src/libs/require.js'
@import './src/libs/vector-data.js'
@import './src/libs/touch-input.js'
@import './src/enemies.js'
@import './src/particles.js'
@import './src/utils.js'
@import './src/player.js'
@import './src/libs/touch-input.js'
/**/


var CANVAS = document.querySelector('#canvas');
var CTX = CANVAS.getContext('2d');
CANVAS.width = CONFIG.width;
CANVAS.height = CONFIG.height;
var gameOver = false;
var mainMenu = false;
var credits = false;

var TIMER = {
    initialTime: 0,
    lastTime: 0,
    init: function init() {
        this.initialTime = (new Date()).getTime();
    },
    getCurrentTime: function getCurrentTime() {
        return (((new Date()).getTime() - this.initialTime) / 1000).toFixed(2);
    },
    render: require('render-text')(CTX)
};



var BOUNDARIES = {
    right: CONFIG.width,
    left: 0  + PLAYER.radius*2,
    up: 0  + PLAYER.radius,
    down: CONFIG.height,
    withinVerSpace: function withinVerSpace(value) {
        return value >= this.up && value <= this.down;
    },
    withinHorSpace: function withinHorSpace(value) {
        return value >= this.left && value <= this.right;
    }
};

// eslint-disable-next-line no-unused-vars
var BACKGROUND = {
    color: 'White',
    thickness: 5,
    spacing: 50,
    speed: .1,
    stripes: [],
    render: function render() {
        /* Função aposentada */
        CTX.fillStyle = this.color;
        var rw = Math.floor(Math.random() * (CONFIG.width + 1));
        var rh = Math.floor(Math.random() * (CONFIG.height + 1));
        for (var j = 0; j < 10; j++) {
            rw = Math.floor(Math.random() * (CONFIG.width + 1));
            rh = Math.floor(Math.random() * (CONFIG.height + 1));
            CTX.fillRect(rw, rh, this.thickness, this.thickness);
        }
    }
};

var Color = {
    /* hsl(263, 39%, 17%) */
    /* #281b3d */
    size: 10,
    dif: 0,
    increment: 0.0005,        
    getBGColor : function getBGColor() {
        if (Math.abs(this.dif) > this.size) {
            this.increment *= -1;
        }
        this.dif += this.increment;
        return 'hsl(263, 39%, ' + (17 + this.dif) + '%)';
    }
};



TIMER.init();

var spriteNames = ['ufoRed', 'ufoGreen', 'ufoBlue', 'ufoYellow', 'player'];
// eslint-disable-next-line no-unused-vars
var sprites = [];
// eslint-disable-next-line no-unused-vars
var globalLoaded = false;
// eslint-disable-next-line no-unused-vars
var sl = spriteNames.length;

function main() {

    if (mainMenu) {
        CTX.fillStyle = '#281b3d';
        CTX.fillRect(0, 0, CONFIG.width, CONFIG.height);
        CTX.drawImage(document.querySelector('#screenMain'), 0, 0);
    } else if (gameOver) {
        CTX.fillStyle = 'White';
        CTX.fillRect(CONFIG.width * 0.11, CONFIG.height * 0.3, CONFIG.width * 0.78, 150);
        CTX.fillStyle = 'Black';
        CTX.font = '35px Arial';
        CTX.fillText('GAME OVER: ' + TIMER.lastTime + ' S', CONFIG.width * 0.15, CONFIG.height * 0.4);
        CTX.fillText('PRESS ENTER', CONFIG.width * 0.15, CONFIG.height * 0.5);
    } else if (credits) {
        CTX.drawImage(document.querySelector('#screenCredits'), 0, 0);
    } else {
        // Background color
        CTX.fillStyle = Color.getBGColor();
        CTX.fillRect(0, 0, CONFIG.width, CONFIG.height);

        // Checa se pegou o player
        // eslint-disable-next-line no-undef
        Enemies.caughtPlayer();

        // renderiza
        // eslint-disable-next-line no-undef
        Particles.renderAll();
        // eslint-disable-next-line no-undef
        Enemies.renderAll();
        PLAYER.render();
        TIMER.render();
    }

    // Invoca funções dali tantos segundos
    requestAnimationFrame(main);
}


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

main();