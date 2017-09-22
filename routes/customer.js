var _ = require('lodash');
var multer = require('multer');
var router = require('express').Router();
var jimp = require('jimp');
var mergeImage = require('merge-img');
var multer = require('multer');
var os = require('os');
var fs = require('fs');
var uuid = require('node-uuid');
var multiparty = require('multiparty');

var UPLOAD_DIRECTORY = './uploads/';

var storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, UPLOAD_DIRECTORY) },
  filename: function (req, file, cb) {
     var ext = file.originalname.slice(file.originalname.lastIndexOf('.'));
      cb(null, uuid.v4()+ext);
    }
});

// Create the multer instance here
var upload = multer({ 
    storage: storage, 
    limits: { fileSize: 10 * 1024 * 1024}
}).any();



var {ProductController, MenuController, InventoryController, OrderController, CustomerController, SiteattributeController} = require('../controllers');

const NodeCache = require( "node-cache" );
const myCache = new NodeCache( { stdTTL: 0, checkperiod: 0, errorOnMissing: true } );

function getProduct(id){
    return ProductController.get({id:id,include:['ratings','productimages','inventory']});
}

function getProducts(options){
    options['include']=['ratings','productimages'];
    return ProductController.get(options);
}

function mapAgegroup(agegroup){
    var age=undefined;
    agegroup = agegroup.toLowerCase();
    switch(agegroup){
        case 'newborn': 
        case 'newborn.html': 
            age='n'; break;
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
            age='s'; break;
        default:
            age=undefined
    }
    return age;
}

function mapGender(gendergroup){
    var gender=undefined;
    gendergroup = gendergroup.toLowerCase();
    
    switch(gendergroup){
        case 'female': gender='f'; break;
        case 'unisex': gender='u'; break;
        case 'male': gender='m'; break;
    }

    return gender;
}

function mapProductGroup(productgroup){
    productgroup = productgroup.toLowerCase();
    
    switch(productgroup){
        case 'featured': productgroup = '"Products"."isfeatured"=true'; break;
        case 'new': productgroup = '"Products"."isnew"=true'; break;
        case 'sale': productgroup = '"Products"."isdeal"=true'; break;
        case 'deal': productgroup = '"Products"."isdeal"=true'; break;
        case 'bestseller': productgroup = '"Products"."isbestseller"=true'; break;
        default: productgroup = undefined;
    }

    return productgroup;
}

router.route('/')
.get(function(req,res){
    var whr = '';
    if(req.session['ctype'] && req.session['ctype']=='a'){
        whr = '"Products"."isactive" in (true,false) and ';
    }else{
        whr = ' "Products"."isactive" = true and '
    }
    
    Promise.all([ProductController.getCategories(0),ProductController.getProducts(whr+'"Products"."isfeatured"=true'), ProductController.getProducts(whr+'"Products"."isnew"=true'), ProductController.getProducts(whr+'"Products"."isbestseller"=true'), ProductController.getProducts(whr+'"Products"."isdeal"=true'), SiteattributeController.getAll()])
    .then((data)=>{
        console.log(data[5]);
        res.render('index',{
            'navigation':data[0],
            'featured':ProductController.prepareForNavigation(data[1]),
            'newproduct':ProductController.prepareForNavigation(data[2]),
            'bestseller':ProductController.prepareForNavigation(data[3]),
            'deal':ProductController.prepareForNavigation(data[4]),
            'siteattributes':data[5]
        });
    }).catch((err)=>{
        console.log(err);
    })
    
});

router.route('/index.html')
.get(function(req,res){
    var whr = '';
    if(req.session['ctype'] && req.session['ctype']=='a'){
        whr = '"Products"."isactive" in (true,false) and ';
    }else{
        whr = ' "Products"."isactive" = true and '
    }
    
    Promise.all([ProductController.getCategories(0),ProductController.getProducts(whr+'"Products"."isfeatured"=true'), ProductController.getProducts(whr+'"Products"."isnew"=true'), ProductController.getProducts(whr+'"Products"."isbestseller"=true'), ProductController.getProducts(whr+'"Products"."isdeal"=true'),SiteattributeController.getAll()])
    .then((data)=>{
        res.render('index',{
            'navigation':data[0],
            'featured':ProductController.prepareForNavigation(data[1]),
            'newproduct':ProductController.prepareForNavigation(data[2]),
            'bestseller':ProductController.prepareForNavigation(data[3]),
            'deal':ProductController.prepareForNavigation(data[4]),
            'siteattributes':data[5]
        });
    }).catch((err)=>{
        console.log(err);
    })
});

