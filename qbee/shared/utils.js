module.exports = {
    get: function (key, object) {
        return object[key];
    },
    ensureHTTP: function (url) {
        if (/^https?:\/\//i.test(url)) return url;
        return 'http://' + url;
    }
};