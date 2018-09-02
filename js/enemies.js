function Enemies(color, width, height, speed, xPos, yPos, radius) {
    this.color = color;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.xPos = xPos;
    this.yPos = yPos;
    this.radius = 5;
    if (typeof radius !== "undefined") {
        this.radius = radius;
    }
}
Enemies.prototype.update = function update() {
    this.yPos += this.speed;
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

Enemies.spawn = function renderList() {
    if (this.list.length < 3) {
        var min = 1;
        var max = 4;
        var ne = Math.floor(Math.random() * (max - min + 1)) + min; //number of enemies
        for (var i = 0; i < ne; i++) {
            var rt = Math.floor(Math.random() * 9);
            if (rt > 0 && rt <= 3) {
                this.list.push(new Enemies("red", 10, 10, 2, CONFIG.width * Math.random(), 0, 5));
            } else if (rt > 3 && rt <= 6) {
                this.list.push(new Enemies("green", 40, 40, 5, CONFIG.width * Math.random(), 0, 20));
            } else if (rt > 5 && rt <= 8) {
                this.list.push(new Enemies("blue", 80, 80, 3, CONFIG.width * Math.random(), 0, 40));
            }
        }
    }
};

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