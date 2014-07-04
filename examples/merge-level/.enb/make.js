var path = require('path');
var fs = require('fs');
var rootPath = path.join(__dirname, '..', '..', '..');
var pseudo = require(rootPath);
var naming = require('bem-naming');

module.exports = function (config) {
    var levels = [
        'level-1.blocks',
        'level-2.blocks'
    ];

    config.task('pseudo', function (task) {
        var levels = getLevels(config);
        var makePlatform = task.getMakePlatform();
        var cdir = makePlatform.getDir();
        var dstpath = config.resolvePath('pseudo-level.blocks');
        var nodes = [];

        return pseudo(levels)
            .addBuilder(dstpath, function (file, levels, dstpath) {
                var name = file.name.split('.')[0];
                var notation = naming.parse(name);
                var nestedPath = buildNestedPath(notation);
                var levelname = path.basename(guessLevel(file.fullname, levels));
                var fileName = [name, levelname, file.suffix].join('.');

                return {
                    sourcePath: file.fullname,
                    targetPath: path.join(dstpath, nestedPath, fileName)
                };
            })
            .build()
            .then(function (filenames) {
                nodes = filenames.map(function (filename) {
                    var target = path.relative(cdir, filename);

                    return path.dirname(target);
                });

                makePlatform.loadCache();

                return makePlatform.init(cdir);
            })
            .then(function () {
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

function guessLevel(filename, levels) {
    var i = levels && levels.length;
    var splited = filename.split(path.sep);
    var level;

    while (level && i--) {
        if (splited.indexOf(levels[i]) !== -1) {
            level = levels[i];
        }
    }

    return level || path.dirname(filename);
}

function buildNestedPath(obj) {
    var buf = [obj.block];

    if (obj.elem) {
        buf.push('__' + obj.elem);
    }

    if (obj.modName) {
        buf.push('_' + obj.modName);
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
        'level-1.blocks',
        'level-2.blocks'
    ].map(function (level) {
        return config.resolvePath(level);
    });
}
