var path = require('path');
var rootPath = path.join(__dirname, '..', '..', '..');
var pseudo = require(rootPath);
var naming = require('bem-naming');

module.exports = function (config) {
    config.task('pseudo', function () {
        return pseudo(getLevels(config))
            .addBuilder('nested-pseudo-level.blocks', function (file) {
                var name = file.name.split('.')[0];
                var notation = naming.parse(name);
                var nestedPath = buildNestedPath(notation);

                return path.join(nestedPath, file.name);
            })
            .build();
    });
};

function buildNestedPath(obj) {
    var buf = [obj.block];

    if (obj.elem) {
        buf.push('__' + obj.elem);
    }

    if (obj.modKey) {
        buf.push('_' + obj.modKey);
    }

    return path.join.apply(null, buf);
}

/**
 * Получение уровней блоков
 * @param {Object} config
 * @returns {*|Array}
 */
function getLevels(config) {
    return [
        'nested-level.blocks'
    ].map(function (level) {
        return config.resolvePath(level);
    });
}
