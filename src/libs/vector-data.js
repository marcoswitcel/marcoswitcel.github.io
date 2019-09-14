/**  Define a strutura de dados Vector2d
* Dependências:
*  /utility/delegate
* Funções sempre retornam outro objeto
**/

(function vectorDataScope(global, exports) {

    const vectorPrototype = {};
    //@TODO Verificar método de adição
    vectorPrototype.add = function vectorAddMethod(vectorObj) {
        return Vector2D(
            this.x + vectorObj.x,
            this.y + vectorObj.y,
        );
    };
    //@TODO método limit, verificar
    vectorPrototype.limit = function vectorLimitMethod(x = 0, y = x) {
        return Vector2D(
            (this.x > x) ? x : this.x,
            (this.y > y) ? y : this.y,
        );
    };
    //@TODO criar método de sub

    //@TODO método de normalização
    vectorPrototype.normalized = function() {
        var scalar = this.x * this.x + this.y * this.y;
        return Vector2D(
            this.x / scalar,
            this.y / scalar
        );
    }

    exports('Vector2D', function Vector2D(x = 0, y = x) {
        return delegate(
            { x, y },
            vectorPrototype
        );
    })
})(window, window.exports);
/* */