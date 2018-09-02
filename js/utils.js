/* Verifica se dois 'círculos' estão se tocando */
function isIntersecting(x1, x2) {
    var ver = Math.abs(x1.yPos - x2.yPos),
        hor = Math.abs(x1.xPos - x2.xPos);
    ver = Math.pow(ver, 2);
    hor = Math.pow(hor, 2);

    return (Math.sqrt(ver + hor)) <= x1.radius + x2.radius
}
/* Facilita a linkagem de objetos */
function delegate(who, to) {
    who.__proto__ = to;
}
/* pega elemento query */
function query(seletoctor) {
    return document.querySelector(seletoctor);
}