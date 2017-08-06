var shared = require('./milight.shared.js');
var Milight = require('node-milight-promise').MilightController;
var commands = require('node-milight-promise').commands2;

module.exports = function(params) {
    var arr = params.deviceType.identifier.split(':');
    var bridgeId = arr[0];
    var zone = arr[1];

    if(!shared.bridges[bridgeId])
        return Promise.reject(new Error(`Bridge id n°${bridgeId} not found`));

    var light = new Milight({
        ip: shared.bridges[bridgeId],
        delayBetweenCommands: 75,
        commandRepeat: 2
    });
    if(zone === '*') {
        switch(params.deviceType.type){
            case 'binary':
                if(params.state.value === 1){
                    light.commandsV6.sendCommands(light.commandsV6.bridge.on());
                } else {
                    light.commandsV6.sendCommands(light.commandsV6.bridge.off());
                }
            break;
            case 'brightness':
                light.commandsV6.sendCommands(light.commandsV6.bridge.on());
                light.commandsV6.sendCommands(light.commandsV6.bridge.brightness(params.state.value));
            break;

            case 'hue':
                light.commandsV6.sendCommands(light.commandsV6.bridge.on());
                light.commandsV6.sendCommands(light.commandsV6.bridge.hue(params.state.value));
            break;
        }
    } else {
        switch(params.deviceType.type){
            case 'binary':
                if(params.state.value === 1){
                    light.sendCommands(commands.rgbw.on(zone));
                } else {
                    light.sendCommands(commands.rgbw.off(zone));
                }
            break;

            case 'brightness':
                light.sendCommands(commands.rgbw.on(zone));
                light.sendCommands(commands.rgbw.brightness(params.state.value));
            break;

            case 'hue':
                light.sendCommands(commands.rgbw.on(zone));
                light.sendCommands(commands.rgbw.hue(params.state.value));
            break;
        }
    }


    light.pause(1000);

    return light.close();
};
