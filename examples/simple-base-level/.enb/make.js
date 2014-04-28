var path = require('path');
var rootPath = path.join(__dirname, '../../../');
var pseudo = require(rootPath);
var builders = require(rootPath + 'builders');

module.exports = function(config) {
    config.task('pseudo', function () {
        return pseudo(getLevels(config))
            .addBuilder('simple-pseudo-level.blocks', builders.simpleLevel())
            .addBuilder('nested-pseudo-level.blocks', builders.nestedLevel())
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
        { path: 'simple-level.blocks', type: 'simple' }
    ].map(function(level) {
        return config.resolvePath(level);
    });
}
