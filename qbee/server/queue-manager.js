'use strict';

var MOPIDY_PORT = 6680;
var MOPIDY_HOST = 'mopidy';

var utils = require('../shared/utils');
var logger = require('../shared/logger');
var Q = require('q');
var Mopidy = require('mopidy');

// enriched queue to keep in sync with mopidy server
var queue = [];

// mopidy server status
var moppy = { // FIXME: dummy for now
    isConnected: false,
    currentPlaylist: 0,
    currentTrack: {
        name: '',
        playtime: '',
        cursor: ''
    },
    queue: []
};

var mopidy = new Mopidy({
    webSocketUrl: 'ws://' + MOPIDY_HOST + ':' + MOPIDY_PORT + '/mopidy/ws/',
    callingConvention: 'by-position-or-by-name'
});

// Mopidy event handlers
//mopidy.on(console.log.bind(console));
mopidy.on("state:online", function() {
    moppy.isConnected = true;
    logger.info('Mopidy server connected');
});

var mopidyManager = {
    getActivePlaylist: function() {
        var deferred = Q.defer();
        mopidy.playlists.getPlaylists()
            .fold(utils.get, moppy.currentPlaylist)
            .then(function(playlist) {
                deferred.resolve(playlist);
            });
        return deferred.promise;
    }
};

var queueManager = {
    getCurrentSong: function() {
        return 'Some Song Title';
    },

    queue: {
        push: function(track) {


        }
    }
};

module.exports = queueManager;