enb-pseudo-levels [![NPM version](https://badge.fury.io/js/enb-pseudo-levels.svg)](http://badge.fury.io/js/enb-pseudo-levels) [![Build Status](https://travis-ci.org/andrewblond/enb-pseudo-levels.svg?branch=master)](https://travis-ci.org/andrewblond/enb-pseudo-levels) [![Dependency Status](https://gemnasium.com/andrewblond/enb-pseudo-levels.svg)](https://gemnasium.com/andrewblond/enb-pseudo-levels)
=================

Инструмент для манипуляции с уровнями для ENB.

Как использовать
----------------

```js
var pseudo = require('enb-pseudo-levels');

module.exports = function (config) {

config.task('pseudo', function () {
    return pseudo(getLevels(config))        // сканируем исходные уровни

        .addBuilder('pseudo-level.blocks',  // задаём путь для нового уровня

            function resolve(file) {        // resolve-функция определяет
                return file.name;           // пути до новых файлов относительно
                                            // 'pseudo-level.blocks'
            }

        )
        .build();                           // строим новый уровень
});

};

function getLevels(config) {
    return [
        'level.blocks'
    ].map(function (level) {
        return config.resolvePath(level);
    });
}

```

Запускаем `pseudo` таск:

```bash
$ ./node_modules/.bin/enb make pseudo
```

Установка:
----------

```
npm install --save-dev enb-pseudo-levels
```

Для работы модуля требуется зависимость от пакета enb версии 0.8.22 или выше.

Разработка
----------
Руководство на [отдельной странице](/CONTRIBUTION.md).

Запуск тестов
-------------
```
$ npm test
```