router.route('/:productgroup.html')
.get(function(req,res,next){

    var productgroup = mapProductGroup(req.params.productgroup);   

    if(productgroup == undefined){
        next();
        return;
    }

    var whr = '';
    if(req.session['ctype'] && req.session['ctype']=='a'){
        whr = '"Products"."isactive" in (true,false) and ';
    }else{
        whr = ' "Products"."isactive" = true and '
    }

    whr += productgroup;
    
    Promise.all([ProductController.getCategories(0),ProductController.getProducts(whr), SiteattributeController.getAll()])
    .then((data)=>{
        res.render('products', {
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },                
                {
                    title:req.params.productgroup,
                    url:'/'+req.params.productgroup+'.html',
                    active:true
                }
            ],
            'pageTitle':req.params.productgroup,
            'products':ProductController.prepareForNavigation(data[1]),
            'siteattributes':data[2]           
        });
    })
});

router.route('/:agegrouptitle.html')
.get(function(req,res,next){
    var age=undefined;
    age=mapAgegroup(req.params.agegrouptitle);
    if(age == undefined){
        next();
        return;
    }

    var whr = '"Products"."agegroup"=\''+age+'\'';
    if(req.session['ctype'] && req.session['ctype']=='a'){
        whr += ' and "Products"."isactive" in (true,false)';
    }else{
        whr += ' and "Products"."isactive" = true '
    }

    Promise.all([ProductController.getCategories(0),ProductController.getProducts(whr), SiteattributeController.getAll()])
    .then((data)=>{
        res.render('products', {
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
            'products':ProductController.prepareForNavigation(data[1]),
            'siteattributes':data[2]           
        });
    })
});

router.route('/:agegrouptitle/:category\.(html)?')
.get(function(req,res,next){
    var age=undefined;
    age=mapAgegroup(req.params.agegrouptitle);
    if(age == undefined){
        next();
        return;
    }

    var category=req.params.category.toLowerCase();
    

    var whr = '"Products"."agegroup"=\''+age+'\' and lower("Products"."category") like \'%'+category+'%\' ';
    if(req.session['ctype'] && req.session['ctype']=='a'){
        whr += ' and "Products"."isactive" in (true,false)';
    }else{
        whr += ' and "Products"."isactive" = true '
    }
    
    Promise.all([ProductController.getCategories(0),ProductController.getProducts(whr), SiteattributeController.getAll()])
    .then((data)=>{
        res.render('products', {
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
                    url:'/'+req.params.agegrouptitle+'/'+category+'.html',
                    active:true
                }                
            ],
            'pageTitle':req.params.agegrouptitle,
            'products':ProductController.prepareForNavigation(data[1]),
            'siteattributes':data[2]           
        });
    })
});


router.route('/:agegrouptitle/:category/:subcategory\.(html)?')
.get(function(req,res,next){
    var category=req.params.category.toLowerCase();
    var subcategory=req.params.subcategory.toLowerCase();
    var age=undefined;
    age=mapAgegroup(req.params.agegrouptitle);
    if(age == undefined){
        next();
        return;
    }
    
    var whr = '"Products"."agegroup"=\''+age+'\' and lower("Products"."category") like \'%'+category+'%\' and lower("Products"."subcategory") like \'%'+subcategory+'%\' ';
    if(req.session['ctype'] && req.session['ctype']=='a'){
        whr += ' and "Products"."isactive" in (true,false)';
    }else{
        whr += ' and "Products"."isactive" = true '
    }

    Promise.all([ProductController.getCategories(0),ProductController.getProducts(whr), SiteattributeController.getAll()])
    .then((data)=>{
        res.render('products', {
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
                    title:req.params.subcategory,
                    url:'/'+req.params.agegrouptitle+'/'+req.params.category+'/'+req.params.subcategory+'.html',
                    active:true
                }
            ],
            'pageTitle':req.params.agegrouptitle,
            'products':ProductController.prepareForNavigation(data[1]),
            'siteattributes':data[2]             
        });
    })
});

router.route('/:agegrouptitle/:category/:subcategory/:gendergroup\.(html)?')
.get(function(req,res,next){
    var category=req.params.category.toLowerCase();
    var subcategory=req.params.subcategory.toLowerCase();
    var gendergroup=req.params.gendergroup.toLowerCase();
    
    var age=undefined;
    var gender = undefined;
    age=mapAgegroup(req.params.agegrouptitle);
    if(age == undefined){
        next();
        return;
    }
    
    gender=mapGender(req.params.gendergroup);

    if(age == undefined || gender == undefined){
        next();
        return;
    }

    var whr = '"Products"."gender"=\''+gender+'\' and "Products"."agegroup"=\''+age+'\' and lower("Products"."category") like \'%'+category+'%\' and lower("Products"."subcategory") like \'%'+subcategory+'%\' ';
    if(req.session['ctype'] && req.session['ctype']=='a'){
        whr += ' and "Products"."isactive" in (true,false)';
    }else{
        whr += ' and "Products"."isactive" = true '
    }
    

    Promise.all([ProductController.getCategories(0),ProductController.getProducts(whr), SiteattributeController.getAll()])
    .then((data)=>{

        data[1]=ProductController.prepareForNavigation(data[1]);

        res.render('products', {
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
                    url:'/'+data[1][0].agegrouptitle+'/'+data[1][0].category+'.html',
                    active:false
                },
                {
                    title:req.params.subcategory,
                    url:'/'+data[1][0].agegrouptitle+'/'+data[1][0].category+'/'+data[1][0].subcategory+'.html',
                    active:false
                },
                {
                    title:req.params.gendergroup,
                    url:'/'+data[1][0].agegrouptitle+'/'+data[1][0].category+'/'+data[1][0].subcategory+'/'+data[1][0].gendergroup+'.html',
                    active:true
                }                
            ],
            'pageTitle':req.params.agegrouptitle,
            'products':data[1],
            'siteattributes':data[2]            
        });
    })
});


