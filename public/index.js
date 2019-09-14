/* globals require */
var CONFIG = {
    width: window.innerWidth > 500 ? 500 : window.innerWidth,//500,
    height: window.innerWidth * 1.2 > 600 ? 600 : window.innerHeight//600
};
/**
/* */
(function requireScope (global) {
    const loaded = {};
    global.require = function require(path = '') {
        return loaded[path] || null;
    };
    global.exports = function exports(name = '', interface = {}) {
        if (!name) throw `export error: var name must be a non empty string. '${typeof name}' passed`;

        loaded[name] = interface;
    };
})(window);
/* */
/**  Define a strutura de dados Vector2d
* Dependências:
*  /utility/delegate
* Funções sempre retornam outro objeto
**/

(function vectorDataScope(global, exports) {

    const vectorPrototype = {};
    //@TODO Verificar método de adição
    vectorPrototype.add = function vectorAddMethod(vectorObj) {
        return Vector2D(
            this.x + vectorObj.x,
            this.y + vectorObj.y,
        );
    };
    //@TODO método limit, verificar
    vectorPrototype.limit = function vectorLimitMethod(x = 0, y = x) {
        return Vector2D(
            (this.x > x) ? x : this.x,
            (this.y > y) ? y : this.y,
        );
    };
    //@TODO criar método de sub

    //@TODO método de normalização
    vectorPrototype.normalized = function() {
        var scalar = this.x * this.x + this.y * this.y;
        return Vector2D(
            this.x / scalar,
            this.y / scalar
        );
    }

    exports('Vector2D', function Vector2D(x = 0, y = x) {
        return delegate(
            { x, y },
            vectorPrototype
        );
    })
})(window, window.exports);
/* */
/**  Arquivo de utilitários João Marcos de Vargas Witcel
* Dependências:
*  Vector2D
**/

window.Vector2D = require('Vector2D');
const INTENTION = {
    lastCoordTouch : null,
    x : 0,
    y : 0,
    taxa : 20,
};

INTENTION.accelVector = function accelVector() {
    // Procedure que atualiza o valor da força
    INTENTION.update();
    return Vector2D(this.x * this.taxa, this.y * this.taxa);
};

INTENTION.isZero = function isZero() {
    return this.x === 0 && this.y === 0;
};

INTENTION.update = function updateIntetion() {
    if (this.lastCoordTouch) {
        var touch = this.lastCoordTouch;
        var diffX = (touch.x - PLAYER.xPos);
        var diffY = (touch.y - PLAYER.yPos);
       
        // Novas coordenadas
        var vector =  Vector2D(diffX, diffY).normalized();
        this.x = vector.x;
        this.y = vector.y;
    }
    
};

INTENTION.setLastCoordTouch = function setLastCoordTouch(event) {
    var touch = event.changedTouches[event.changedTouches.length - 1];
    this.lastCoordTouch = Vector2D(touch.pageX, touch.pageY);
};


window.addEventListener('load', function() {
    var canvas = document.querySelector('#canvas');
    canvas.addEventListener('touchstart', function(event) {
        INTENTION.setLastCoordTouch(event);
    });
    canvas.addEventListener('touchmove', function(event) {
        INTENTION.setLastCoordTouch(event);
    });
    canvas.addEventListener('touchend', function() {
        INTENTION.lastCoordTouch = null;
        INTENTION.x = 0;
        INTENTION.y = 0;
    });
});
/* */
function Enemies(color, width, height, speed, xPos, yPos, radius, type) {
    this.color = color;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.xPos = xPos;
    this.yPos = yPos;
    this.radius = 5;
    this.type = type;
    this.degree = 1;
    this.angularSpeed = 2;
    if (typeof radius !== 'undefined') {
        this.radius = radius;
    }
}
Enemies.prototype.update = function update() {
    if (!this.type) {
        this.type = 'inner';
    }
    Enemies.action[this.type](this);

};
Enemies.prototype.render = function render() {
    this.update();
    CTX.save();
    CTX.translate(this.xPos, this.yPos);
    CTX.rotate((this.degree += this.angularSpeed)*Math.PI/180);
    CTX.fillStyle = this.color;
    CTX.beginPath();
    switch (this.type) {
        case 'inner':
            CTX.drawImage(query('#ufoRed'), - this.radius, - this.radius, this.radius * 2, this.radius * 2);
            break;
        case 'outer':
            CTX.drawImage(query('#ufoGreen'), - this.radius, - this.radius, this.radius * 2, this.radius * 2);
            break;
        case 'thunder':
            CTX.drawImage(query('#ufoBlue'), - this.radius, - this.radius, this.radius * 2, this.radius * 2);
            break;
        case 'lemon':
            CTX.drawImage(query('#ufoYellow'), - this.radius, - this.radius, this.radius * 2, this.radius * 2);
            break;
    }
    CTX.restore();


    CTX.fill();
};

