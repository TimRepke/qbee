'use strict';

var MOPIDY_PORT = 6680;
var MOPIDY_HOST = 'mopidy';
var QBEE_LIST_NAME = 'QBeeList';

var utils = require('../shared/utils');
var logger = require('../shared/logger');
var uuid = require('node-uuid');
var Q = require('q');
var Mopidy = require('mopidy');

/**
 * enriched queue to keep in sync with mopidy server
 * convention: each entry contains
 *  - a public uuid,
 *  - the mopidy tlid,
 *  - vote (initial = 0),
 *  - voters (array of identifiers of people who voted for it)
 *  - and details from mopidy in data
 *  - every upvote: move up
 *  - every downvote: move down
 *  - if vote > 6 : next to play
 *  - if vote < -6: remove
 */
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

mopidy.on('event:tracklistChanged', function(){
    mopidy.playback.play();
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

    getTrackPos: function (uuid) {
        for (var run = 0; run < queue.length; run++) {
            if (queue[run].uuid === uuid) return run;
        }
        return -1;
    },
    push: function (track) {
        var deferred = Q.defer();
        if (track.uri) {
            // TODO: upvote instead of add if already there
            mopidy.tracklist.add({
                uri: track.uri
            }).then(function (result) {
                if (result.length > 0) {
                    logger.info('added track via uri: ' + track.uri);
                    var uid = uuid.v4();
                    queue.push({
                        uuid: uid,
                        tlid: result[0].tlid,
                        vote: 0,
                        voters: [],
                        data: result[0]
                    });
                    result.uuid = uid;
                    deferred.resolve(result);
                } else {
                    logger.warn('adding track failed with uri ' + track.uri);
                    deferred.reject('adding track failed with uri ' + track.uri);
                }
            });
        }
        return deferred.promise;
    },
    remove: function (pos) {
        if (pos < 0 || pos > queue.length) return false;
        var removed = queue.splice(pos, 1)[0];
        mopidy.tracklist.remove({
            tlid: [removed.tlid]
        });
        return true;
    },
    moveToPos: function (to, from) {
        if (from < 0 || from >= queue.length) return false;
        if (to < 0) to = 0;
        if (to > queue.length) return false;
        queue.splice(to, 0, queue.splice(from, 1)[0]);
        mopidy.tracklist.move({
            start: from,
            end: from+1,
            to_position: to
        });
        return true;
    },

    /**
     *
     * @param params {trackUUID, userUUID, [up: true], [down: true]}
     */
    vote: function (params) {
        var trackPos = queueManager.getTrackPos(params.trackUUID);

        // track not found
        if (trackPos < 0) return false;

        var track = queue[trackPos];

        // already voted
        if (track.voters.indexOf(userUUID) >= 0) return false;

        if (params.up) {
            track.vote++;
            queueManager.moveToPos((track.vote > 6) ? 0 : (trackPos - 1), trackPos);
        } else if (params.down) {
            track.vote--;
            if (track.vote < -6)
                queueManager.remove(trackPos);
            else
                queueManager.moveToPos((trackPos + 1), trackPos);
        } else {
            return false;
        }
        return true;
    },

    debug: function (conf) {
        return mopidyManager.getPlaylist();
    }
};

module.exports = queueManager;