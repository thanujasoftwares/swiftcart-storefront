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
                    case 'isactive':
                    prod.isactive = value;
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
    get:(options,isobject) => {
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
                if(products.length > 0){
                    resolve(products);
                }else{
                    reject("No product is found");
                }
            }).catch((err)=>{
                reject(err);
            })
        })
    }, 

    'getCategories':(VendorId) => {
        return new Promise((resolve,reject)=>{
            Products.getCategories(VendorId).then((menuitems)=>{
                // resolve(categories);
                var uniqCat = [];
                var uniqSub = [];
                var agegroup=['n','i','k','t','y','a','s'];
                var menu=[]
                _.map(agegroup,(age,index)=>{
                    var prevCat = "";
                    var prevCatInd=-1;
                    var nav=[];
                    _.map(menuitems,function(item,index){
                        item.agegroup=item.agegroup.trim();
                        if(item.agegroup==age){
                            uniqCat.push(item.category);
                            uniqSub.push(item.subcategory);
                            if(item.category != prevCat){
                                nav.push({category:item.category,subcategory:[]});
                                prevCatInd++;
                            }
                            nav[prevCatInd]['subcategory'].push(item.subcategory);
                        }
                    });

                    switch(age){
                        case 'n': age='NewBorn'; break;
                        case 'i': age='Infant'; break;
                        case 't': age='Teens'; break;
                        case 'k': age='Kids'; break;
                        case 'y': age='Young'; break;
                        case 'a': age='Adult'; break;
                        case 's': age='Seniors'; break;
                    }
                    menu.push({
                        'group':age,
                        'groupitems':nav
                    });
                });

                var fabric=['cotton','silk','linen','wool','leather','ramie','hemp','jute','acetate','chiffon','acrylic','organza',
                'lastex','nylon','velvet','polyester','taffeta','denim','rayon','spandex','georgette','viscose','grey fabric',
                'polypropylene','satin','industrial','fiberglass','filter','carbon','vinyl','plain','blended','crewel','kashmir',
                'stretch','reflective','quilted','polyethylene','narrow','laminated','flocked','fire resistant','water resistant','corduroy',
                'velvet','egyptian cotton','knit','memory foam','microfiber','fleece','micro fleece','polyester','stretch','spandex'
                ];
                            

                uniqCat = _.uniq(uniqCat);
                uniqSub = _.uniq(uniqSub);
                // success = myCache.set("navigation", {
                //     categories: uniqCat,
                //     subcategories:uniqSub,
                //     menu:menu
                // }, 10000 );
                resolve({
                    categories: uniqCat,
                    subcategories:uniqSub,
                    menu:menu,
                    fabric:fabric,
                    age:{
                        'n':'NewBorn',
                        'i':'Infant',
                        't':'Teens',
                        'k':'Kids',
                        'y':'Young',
                        'a':'Adult',
                        's':'Seniors'
                    }
                });
            })
            .catch((err)=>{
                console.log("Error while storing navigation");
                console.log(err);
                reject("system error");
            }); 
            // try{
            //     var menu = myCache.get( "navigation", true ); 
            //     resolve(menu);       
            // }catch(err){
            // }                
            // }).catch((err)=>{
            //     reject(err);
            // })
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
            ("Inventories"."instock"-"Inventories"."reserved") as "instock",
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
        where "Products"."isdeleted" = false and "Products"."sku" is not null 
            `

            sql = sql +" and "+where;
            
            return Products.query(sql).then((products)=>{
                resolve(products)
            }).catch((err)=>{
                reject(err);
            })
        });        
    },

    deleteProdutImage:(productid,imageid) => {
        return new Promise((resolve,reject)=>{
            ProductImages.findOne({
                where:{
                    id:imageid,
                    ProductId:productid
                }
            }).then((img)=>{
                img.destroy({force:true});
                resolve(img);
            }).catch((err)=>{
                console.log(err)
                reject("Image not deleted");
            })
        });
    },


    /* HELPER FUNCTIONS */

    getJSONDocument:(product) => {
        var obj = JSON.parse(JSON.stringify(product));
        return JSON.stringify(ProductController._parseAndClean(obj));  
    },

    /**
     * This helper function prepare Product Object ready to display on webpage
     */
    prepareForNavigation:(obj)=>{
        var products = JSON.parse(JSON.stringify(obj));
        _.map(products,function(product,index){
            product.agegroup=product.agegroup.trim();
            switch(product.agegroup){
                case 'n': products[index]['agegrouptitle']='Newborn'; break;
                case 'i': products[index]['agegrouptitle']='Infant'; break;
                case 'k': products[index]['agegrouptitle']='Kids'; break;
                case 't': products[index]['agegrouptitle']='Teens'; break;
                case 'y': products[index]['agegrouptitle']='Young'; break;
                case 'a': products[index]['agegrouptitle']='Adult'; break;
                case 's': products[index]['agegrouptitle']='Seniors'; break;
            }
            products[index]['agegroup']=product.agegroup;
            switch(product.gender){
                case 'f': products[index]['gendergroup']='female'; break;
                case 'u': products[index]['gendergroup']='unisex'; break;
                case 'm': products[index]['gendergroup']='male'; break;
            }
            products[index]['agegroup']=product.agegroup;

            var inventory = [];
            product['isoutofstock'] = true;
            if(product['Inventories'] && product['Inventories'].length > 0){
                var prevSize='';
                var prevIndex=-1;
                _.map(product['Inventories'],(inventoryitem,index) => {
                    if(prevSize != inventoryitem.size){
                        inventory.push({
                            'size':inventoryitem.size,
                            'items':[]
                        });
                        prevSize=inventoryitem.size;
                        prevIndex++;
                    }
                    inventory[prevIndex]['items'].push(inventoryitem);
                });
            }
            delete products[index]['Inventories'];  
            products[index]['Inventories']=inventory; 

            var cartvalue = JSON.stringify({
                'id':product.id,
                'name':product.name
            });
    
            var cartbuffervalue = new Buffer(cartvalue).toString("base64");
            products['cartvalue'] = cartbuffervalue;
                

        });

        
        return products;             
    },

    getIndiaStates:()=>{
        return [
            {
            "key": "AN",
            "name": "Andaman and Nicobar Islands"
            },
            {
            "key": "AP",
            "name": "Andhra Pradesh"
            },
            {
            "key": "AR",
            "name": "Arunachal Pradesh"
            },
            {
            "key": "AS",
            "name": "Assam"
            },
            {
            "key": "BR",
            "name": "Bihar"
            },
            {
            "key": "CG",
            "name": "Chandigarh"
            },
            {
            "key": "CH",
            "name": "Chhattisgarh"
            },
            {
            "key": "DH",
            "name": "Dadra and Nagar Haveli"
            },
            {
            "key": "DD",
            "name": "Daman and Diu"
            },
            {
            "key": "DL",
            "name": "Delhi"
            },
            {
            "key": "GA",
            "name": "Goa"
            },
            {
            "key": "GJ",
            "name": "Gujarat"
            },
            {
            "key": "HR",
            "name": "Haryana"
            },
            {
            "key": "HP",
            "name": "Himachal Pradesh"
            },
            {
            "key": "JK",
            "name": "Jammu and Kashmir"
            },
            {
            "key": "JH",
            "name": "Jharkhand"
            },
            {
            "key": "KA",
            "name": "Karnataka"
            },
            {
            "key": "KL",
            "name": "Kerala"
            },
            {
            "key": "LD",
            "name": "Lakshadweep"
            },
            {
            "key": "MP",
            "name": "Madhya Pradesh"
            },
            {
            "key": "MH",
            "name": "Maharashtra"
            },
            {
            "key": "MN",
            "name": "Manipur"
            },
            {
            "key": "ML",
            "name": "Meghalaya"
            },
            {
            "key": "MZ",
            "name": "Mizoram"
            },
            {
            "key": "NL",
            "name": "Nagaland"
            },
            {
            "key": "OR",
            "name": "Odisha"
            },
            {
            "key": "PY",
            "name": "Puducherry"
            },
            {
            "key": "PB",
            "name": "Punjab"
            },
            {
            "key": "RJ",
            "name": "Rajasthan"
            },
            {
            "key": "SK",
            "name": "Sikkim"
            },
            {
            "key": "TN",
            "name": "Tamil Nadu"
            },
            {
            "key": "TS",
            "name": "Telangana"
            },
            {
            "key": "TR",
            "name": "Tripura"
            },
            {
            "key": "UP",
            "name": "Uttar Pradesh"
            },
            {
            "key": "UK",
            "name": "Uttarakhand"
            },
            {
            "key": "WB",
            "name": "West Bengal"
            }
            ];  
    }

}

module.exports = ProductController;