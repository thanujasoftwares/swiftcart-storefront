'use strict';
var _ = require("lodash");

var {Menus} = require('../models');

var MenuController = {
    get:() => {
        return new Promise((resolve,reject) => {
            Menus.findAll({
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
            Menus.create({
                category:category,
                subcategory:subcategory
            }).then((menu) => {
                resolve(menu);
            }).catch((err)=>{
                reject("menu not added");
            })
        })
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
                        p[k] = MenuController._parseAndClean(v);
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
        return JSON.stringify(MenuController._parseAndClean(obj));  
    }

}

module.exports = MenuController;