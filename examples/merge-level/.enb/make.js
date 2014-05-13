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
        var nodes = [];

        return pseudo(levels)
            .addBuilder('pseudo-level.blocks', function (file, levels) {
                var name = file.name.split('.')[0];
                var notation = naming.parse(name);
                var nestedPath = buildNestedPath(notation);
                var levelname = path.basename(guessLevel(file.fullname, levels));
                var fileName = [name, levelname, file.suffix].join('.');

                return path.join(nestedPath, fileName);
            })
            .build()
            .then(function (targets) {
                nodes = targets.map(function (target) {
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
        'level-1.blocks',
        'level-2.blocks'
    ].map(function (level) {
        return config.resolvePath(level);
    });
}