router.route('/:agegrouptitle/:category/:subcategory/:gendergroup/:id/:sku/:title.html')
.get(function(req,res){
    Promise.all([ProductController.getCategories(0),getProduct(req.params.id,true), SiteattributeController.getAll()])
    .then((data)=>{
        data[1]=ProductController.prepareForNavigation(data[1]);
        res.render('product',{
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },
                {
                    title:data[1][0].agegrouptitle,
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
            'isadmin':(req.session['ctype'] && req.session['ctype']=='a'),
            'product':data[1][0],
            'siteattributes':data[2]  
        });
    }).catch((err)=>{
        console.log(err);
        res.status(404).render('404');
    })
});

router.route('/cart.html')
.get(function(req,res){
    Promise.all([ProductController.getCategories(0), SiteattributeController.getAll()])
    .then((data)=>{
        res.render('cart',{
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
                }],
            'customerId':req.session[req.sessionID]  || 0,
            'siteattributes':data[1]  
        });        
    })
});

router.route('/checkout.html')
.post(function(req,res){
    CustomerController.checkout(req.body).then((result)=>{
        OrderController.create(result.customer,result.customeraddressbooks,req.body).then((result)=>{
            res.status(200).json({status:200,trackingnumber:result.order.id+'-'+result.customer.id+'-'+result.order.TrackingNumber, email:result.customer.email, phonenumber: result.customer.phonenumber});
        }).catch((err)=>{
            res.status(200).json({status:404,message:'Unable to place your order'});
        })
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({status:500,id:0});
    });
});


router.route('/thankyou.html')
.get(function(req,res){
    Promise.all([ProductController.getCategories(0), SiteattributeController.getAll()])
    .then((data)=>{
        res.render('thankyou',{
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
                }],
            'siteattributes':data[1]  
        });        
    })
});

router.route('/faq.html')
.get(function(req,res){
    Promise.all([ProductController.getCategories(0), SiteattributeController.getAll()])
    .then((data)=>{
        res.render('faq',{
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },
                {
                    title:'FAQ',
                    url:'/faq.html',
                    active:true
                }],
            'siteattributes':data[1]  
        });        
    })
});

router.route('/privacy.html')
.get(function(req,res){
    Promise.all([ProductController.getCategories(0), SiteattributeController.getAll()])
    .then((data)=>{
        res.render('privacy',{
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },
                {
                    title:'Privacy Statement',
                    url:'/privacy.html',
                    active:true
                }],
            'siteattributes':data[1]  
        });        
    })
});

router.route('/legal.html')
.get(function(req,res){
    Promise.all([ProductController.getCategories(0), SiteattributeController.getAll()])
    .then((data)=>{
        res.render('legal',{
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },
                {
                    title:'Legal Statement',
                    url:'/legal.html',
                    active:true
                }],
            'siteattributes':data[1]  
        });        
    })
});


router.route('/termsandconditions.html')
.get(function(req,res){
    Promise.all([ProductController.getCategories(0), SiteattributeController.getAll()])
    .then((data)=>{
        res.render('tandc',{
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },
                {
                    title:'Terms And Conditions',
                    url:'/termsandconditions.html',
                    active:true
                }],
            'siteattributes':data[1]  
        });        
    })
});

