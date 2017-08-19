'use strict';

var fs        = require('fs');
var path      = require('path');
var basename  = path.basename(module.filename);
var controllers={};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== basename);
    })
    .forEach(function(file) {
        if (file.slice(-13) !== 'controller.js') return;
        var controller = require(path.join(__dirname, file));
        var name = file.charAt(0).toUpperCase()+file.substr(1,file.length-14)+'Controller';
        console.log(name);
        controllers[name]=controller;
    });

module.exports=controllers;
