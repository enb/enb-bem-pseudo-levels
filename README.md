enb-pseudo-levels [![NPM version](https://badge.fury.io/js/enb-pseudo-levels.svg)](http://badge.fury.io/js/enb-pseudo-levels) [![Build Status](https://travis-ci.org/andrewblond/enb-pseudo-levels.svg?branch=master)](https://travis-ci.org/andrewblond/enb-pseudo-levels) [![Dependency Status](https://gemnasium.com/andrewblond/enb-pseudo-levels.svg)](https://gemnasium.com/andrewblond/enb-pseudo-levels)
=================

Инструмент для манипуляции с уровнями переопределений для ENB. Позволяет создавать уровни на основе уже существующих.

Текущая реализация основана на симлинках. Это означает, что созданный уровень будет состоять из симлинкок на файлы исходных уровней.

Как использовать?
-----------------

Для того, чтобы выполнить манипуляцию над уровнями следует:

1. Задать список исходных уровней, на основе которых будут производиться манипуляции.
2. Задекларировать resolve-функцию по пути до нового уровня.
3. Запустить процесс сборки новых уровней;

Пример того, как скопировать `nested`-уровень и положить его на файловую систему в `simple`-стиле:

```js
var pseudo = require('enb-pseudo-levels');

module.exports = function (config) {

var dstpath = config.resolvePath('pseudo-level');  // путь до нового уровня

// Создаём таск с названием `pseudo`, для манипуляций с уровнями.
config.task('pseudo', function () {

return pseudo(getLevels(config))    // Сканируем исходные уровни.    (1)
    .addBuilder(dstpath, resolve)   // Задаём путь и resolve-функцию (2)
    .build();                       // Строим новый уровень          (3)
});

};

/**
 * Функция применяется для каждого файла найденного на исходных уровнях `levels`
 *
 * @param file информация о текущем файле
 * @param levels список исходных уровней
 * @param dstpath путь до нового уровня
 */
function resolve (file, levels, dstpath) {
    return {
        sourcePath: file.fullname,                 // путь до исходного файла
        targetPath: path.join(dstpath, file.name)  // путь до нового файла
    };
}

function getLevels (config) {
    return [
        'source-level'
    ].map(function (level) {
        return config.resolvePath(level);
    });
}
```

Запускаем скрипт манипуляции с уровнями следует описанный в таске `pseudo`:

```bash
$ ./node_modules/.bin/enb make pseudo
```

Установка
----------

```
npm install --save-dev enb-pseudo-levels
```

Для работы модуля требуется зависимость от пакета enb версии 0.8.22 или выше.

Разработка
----------
Руководство на [отдельной странице](/CONTRIBUTION.md).
