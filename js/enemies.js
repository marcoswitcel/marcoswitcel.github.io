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
    init : function init() {
        this.initialTime = (new Date()).getTime();
    },
    getCurrentTime : function getCurrentTime() {
        return (((new Date()).getTime() - this.initialTime)/1000).toFixed(2);
    },
    render : function render() {
        CTX.fillStyle = "Black";
        CTX.font = "30px Arial";
        CTX.fillText(this.getCurrentTime(), 40, CONFIG.height * .95);
    }
}

function Enemies(color, width,height, speed, xPos, yPos, radius) {
    this.color =  color;
    this.width =  width;
    this.height = height;
    this.speed = speed;
    this.xPos = xPos;
    this.yPos = yPos;
    this.radius = 5;
}
Enemies.prototype.update = function update() {
    this.yPos += this.speed;
};
Enemies.prototype.render =  function render() {
    this.update();

    CTX.fillStyle = this.color;
    CTX.fillRect(this.xPos, this.yPos, this.width, this.height);
};

Enemies.renderAll = function renderList(list) {
    list.forEach(function (el) {
        el.render();
    });
};
Enemies.caughtPlayer = function caughtPlayer(list) {
    for (var i = 0; i < list.length; i++) {
        if (isIntersecting(list[i], PLAYER)) {
            console.log("colidiu");
            break;
        }
    }
};