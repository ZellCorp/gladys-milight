var shared = require('./milight.shared.js');
var Milight = require('node-milight-promise');
var commands = Milight.commandsV6;

module.exports = function(params) {
    var light = new Milight.MilightController({
        ip: "192.168.0.10",
        type: 'v6'
      });
        switch(params.deviceType.type){
            case 'binary':
                if(params.state.value === 1){
                    light.sendCommands(commands.bridge.on());
                } else {
                    light.sendCommands(commands.bridge.off());
                } 
            break;

            case 'brightness':
                light.sendCommands(commands.bridge.on());
                light.sendCommands(commands.bridge.brightness(params.state.value));
            break;

            case 'hue':
                light.sendCommands(commands.bridge.on());
                light.sendCommands(commands.bridge.hue(params.state.value));
            break;
    }
    light.pause(1000);

    return light.close();
};
