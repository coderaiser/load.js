'use strict';

const {promisify} = require('es6-promisify');
const createElement = require('@cloudcmd/create-element');

const noop = () => {};

const addListenerOnce = (el, name, fn) => {
    const listener = (e) => {
        fn(e);
        el.removeEventListener(name, fn);
    };
    
    el.addEventListener(name, listener);
};

const load = async (src) => {
    const ext = getExt(src);
    
    switch(ext) {
    case '.js':
        return await load.js(src);
    
    case '.css':
        return await load.css(src);
    
    case '.json':
        return await load.json(src);
    
    default:
        return await load.ajax(src);
    }
};

load.onerror = noop;
load.onload = noop;

load.addLoadListener = (onload) => {
    load.onload = onload;
};

load.addErrorListener = (onerror) => {
    load.onerror = onerror;
};

module.exports = load;

load.js = promisify((src, callback) => {
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
});

load.css = promisify((src, callback) => {
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
});

load.ajax = promisify((url, callback) => {
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
        callback(e);
    });
    
    request.send();
});

load.json = promisify((url ,callback) => {
    load.ajax(url, (error, data) => {
        let json;
        
        if (!error)
            json = JSON.parse(data);
        
        callback(error, json);
    });
});

load.series = async (urls) => {
    const url = urls.shift();
    
    if (!url)
        return;
    
    await load(url);
    await load.series(urls);
};

load.parallel = async (urls) => {
    const promises = urls.map(load);
    return await Promise.all(promises);
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
    const isStr = typeof src === 'string';
    
    if (!isStr)
        return '';
    
    if (~src.indexOf(':'))
        src += '-join';
    
    const num = src.lastIndexOf('/') + 1;
    const sub = src.substr(src, num);
    const id = src.replace(sub, '')
        .replace(/\./g, '-');
    
    return id;
}

