var _ = require('lodash');
var router = require('express').Router();
var {ProductController, MenuController, InventoryController} = require('../controllers');

const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 0, checkperiod: 0, errorOnMissing: true } );

function getNavigation(){
    return new Promise((resolve,reject) => {
        try{
            var menu = myCache.get( "navigation", true ); 
            resolve(menu);       
        }catch(err){
            ProductController
            .getCategories(0)
            .then((menuitems)=>{
                var uniqCat = [];
                var uniqSub = [];
                var agegroup=['n','i','t','y','a','s'];
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
                        case 'n': age='New Born'; break;
                        case 'i': age='Infant'; break;
                        case 't': age='Teens'; break;
                        case 'y': age='Young'; break;
                        case 'a': age='Adult'; break;
                        case 's': age='Seniors'; break;
                    }
                    menu.push({
                        'group':age,
                        'groupitems':nav
                    });
                });

                uniqCat = _.uniq(uniqCat);
                uniqSub = _.uniq(uniqSub);
                success = myCache.set("navigation", {
                    categories: uniqCat,
                    subcategories:uniqSub,
                    menu:menu
                }, 10000 );
                resolve({
                    categories: uniqCat,
                    subcategories:uniqSub,
                    menu:menu
                });
            })
            .catch((err)=>{
                console.log("Error while storing navigation");
                console.log(err);
            });    
        }
    });
}


function getFeaturedItem(){
    return ProductController.getProducts("isfeatured=true");
}



function getProduct(id){
    return ProductController.get({id:id,include:['ratings','productimages','inventory']});
}

function getProducts(options){

    options['include']=['ratings','productimages'];
    return ProductController.get(options);
}

router.route('/')
.get(function(req,res){
    // Promise.all([getNavigation(),getFeaturedItemByAgeGroup('n'),getFeaturedItemByAgeGroup('i'),getFeaturedItemByAgeGroup('t'),getFeaturedItemByAgeGroup('y'),getFeaturedItemByAgeGroup('a'),getFeaturedItemByAgeGroup('s')])
    // .then((data)=>{
    //     console.log(JSON.stringify(data[1]));
    //     res.render('mimity/index',{
    //         'navigation':data[0],
    //         'newborn':data[1],
    //         'infant':data[2],
    //         'teen':data[3],
    //         'young':data[4],
    //         'adult':data[5],
    //         'senior':data[6]
    //     });
    // })

    Promise.all([getNavigation(),ProductController.getProducts('"Inventories"."isfeatured"=true'), ProductController.getProducts('"Inventories"."isnew"=true'), ProductController.getProducts('"Inventories"."isbestseller"=true'), ProductController.getProducts('"Inventories"."isdeal"=true'), ProductController.getProducts('"Inventories"."issale"=true')])
    .then((data)=>{
        
        _.map(data,function(products,pindex){
            if(pindex > 0){
                _.map(products,function(product,index){
                    
                    product.agegroup=product.agegroup.trim();
                    switch(product.agegroup){
                        case 'n': data[pindex][index]['agegrouptitle']='Newborn'; break;
                        case 'i': data[pindex][index]['agegrouptitle']='Infant'; break;
                        case 't': data[pindex][index]['agegrouptitle']='Teens'; break;
                        case 'y': data[pindex][index]['agegrouptitle']='Young'; break;
                        case 'a': data[pindex][index]['agegrouptitle']='Adult'; break;
                        case 's': data[pindex][index]['agegrouptitle']='Seniors'; break;
                    }
                    data[pindex][index]['agegroup']=product.agegroup;
                    switch(product.gender){
                        case 'f': data[pindex][index]['gendergroup']='female'; break;
                        case 'u': data[pindex][index]['gendergroup']='unisex'; break;
                        case 'm': data[pindex][index]['gendergroup']='male'; break;
                    }
                    data[pindex][index]['agegroup']=product.agegroup;
                })
            }
            
        })   
        console.log(JSON.parse(JSON.stringify(data[1])));     
        res.render('mimity/index',{
            'navigation':data[0],
            'featured':data[1],
            'newproduct':data[2],
            'bestseller':data[3],
            'deal':data[4]
        });
    })
    
});