router.route('/login.html')
.get(function(req,res){
    Promise.all([ProductController.getCategories(0), SiteattributeController.getAll()])
    .then((data)=>{
        res.render('login',{
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },
                {
                    title:'Login',
                    url:'/login.html',
                    active:true
                }],
            'ischeckout':false,
            'siteattributes':data[1]  
        });        
    })
})
.post(function(req,res){
    CustomerController.register(req.body).then((customer)=>{
        var cst=JSON.parse(JSON.stringify(customer));
        req.session[req.sessionID]=cst.id;
        delete cst['createdAt'];
        delete cst['updatedAt'];
        delete cst['isblocked'];
        delete cst['isverified'];
        delete cst['isdeleted'];
        delete cst['hashcode'];
        
        var ischeckout=req.body.ischeckout || false;

        if(ischeckout){
            res.status(200).json({status:302,redirect:'/account/'+cst.id+'/profile.html', cid:cst.id, type:'c'});
        }else{
            res.status(200).json({status:302,redirect:'/account/'+cst.id+'/checkout.html', cid:cst.id, type:'c'});
        }
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({status:500});
    })
})
.put(function(req,res){
    CustomerController.findOne(req.body).then((customer)=>{
        var cst=JSON.parse(JSON.stringify(customer));
        req.session[req.sessionID]=cst.id;
        req.session['ctype']=cst.customertype;
        delete cst['createdAt'];
        delete cst['updatedAt'];
        delete cst['isblocked'];
        delete cst['isverified'];
        delete cst['isdeleted'];
        delete cst['hashcode'];

        var ischeckout=req.body.ischeckout || false;
        var customertype = customer.customertype.trim();
        var redirect = req.body.redirect || req.query.redirect || undefined;

        if(redirect && redirect.indexOf('login.html') > 0){
            redirect = undefined;
        }

        if(customertype=='a'){
            redirect = redirect || '/admin/settings.html'
        }
        else if(ischeckout){
            redirect = redirect || '/account/'+cst.id+'/profile.html'
        }else{
            redirect = redirect || '/account/'+cst.id+'/checkout.html'
        }

        res.status(200).json({status:302,redirect:redirect, cid:cst.id, type:customertype});
        
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({status:500});
    })
})
.delete(function(req,res){
    req.session[req.sessionID] = 0;
    req.session['ctype']='c';
    res.status(200).json({status:302,redirect:'/'});
})

router.route('/products/categories.json')
.get(function(req,res){
    ProductController.getCategories(0)    
    .then((data)=>{
        res.json({status:200,categories:data.categories,subcategories:data.subcategories,fabric:data.fabric});
    }).catch((err)=>{
        res.json({status:500,categories:[],subcategories:[],fabric:[]});
    })
});

/* GUEST */

router.route('/guest/login.html')
.get(function(req,res){
    Promise.all([ProductController.getCategories(0), SiteattributeController.getAll()])
    .then((data)=>{
        res.render('login',{
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },
                {
                    title:'Login',
                    url:'/login.html',
                    active:true
                }],
            'ischeckout':true,
            'siteattributes':data[1]
        });        
    })
});


// router.route('/guest/login.html')
// .get(function(req,res){
//     Promise.all([ProductController.getCategories(0)])
//     .then((data)=>{
//         res.render('login',{
//             'navigation':data[0],
//             'navPath':[
//                 {
//                     title:'Home',
//                     url:'/',
//                     active:false
//                 },
//                 {
//                     title:'Login',
//                     url:'/login.html',
//                     active:true
//                 }],
//             'ischeckout':true
//         });        
//     })
// });

router.route('/guest/checkout.html')
.get(function(req,res){
    Promise.all([ProductController.getCategories(0), SiteattributeController.getAll()])
    .then((data)=>{
        var cid=0;
        if (req.session && req.session[req.sessionID]) {
            cid=req.session[req.sessionID];
        }
        res.render('checkout',{
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
            'customerId':0,
            'states':ProductController.getIndiaStates(),
            // {key:'paytm', name:'PayTm'},{key:'actfr',name:'A/C Tranfer'},
            'paytypes':[{key:'cod',name:'Cash On Delivery'}],
            'siteattributes':data[1]  
        });        
    })
});

router.route('/guest/orders/:orderid-:cid-:trackingnumber.html')
.get(function(req,res){
    Promise.all([ProductController.getCategories(0), CustomerController.getProfile(req.params.cid), OrderController.getOrder(req.params.cid,req.params.orderid), SiteattributeController.getAll()])
    .then((data)=>{
        res.render('invoice',{
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },
                {
                    title:req.params.orderid+'-'+req.params.cid+'-'+req.params.trackingnumber,
                    url:'/guest/'+'/orders/'+req.params.orderid+'-'+req.params.cid+'-'+req.params.trackingnumber+'.html',
                    active:true
                }
            ],
            'isadmin':false,
            'customer':data[1],
            'order':data[2],
            'siteattributes':data[3]
        });        
    }).catch((err)=>{
        console.log(err);
        res.render('404');
    })
});

/* GUEST */

/* CUSTOMER */

router.route('/account/:customerId/*')
.get(function(req,res,next){
    if(req.session['ctype']=='a'){
        next();
    }
    else if (req.session[req.sessionID] == undefined  || req.session[req.sessionID]!= req.params.customerId) {
        Promise.all([ProductController.getCategories(0), SiteattributeController.getAll()])
        .then((data)=>{
            res.render('login',{
                'navigation':data[0],
                'navPath':[
                    {
                        title:'Home',
                        url:'/',
                        active:false
                    },
                    {
                        title:'Login',
                        url:'/login.html',
                        active:true
                    }],
                'ischeckout':false,
                'siteattributes':data[1]
            });        
        })
    }else{
        next();
    }
});

