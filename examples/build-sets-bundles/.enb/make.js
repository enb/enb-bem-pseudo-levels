var path = require('path');
var rootPath = path.join(__dirname, '..', '..', '..');
var pseudo = require(rootPath);
var guesser = require(path.join(rootPath, 'lib/file-guesser'));

module.exports = function(config) {
    config.task('pseudo', function () {
        return pseudo(getLevels(config))
            .addBuilder('pseudo.sets', function(file) {
                if(file.isDirectory && ['bundles'].indexOf(file.suffix) !== -1) {
                    var files = file.files;
                    var scope = file.name.split('.')[0];
                    var sublevels = [{ path : file.fullname }];

                    return files && files.length && files.map(function(file) {
                        return one(file, sublevels, scope);
                    }).filter(function(file) {
                        return file;
                    });
                }

                return false;
            })
            .build();
    });
};

function one(file, levels, scope) {
    var fileInfo = guesser.getFileInfo(file, levels);
    var fileName = file.name;

    return {
        targetPath : path.join(scope, fileInfo.name, fileName),
        sourcePath : file.fullname
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
    ].map(function(level) {
        return config.resolvePath(level);
    });
}
