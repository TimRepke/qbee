var logger = require('../shared/logger');

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
            data: 'data:' + JSON.stringify(payload) + '\n\n'
        };
    } catch (e) {
        logger.error(e.message);
        return null;
    }
}

module.exports = {
    addClient: function (connection) {
        openConnections.push(connection);
        logger.log('opened new connection; now open: ' + openConnections.length);
    },
    removeClient: function (connection) {
        var toRemove;
        for (var j = 0; j < openConnections.length; j++) {
            if (openConnections[j] == connection) {
                toRemove = j;
                break;
            }
        }
        openConnections.splice(j, 1);
        logger.log('closed connection; still open: ' + openConnections.length);
    },
    broadcastJSON: function (payload) {
        var preparedResponse = prepareResponse(payload);
        if (preparedResponse) {
            openConnections.forEach(function (resp) {
                resp.write(preparedResponse.id);
                resp.write(preparedResponse.data);
            });
        }
        logger.debug('broadcasted message to ' + openConnections.length + ' clients');
    }
};