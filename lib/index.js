var vow = require('vow'),
    scanner = require('./level-scanner'),
    pseudoLevelBuilder = require('./pseudo-level-builder');

function PseudoFlow(levels) {
    this._initLevels(levels);

    this._builders = [];
    this._scanLevelsPromise = this._scanLevels();
}

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

PseudoFlow.prototype.addBuilder = function (dstpath, resolve) {
    this._builders.push({ dstpath: dstpath, resolve: resolve });

    return this;
};

PseudoFlow.prototype.build = function (targets) {
    return this._scanLevelsPromise
        .then(function () {
            return vow.all(this._builders.map(function (builder) {
                return pseudoLevelBuilder.build(builder.dstpath, this._files, this._levels, builder.resolve, targets);
            }, this));
        }, this)
        .then(function (targets) {
            return Array.prototype.concat.apply([], targets);
        });
};

module.exports = function (levels) {
    return new PseudoFlow(levels);
};
