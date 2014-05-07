var path = require('path');
var fs = require('fs');
var rootPath = path.join(__dirname, '..', '..', '..');
var pseudo = require(rootPath);
var guesser = require(path.join(rootPath, 'lib/file-guesser'));

module.exports = function(config) {
    var levels = [
        'level-1.blocks',
        'level-2.blocks'
    ];

    config.task('pseudo', function (task) {
        var makePlatform = task.getMakePlatform();
        var cdir = makePlatform.getDir();
        var nodes = [];

        return pseudo(getLevels(config))
            .addBuilder('pseudo-level.blocks', function (file, levels) {
                var fileInfo = guesser.getFileInfo(file, levels);
                var fileName = [fileInfo.name, fileInfo.level.name, file.suffix].join('.');

                return path.join(fileInfo.bem.nestedPath, fileName);
            })
            .build()
            .then(function(targets) {
                nodes = targets.map(function (target) {
                    return path.dirname(target);
                });

                makePlatform.loadCache();

                return makePlatform.init(cdir);
            })
            .then(function() {
                return makePlatform.buildTargets(nodes);
            });
    });

    config.nodes('pseudo-level.blocks/*', function (nodeConfig) {
        var nodePath = nodeConfig.getPath();
        var nodeName = path.basename(nodePath);
        var targets = [];

        levels.forEach(function (level) {
            var target = [nodeName, level, 'txt'].join('.');
            var targetPath = nodeConfig.resolvePath(target);

            if (fs.existsSync(targetPath)) {
                nodeConfig.addTech([
                    require('enb/techs/file-provider'), { target: target }
                ]);

                targets.push(target);
            }
        });

        nodeConfig.addTechs([
            [require('enb/techs/file-merge'), {
                sources: targets,
                target: '?.txt'
            }]
        ]);
        nodeConfig.addTargets([
            '?.txt'
        ]);
    });
};

/**
 * Получение уровней блоков
 * @param {Object} config
 * @returns {*|Array}
 */
function getLevels(config) {
    return [
        'level-1.blocks',
        'level-2.blocks'
    ].map(function(level) {
        return config.resolvePath(level);
    });
}
