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