/* Atributos estáticos */

Enemies.list = [];

Enemies.renderAll = function renderList() {
    this.check();
    this.spawn();
    this.list.forEach(function (el) {
        el.render();
    });
};

Enemies.check = function renderList() {
    var ll = this.list.length;
    var newList = [];
    for (var i = 0; i < ll; i++) {
        if (this.list[i].yPos < CONFIG.height) {
            newList.push(this.list[i]);
        }
    }
    this.list = newList;
};

Enemies.action = {
    'inner': function exec(elm) {
        elm.yPos += elm.speed;
        if (elm.yPos > CONFIG.height / 4) {
            elm.speed = 3;
            this.angularSpeed *= 2;
        }
    },
    'outer': function exec(elm) {
        elm.yPos += elm.speed;
        if (elm.yPos > CONFIG.height / 1.5) {
            elm.speed = 2;
        } else if (elm.yPos > CONFIG.height / 3.5) {
            elm.speed = 1;
        }
    },
    'thunder': function exec(elm) {
        var bp1 = elm.yPos > CONFIG.height / 4;
        var bp2 = elm.yPos > CONFIG.height / 2;

        if (bp2) {
            elm.yPos += elm.speed;
            elm.xPos -= elm.speed;
            elm.speed = 1.5;
        } else if (bp1) {
            elm.speed = 2;
            elm.yPos += elm.speed;
            elm.xPos += elm.speed;
        } else {
            elm.yPos += elm.speed;
        }
    },
    'lemon': function exec(elm) {
        var bp1 = elm.yPos > CONFIG.height / 7;
        var w2 = CONFIG.width / 2;
        elm.yPos += elm.speed;
        if (bp1) {
            elm.speed = 2;
            if (PLAYER.xPos < w2 && elm.xPos > w2) {
                elm.xPos -= elm.speed;
            } else if (PLAYER.xPos > w2 && elm.xPos < w2) {
                elm.xPos += elm.speed;
            } else {
                elm.speed = 3;
            }
        }
    }
};

Enemies.spawn = function renderList() {
    if (this.list.length < 2) {
        ne = this.rand(1, 4); //number of enemies
        conf = Enemies.getActionConfig(this.rand(1, 3));
        var spacing = 0,
            height, rt;
        for (var i = 0; i < ne; i++) {
            height = this.rand(-300, 40);
            rt = this.rand(1, 10);
            if (rt > 0 && rt <= 3) {
                this.list.push(new Enemies("red", 10, 10, 0.5, this.getQuadrant(conf[0]), height, 30, "inner"));
            } else if (rt > 3 && rt <= 6) {
                 this.list.push(new Enemies("green", 10, 10, 3, this.getQuadrant(conf[1]), height, 30, "outer"));
            } else if (rt > 6 && rt <= 8) {
                this.list.push(new Enemies("blue", 10, 10, 1, PLAYER.xPos + spacing, height, 40, "thunder"));
            } else if (rt > 8 && rt <= 10) {
                this.list.push(new Enemies("yellow", 10, 10, 1.5, this.getQuadrant(conf[2]), height, 30, "lemon"));
            }
            spacing += 150;
        }
    }
};

Enemies.rand = function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

Enemies.getQuadrant = function get() {
    var qd = this.rand(1, 4);
    if (qd == 1) {
        return this.rand(0, CONFIG.width * 0.33);
    } else if (qd == 2) {
        return this.rand(CONFIG.width * 0.33, CONFIG.width * 0.67);
    } else {
        return this.rand(CONFIG.width * 0.67, CONFIG.width);
    }
};

Enemies.getActionConfig = function get(num) {
    switch (num) {
    case 1:
        return [1, 2, 3];
    case 2:
        return [1, 3, 2];
    case 3:
        return [3, 2, 1];
    }
};

Enemies.caughtPlayer = function caughtPlayer() {
    for (var i = 0; i < this.list.length; i++) {
        if (isIntersecting(this.list[i], PLAYER)) {
            // var audio = new Audio('assets/explosion.ogg');
            // audio.volume = 0.5;
            // audio.play();
            gameOver = true;
            break;
        }
    }
};
/* */
/*global CONFIG, CTX */
/* */
function Particles(color, radius, speed, xPos, yPos) {
    this.color = color;
    this.radius = radius;
    this.speed = speed;
    this.xPos = xPos;
    this.yPos = yPos;
}

Particles.list = [];

Particles.prototype.update = function update() {
    this.yPos += this.speed;
};
Particles.prototype.render = function render() {
    this.update();
    CTX.fillStyle = this.color;
    //CTX.fillRect(this.xPos, this.yPos, this.width, this.height);
    CTX.beginPath();
    CTX.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
    CTX.fill();
    //CTX.stroke();
};

