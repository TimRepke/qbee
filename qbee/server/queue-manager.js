'use strict';

var MOPIDY_PORT = 6680;
var MOPIDY_HOST = 'mopidy';
var QBEE_LIST_NAME = 'QBeeList';

var utils = require('../shared/utils');
var logger = require('../shared/logger');
var Q = require('q');
var Mopidy = require('mopidy');

// enriched queue to keep in sync with mopidy server
var queue = [];

// mopidy server status
var moppy = { // FIXME: dummy for now
    isConnected: false,
    assertConnection: function () {
        logger.trace('checking for connection to Mopidy');
        if (!moppy || !moppy.isConnected) {
            throw new Error('Mopidy Server not connected');
        }
        return true;
    },
    currentPlaylist: null,
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
mopidy.on("state:online", function () {
    moppy.isConnected = true;
    logger.info('Mopidy server connected');
});

var mopidyManager = {
    getPlaylist: function () {
        var deferred = Q.defer();
        logger.trace('getting active playlist');
        moppy.assertConnection();
        mopidy.playlists.getPlaylists().then(function (playlists) {
            logger.trace('num playlists: ' + playlists.length);
            if (playlists && playlists.length > 0 && moppy.currentPlaylist) {
                logger.trace('Playlist is there already');
                deferred.resolve(playlists[moppy.currentPlaylist]);
                return playlists[moppy.currentPlaylist];
            }
            if (playlists && playlists.length > 0) {
                logger.trace('playlists exist, try to find ' + QBEE_LIST_NAME);
                for (var i = 0; i < playlists.length; i++) {
                    if (playlists[i].name === QBEE_LIST_NAME) {
                        moppy.currentPlaylist = i;
                        logger.trace('found ' + QBEE_LIST_NAME + ' at ' + i);
                        deferred.resolve(playlists[moppy.currentPlaylist]);
                        return playlists[moppy.currentPlaylist];
                    }
                }
            }
            logger.trace('creating playlist');
            mopidy.playlists.create({name: QBEE_LIST_NAME}).then(function (playlist) {
                moppy.currentPlaylist = 0;
                deferred.resolve(playlist);
                return playlist;
            }).done();
        }).done();

        return deferred.promise;
    }
};

var queueManager = {
    getCurrentSong: function () {
        return 'Some Song Title';
    },

    queue: {
        push: function (track) {
            var deferred = Q.defer();
            if (track.uri) {
                mopidy.tracklist.add({
                    uri: track.uri
                }).then(function (result) {
                    if(result.length>0) {
                        logger.info('added track via uri: ' + track.uri);
                        deferred.resolve(result);
                    } else {
                        logger.warn('adding track failed with uri ' + track.uri);
                        deferred.reject('adding track failed with uri ' + track.uri);
                    }
                });
            }
            return deferred.promise;
        }
    },

    debug: function (conf) {
        return mopidyManager.getPlaylist();
    }
};

module.exports = queueManager;