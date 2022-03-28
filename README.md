# Load.js

Dynamically loading external JavaScript and CSS files 

## Install

```
npm install load.js
```

## How use?
```js
const load = require('load');

/* you could use jquery functions here */
await load.js('jquery.js');

/* load menu css and then do some magic */
await load.css('menu.css');

/* recognition file type by extension */
const [e1, event] = await tryToCatch(load, 'css-or-.js');

const [e2, footer] = await tryToCatch(load, 'template/footer.html');

const [e3, config] = await tryToCatch(load.json, 'config.json');

const [e4, header] = await tryToCatch(load.ajax, 'template/header.html');

/* load one-by-one */
await load.series([
    'jquery.js',
    'jq-console.js',
]);

/* load all together */
await load.parallel([
    'menu.css',
    'menu.js',
]);
```

## License

MIT
