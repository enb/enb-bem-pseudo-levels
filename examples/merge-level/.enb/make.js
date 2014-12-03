var path = require('path'),
    fs = require('fs'),
    rootPath = path.join(__dirname, '..', '..', '..'),
    pseudo = require(rootPath),
    naming = require('bem-naming');

module.exports = function (config) {
    var levels = [
        'level-1.blocks',
        'level-2.blocks'
    ];

    config.task('pseudo', function (task) {
        var levels = getLevels(config),
            makePlatform = task.getMakePlatform(),
            cdir = makePlatform.getDir(),
            dstpath = config.resolvePath('pseudo-level.blocks'),
            nodes = [];

        return pseudo(levels)
            .addBuilder(dstpath, function (file, levels, dstpath) {
                var name = file.name.split('.')[0],
                    notation = naming.parse(name),
                    nestedPath = buildNestedPath(notation),
                    levelname = path.basename(guessLevel(file.fullname, levels)),
                    fileName = [name, levelname, file.suffix].join('.');

                return {
                    sourcePath: file.fullname,
                    targetPath: path.join(dstpath, nestedPath, fileName),
                    isDirectory: file.isDirectory
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
        var nodePath = nodeConfig.getPath(),
            nodeName = path.basename(nodePath),
            targets = [];

        levels.forEach(function (level) {
            var target = [nodeName, level, 'txt'].join('.'),
                targetPath = nodeConfig.resolvePath(target);

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
    var i = levels && levels.length,
        splited = filename.split(path.sep),
        level;

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
