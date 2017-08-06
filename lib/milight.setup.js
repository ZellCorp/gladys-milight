var milight = require('node-milight-promise');
var Promise = require('bluebird');
var init = require('./milight.init.js');

module.exports = function() {
    console.log("run setup");
    return milight.discoverBridges({
     type : 'v6'
    })
        .then((bridges) => {
          console.log("bridges");
            // foreach bridge, we create a device bridge
            return Promise.map(bridges, function(bridge) {
                return gladys.device.create({
                    device: {
                        name: 'Milight bridge',
                        protocol: 'wifi',
                        service: 'milight',
                        identifier: bridge.ip
                    },
                    types: []
                });
            });
        })
        .then(() => {
            console.log("before return init");

            // we init the bridge cache
            return init();
        });
};
