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