router.route('/:agegrouptitle\.(html)?')
.get(function(req,res,next){
    console.log(req.params);
    req.params.agegrouptitle=req.params.agegrouptitle.toLowerCase();
    var age='';
    switch(req.params.agegrouptitle){
        case 'newborn': 
        case 'newborn.html': 
            age='a'; break;
        case 'infant': 
        case 'infant.html': 
            age='i'; break;
        case 'teens': 
        case 'teens.html': 
            age='t'; break;
        case 'young': 
        case 'young.html': 
            age='y'; break;
        case 'adult': 
        case 'adult.html': 
            age='a'; break;
        case 'seniors': 
        case 'seniors.html': 
            age='a'; break;
        default:
            next();
    }    
    Promise.all([getNavigation(),ProductController.getProducts('"Products"."agegroup"=\''+age+'\'')])
    .then((data)=>{
        req.params.agegrouptitle=req.params.agegrouptitle.charAt(0).toUpperCase() + req.params.agegrouptitle.slice(1);
        
        var products=JSON.parse(JSON.stringify(data[1]));
        _.map(products,function(product,index){
            product.agegroup=product.agegroup.trim();
            switch(product.agegroup){
                case 'n': products[index]['agegrouptitle']='Newborn'; break;
                case 'i': products[index]['agegrouptitle']='Infant'; break;
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
            
        })
        console.log(JSON.stringify(products));
        res.render('mimity/products', {
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },                
                {
                    title:req.params.agegrouptitle,
                    url:'/'+req.params.agegrouptitle+'.html',
                    active:true
                }
            ],
            'pageTitle':req.params.agegrouptitle,
            'products':products           
        });
    })
});

router.route('/:agegrouptitle/:category\.(html)?')
.get(function(req,res,next){
    console.log(req.params);
    req.params.agegrouptitle=req.params.agegrouptitle.toLowerCase();
    req.params.category=req.params.category.toLowerCase();
    var age='';
    switch(req.params.agegrouptitle){
        case 'newborn': 
        case 'newborn.html': 
            age='a'; break;
        case 'infant': 
        case 'infant.html': 
            age='i'; break;
        case 'teens': 
        case 'teens.html': 
            age='t'; break;
        case 'young': 
        case 'young.html': 
            age='y'; break;
        case 'adult': 
        case 'adult.html': 
            age='a'; break;
        case 'seniors': 
        case 'seniors.html': 
            age='a'; break;
        default:
            next();
    }    
    Promise.all([getNavigation(),ProductController.getProducts('"Products"."agegroup"=\''+age+'\' and lower("Products"."category") like \'%'+req.params.category+'%\' ')])
    .then((data)=>{
        req.params.agegrouptitle=req.params.agegrouptitle.charAt(0).toUpperCase() + req.params.agegrouptitle.slice(1);
        
        var products=JSON.parse(JSON.stringify(data[1]));
        _.map(products,function(product,index){
            product.agegroup=product.agegroup.trim();
            switch(product.agegroup){
                case 'n': products[index]['agegrouptitle']='Newborn'; break;
                case 'i': products[index]['agegrouptitle']='Infant'; break;
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
            
        })
        console.log(JSON.stringify(products));
        res.render('mimity/products', {
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },                
                {
                    title:req.params.agegrouptitle,
                    url:'/'+req.params.agegrouptitle+'.html',
                    active:false
                },
                {
                    title:data[1][0].category,
                    url:'/'+data[1][0].agegrouptitle+'/'+data[1][0].category+'.html',
                    active:true
                }                
            ],
            'pageTitle':req.params.agegrouptitle,
            'products':products           
        });
    })
});


