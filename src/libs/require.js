/* */
(function requireScope (global) {
    const loaded = {};
    global.require = function require(path = '') {
        return loaded[path] || null;
    };
    global.exports = function exports(name = '', interface = {}) {
        if (!name) throw `export error: var name must be a non empty string. '${typeof name}' passed`;

        loaded[name] = interface;
    };
})(window);
/* */