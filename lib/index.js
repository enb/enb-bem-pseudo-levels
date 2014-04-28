var vow = require('vow');
var PseudoLevel = require('./pseudo-level').PseudoLevel;
var pseudoLevelBuilder = require('./pseudo-level-builder');

var Pseudo = function (levels) {
    this._buildPromises = [];
    this._pseudoLevel = new PseudoLevel(levels);
    this._initPromise = this._pseudoLevel.init();
};

Pseudo.prototype.addBuilder = function (targetPath, resolve) {
    this._initPromise.then(function () {
        var files = this._pseudoLevel.getFiles();
        var levels = this._pseudoLevel.getSourceLevels();

        this._buildPromises.push(pseudoLevelBuilder.build(targetPath, files, levels, resolve));
    }, this);

    return this;
};

Pseudo.prototype.build = function () {
    return this._initPromise
        .then(function () {
            return vow.all(this._buildPromises);
        }, this);
};

function init(levels) {
    return new Pseudo(levels);
}

module.exports = init;