router.route('/account/:customerId/checkout.html')
.get(function(req,res){
    var cid=0;
    if (req.session[req.sessionID] == undefined  || req.session[req.sessionID]!= req.params.customerId) {
        res.render('404');
    }else{
        Promise.all([ProductController.getCategories(0),CustomerController.getProfile(req.params.customerId), CustomerController.getAddressBook(req.params.customerId), SiteattributeController.getAll()])
        .then((data)=>{
            res.render('account-checkout',{
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
                'customerId':req.params.customerId,
                'customer':data[1],
                'customeraddressbooks':data[2],
                'states':ProductController.getIndiaStates(),
                //{key:'paytm', name:'PayTm'},{key:'actfr',name:'A/C Tranfer'},
                'paytypes':[{key:'cod',name:'Cash On Delivery'}],
                'siteattributes':data[3]
            });        
        })
    }
});

router.route('/account/:customerid/profile.html')
.get(function(req,res){
    if (req.session && req.session[req.sessionID] && (req.session[req.sessionID]==req.params.customerid || req.session['ctype']=='a')) {
        Promise.all([ProductController.getCategories(0),CustomerController.getProfile(req.params.customerid), CustomerController.getAddressBook(req.params.customerid), CustomerController.getOrder(req.params.customerid), SiteattributeController.getAll()])
        .then((data)=>{
            res.render('account-profile',{
                'navigation':data[0],
                'navPath':[
                    {
                        title:'Home',
                        url:'/',
                        active:false
                    },
                    {
                        title:'My Account',
                        url:'/account/:customer/profile.html',
                        active:true
                    }],
                'ischeckout':false,
                'isadmin':(req.session[req.sessionID]!=req.params.customerid && req.session['ctype']=='a'?true:false),
                'states':ProductController.getIndiaStates(),
                'customer':data[1],
                'customeraddressbook':data[2],
                'orders':data[3],
                'siteattributes':data[4]
            });        
        }).catch((err)=>{
            console.log(err);
            res.status(404).render('404');
        })
    }else{
        Promise.all([ProductController.getCategories(0)])
        .then((data)=>{
            res.render('login',{
                'navigation':data[0],
                'navPath':[
                    {
                        title:'Home',
                        url:'/',
                        active:false
                    },
                    {
                        title:'Login',
                        url:'/login.html',
                        active:true
                    }],
                'ischeckout':false,
                'siteattributes':data[1]
            });        
        })        
    }
});

router.route('/account/:customerid/address.html')
.post(function(req,res){
    if (req.session && req.session[req.sessionID] && req.session[req.sessionID]==req.params.customerid) {
        CustomerController.addAddressBook(req.params.customerid,req.body).then((ab)=>{
            var cst=JSON.parse(JSON.stringify(ab));
            res.json({status:200,addressbook:cst});
        }).catch((err) => {
            console.log(err);
            res.json({status:500});
        });
    }else{
        res.json({status:500});
    }
});

router.route('/account/:customerid/orders/:orderid-:cid-:trackingnumber.html')
.get(function(req,res){
        Promise.all([ProductController.getCategories(0), CustomerController.getProfile(req.params.customerid), OrderController.getOrder(req.params.customerid,req.params.orderid), SiteattributeController.getAll()])
        .then((data)=>{
            res.render('invoice',{
                'navigation':data[0],
                'navPath':[
                    {
                        title:'Home',
                        url:'/',
                        active:false
                    },
                    {
                        title:'My Account',
                        url:'/account/'+req.params.customerid+'/profile.html',
                        active:false
                    },
                    {
                        title:'Order History',
                        url:'/account/'+req.params.customerid+'/profile.html',
                        active:false
                    },
                    {
                        title:req.params.orderid+'-'+req.params.customerid+'-'+req.params.trackingnumber,
                        url:'/account/'+req.params.customerid+'/orders/'+req.params.orderid+'-'+req.params.customerid+'-'+req.params.trackingnumber+'.html',
                        active:true
                    }
                ],
                'isadmin':false,
                'customer':data[1],
                'order':data[2],
                'siteattributes':data[3],
            });        
        }).catch((err)=>{
            console.log(err);
            res.render('404');
        })
});



/** Admin */

router.route('/admin/*')
.get(function(req,res,next){
    if (req.session && req.session[req.sessionID] && req.session['ctype'] && req.session['ctype']=='a') {
        next();
        return;
    }else{
        Promise.all([ProductController.getCategories(0), SiteattributeController.getAll()])
        .then((data)=>{
            res.render('login',{
                'navigation':data[0],
                'navPath':[
                    {
                        title:'Home',
                        url:'/',
                        active:false
                    },
                    {
                        title:'Login',
                        url:'/login.html',
                        active:true
                    }],
                'ischeckout':false,
                'siteattributes':data[1]
            });        
        })        
    }       
})

