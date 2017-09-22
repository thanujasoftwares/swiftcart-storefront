'use strict';
var _ = require("lodash");
 
var {Products, Menus, Catalogs, OrderItems, Orders, Ratings, Reviews, Recommendatations, Inventories} = require('../models');

var InventoryController = {
    /* PRIVATE FUNCTIONS */
    _mapColumn:(data)=>{
        var obj={
            isdeleted: false
        };
        if(_.isObject(data)){
            _.map(data,(value,key)=>{
                switch(key){
                    case 'id':
                        obj.id=value;
                    break;
                    case 'productid':
                        obj.ProductId=value;
                    break;
                    // case 'isfeatured':
                    //     obj.isfeatured = value;
                    // break;
                    // case 'isnew':
                    //     obj.isnew = value;
                    // break;
                    // case 'issale':
                    //     obj.issale = value;
                    // break;
                    // case 'isbestseller':
                    //     obj.isbestseller = value;
                    // break;
                    // case 'isdeal':
                    //     obj.isdeal = value;
                    // break;
                    // case 'ishot':
                    //     obj.ishot = value;
                    // break;
                    
                    // case 'sku':
                    //     obj.sku = value;
                    // break;
                    case 'unitprice':
                        obj.unitprice = parseFloat(value);
                    break;
                    case 'discount':
                        obj.discount = parseFloat(value);
                    break;
                    case 'color':
                        obj.color = value;
                    break;
                    case 'instock':
                        obj.instock = parseFloat(value);
                    break;
                    case 'ordered':
                        obj.ordered = parseFloat(value);
                    break;
                    case 'reserved':
                        obj.reserved = parseFloat(value);
                    break;
                    case 'size':
                        obj.size = value;
                    break;
                    case 'isdeleted':
                        obj.isdeleted = value;
                    break;
                }
            });
            return obj;
        }
        return null;
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
                        p[k] = InventoryController._parseAndClean(v);
                    }
            }
        });
        if(isdeleted){
            return null;
        }else{
            return p;
        }
    },    

    /* CREATE */
    create:(data) => {
        return new Promise((resolve,reject)=>{
            var newinv=InventoryController._mapColumn(data);
            if(newinv){
                delete newinv['id']
                newinv['productid'] = newinv['productid'] || undefined;
                newinv['size'] = newinv['size'] || undefined;
                newinv['unitprice'] = newinv['unitprice'] || undefined;
                newinv['discount'] = newinv['discount'] || undefined;
                newinv['instock'] = newinv['instock'] || undefined;
                newinv['reserved'] = newinv['reserved'] || undefined;

                Inventories.create(newinv).then((invuct)=>{
                    resolve(invuct);
                }).catch((err)=>{
                    reject(err);
                });
            }
        })
    },

    update:(id,data) => {
        return new Promise((resolve,reject)=>{
            var newinv=InventoryController._mapColumn(data);
            if(newinv){
                delete newinv.id;
                Inventories.update(newinv,{where:{id:id}}).then((invuct)=>{
                    resolve(invuct);
                }).catch((err)=>{
                    reject(err);
                });
            }
        })
    },    

    delete:(productid,id) => {
        return new Promise((resolve,reject)=>{
            Inventories.findOne({where:{id:id,ProductId:productid}}).then((inv)=>{
                inv.destroy().then(function(){
                    resolve("deleted");
                })
            }).catch((err)=>{
                reject(err);
            });
        })
    },

    /* RETRIEVE */
    get:(options) => {
        return new Promise((resolve,reject)=>{
            var invwhr = InventoryController._mapColumn(options);
            var includes=[]
            if(!invwhr){
                invwhr = {
                    isdeleted: false 
                }
            }
            return Inventories.findAll({
                include:includes
                ,where:invwhr
            }).then((invucts)=>{
                resolve(invucts)
            }).catch((err)=>{
                console.log(err);
                reject(err);
            })
        })
    },

    // check: (inventories) => {
    //     _.map(inventories,(inventory,index) =>{
    //         rc.get("inv:"+inventory.id,function(err,value){
    //             if(value==null){
    //                 rc.set("inv:"+inventory.id,(inventory.instock - inventory.reserved));
    //             }else{
    //                 inventories[index][instock] = value;
    //             }
    //         })
    //     });
    // },

    /* HELPER FUNCTIONS */

    getJSONDocument:(invuct) => {
        var obj = JSON.parse(JSON.stringify(invuct));
        return JSON.stringify(InventoryController._parseAndClean(obj));  
    }
}

module.exports = InventoryController;