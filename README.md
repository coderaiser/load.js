# Load.js

Dynamically loading external JavaScript and CSS files 

##How use?
Create `html` page with `js` and `css` connected.

```html
<script src="load.min.js"></script>
```

```js
load.js('jquery.js', function() {
    /* you could use jquery functions here */
});

load.css('menu.css', function() {
    /* load menu css and then do some magic */
});

/* recognition file type by extension */
load('css-or-.js', function() {
    console.log('done');
});

load.json('config.json', function(config) {
    console.log(config);
});

/* load one-by-one */
load.series([
    'jquery.js',
    'jq-console.js',
], function() {
});

/* load all togeter and call callback */
load.parallel([
    'menu.css',
    'menu.js',
], function() {
    
});
```

## License

MIT
