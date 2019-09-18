'use strict';

const {run} = require('madrun');

module.exports = {
    'lint': () => 'putout lib madrun.js',
    'fix:lint': () => run('lint', '--fix'),
    'watcher': () => 'nodemon -w test -w lib --exec',
    'watch:test': () => run('watcher', 'npm test'),
    'watch:lint': () => run('watcher', '\'npm run lint\''),
};

