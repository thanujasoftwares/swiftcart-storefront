'use strict';
var _ = require("lodash");

var {SiteAttributes} = require('../models');

var SiteAttributeController = {
    create:(values)=>{
        return new Promise((resolve,reject)=>{

            var options={
                key:undefined,
                value0:undefined,
                value1:undefined,
                value2:undefined,
                value3:undefined,
                value4:undefined,
                value5:undefined,
                value6:undefined,
                value7:undefined,
                value8:undefined,
                value9:undefined
            };
            _.map(values,(value,k)=>{
                switch(k){
                    case 'key':options['key']=value;break;
                    case 'value0':options['value0']=value;break;
                    case 'value1':options['value1']=value;break;
                    case 'value2':options['value2']=value;break;
                    case 'value3':options['value3']=value;break;
                    case 'value4':options['value4']=value;break;
                    case 'value5':options['value5']=value;break;
                    case 'value6':options['value6']=value;break;
                    case 'value7':options['value7']=value;break;
                    case 'value8':options['value8']=value;break;
                    case 'value9':options['value9']=value;break;
                }
            });
            SiteAttributes.create(options).then((siteattribute)=>{
                resolve(siteattribute);
            }).catch((err)=>{
                console.log(err);
                reject(err);
            })
        })
    },
    getAll:() => {
        return new Promise((resolve,reject) => {
            SiteAttributes.findAll({
                where:{
                    isdeleted: false
                }
            }).then((attributes) => {
                var siteattributes={}
                _.map(attributes,(attribute)=>{
                    if(_.isEmpty(siteattributes[attribute.key])){
                        siteattributes[attribute.key]=JSON.parse(JSON.stringify(attribute));
                    }else if(_.isArray(siteattributes[attribute.key])){
                        siteattributes[attribute.key].push(JSON.parse(JSON.stringify(attribute)));
                    }else {
                        var pValue=siteattributes[attribute.key]
                        siteattributes[attribute.key]=[];
                        siteattributes[attribute.key].push(pValue);
                        siteattributes[attribute.key].push(JSON.parse(JSON.stringify(attribute)));
                    }
                });
                siteattributes['color']={
                    'id':-1,
                    'key':'color',
                    'value0':'teal'
                };
                resolve(siteattributes);
            }).catch((err) => {
                reject("site attributes not found");
            })
        });
    },    
    get: (key) => {
        return new Promise((resolve,reject)=>{
            SiteAttributes.findOne({
                where:{
                    key: key,
                    isdeleted: false
                },
            }).then((siteattributes)=>{
                if(siteattributes){
                    resolve(siteattributes);
                }else{
                    reject("Site Attribute Not Found");
                }
            }).catch((err)=>{
                console.log(err);
                reject(err);
            })            
        })
    },
    update:(id, key, values)=>{
        return new Promise((resolve,reject)=>{

            var options={
                value0:undefined,
                value1:undefined,
                value2:undefined,
                value3:undefined,
                value4:undefined,
                value5:undefined,
                value6:undefined,
                value7:undefined,
                value8:undefined,
                value9:undefined
            };
            _.map(values,(value,key)=>{
                switch(key){
                    case 'value0':options['value0']=value;break;
                    case 'value1':options['value1']=value;break;
                    case 'value2':options['value2']=value;break;
                    case 'value3':options['value3']=value;break;
                    case 'value4':options['value4']=value;break;
                    case 'value5':options['value5']=value;break;
                    case 'value6':options['value6']=value;break;
                    case 'value7':options['value7']=value;break;
                    case 'value8':options['value8']=value;break;
                    case 'value9':options['value9']=value;break;
                }
            });
            SiteAttributes.update(options,{
                where:{
                    id:id,
                    key:key
                }
            }).then((siteattribute)=>{
                resolve(siteattribute);
            }).catch((err)=>{
                console.log(err);
                reject(err);
            })
        })
    },  
    delete:(id,key) => {
        SiteAttributes.update({
            isdeleted: true
        },{
            where:{
                id:id,
                key:key
            }
        }).then((siteattribute)=>{
            resolve(siteattribute);
        }).catch((err)=>{
            console.log(err);
            reject(err);
        })        
    }  
}

module.exports = SiteAttributeController;