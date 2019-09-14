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