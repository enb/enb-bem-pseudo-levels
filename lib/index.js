var vow = require('vow');
var scanner = require('./level-scanner');
var pseudoLevelBuilder = require('./pseudo-level-builder');

console.log();
console.warn('WARNING!!!');
console.warn('The `enb-pseudo-levels` package has been renamed to `enb-bem-pseudo-levels`.');
console.warn('Please follow https://github.com/enb-bem/enb-bem-pseudo-levels.');
console.log();

var PseudoFlow = function (levels) {
    this._initLevels(levels);

    this._buildPromises = [];
    this._scanLevelsPromise = this._scanLevels();
};

PseudoFlow.prototype._initLevels = function (levels) {
    this._levels = levels.map(function (level) {
        if (typeof level === 'string') {
            level = { path: level };
        }

        return level;
    });
};

PseudoFlow.prototype._scanLevels = function () {
    return scanner.scan(this._levels)
        .then(function (files) {
            this._files = Array.prototype.concat.apply([], files);
        }, this);
};

PseudoFlow.prototype.addBuilder = function (targetPath, resolve) {
    this._scanLevelsPromise.then(function () {
        this._buildPromises.push(pseudoLevelBuilder.build(targetPath, this._files, this._levels, resolve));
    }, this);

    return this;
};

PseudoFlow.prototype.build = function () {
    return this._scanLevelsPromise
        .then(function () {
            return vow.all(this._buildPromises);
        }, this)
        .then(function (targets) {
            return Array.prototype.concat.apply([], targets);
        });
};

module.exports = function (levels) {
    return new PseudoFlow(levels);
};
