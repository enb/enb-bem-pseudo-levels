var path = require('path');
var rootPath = path.join(__dirname, '../../../');
var pseudo = require(rootPath);
var builders = require(rootPath + 'builders');

module.exports = function(config) {
    config.task('pseudo', function () {
        return pseudo(getLevels(config))
            .addBuilder('pseudo-level.blocks', builders.nestedLevel())
            .build();
    });
};

/**
 * Получение уровней
 * @param {Object} config
 * @returns {*|Array}
 */
function getLevels(config) {
    return [
        '*.blocks'
    ].map(function(level) {
        return config.resolvePath(level);
    });
}
