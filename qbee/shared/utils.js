module.exports = {
    events: {
        CONNECTION_ESTABLISHED: 'CONNECTION_ESTABLISHED'
    },
    get: function (key, object) {
        return object[key];
    },
    ensureHTTP: function (url) {
        if (/^https?:\/\//i.test(url)) return url;
        return 'http://' + url;
    }
};