router.route('/:agegrouptitle/:category/:subcategory\.(html)?')
.get(function(req,res,next){
    console.log(req.params);
    req.params.agegrouptitle=req.params.agegrouptitle.toLowerCase();
    req.params.category=req.params.category.toLowerCase();
    req.params.subcategory=req.params.subcategory.toLowerCase();
    var age='';
    switch(req.params.agegrouptitle){
        case 'newborn': 
        case 'newborn.html': 
            age='a'; break;
        case 'infant': 
        case 'infant.html': 
            age='i'; break;
        case 'teens': 
        case 'teens.html': 
            age='t'; break;
        case 'young': 
        case 'young.html': 
            age='y'; break;
        case 'adult': 
        case 'adult.html': 
            age='a'; break;
        case 'seniors': 
        case 'seniors.html': 
            age='a'; break;
        default:
            next();
    }    
    Promise.all([getNavigation(),ProductController.getProducts('"Products"."agegroup"=\''+age+'\' and lower("Products"."category") like \'%'+req.params.category+'%\' and lower("Products"."subcategory") like \'%'+req.params.subcategory+'%\' ')])
    .then((data)=>{
        req.params.agegrouptitle=req.params.agegrouptitle.charAt(0).toUpperCase() + req.params.agegrouptitle.slice(1);
        
        var products=JSON.parse(JSON.stringify(data[1]));
        _.map(products,function(product,index){
            product.agegroup=product.agegroup.trim();
            switch(product.agegroup){
                case 'n': products[index]['agegrouptitle']='Newborn'; break;
                case 'i': products[index]['agegrouptitle']='Infant'; break;
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
            
        })
        console.log(JSON.stringify(products));
        res.render('mimity/products', {
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },                
                {
                    title:req.params.agegrouptitle,
                    url:'/'+req.params.agegrouptitle+'.html',
                    active:false
                },
                {
                    title:req.params.category,
                    url:'/'+req.params.agegrouptitle+'/'+req.params.category+'.html',
                    active:false
                },
                {
                    title:data[1][0].subcategory,
                    url:'/'+data[1][0].agegrouptitle+'/'+req.params.category+'/'+data[1][0].subcategory+'.html',
                    active:true
                }
            ],
            'pageTitle':req.params.agegrouptitle,
            'products':products           
        });
    })
});

router.route('/:agegrouptitle/:category/:subcategory/:gendergroup\.(html)?')
.get(function(req,res,next){
    console.log(req.params);
    req.params.agegrouptitle=req.params.agegrouptitle.toLowerCase();
    req.params.category=req.params.category.toLowerCase();
    req.params.subcategory=req.params.subcategory.toLowerCase();
    req.params.gendergroup=req.params.gendergroup.toLowerCase();
    var age='';
    var gender='';
    switch(req.params.agegrouptitle){
        case 'newborn': 
        case 'newborn.html': 
            age='a'; break;
        case 'infant': 
        case 'infant.html': 
            age='i'; break;
        case 'teens': 
        case 'teens.html': 
            age='t'; break;
        case 'young': 
        case 'young.html': 
            age='y'; break;
        case 'adult': 
        case 'adult.html': 
            age='a'; break;
        case 'seniors': 
        case 'seniors.html': 
            age='a'; break;
        default:
            next();
    }  
    switch(req.params.gendergroup){
        case 'female': gender='f'; break;
        case 'unisex': gender='u'; break;
        case 'male': gender='m'; break;
    }

    Promise.all([getNavigation(),ProductController.getProducts('"Products"."gender"=\''+gender+'\' and "Products"."agegroup"=\''+age+'\' and lower("Products"."category") like \'%'+req.params.category+'%\' and lower("Products"."subcategory") like \'%'+req.params.subcategory+'%\' ')])
    .then((data)=>{
        req.params.agegrouptitle=req.params.agegrouptitle.charAt(0).toUpperCase() + req.params.agegrouptitle.slice(1);
        
        var products=JSON.parse(JSON.stringify(data[1]));
        _.map(products,function(product,index){
            product.agegroup=product.agegroup.trim();
            switch(product.agegroup){
                case 'n': products[index]['agegrouptitle']='Newborn'; break;
                case 'i': products[index]['agegrouptitle']='Infant'; break;
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
            
        })
    
        res.render('mimity/products', {
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },                
                {
                    title:req.params.agegrouptitle,
                    url:'/'+req.params.agegrouptitle+'.html',
                    active:false
                },
                {
                    title:data[1][0].subcategory,
                    url:'/'+data[1][0].agegrouptitle+'/'+data[1][0].category+'/'+data[1][0].subcategory+'.html',
                    active:false
                },
                {
                    title:data[1][0].gendergroup,
                    url:'/'+data[1][0].agegrouptitle+'/'+data[1][0].category+'/'+data[1][0].subcategory+'/'+data[1][0].gendergroup+'.html',
                    active:false
                },                
                {
                    title:data[1][0].category,
                    url:'/'+data[1][0].agegrouptitle+'/'+data[1][0].category+'.html',
                    active:true
                }                
            ],
            'pageTitle':req.params.agegrouptitle,
            'products':products           
        });
    })
});


