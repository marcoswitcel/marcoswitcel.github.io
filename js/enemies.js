function isIntersecting(p1, p2) {
    var
        ver = Math.abs(p1.yPos - p2.yPos),
        hor = Math.abs(p1.xPos - p2.xPos);
    ver = Math.pow(ver, 2);
    hor = Math.pow(hor, 2);

    return (Math.sqrt(ver + hor)) <= p1.radius + p2.radius
}

var TIMER = {
    initialTime: 0,
    init: function init() {
        this.initialTime = (new Date()).getTime();
    },
    getCurrentTime: function getCurrentTime() {
        return (((new Date()).getTime() - this.initialTime) / 1000).toFixed(2);
    },
    render: function render() {
        CTX.fillStyle = "Black";
        CTX.font = "30px Arial";
        CTX.fillText(this.getCurrentTime(), 40, CONFIG.height * .95);
    }
}

function Enemies(color, width, height, speed, xPos, yPos, radius) {
    this.color = color;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.xPos = xPos;
    this.yPos = yPos;
    this.radius = 5;
}

Enemies.list = [];

Enemies.prototype.update = function update() {
    this.yPos += this.speed;
};
Enemies.prototype.render = function render() {
    this.update();
    CTX.fillStyle = this.color;
    CTX.fillRect(this.xPos, this.yPos, this.width, this.height);
};

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

Enemies.spawn = function renderList() {
    if (this.list.length < 3) {
        var min = 1;
        var max = 4;
        var ne = Math.floor(Math.random() * (max - min + 1)) + min; //number of enemies
        for (var i = 0; i < ne; i++) {
            var rt = Math.floor(Math.random() * 9);
            if (rt > 0 && rt <= 3) {
                this.list.push(new Enemies("red", 10, 10, 1, CONFIG.width * Math.random(), 0));
            } else if (rt > 3 && rt <= 6) {
                this.list.push(new Enemies("green", 40, 40, 5, CONFIG.width * Math.random(), 0));
            } else if (rt > 5 && rt <= 8) {
                this.list.push(new Enemies("blue", 80, 80, 1.5, CONFIG.width * Math.random(), 0));
            }
        }
    }
};

Enemies.caughtPlayer = function caughtPlayer() {
    for (var i = 0; i < this.list.length; i++) {
        if (isIntersecting(this.list[i], PLAYER)) {
            console.log("colidiu");
            var audio = new Audio('assets/explosion.ogg');
            audio.play();
            break;
        }
    }
};