var vow = require('vow');
var scanner = require('./level-scanner');

var PseudoLevel = function (levels) {
    this._levels = levels;
};

PseudoLevel.prototype.init = function () {
    this._levelsProcess();

    return vow.all([
            scanner.scanSimpleLevels(this._simpleLevels),
            scanner.scanNestedLevels(this._nestedLevels)
        ])
        .then(function (files) {
            this._levels = Array.prototype.concat(this._simpleLevels, this._nestedLevels);
            this._files = Array.prototype.concat.apply([], files);
        }, this);
};

PseudoLevel.prototype.getFiles = function () {
    return this._files;
};

PseudoLevel.prototype.getSourceLevels = function () {
    return this._levels;
};

PseudoLevel.prototype._levelsProcess = function () {
    var simpleLevels = [];
    var nestedLevels = [];

    this._levels.forEach(function (level) {
        if (typeof level === 'string') {
            level = { path: level };
        }

        level.type = level.type || 'nested';

        if (level.type === 'simple') {
            simpleLevels.push(level);
        } else {
            nestedLevels.push(level);
        }
    });

    this._simpleLevels = simpleLevels;
    this._nestedLevels = nestedLevels;
};

exports.PseudoLevel = PseudoLevel;