router.route('/:agegrouptitle/:category/:subcategory/:gendergroup/:id/:sku/:title.html')
.get(function(req,res){
    Promise.all([getNavigation(),getProduct(req.params.id)])
    .then((data)=>{
        var inventory = [];
        data[1][0]['isoutofstock'] = true;
        if(data[1][0]['Inventories'].length > 0){
            var prevSize='';
            var prevIndex=-1;
            _.map(data[1][0]['Inventories'],(inventoryitem,index) => {
                console.log(inventoryitem.dataValues);
                if(prevSize != inventoryitem.dataValues.size){
                    inventory.push({
                        'size':inventoryitem.dataValues.size,
                        'items':[]
                    });
                    prevSize=inventoryitem.dataValues.size;
                    prevIndex++;
                }
                inventory[prevIndex]['items'].push(inventoryitem.dataValues);
            });
        }

        delete data[1][0]['Inventories'];
        
        data[1][0]['Inventories']=inventory;
        console.log(JSON.stringify(data[1]));
        data[1][0]['gender']=data[1][0]['gender'].trim();
        data[1][0]['agegroup']=data[1][0]['agegroup'].trim();

        switch(data[1][0]['gender']){
            case 'm':data[1][0]['gendergroup']='Male';break;
            case 'f':data[1][0]['gendergroup']='Female';break;
            case 'u':data[1][0]['gendergroup']='Unisex';break;
            default:data[1][0]['gendergroup']='unknown';          
        }

        switch(data[1][0]['agegroup']){
            case 'n':data[1][0]['agegroupvalue']='New Born ( 0 - 12 Months)';data[1][0]['agegrouptitle']='NewBorn';break;
            case 'i':data[1][0]['agegroupvalue']='Infant ( 1 - 12 Years)';data[1][0]['agegrouptitle']='Infant';break;
            case 't':data[1][0]['agegroupvalue']='Teen ( 13 - 20 Years)';data[1][0]['agegrouptitle']='Teen';break;
            case 'y':data[1][0]['agegroupvalue']='Young ( 21 - 30 Years)';data[1][0]['agegrouptitle']='Young';break;
            case 'a':data[1][0]['agegroupvalue']='Adult ( 30 - 55 Years)';data[1][0]['agegrouptitle']='Adult';break;
            case 's':data[1][0]['agegroupvalue']='Seniors ( 55+ Years)';data[1][0]['agegrouptitle']='Seniors';break;
            default:data[1][0]['agegroupvalue']='unknown';          
        }        


        res.render('mimity/product',{
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },
                {
                    title:data[1][0].agegroupvalue,
                    url:'/'+data[1][0].agegrouptitle+'.html',
                    active:false
                },                                                
                {
                    title:data[1][0].category,
                    url:'/'+data[1][0].agegrouptitle+'/'+data[1][0].category+'.html',
                    active:false
                },
                {
                    title:data[1][0].subcategory,
                    url:'/'+data[1][0].agegrouptitle+'/'+data[1][0].category+'/'+data[1][0].subcategory+'.html',
                    active:false
                },
                {
                    title:data[1][0].gendergroup,
                    url:'/'+data[1][0].agegrouptitle+'/'+data[1][0].category+'/'+data[1][0].subcategory+'/'+data[1][0].gendergroup+'.html',
                    active:false
                },
                {
                    title:data[1][0].name,
                    url:'/product/'+data[1][0].id,
                    active:true
                }],
            'product':data[1][0]
        });
    })
});
module.exports = router;