'use strict';
var _ = require("lodash");


var {Products, Menus, Catalogs, OrderItems, Orders, Ratings, Reviews, Recommendatations, Inventories, ProductImages} = require('../models');

var ProductController = {
    /* PRIVATE FUNCTIONS */
    _mapColumn:(data)=>{
        var prod={
            isdeleted: false
        };
        if(_.isObject(data)){
            _.map(data,(value,key)=>{
                switch(key){
                    case 'id':
                        prod.id=value;
                    break;
                    case 'name':
                        prod.name=value;
                    break;
                    case 'category':
                        prod.category = value;
                    break;
                    case 'subcategory':
                        prod.subcategory = value;
                    break;
                    case 'isdeleted':
                        prod.isdeleted = value;
                    break;
                    case 'issale':
                        prod.issale = value;
                    break;
                    case 'isbestseller':
                        prod.isbestseller = value;
                    break;
                    case 'isdeal':
                        prod.isdeal = value;
                    break;
                    case 'ishot':
                        prod.ishot = value;
                    break;
                    case 'sku':
                        prod.sku = value;
                    break;
                    case 'isfeatured':
                        prod.isfeatured = value;
                    break;
                    case 'isnew':
                        prod.isnew = value;
                    break;
                    case 'gender':
                        prod.gender = value;
                    break;
                    case 'agegroup':
                        prod.agegroup = value;
                    break;
                    case 'manufacturename':
                        prod.manufacturename = value;
                    break;
                    case 'modelno':
                        prod.modelno = value;
                    break;
                    case 'materialtype':
                        prod.materialtype = value;
                    break;
                    case 'shortdesc':
                        prod.shortdesc = value;
                    break;
                    case 'longdesc':
                        prod.longdesc = value;
                    break;
                    case 'VendorId':
                        prod.VendorId = value;
                    break;          
                }
            });
            return prod;
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
                        p[k] = ProductController._parseAndClean(v);
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
            var newprod=ProductController._mapColumn(data);
            if(newprod){
                Products.create(newprod).then((product)=>{
                    resolve(product);
                }).catch((err)=>{
                    reject(err);
                });
            }
        })
    },

    update:(id,data) => {
        return new Promise((resolve,reject)=>{
            var newprod=ProductController._mapColumn(data);
            if(newprod){
                delete newprod.id;
                Products.update(newprod,{where:{id:id}}).then((product)=>{
                    resolve(product);
                }).catch((err)=>{
                    reject(err);
                });
            }
        })
    },    

    /* RETRIEVE */
    get:(options) => {
        return new Promise((resolve,reject)=>{
            var prodwhr = ProductController._mapColumn(options);
            var includes=[]
            if(!prodwhr){
                prodwhr = {
                    isdeleted: false 
                }
            }

            if(_.isObject(options)){
                _.map(options,(value,key)=>{
                    switch(key){
                        // case 'id':
                        //     prodwhr.id=value;
                        // break;
                        // case 'category':
                        //     prodwhr.category = value;
                        // break;
                        // case 'subcategory':
                        //     prodwhr.subcategory = value;
                        // break;
                        // case 'isdeleted':
                        //     prodwhr.isdeleted = value;
                        // break;
                        // case 'isfeatured':
                        //     prodwhr.isfeatured = value;
                        // break;
                        // case 'isnew':
                        //     prodwhr.isnew = value;
                        // break;
                        // case 'gender':
                        //     prodwhr.gender = value;
                        // break;
                        // case 'agegroup':
                        //     prodwhr.agegroup = value;
                        // break;
                        // case 'manufacturename':
                        //     prodwhr.manufacturename = value;
                        // break;
                        // case 'modelno':
                        //     prodwhr.modelno = value;
                        // break;
                        // case 'materialtype':
                        //     prodwhr.materialtype = value;
                        // break;
                        // case 'category':
                        //     prodwhr.category = value;
                        // break;
                        // case 'subcategory':
                        //     prodwhr.subcategory = value;
                        // break;
                        // case 'VendorId':
                        //     prodwhr.VendorId = value;
                        // break;                        
                        case 'include':
                            _.map(value,(v,m)=>{
                                    switch(v){
                                        case 'inventory':
                                        includes.push({
                                            model:Inventories,
                                            include:[{
                                                model:ProductImages
                                            }]
                                        });
                                    break;
                                        case 'productimages':
                                            includes.push({
                                                model:ProductImages
                                            });
                                        break;
                                        case 'catalogs':
                                            includes.push({
                                                model:Catalogs, attribute:["type","data","description"]
                                            });
                                        break;
                                        case 'ratings':
                                            includes.push({
                                                model:Ratings, attribute:["star1","star2","star3","star4","star5"]
                                            });
                                        break; 
                                        case 'reviews':
                                            includes.push({
                                                model:Reviews, attribute:["id","data","customer"]
                                            });
                                        break;
                                        case 'recommendations':
                                            var rincludes=[{
                                                model:Menus, attribute:["category","subcategory"]
                                            }];
                                            _.map(v,(rv,rk)=>{
                                                if(rv){
                                                    switch(rk){
                                                        case 'catalogs':
                                                            rincludes.push({
                                                                model:Catalogs, attribute:["type","data","description"]
                                                            });
                                                        break;
                                                        case 'ratings':
                                                            rincludes.push({
                                                                model:Ratings, attribute:["star1","star2","star3","star4","star5"]
                                                            });
                                                        break; 
                                                        case 'reviews':
                                                            rincludes.push({
                                                                model:Reviews, attribute:["id","data","customer"]
                                                            });
                                                        break;
                                                    }                                                    
                                                }
                                            });
                                            includes.push({
                                                model:Products, 
                                                attribute:["id","name"],
                                                as:"ProductRecommendations",
                                                include:rincludes
                                            });                                                                                      
                                        break;                                                                                                                    
                                    }
                                });
                        break;
                    }
                })
            }
            return Products.findAll({
                include:includes
                ,where:prodwhr
            }).then((products)=>{
                resolve(products)
            }).catch((err)=>{
                console.log(err);
                reject(err);
            })
        })
    }, 

    'getCategories':(VendorId) => {
        return new Promise((resolve,reject)=>{
            return Products.getCategories(VendorId).then((categories)=>{
                resolve(categories)
            }).catch((err)=>{
                reject(err);
            })
        });        
    },

    'getProducts':(where) => {
        return new Promise((resolve,reject)=>{
            var sql=`
            select distinct
            "Products"."id","Products"."name","Products"."category","Products"."subcategory","Products"."agegroup" ,"Products"."gender",
            ("Ratings"."star1"+"Ratings"."star1"+"Ratings"."star2"+"Ratings"."star3"+"Ratings"."star4"+"Ratings"."star5")/5 as "star",
            "Products"."sku" as "sku",
            "Products"."isfeatured" as "isfeatured",
            "Products"."isnew" as "isnew",
            "Products"."isdeal" as "isdeal",
            "Products"."issale" as "issale",
            "Products"."isbestseller" as "isbestseller",
            min("Inventories"."unitprice") over (partition by "Inventories"."ProductId")  as "unitprice",
            min("Inventories"."discount") over (partition by "Inventories"."ProductId") as "discount",
            max("Products.ProductImages"."path") over (partition by "Products.ProductImages"."ProductId") as "imagepath",
            max("Products.ProductImages"."sm") over (partition by "Products.ProductImages"."ProductId") as "sm",
            max("Products.ProductImages"."md") over (partition by "Products.ProductImages"."ProductId") as "md",
            max("Products.ProductImages"."xl") over (partition by "Products.ProductImages"."ProductId") as "xl",
            max("Products.ProductImages"."lg") over (partition by "Products.ProductImages"."ProductId") as "lg",
            max("Products.ProductImages"."xxl") over (partition by "Products.ProductImages"."ProductId") as "xxl"
        from "Products" 
        left join "Ratings" as "Ratings" on "Products"."id" = "Ratings"."ProductId"
        left join "Inventories" as "Inventories" on "Products"."id" = "Inventories"."ProductId"
        left join "ProductImages" as "Products.ProductImages" on  "Products.ProductImages"."ProductId" = "Products"."id"
        where "Products"."isdeleted" = false and "Products"."sku" is not null and "Inventories"."size" is not null and ("Inventories"."instock"-"Inventories"."reserved")>0
            `

            sql = sql +" and "+where;
            
            return Products.query(sql).then((products)=>{
                resolve(products)
            }).catch((err)=>{
                reject(err);
            })
        });        
    },


    /* HELPER FUNCTIONS */

    getJSONDocument:(product) => {
        var obj = JSON.parse(JSON.stringify(product));
        return JSON.stringify(ProductController._parseAndClean(obj));  
    }
}

module.exports = ProductController;