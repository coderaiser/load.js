'use strict';

const createElement = require('@cloudcmd/create-element');
const noop = () => {};

load.addLoadListener = (onload) => {
    load.onload = onload;
};

load.addErrorListener = (onerror) => {
    load.onerror = onerror;
};

const addListenerOnce = (el, name, fn) => {
    const listener = (e) => {
        fn(e);
        el.removeEventListener(name, fn);
    };
    
    el.addEventListener(name, listener);
};

load.onerror = noop;
load.onload = noop;

module.exports = load;

function load(src, callback) {
    const ext = getExt(src);
    
    switch (ext) {
    case '.js':
        return load.js(src, callback);
    
    case '.css':
        return load.css(src, callback);
    
    case '.json':
        return load.json(src, callback);
    
    default:
        return load.ajax(src, callback);
    }
}

load.js = (src, callback) => {
    const id = getIdBySrc(src);
    let el = document.getElementById(id);
    
    if (el)
        return callback();
    
    el = createElement('script', {
        id,
        src,
    });
    
    addListenerOnce(el, 'load', (event) => {
        callback(null, event);
        load.onload();
    });
    
    addListenerOnce(el, 'error', (e) => {
        callback(e);
        document.body.removeChild(el);
        load.onerror(e, src);
    });
};

load.css = (src, callback) => {
    const id = getIdBySrc(src);
    let el = document.getElementById(id);
    
    if (el)
        return callback();
    
    el = createElement('link', {
        id: getIdBySrc(src),
        rel: 'stylesheet',
        href: src,
        parent: document.head,
    });
    
    el.addEventListener('load', (event) => {
        callback(null, event);
        load.onload();
    });
    
    el.addEventListener('error', (e) => {
        callback(e);
        document.head.removeChild(el);
        load.onerror(e, src);
    });
};

load.ajax   = (url, callback) => {
    const request = new XMLHttpRequest();
    
    request.open('GET', url, true);
    
    request.addEventListener('load', () => {
        if (request.status >= 200 && request.status < 400){
            const data = request.responseText;
            callback(null, data);
            load.onload();
        }
    });
    
    request.addEventListener('error', (e) => {
        load.onerror(e);
    });
    
    request.send();
};

load.json = (url ,callback) => {
    load.ajax(url, (error, data) => {
        let json;
        
        if (!error)
            json = JSON.parse(data);
        
        callback(error, json);
    });
};

load.series = (urls, callback) => {
    const url = urls.shift();
    
    if (!url)
        return callback();
    
    load(url, (error) => {
        if (error)
            return callback(error);
        
        load.series(urls, callback);
    });
};

load.parallel = (urls, callback) => {
    let i = urls.length;
    let done;
    let func = (error) => {
        --i;
        
        if (!i && !done || error) {
            done = true;
            callback(error);
        }
    };
    
    urls.forEach((url) => {
        load(url, func);
    });
};

function getExt(name) {
    const isStr = typeof name === 'string';
    let ret = '';
    let dot;
    
    if (isStr) {
        dot = name.lastIndexOf('.');
        
        if (~dot)
            ret = name.substr(dot);
    }
    
    return ret;
}

load.getIdBySrc = getIdBySrc;

function getIdBySrc(src) {
    let num, sub, id;
    const isStr = typeof src === 'string';
    
    if (!isStr)
        return '';
    
    if (~src.indexOf(':'))
        src += '-join';
    
    num    = src.lastIndexOf('/') + 1;
    sub    = src.substr(src, num);
    id     = src.replace(sub, '')
        .replace(/\./g, '-');
    
    return id;
}

