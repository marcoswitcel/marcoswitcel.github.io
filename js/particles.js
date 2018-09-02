function Particles(color, width, height, speed, xPos, yPos, radius) {
    this.color = color;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.xPos = xPos;
    this.yPos = yPos;
    this.radius = 5;
}

Particles.list = [];

Particles.prototype.update = function update() {
    this.yPos += this.speed;
};
Particles.prototype.render = function render() {
    this.update();
    CTX.fillStyle = this.color;
    CTX.fillRect(this.xPos, this.yPos, this.width, this.height);
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
        Particles.list.push(new Particles("White", 4, 4, .5, CONFIG.width * Math.random(), -(CONFIG.height * Math.random()), 5));
    }
};