router.route('/admin/settings.html')
.get(function(req,res){
    Promise.all([ProductController.getCategories(0),CustomerController.getProfile(req.session[req.sessionID]), SiteattributeController.getAll()])
    .then((data)=>{
        res.render('admin-profile',{
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },
                {
                    title:'My Account',
                    url:'/admin/settings.html',
                    active:true
                }],
                'customer':data[1],
                'siteattributes':data[2]
        });        
    }).catch((err)=>{
        console.log(err);
        res.status(404).render('404');
    })
})
.post(function(req,res){
    if (req.session && req.session[req.sessionID] && req.session['ctype'] && req.session['ctype']=='a') {
        if(_.isEmpty(req.body)){

            var count = 0;
            var form = new multiparty.Form({
                autoFields:true,
                autoFiles: true,
                uploadDir:'./uploads/'
            });

            var key =  undefined;
            var value1 = undefined;
            var refid = undefined;
            form.parse(req, function(err, fields, files) {
                key = fields.key || undefined;
                refid = fields.refid || undefined;
                value1 = undefined;
                Object.keys(files).forEach(function(name) {
                  value1 = files[name][0]['path'];
                  var path = value1.slice(0,value1.lastIndexOf('.'));
                  var ext = value1.slice(value1.lastIndexOf('.'));
                  jimp.read(value1,(err,img)=>{
                      if(err){
                          console.log(err);
                      }
                      var nImg = img.clone();
                      var size = 300;
                      var path = value1.slice(0,value1.lastIndexOf('.'));
                      var ext = value1.slice(value1.lastIndexOf('.'));
                      var newFile= path+'-'+size+ext;
                      nImg.resize(jimp.AUTO,64).write(newFile);
                      req.body={
                          'key':key,
                          'value0':path+'-'+size+ext,
                          'refid':refid
                      };
  
                      key = req.body.key || undefined;
                      
                      if(key){
                          SiteattributeController.get(key)
                          .then((siteattribute) =>{
                              SiteattributeController.update(siteattribute.id, siteattribute.key, req.body)
                              .then((attribute)=>{
                                  res.json({status:200, refid: req.body.refid});
                              })
                          }).catch((err)=>{
                              SiteattributeController.create(req.body)
                              .then((data)=>{
                                  res.json({status:200, refid:req.body.refid||""})
                              }).catch((err)=>{
                                  console.log(err);
                                  res.json({status:500, refid:req.body.refid||""})
                              })
                          })
                      }else{
                          res.json({status:500, refid:req.body.refid||""})
                      }
                  });                     
                });
            });            

            // Close emitted after form parsed
            form.on('close', function() {

            });

        }else{
            key = req.body.key || undefined;
            
            if(key){

                if(key=='passwd'){
                    CustomerController.updatePassword(req.session[req.sessionID],{
                        passwd: req.body.value0 || undefined,
                        newpasswd: req.body.value1 || undefined
                    }).then((data)=>{
                        res.json({status:302, redirect:'/admin/setting.html'})
                    }).catch((err)=>{
                        console.log(err);
                        res.json({status:500, redirect:'/admin/setting.html'})
                    })

                }else{
                    SiteattributeController.get(key)
                    .then((siteattribute) =>{
                        SiteattributeController.update(siteattribute.id, siteattribute.key, req.body)
                        .then((attribute)=>{
                            res.json({status:200, refid: req.body.refid});
                        })
                    }).catch((err)=>{
                        SiteattributeController.create(req.body)
                        .then((data)=>{
                            res.json({status:200, refid:req.body.refid||""})
                        }).catch((err)=>{
                            console.log(err);
                            res.json({status:500, refid:req.body.refid||""})
                        })
                    })
                }
            }else{
                res.json({status:500, refid:req.body.refid||""})
            }
        }        

    }else{
        res.json({status:500})
    }
})

router.route('/admin/orders.html')
.get(function(req,res){
        Promise.all([ProductController.getCategories(0),CustomerController.getProfile(req.session[req.sessionID]), SiteattributeController.getAll()])
        .then((data)=>{
            res.render('admin-orders',{
                'navigation':data[0],
                'navPath':[
                    {
                        title:'Home',
                        url:'/',
                        active:false
                    },
                    {
                        title:'My Account',
                        url:'/account/'+req.session[req.sessionID]+'/profile.html',
                        active:false
                    },
                    {
                        title:'Orders',
                        url:'/admin/orders.html',
                        active:true
                    },
                    ],
                'customer':data[1],
                'siteattributes':data[2]
            });        
        }).catch((err)=>{
            console.log(err);
            res.status(404).render('404');
        })
})

router.route('/admin/orders.json')
.get(function(req,res){
    if (req.session && req.session[req.sessionID] && req.session['ctype'] && req.session['ctype']=='a') {
        OrderController.getOrders({
            offset:req.params.offset || 0
        })
        .then((orders)=>{
           res.json(orders); 
        }).catch((err)=>{
            console.log(err);
            res.status(500);
        })
    }else{
        res.status(500);       
    }
});

