var path = require('path');
var rootPath = path.join(__dirname, '..', '..', '..');
var pseudo = require(rootPath);
var guesser = require(path.join(rootPath, 'lib/file-guesser'));

module.exports = function(config) {
    config.task('pseudo', function () {
        return pseudo(getLevels(config))
            .addBuilder('nested-pseudo-level.blocks', function (file) {
                return path.join(guesser.buildBemNestedPath(file), file.name);
            })
            .build();
    });
};

/**
 * Получение уровней блоков
 * @param {Object} config
 * @returns {*|Array}
 */
function getLevels(config) {
    return [
        'nested-level.blocks'
    ].map(function(level) {
        return config.resolvePath(level);
    });
}
