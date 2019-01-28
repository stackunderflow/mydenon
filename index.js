/*
//  myDenon.c
//  
//
//  Created by stackunderflow on 26/01/2019.
*/

var net = require("net");
var Accessory, Service, Characteristic, UUIDGen;

module.exports = function (homebridge) {

    console.log("homebridge API version: " + homebridge.version);
    
    // Accessory must be created from PlatformAccessory Constructor
    Accessory = homebridge.platformAccessory;
    
    // Service and Characteristic are from hap-nodejs
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    UUIDGen = homebridge.hap.uuid;
    
    homebridge.registerAccessory("speaker-plugin", "MyDenonSpeaker", myDenon);
}

// myDenon
function myDenon(log, config, api) {

    this.log = log;
    this.name = config['name'];
    this.ip = config['ip'];
    this.zone = config['zone'];
    this.input = config['input'];
    
    this.log("about to check api");
    
    if (api) {

        this.log("api is non-null");

        // Save the API object as plugin needs to register new accessory via this object
        this.api = api;

        // Listen to event "didFinishLaunching", this means homebridge already finished loading cached accessories.
        // Platform Plugin should only register new accessory that doesn't exist in homebridge after this event.
        // Or start discover new accessories.
        this.api.on('didFinishLaunching', function() {
          this.log("Did finish launching");
        
       })
    }
}

myDenon.prototype = {
		
	// configureAccessory
	configureAccessory: function (callback) {
		this.log("configureAccessory called!");	
	},
	
	// identify
	identify: function (callback) {
	
		this.log("Identify requested!");
		callback(); // success
	},
	
	// GET SpeakerOnCharacteristic
	getSpeakerOnCharacteristic:  function (callback) {
	       
		this.log('getSpeakerOnCharacteristic');
	
		const me = this;                                                      
	                                                                              
	    var client = new net.Socket();                                        
	    client.connect(23, this.ip, function() {                              
	        this.log('Sending Z2?\n');                                     
	        client.write('Z2?\n');                                            
	    });                                                                   
	                                                                          
	                                                                          
	    client.on('data', function(data) {                                    
	        this.log('Received: ' + data);                                 
	        client.destroy(); // kill client after server's response          
	    });                                                                   
	                                                                          
	    client.on('close', function() {                                       
	        this.log('Connection closed');                                 
	    });                                                                   
	                                                                          
	    callback(null);            
	},
	
	// SET SpeakerON                                                          
	setSpeakerOnCharacteristic:  function (state, callback) {                         
	
	    this.log('setSpeakerOnCharacteristic');                             
	
	    const me = this;                                                      
	                                                                          
	    // turn on specific zone                                              
	    var client = new net.Socket();                                        
	    client.connect(23, this.ip, function() {                              
	        this.log('on = ' + state);                                        
	        this.log('Sending Z2ON\n');                                    
	                                                                          
	        client.write('Z2ON\n');                                           
	        client.write('Z2NET\n');                                          
	    });                                                                   
	                                                                          
	    client.on('close', function() {                                       
	        this.log('Connection closed');                                 
	    });                            
		
		callback(null);                                       
	                                                                              
	},                                                   
	                                                                              
	// GET SpeakerVolume                                                      
	getSpeakerVolumeCharacteristic:  function (callback) {                         
	
	    this.log('getSpeakerVolumeCharacteristic');                             
	    const me = this;                                                      
	                                                                                
		callback(null);                                                               
	},                                                              
	                                                                    
	// SET SpeakerVolume                                            
	setSpeakerVolumeCharacteristic: function (state, callback) {           
	        
		this.log('setSpeakerVolumeCharacteristic');                             
	
		const me = this;                                            
	                                                                    
	    // turn on specific zone                                    
	    var client = new net.Socket();                              
	    client.connect(23, this.ip, function() {                    
	        this.log('on = ' + state);                              
	        this.log('Sending Z2ON\n');                          
	                                                                
	        client.write('Z2ON\n');                                 
	        client.write('Z2NET\n');                                
	    });                                                         
	                                                                
	    client.on('close', function() {                             
	        this.log('Connection closed');                       
	    });                                                         
	 	callback(null);                                                               
	},                                
	
	// GET SpeakerMute                                                        
	getSpeakerMuteCharacteristic: function (callback) {                           
	
	    this.log('getSpeakerMuteCharacteristic');                             
	    const me = this;                                                   
	                                                                       
	    var client = new net.Socket();                                         
	    client.connect(23, this.ip, function() {                               
	        this.log('Sending Z2MU?\n');                                
	        client.write('Z2MU?\n');                                       
	    });                                                                
	                                                                       
	                                                                       
	    client.on('data', function(data) {                                     
	        this.log('Received: ' + data);                                  
	        client.destroy(); // kill client after server's response           
	    });                                                                    
	                                                                           
	    client.on('close', function() {                                        
	        this.log('Connection closed');                                  
	    });                                                                    
	    callback(null);                                                                       
	},                                                                         
	                                                                               
	// SET SpeakerMute                                                         
	setSpeakerMuteCharacteristic: function (state, callback) {                        
	
	    this.log('setSpeakerMuteCharacteristic');                             
	    const me = this;                                                       
	                                                                           
	    // turn on specific zone                                               
	    var client = new net.Socket();                                         
	    client.connect(23, this.ip, function() {                               
	        this.log('on = ' + state);                                         
	        this.log('Sending Z2MUON\n');                                   
	                                                                           
	        client.write('Z2MUON\n');                                          
	    });                                                                    
	                                                                           
	    client.on('close', function() {                                        
	        this.log('Connection closed');                                  
	    });                                                                    
	 	callback(null);                                                                          
	},                               
	
	// getServices
	getServices: function() {                                   
	
	    speakerService = new Service.Speaker(this.name);                       
	                                                                           
	    speakerService.getCharacteristic(Characteristic.Mute)                  
	    .on('get', this.getSpeakerMuteCharacteristic.bind(this))               
	    .on('set', this.setSpeakerMuteCharacteristic.bind(this));              
	                                                                           
	                                                                           
	    this.log("add Characteristic Volume...");                              
	    speakerService.addCharacteristic(new Characteristic.Volume())          
	    .on('get', this.getSpeakerVolumeCharacteristic.bind(this))             
	    .on('set', this.setSpeakerVolumeCharacteristic.bind(this));            
	                                                                           
	    this.log("add Characteristic On...");                                  
	    speakerService.addCharacteristic(new Characteristic.On())              
	    .on('get', this.getSpeakerOnCharacteristic.bind(this))                 
	    .on('set', this.setSpeakerOnCharacteristic.bind(this));                
	  
		const informationService = new Service.AccessoryInformation();
	
	    informationService
	    .setCharacteristic(Characteristic.Manufacturer, "Denon")
	    .setCharacteristic(Characteristic.Model, "AVR Speaker")
	    .setCharacteristic(Characteristic.SerialNumber, "SP01")
	    .setCharacteristic(Characteristic.FirmwareRevision, "1.0");                                                                             
	  
	  	this.speakerService = speakerService;                                  
	  	this.informationService = informationService
	
	    this.log('getServices');  
	  	
	    return [informationService, speakerService];                                               
	},  
};
   


