var path = require('path');
var util = require('util');
var vow = require('vow');
var vfs = require('enb/lib/fs/async-fs');

function symlink(sourcePath, targetPath) {
    var dir = path.dirname(targetPath);

    return vfs.makeDir(dir)
        .then(function () {
            return vfs.exists(targetPath);
        })
        .then(function (isExists) {
            if (isExists) {
                return vfs.remove(targetPath);
            }
        })
        .then(function () {
            var relativeSourcePath = path.relative(path.dirname(targetPath), sourcePath);

            return vfs.symLink(relativeSourcePath, targetPath);
        });
}

function build(dstpath, files, levels, resolve, args) {
    return vfs.makeDir(dstpath)
        .then(function () {
            var hash = {};
            var targets = [];
            var toSymlink = [];

            files.map(function (file) {
                var solutions = resolve(file, levels, dstpath);

                if (solutions) {
                    if (!util.isArray(solutions)) {
                        if (typeof solutions === 'string') {
                            solutions = [{ sourcePath: file.fullname, targetPath: solutions }];
                        } else {
                            solutions = [solutions];
                        }
                    }

                    solutions.forEach(function (solution) {
                        var targetPath = path.resolve(dstpath, solution.targetPath);

                        hash[targetPath] = solution.sourcePath;
                    });
                }
            });

            targets = Object.keys(hash);

            if (args && args.length) {
                args.forEach(function (arg) {
                    arg = arg.replace(/\/$/, '');

                    var splitedArg = arg.split(path.sep);

                    targets.forEach(function (target) {
                        var splitedTarget = target.split(path.sep);

                        if (splitedArg.length === splitedTarget.length && target === arg) {
                            toSymlink.push(target);
                        } else if (splitedArg.length < splitedTarget.length) {
                            if (arg === splitedTarget.splice(0, splitedArg.length).join(path.sep)){
                                toSymlink.push(target);
                            }
                        }
                    });
                });
            } else {
                toSymlink = targets;
            }

            return vow.all(toSymlink.map(function (key) {
                    return symlink(hash[key], key);
                }))
                .then(function () {
                    return targets;
                });
        });
}

exports.build = build;
