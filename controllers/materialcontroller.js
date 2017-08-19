'use strict';
var _ = require("lodash");

var {Materials} = require('../models');

var MaterialController = {
    get:() => {
        return new Promise((resolve,reject) => {
            Materials.findAll({
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
            Materials.create({
                category:category,
                subcategory:subcategory
            }).then((menu) => {
                resolve(menu);
            }).catch((err)=>{
                reject("menu not added");
            })
        })
    },
    find:(options) => {
        return new Promise((resolve,reject) => {
            Manfactures.findOne({
                where:{
                    name:name,
                    model:model,
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
                        p[k] = MaterialController._parseAndClean(v);
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
        return JSON.stringify(MaterialController._parseAndClean(obj));  
    }

}

module.exports = MaterialController;