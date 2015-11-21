var logger = require('../shared/logger');
var utils  = require('../shared/utils');
var uuid = require('node-uuid');

var openConnections = [];

/**
 *
 * @param payload
 * @returns {{id: string, data: string}} or null on error
 */
function prepareResponse(payload) {
    try {
        var d = new Date();
        return {
            id: 'id: ' + d.getMilliseconds() + '\n',
            payload: 'data:' + JSON.stringify(payload) + '\n\n'
        };
    } catch (e) {
        logger.error(e.message);
        return null;
    }
}

function sendPayload(socket, payload) {
    var prepared = prepareResponse(payload);
    socket.write(prepared.id);
    socket.write(prepared.data);
}
function sendPrepared(socket, prepared) {
    socket.write(prepared.id);
    socket.write(prepared.data);
}


module.exports = {
    addClient: function (connection) {
        var uuid = uuid.v4();
        openConnections.push({
            socket: connection,
            uuid: uuid
        });
        sendPayload(connection, {
            event: utils.events.CONNECTION_ESTABLISHED,
            data: {
                uuid: uuid
            }
        });
        logger.log('opened new connection; now open: ' + openConnections.length);
    },
    removeClient: function (connection) {
        var toRemove;
        for (var j = 0; j < openConnections.length; j++) {
            if (openConnections[j].socket == connection) {
                toRemove = j;
                break;
            }
        }
        openConnections.splice(j, 1);
        logger.log('closed connection; still open: ' + openConnections.length);
    },
    sendToUUID: function(uuid, event, payload) {
        for (var j = 0; j < openConnections.length; j++) {
            if (openConnections[j].uuid === uuid) {
                sendPayload(openConnections[j].socket, {
                    event: event,
                    data: payload
                });
                break;
            }
        }
    },
    sendToSocket: function(socket, event, payload) {
        sendPayload(socket, {
            event: event,
            data: payload
        });
    },
    broadcast: function (event, payload) {
        var preparedResponse = prepareResponse({
            event: event,
            data: payload
        });
        if (preparedResponse) {
            openConnections.forEach(function (resp) {
                sendPrepared(resp, preparedResponse);
            });
        }
        logger.debug('broadcasted event ' + event + ' to ' + openConnections.length + ' clients');
    }
};