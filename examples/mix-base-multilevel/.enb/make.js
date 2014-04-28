var path = require('path');
var rootPath = path.join(__dirname, '../../../');
var pseudo = require(rootPath);
var builders = require(rootPath + 'builders');

module.exports = function(config) {
    config.task('pseudo', function () {
        return pseudo(getLevels(config))
            .addBuilder('simple-pseudo-multilevel.blocks', builders.simpleMultilevel())
            .addBuilder('nested-pseudo-multilevel.blocks', builders.nestedMultilevel())
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
        { path: 'simple-level.blocks', type: 'simple' },
        { path: 'nested-level.blocks', type: 'nested' }
    ].map(function(level) {
        return config.resolvePath(level);
    });
}
