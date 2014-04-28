var vow = require('vow');
var vfs = require('vow-fs');
var scanner = require('./scan-levels');

var PseudoLevel = function (levels) {
    this._levels = levels;
};

PseudoLevel.prototype.init = function () {
    return this._levelsProcess()
        .spread(function (simpleLevels, nestedLevels) {
            return vow.all([
                    scanner.scanSimpleLevels(simpleLevels),
                    scanner.scanNestedLevels(nestedLevels)
                ])
                .then(function (files) {
                    this._levels = Array.prototype.concat(simpleLevels, nestedLevels);
                    this._files = Array.prototype.concat.apply([], files);
                }, this);
        }, this);
};

PseudoLevel.prototype.getFiles = function () {
    return this._files;
};

PseudoLevel.prototype.getSourceLevels = function () {
    return this._levels;
};

PseudoLevel.prototype._levelsProcess = function () {
    var simpleLevelPromises = [];
    var nestedLevelPromises = [];

    this._levels.forEach(function (level) {
        if (typeof level === 'string') {
            level = { path: level };
        }

        var promise = vfs.glob(level.path)
            .then(function (levelPaths) {
                return levelPaths.map(function (levelPath) {
                    return { path: levelPath, type: level.type || 'nested' };
                });
            });

        if (level.type === 'simple') {
            simpleLevelPromises.push(promise);
        } else {
            nestedLevelPromises.push(promise);
        }
    });

    return vow.all([
        vow.all(simpleLevelPromises)
            .then(function (levels) {
                return Array.prototype.concat.apply([], levels);
            }),
        vow.all(nestedLevelPromises)
            .then(function (levels) {
                return Array.prototype.concat.apply([], levels);
            })
    ]);
};

exports.PseudoLevel = PseudoLevel;
