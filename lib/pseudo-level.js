var scanner = require('./level-scanner');

var PseudoLevel = function (levels) {
    this._levels = levels;
};

PseudoLevel.prototype.init = function () {
    this._levelsProcess();

    return scanner.scan(this._levels)
        .then(function (files) {
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
    this._levels = this._levels.map(function (level) {
        if (typeof level === 'string') {
            level = { path: level };
        }

        return level;
    });
};

exports.PseudoLevel = PseudoLevel;
