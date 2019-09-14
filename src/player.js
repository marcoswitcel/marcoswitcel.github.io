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