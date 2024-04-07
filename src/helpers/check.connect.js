const mongoose = require('mongoose');
const _SECONDS = 5000;
const os = require('os');
const process = require('process');
//count connect
const countConnect =() => { 
    const numConnections = mongoose.connections.length;
    console.log(`Number of connections: ${numConnections}`);
}

// check overload
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus.length;
        const memoryUsage = process.memoryUsage().rss;

        // Example maximum number of connections based on number of cores
        const maxConnections = numCores * 10;

        console.log(`Active connections: ${numConnection}`)
        console.log(`Memory usage: ${memoryUsage/1024/1024} MB`)

        if(numConnection > maxConnections) {
            console.log(`Too many active connections, shutting down`)
            
        }

}, _SECONDS) // monitor ever 5 seconds
}
module.exports = {
    countConnect,
    checkOverload
}