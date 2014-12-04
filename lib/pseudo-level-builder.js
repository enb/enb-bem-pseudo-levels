var path = require('path'),
    util = require('util'),
    vow = require('vow'),
    vfs = require('enb/lib/fs/async-fs'),
    slashRegExp = new RegExp('\\' + path.sep + '$', 'g');

function symlink(source, targetPath) {
    var dir = path.dirname(targetPath);

    return vfs.makeDir(dir)
        .then(function () {
            return vfs.exists(targetPath);
        })
        .then(function (isExists) {
            if (isExists) {
                return;
            }

            var relativeSourcePath = path.relative(path.dirname(targetPath), source.sourcePath);

            return vfs.symLink(relativeSourcePath, targetPath, source.isDirectory ? 'dir' : 'file');
        });
}

function build(dstpath, files, levels, resolve, args) {
    var hash = {},
        targets = [],
        toSymlink = [];

    files.map(function (file) {
        var solutions = resolve(file, levels, dstpath);

        if (solutions) {
            if (!util.isArray(solutions)) {
                if (typeof solutions === 'string') {
                    solutions = [{ sourcePath: file.fullname, targetPath: solutions, isDirectory: file.isDirectory }];
                } else {
                    solutions = [solutions];
                }
            }

            solutions.forEach(function (solution) {
                var targetPath = path.resolve(dstpath, solution.targetPath);

                hash[targetPath] = { sourcePath: solution.sourcePath, isDirectory: solution.isDirectory };
            });
        }
    });

    targets = Object.keys(hash);

    if (args && args.length) {
        args.forEach(function (arg) {
            arg = arg.replace(slashRegExp, '');

            targets.forEach(function (target) {
                var splitedArg = arg.split(path.sep),
                    splitedTarget = target.split(path.sep);

                if ((splitedArg.length === splitedTarget.length && target === arg) ||
                    ((splitedArg.length < splitedTarget.length) &&
                        (arg === splitedTarget.splice(0, splitedArg.length).join(path.sep))
                    ) ||
                    ((splitedArg.length > splitedTarget.length) &&
                        (target === splitedArg.splice(0, splitedTarget.length).join(path.sep))
                    )
                ) {
                    toSymlink.push(target);
                }
            });
        });
    } else {
        toSymlink = targets;
    }

    return toSymlink.length ? vfs.makeDir(dstpath)
        .then(function () {
            return vow.all(toSymlink.map(function (key) {
                return symlink(hash[key], key);
            }));
        })
        .then(function () {
            return toSymlink;
        }) : toSymlink;
}

exports.build = build;