Particles.renderAll = function renderList() {
    this.check();
    this.spawn();
    this.list.forEach(function (el) {
        el.render();
    });
};

Particles.check = function renderList() {
    var ll = this.list.length;
    var newList = [];
    for (var i = 0; i < ll; i++) {
        if (this.list[i].yPos < CONFIG.height) {
            newList.push(this.list[i]);
        }
    }
    this.list = newList;
};

Particles.spawn = function renderList() {
    if (this.list.length < 50) {
        var radius = 1 + Math.floor(Math.random()*3);
        Particles.list.push(new Particles('#a1e9f7', radius, .5, CONFIG.width * Math.random(), -(CONFIG.height * Math.random()), 5));
    }
};
/* */
/* */
/* Verifica se dois 'círculos' estão se tocando */
function isIntersecting(x1, x2) {
    var ver = Math.abs(x1.yPos - x2.yPos),
        hor = Math.abs(x1.xPos - x2.xPos);
    ver = Math.pow(ver, 2);
    hor = Math.pow(hor, 2);

    return (Math.sqrt(ver + hor)) <= x1.radius + x2.radius;
}
/* Facilita a linkagem de objetos */
function delegate(who, to) {
    who.__proto__ = to;
    return who;
}
/* pega elemento query */
function query(cssSelector) {
    return document.querySelector(cssSelector);
}

(function utilsScope(global, exports) {
    exports('render-text', function setaCTX(CTX) {
        return function render() {
            CTX.fillStyle = 'White';
            CTX.font = '30px Arial';
            this.lastTime = this.getCurrentTime();
            // eslint-disable-next-line no-undef
            CTX.fillText(this.lastTime, 40, CONFIG.height * .95);
        };
    });
    exports('render-text-any', function setaCTX(CTX) {
        return function render(config = {}) {
            CTX.fillStyle = config.color || 'White';
            CTX.font = config.font || '30px Arial';
            // eslint-disable-next-line no-undef
            CTX.fillText(config.text, config.x || 0, config.y || 0);
        };
    });
})(window, window.exports);
/* */
/*global BOUNDARIES, CTX, INTENTION, CONFIG, delegate  */
var renderizibles = {
    update: function update() {
        // Aplica as desacelerações
        if (this.speedX !==  0) {
            this.speedX += -1 * this.desc * (this.speedX/Math.abs(this.speedX));
        }
        if (this.speedY !==  0) {
            this.speedY += -1 * this.desc * (this.speedY/Math.abs(this.speedY));
        }
        // Linita a velocidade à maxSpeed setada, mantém o sentido do movimento
        if (Math.abs(this.speedX) > this.maxSpeed) {
            this.speedX = this.maxSpeed * (this.speedX/Math.abs(this.speedX));
        }
        if (Math.abs(this.speedY) > this.maxSpeed) {
            this.speedY = this.maxSpeed * (this.speedY/Math.abs(this.speedY));
        }
        // Limite da tela 
        if (BOUNDARIES.withinHorSpace(PLAYER.xPos + this.speedX)) {
            PLAYER.xPos += this.speedX;
        }
        if (BOUNDARIES.withinVerSpace(PLAYER.yPos + this.speedY)) {
            PLAYER.yPos += this.speedY;
        }
        var { x, y } = INTENTION.accelVector();
        this.speedY += y;
        this.speedX += x;
    },

    render: function render() {
        this.update();
        CTX.fillStyle = this.color;
        //CTX.drawImage(query('#player'), 0, 0, 112, 75, this.xPos - 56, this.yPos - 37.5, this.radius*2, (this.radius*2)*0.67);
        //CTX.drawImage(query('#player'), 0, 0, 112, 75, this.xPos - 56, this.yPos - 37.5, this.radius*2, (this.radius*2)*0.67);
        CTX.fillStyle = 'pink';
        CTX.beginPath();
        CTX.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
        CTX.fill();
        this.debbug();
        
    },
    debbug: function debbug() {
        this.debbugable && (
            require('render-text-any')(CTX)({
                x: this.xPos,
                y : this.yPos,
                color: 'red',
                font: '15px Arial',
                text : `x: ${~~this.xPos} y: ${~~this.yPos}`
            })
        )
    }
};

var PLAYER = {
    color: '#135050',
    width: 10,
    height: 10,
    accel: 0.1,
    desc: 0.03,    
    speedX: 0,
    speedY: 0,
    maxSpeed: 2,
    xPos: CONFIG.width / 2 + 35,
    radius: 20,
    yPos: CONFIG.height * 0.8,
    debbugable: true
};

// Agora PLAYER pode fazer uso dos métodos de renderizibles
delegate(PLAYER, renderizibles);
/* */

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