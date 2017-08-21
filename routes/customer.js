var _ = require('lodash');
var router = require('express').Router();
var {ProductController, MenuController, InventoryController, OrderController, CustomerController} = require('../controllers');

const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 0, checkperiod: 0, errorOnMissing: true } );

function getNavigation(){
    return new Promise((resolve,reject) => {
        ProductController
        .getCategories(0)
        .then((menuitems)=>{
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
                    case 'n': age='New Born'; break;
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
        // try{
        //     var menu = myCache.get( "navigation", true ); 
        //     resolve(menu);       
        // }catch(err){
        // }
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

function getStates(){
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

    Promise.all([getNavigation(),ProductController.getProducts('"Products"."isfeatured"=true'), ProductController.getProducts('"Products"."isnew"=true'), ProductController.getProducts('"Products"."isbestseller"=true'), ProductController.getProducts('"Products"."isdeal"=true')])
    .then((data)=>{
        _.map(data,function(products,pindex){
            if(pindex > 0){
                _.map(products,function(product,index){
                    
                    product.agegroup=product.agegroup.trim();
                    switch(product.agegroup){
                        case 'n': data[pindex][index]['agegrouptitle']='Newborn'; break;
                        case 'i': data[pindex][index]['agegrouptitle']='Infant'; break;
                        case 'k': data[pindex][index]['agegrouptitle']='Kids'; break;
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
    }).catch((err)=>{
        console.log(err);
    })
    
});

router.route('/cart.html')
.get(function(req,res){
    Promise.all([getNavigation()])
    .then((data)=>{
        res.render('mimity/cart',{
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },
                {
                    title:'Shopping cart',
                    url:'/cart.html',
                    active:true
                }]
        });        
    })
});



router.route('/checkout.html')
.get(function(req,res){
    Promise.all([getNavigation()])
    .then((data)=>{

        res.render('mimity/checkout',{
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },
                {
                    title:'Shopping cart',
                    url:'/cart.html',
                    active:false
                },                
                {
                    title:'Checkout',
                    url:'/checkout.html',
                    active:true
                }],
            'states':getStates(),
            'paytypes':[{key:'paytm', name:'PayTm'},{key:'actfr',name:'A/C Tranfer'},{key:'cod',name:'Cash On Delivery'}]
        });        
    })
})
.post(function(req,res){
    CustomerController.create(req.body).then((result)=>{
        OrderController.create(result.customer,result.customeraddressbooks,req.body).then((result)=>{
            res.status(200).json({status:200,trackingnumber:result.order.id+'-'+result.customer.id+'-'+result.order.TrackingNumber, email:result.customer.email, phonenumber: result.customer.phonenumber});
        })
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({status:500,id:0});
    });
});


router.route('/thankyou.html')
.get(function(req,res){
    Promise.all([getNavigation()])
    .then((data)=>{

        res.render('mimity/thankyou',{
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },
                {
                    title:'Thankyou',
                    url:'/Thankyou.html',
                    active:true
                }]
        });        
    })
})

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
        case 'kids': 
        case 'kids.html': 
            age='k'; break;
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
        case 'kids': 
        case 'kids.html': 
            age='k'; break;
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
        case 'kids': 
        case 'kids.html': 
            age='k'; break;
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
        case 'kids': 
        case 'kids.html': 
            age='k'; break;
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
            case 'i':data[1][0]['agegroupvalue']='Infant ( 1 - 5 Years)';data[1][0]['agegrouptitle']='Infant';break;
            case 'k':data[1][0]['agegroupvalue']='Kids ( 5 - 12 Years)';data[1][0]['agegrouptitle']='Kids';break;
            case 't':data[1][0]['agegroupvalue']='Teen ( 13 - 20 Years)';data[1][0]['agegrouptitle']='Teen';break;
            case 'y':data[1][0]['agegroupvalue']='Young ( 21 - 30 Years)';data[1][0]['agegrouptitle']='Young';break;
            case 'a':data[1][0]['agegroupvalue']='Adult ( 30 - 55 Years)';data[1][0]['agegrouptitle']='Adult';break;
            case 's':data[1][0]['agegroupvalue']='Seniors ( 55+ Years)';data[1][0]['agegrouptitle']='Seniors';break;
            default:data[1][0]['agegroupvalue']='unknown';          
        }        

        var cartvalue = JSON.stringify({
            'id':data[1][0].id,
            'name':data[1][0].name
        });

        var cartbuffervalue = new Buffer(cartvalue).toString("base64");
        data[1][0]['cartvalue'] = cartbuffervalue;


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