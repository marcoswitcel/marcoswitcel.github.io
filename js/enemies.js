function Enemies(color, width, height, speed, xPos, yPos, radius, type) {
    this.color = color;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.xPos = xPos;
    this.yPos = yPos;
    this.radius = 5;
    this.type = type;
    if (typeof radius !== "undefined") {
        this.radius = radius;
    }
}
Enemies.prototype.update = function update() {
    // this.yPos += this.speed;
    if (!this.type) {
        this.type = "inner";
    }
    Enemies.action[this.type](this);

};
Enemies.prototype.render = function render() {
    this.update();
    CTX.fillStyle = this.color;
    //CTX.fillRect(this.xPos, this.yPos, this.width, this.height);
    CTX.beginPath();
    CTX.arc(this.xPos + this.radius, this.yPos + this.radius, this.radius, 0, 2 * Math.PI);
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
        var bp1 = elm.yPos > CONFIG.height / 4;
        var bp2 = elm.yPos > CONFIG.height / 2;

        if (bp2) {
            ne = Math.random() * 4;
            if (ne > 2) {
                elm.speed = 0.8;
                elm.xPos += elm.speed;
            } else {
                elm.speed = 0.8;
                elm.xPos -= elm.speed;
            }
            elm.yPos += elm.speed;
        } else if (bp1) {
            elm.speed = 2;
            elm.yPos += elm.speed;
        } else {
            elm.yPos += elm.speed;
        }
    }
};

Enemies.spawn = function renderList() {
    if (this.list.length < 4) {
        ne = this.rand(1, 4); //number of enemies
        conf = Enemies.getActionConfig(this.rand(1, 3));
        var spacing = 0, height, rt;
        for (var i = 0; i < ne; i++) {
            height = this.rand(-300, 40);
            rt = this.rand(1, 10);
            if (rt > 0 && rt <= 3) {
                this.list.push(new Enemies("red", 10, 10, 0.5, this.getQuadrant(conf[0]), height, 30, "inner"));
            } else if (rt > 3 && rt <= 6) {
                this.list.push(new Enemies("green", 10, 10, 3, this.getQuadrant(conf[1]), height, 30, "outer"));
            } else if (rt > 5 && rt <= 8) {
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
}

Enemies.getQuadrant = function get() {
    var qd = this.rand(1, 4);
    if (qd == 1) {
        return this.rand(0, CONFIG.width * 0.25);
    } else if (qd == 2) {
        return this.rand(CONFIG.width * 0.25, CONFIG.width * 0.5);
    } else if (qd == 3) {
        return this.rand(CONFIG.width * 0.5, CONFIG.width * 0.75);
    } else {
        return this.rand(CONFIG.width * 0.75, CONFIG.width);
    }
}

Enemies.getActionConfig = function get(num) {
    switch (num) {
        case 1:
            return [1, 2, 3];
        case 2:
            return [4, 3, 2];
        case 3:
            return [3, 4, 1];
    }
}

Enemies.caughtPlayer = function caughtPlayer() {
    for (var i = 0; i < this.list.length; i++) {
        if (isIntersecting(this.list[i], PLAYER)) {
            var audio = new Audio('assets/explosion.ogg');
            audio.play();
            gameOver = true;
            break;
        }
    }
};