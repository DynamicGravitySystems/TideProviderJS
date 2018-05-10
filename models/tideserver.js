const debug = require('debug')('tideprovider:consumer');
const Consumer = require('sqs-consumer');
const fsp = require('./fsprovider');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

const url = process.env.SQS_URL;

function consume(handler){
    const consumer = Consumer.create({
        queueUrl: url,
        messageAttributeNames: [
            'Latitude',
            'Longitude',
            'Altitude'
        ],
        sqs: new AWS.SQS(),
        handleMessage: handler,
        batchSize: 10,
    });
    consumer.start();
    return consumer;
}

module.exports = function(server){
    const io = require('socket.io')(server);
    const stream = io.of('/tide');

    const total_correction = [];
    const tc_limit = 3600;

    let lat = 0;
    let lon = 0;
    let alt = 0;

    fsp.load().then((data) => {
        data.forEach((item, idx) => {
            total_correction.push(item);
        });
        debug("loaded cache from file, cache length: " + total_correction.length);
    }).catch((err) => {
        debug("Error loading cache from file: " + err);
    });

    debug("Listening for client connections");
    stream.on('connection', (client) => {
        debug("Client connected id:", client.id);
        client.on('getcache', (count) => {
            debug("Client requested cache.");
            if (total_correction.length < 1){
                return;
            }
            let len = count || tc_limit;
            client.emit('cache', total_correction.slice(-len));
        });
        client.on('getloc', () => {
            debug("Client requested location.");
            client.emit('location', {latitude: lat, longitude: lon, altitude: alt});
        })
    });

    consume((message, done) => {
        lat = parseFloat(message.MessageAttributes.Latitude.StringValue);
        lon = parseFloat(message.MessageAttributes.Longitude.StringValue);
        alt = parseFloat(message.MessageAttributes.Altitude.StringValue);

        let packet;
        try {
            let body = JSON.parse(message.Body);
            packet = {g0: body.total, ts: body.utctime * 1000};
            debug(packet);
        } catch(e) {
            debug("Exception parsing JSON: "+ e);
            packet = {g0: 0, ts: Date.now()};
        }

        total_correction.push(packet);
        if (total_correction.length > tc_limit){
            total_correction.shift();
        }
        stream.emit('tc', packet);
        done();
        fsp.save(total_correction);
    })
};
