'use strict';

var MOPIDY_PORT = 6680;
var MOPIDY_HOST = 'mopidy';

var Mopidy = require('mopidy');

// enriched queue to keep in sync with mopidy server
var queue = [];

// mopidy server status
var moppy = { // FIXME: dummy for now
    currentTrack: {
        name: '',
        playtime: '',
        cursor: ''
    },
    queue: []
};

var mopidy = new Mopidy({
    webSocketUrl: 'ws://' + MOPIDY_HOST + ':' + MOPIDY_PORT + '/mopidy/ws/'
});

module.exports = {
    getCurrentSong: function() {
        return 'Some Song Title';
    },

    getQueue: {

    }
};