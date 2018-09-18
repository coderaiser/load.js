# Load.js

Dynamically loading external JavaScript and CSS files 

## Install

```
npm install load.js
```

## How use?
```js
const load = require('load');

load.js('jquery.js', (error) => {
    /* you could use jquery functions here */
});

load.css('menu.css', (error) => {
    /* load menu css and then do some magic */
});

/* recognition file type by extension */
load('css-or-.js', (error, event) => {
    console.log(error || event);
});

load('template/footer.html', (error, footer) => {
    console.log(error || footer);
});

load.json('config.json', (error, config) => {
    console.log(error || config);
});

load.ajax('template/header.html', (error, header) => {
    console.log(error || header);
});

/* load one-by-one */
load.series([
    'jquery.js',
    'jq-console.js',
], (error) => {
});

/* load all together and call callback */
load.parallel([
    'menu.css',
    'menu.js',
], (error) => {
});
```

## License

MIT