router.route('/admin/orders/:orderid-:cid-:trackingnumber.html')
.get(function(req,res){
    Promise.all([ProductController.getCategories(0), CustomerController.getProfile(req.params.cid), OrderController.getOrder(req.params.cid,req.params.orderid), SiteattributeController.getAll()])
    .then((data)=>{
        res.render('invoice',{
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },
                {
                    title:'Orders',
                    url:'/admin/orders.html',
                    active:false
                },
                {
                    title:req.params.orderid+'-'+req.params.cid+'-'+req.params.trackingnumber,
                    url:'/guest/'+'/orders/'+req.params.orderid+'-'+req.params.cid+'-'+req.params.trackingnumber+'.html',
                    active:true
                }
            ],
            'isadmin':true,
            'customer':data[1],
            'order':data[2],
            'siteattributes':data[3]
        });        
    }).catch((err)=>{
        console.log(err);
        res.render('404');
    })
})
.put(function(req,res){
    if (req.session && req.session[req.sessionID] && req.session['ctype'] && req.session['ctype']=='a') {
        OrderController.update(req.params.orderid,req.params.trackingnumber, {
            status:req.body.status||'new'
        })
        .then((order)=>{
            res.json({status:200, refid:req.body.refid||""})
        }).catch((err)=>{
            console.log(err);
            res.json({status:500, refid:req.body.refid||""})
        })
    }else{
        res.json({status:500, refid:req.body.refid||""})
    }
    
})


router.route('/admin/orders/:orderid/shipping.html')
.post(function(req,res){
    if (req.session && req.session[req.sessionID] && req.session['ctype'] && req.session['ctype']=='a') {
        OrderController.addShippingLabel(req.params.orderid, req.body)
        .then((data)=>{
            res.json({status:200, shippinglabel:data, refid:req.body.refid||""})
        }).catch((err)=>{
            console.log(err);
            res.json({status:500, shippinglabel:[], refid:req.body.refid||""})
        })
    }else{
        res.json({status:500, shippinglabel:[], refid:req.body.refid||""})
    }
})
.delete(function(req,res){
    if (req.session && req.session[req.sessionID] && req.session['ctype'] && req.session['ctype']=='a') {
        OrderController.deleteShippingLabel(req.params.orderid, req.body)
        .then((data)=>{
            res.json({status:200, shippinglabel:data, refid:req.body.refid||""})
        }).catch((err)=>{
            console.log(err);
            res.json({status:500, shippinglabel:[], refid:req.body.refid||""})
        })
    }else{
        res.json({status:500, shippinglabel:[], refid:req.body.refid||""})
    }

});


router.route('/admin/customers.html')
.get(function(req,res){
        Promise.all([ProductController.getCategories(0),CustomerController.getProfile(req.session[req.sessionID]), SiteattributeController.getAll()])
        .then((data)=>{
            res.render('admin-customers',{
                'navigation':data[0],
                'navPath':[
                    {
                        title:'Home',
                        url:'/',
                        active:false
                    },
                    {
                        title:'My Account',
                        url:'/account/'+req.session[req.sessionID]+'/profile.html',
                        active:false
                    },
                    {
                        title:'customers',
                        url:'/admin/customers.html',
                        active:true
                    },
                    ],
                'customer':data[1],
                'siteattributes':data[2]
            });        
        }).catch((err)=>{
            console.log(err);
            res.status(404).render('404');
        })

})

router.route('/admin/customers.json')
.get(function(req,res){
    if (req.session && req.session[req.sessionID] && req.session['ctype'] && req.session['ctype']=='a') {
        CustomerController.getCustomers({
            offset:req.params.offset || 0
        })
        .then((customers)=>{
           res.json({status:200,customers:customers}); 
        }).catch((err)=>{
            console.log(err);
            res.status(500);
        })
    }else{
        res.status(500);       
    }
});

router.route('/admin/product/new.html')
.get(function(req,res){
        Promise.all([ProductController.getCategories(0), SiteattributeController.getAll()])
        .then((data)=>{
            res.render('newproduct',{
                'navigation':data[0],
                'navPath':[
                    {
                        title:'Home',
                        url:'/',
                        active:false
                    },
                    {
                        title:'My Account',
                        url:'/account/'+req.session[req.sessionID]+'/profile.html',
                        active:false
                    },
                    {
                        title:'newproduct',
                        url:'/admin/product/new.html.html',
                        active:true
                    },
                    ],
                'siteattributes':data[1]
            });        
        }).catch((err)=>{
            console.log(err);
            res.status(404).render('404');
        })        
})
.post(function(req,res){
    console.log(req.body);
    ProductController.create(req.body).then((newproduct)=>{
        ProductController.get({id:newproduct.id}).then((products)=>{
            data = ProductController.prepareForNavigation(products);
            res.status(200).json({status:302,redirect:'/'+data[0].agegrouptitle+'/'+data[0].category+'/'+data[0].subcategory+'/'+data[0].gendergroup+'/'+data[0].id+'/'+data[0].sku+'/'+data[0].name+'.html'});
        })        
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({status:500,products:[]});
    });
});

