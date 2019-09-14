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