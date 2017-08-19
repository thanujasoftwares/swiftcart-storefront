'use strict';
var _ = require("lodash");

var {Manfactures} = require('../models');

var ManfactureController = {
    get:() => {
        return new Promise((resolve,reject) => {
            Manfactures.findAll({
                where:{
                    isdeleted: false
                }
            }).then((menus) => {
                resolve(menus);
            }).catch((err) => {
                reject("menu not found");
            })
        });
    },
    create: (category,subcategory) => {
        return new Promise((resolve,rejext)=>{
            Manfactures.create({
                category:category,
                subcategory:subcategory
            }).then((menu) => {
                resolve(menu);
            }).catch((err)=>{
                reject("menu not added");
            })
        })
    },
    find:() => {
        return new Promise((resolve,reject) => {
            Manfactures.findOne({
                where:{
                    isdeleted: false
                }
            }).then((m) => {
                resolve(m);
            }).catch((err) => {
                reject("menu not found");
            })
        });
    },
    _parseAndClean:(p) => {
        var isdeleted = false;
         _.map(p,(v,k)=>{
            switch(k){
                case 'isdeleted':
                    if(v){
                        isdeleted=true;
                    }
                    delete p[k]
                    
                break;
                case 'createdAt':
                case 'updatedAt':
                    delete p[k]
                default:
                    if(_.isObject(v)){
                        p[k] = ManfactureController._parseAndClean(v);
                    }
            }
        });
        if(isdeleted){
            return null;
        }else{
            return p;
        }
    },

    getJSONDocument:(menuitems) => {
        var obj = JSON.parse(JSON.stringify(menuitems));
        return JSON.stringify(ManfactureController._parseAndClean(obj));  
    }

}

module.exports = ManfactureController;