router.route('/admin/product/:id/edit.html')
.get(function(req,res){
    Promise.all([ProductController.getCategories(0),getProduct(req.params.id,true), SiteattributeController.getAll()])
    .then((data)=>{
        data[1]=ProductController.prepareForNavigation(data[1]);
        res.render('editproduct',{
            'navigation':data[0],
            'navPath':[
                {
                    title:'Home',
                    url:'/',
                    active:false
                },
                {
                    title:'My Account',
                    url:'/account/'+req.session[req.sessionID]+'/profile.html',
                    active:false
                },
                {
                    title:'product',
                    url:'/'+data[1].agegrouptitle+'/'+data[1].category+'/'+data[1].subcategory+'/'+data[1].gendergroup+'/'+req.params.id+'/any/'+data[1].name+'.html',
                    active:false
                },
                ],
            'product':data[1][0],
            'siteattributes':data[2]
        });        
    }).catch((err)=>{
        console.log(err);
        res.status(404).render('404');
    }) 
})
.put(function(req,res){
    ProductController.update(req.params.id,req.body).then((product)=>{
        ProductController.get({id:req.params.id}).then((products)=>{
            data = ProductController.prepareForNavigation(products);
            res.status(200).json({status:302,redirect:'/'+data[0].agegrouptitle+'/'+data[0].category+'/'+data[0].subcategory+'/'+data[0].gendergroup+'/'+data[0].id+'/'+data[0].sku+'/'+data[0].name+'.html'});
        })        
    }).catch((err)=>{
        res.status(500).json({status:500,products:[]});
    });
})
.delete(function(req,res){
    ProductController.update(req.params.id,{isdeleted:true, isactive:false}).then((product)=>{
        console.log(product.dataValues);
        res.status(200).json({status:302,redirect:'/'});
    }).catch((err)=>{
        res.status(500).json({status:500,products:[]});
    });
});

router.route('/admin/product/:id/image.html')
.post(function(req,res){
    ProductController
    .get({id:req.params.id})
    .then((products)=>{
    
        var count = 0;
        var form = new multiparty.Form({
            autoFields:true,
            autoFiles: true,
            uploadDir:'./uploads/'
        });

        var value1 = undefined;
        form.parse(req, function(err, fields, files) {
            value1 = undefined;
            var refid = fields.refid || '';
            var images=[];
            Object.keys(files).forEach(function(name) {
                value1 = files[name][0]['path'];
                var path = value1.slice(0,value1.lastIndexOf('.'));
                var ext = value1.slice(value1.lastIndexOf('.'));
                var ctype=files[name][0]['headers']['content-type'];
                jimp.read(value1,(err,img)=>{
                    if(err){
                        console.log(err);
                    }
                    images.push({
                        InventoryId:0,
                        ProdutId:req.params.id,
                        path:'/',
                        type:ctype,
                        actual:value1,
                        'xxl':path+'-1024'+ext,
                        'xl':path+'-512'+ext,
                        'lg':path+'-256'+ext,
                        'md':path+'-128'+ext,
                        'sm':path+'-64'+ext,
                        'xs':path+'-32'+ext
                    });
                    _.map(images,function(file,index){
                        jimp.read(file.actual,(err,img)=>{
                            if(err){
                                console.log(err);
                            }
                            _.map([1024,512,256,128,64,32],(size,index)=>{
                                var nImg = img.clone();
                                var path = file.actual.slice(0,file.actual.lastIndexOf('.'));
                                var ext = file.actual.slice(file.actual.lastIndexOf('.'));
                                var newFile= path+'-'+size+ext;
                                nImg.resize(size,jimp.AUTO).write(newFile);
                            });
                            console.log(file);
                            products[0].createProductImage(file);
                        })
                        return "a";
                    });
                });
            });
            res.status(200).json({status:302,redirect:'/admin/product/'+req.params.id+'/image.html',refid:refid[0]||''});
        });
    })
    .catch((err)=>{
        res.status(500).json({status:500,redirect:'/admin/product/'+req.params.id+'/image.html',refid:refid[0]||''});
    })
})
.delete(function(req,res){
    ProductController.deleteProdutImage(req.params.id,req.body.imageid).then((result)=>{
        console.log(req.body.imageid);
        res.status(200).json({status:302});
    }).catch((err)=>{
        res.status(200).json({status:302});
    })
});


router.route('/admin/product/:id/inventory.html')
.post(function(req,res){
    console.log(req.body);
    InventoryController
    .create(req.body).then((product)=>{
        res.status(200).json({status:302,inventories:product.dataValues});
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({status:500,inventories:[]});
    });
})
.delete(function(req,res){
    console.log(req.body);
    InventoryController
    .delete(req.params.id,req.body.id).then((product)=>{
        res.status(200).json({status:302});
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({status:500,inventories:[]});
    });
});

router.route('/admin/product/:productId/inventory/:id.html')
.put(function(req,res){
    console.log(req.body);
    InventoryController
    .update(req.params.id,req.body).then((product)=>{
        res.status(200).json({status:302,inventories:product.dataValues});
    }).catch((err)=>{
        res.status(500).json({status:500,inventories:[]});
    });
})
module.exports = router;