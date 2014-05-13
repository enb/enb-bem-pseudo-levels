var path = require('path');
var rootPath = path.join(__dirname, '..', '..', '..');
var pseudo = require(rootPath);

module.exports = function (config) {
    config.task('pseudo', function () {
        return pseudo(getLevels(config))
            .addBuilder('pseudo.sets', function (file) {
                if (file.isDirectory && file.suffix === 'bundles') {
                    var files = file.files;
                    var scope = file.name.split('.')[0];

                    return files && files.length && files.map (function (file) {
                        return one(file, scope);
                    }).filter(function (file) {
                        return file;
                    });
                }

                return false;
            })
            .build();
    });
};

function one (file, scope) {
    var name = file.name;
    var node = name.split('.')[0];

    return {
        targetPath: path.join(scope, node, name),
        sourcePath: file.fullname
    };
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
