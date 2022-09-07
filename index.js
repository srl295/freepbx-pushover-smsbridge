/**
 * Copyright (c) 2022 Code Hive Tx, LLC
 * SPDX-License-Identifier: Apache-2.0
 */

const http = require('http');
const Push = require('pushover-notifications');
const package = require('./package.json');
const config = require('./config.json');
const process = require('process');

console.log('Hello');

const port = config.port || 21439;
const host = config.host || '127.0.0.1';

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} ${req.socket.address().address} ${req.method} ${req.url}`);
    if (req.method !== 'POST') {
        res.writeHead(405);
        res.end(`${req.method} not allowed!\n`);
    } else {
        let data = "";
        req.on("data", (d) => data += d);
        req.on("end", () => {
            try {
                const o = JSON.parse(data);
                console.dir(o);
                res.writeHead(200, { "Content-Type": "text/plain" });
                // res.end(`You wrote: ${JSON.stringify(o)}\n`);

                const {to, from, adaptor, time, message, eventDirection} = o;

                if (eventDirection == 'in') {
                    let routing = config.routing[to];
                    if (!routing) {
                        routing = config.routing.default;
                        console.log('Using default routing');
                    }
                    if (!routing) {
                        console.error(`No routing for ${to} - default`);
                        routing = { user: config.PUSHOVER_USER };
                    }

                    const msg = {
                        title: `${from}»${to}`,
                        message: `${message}`,
                    };
                    const p = new Push( {
                        token:  config.PUSHOVER_TOKEN || process.env['PUSHOVER_TOKEN'],
                        user: routing.user,
                    });
                    console.dir({msg, user: routing.user});
                    // TODO: should ideally not do this inside of the request
                    p.send(msg, (err, result) => {
                        if(err) {
                            res.end("err");
                            throw err;
                        }
                        console.log(result);
                        res.end("ok");
                    })
                } else {
                    console.error('Skipping: ' + eventDirection);
                    res.end("ok");
                }
            } catch (e) {
                console.error(e);
                console.log(data);
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end(`Error deseralizing data\n`);
            }
        });
    }
});
server.listen(port, host, () => {
    console.log(`${package.name}: listening to http://${host}:${port}`);
});

