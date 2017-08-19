var router = require('express').Router();
var _ = require('lodash');
var async = require('async');
var jimp = require('jimp');
var mergeImage = require('merge-img');
var multer = require('multer');
var os = require('os');
var uuid = require('node-uuid');

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



//var {Menus} = require('../models');
var {ProductController, MenuController, InventoryController} = require('../controllers');
router.route('/welcome')
.get(function(req,res){
    res.status(200).json({'message':'hi'});
});

router.route('/menu')
.get(function(req,res){
    console.log(req.query);
    vendorid=req.query.vendorid || -1;
    ProductController
    .getCategories(vendorid)
    .then((menuitems)=>{

        // var uniqCat = [];
        // var uniqSub = [];
        
        // _.map(menuitems,function(item,index){
        //     uniqCat.push(item.category);
        //     uniqSub.push(item.subcategory);
        // })

        // uniqCat = _.uniq(uniqCat);
        // uniqSub = _.uniq(uniqSub);

        // res.status(200).json({statu:200,menu:{category:uniqCat, subcategory:uniqSub,menuitems: MenuController.getJSONDocument(menuitems)}});

        res.status(200).json({statu:200,menu:ProductController.getJSONDocument(menuitems)});

    })
    .catch((err)=>{
        res.status(404).json({statu:404,menu:[]});
    });
})

router.route('/menu/categories')
.get(function(req,res){
    console.log(req.query);
    vendorid=req.query.vendorid || -1;
    ProductController
    .getCategories(vendorid)
    .then((menuitems)=>{
        var uniqCat = [];
        var uniqSub = [];
        _.map(menuitems,function(item,index){
            uniqCat.push(item.category);
            uniqSub.push(item.subcategory);
        })
        uniqCat = _.uniq(uniqCat);
        uniqSub = _.uniq(uniqSub);
        res.status(200).json({statu:200,menu:{category:uniqCat, subcategory:uniqSub,menuitems: ProductController.getJSONDocument(menuitems)}});
        // res.status(200).json({statu:200,menu:ProductController.getJSONDocument(menuitems)});

    })
    .catch((err)=>{
        res.status(404).json({statu:404,menu:[]});
    });
})

router.route('/menu/materials')
.get(function(req,res){
    ProductController
    .get()
    .then((menuitems)=>{
        var uniqCat = [];
        var uniqSub = [];
        _.map(menuitems,function(item,index){
            uniqCat.push(item.materialtype);
        })
        uniqCat = _.uniq(uniqCat);
        res.status(200).json({statu:200,materials:uniqCat});
    })
    .catch((err)=>{
        res.status(404).json({statu:404,menu:[]});
    });
})

router.route('/products/')
.get(function(req,res){
    console.log(req.query);
    ProductController
    .get(req.query)
    .then((products)=>{
        res.status(200).json({statu:200,products:ProductController.getJSONDocument(products)});
    })
    .catch((err)=>{
        console.log(err);
        res.status(404).json({statu:404,products:[]});
    });
})
.post(function(req,res){
    console.log(req.body);
    ProductController.create(req.body).then((product)=>{
        console.log(product.dataValues);
        res.status(200).json({status:200,products:product.dataValues});
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({status:500,products:[]});
    });
})
;

router.route('/products/:id')
.get(function(req,res){
    console.log(req.query.params);
    ProductController
    .get(req.query)
    .then((products)=>{
        res.status(200).json({statu:200,products:ProductController.getJSONDocument(products)});
    })
    .catch((err)=>{
        res.status(404).json({statu:404,products:[]});
    });
})  
.put(function(req,res){
    console.log(req.body);
    ProductController.update(req.params.id,req.body).then((product)=>{
        console.log(product.dataValues);
        res.status(200).json({status:200,products:product.dataValues});
    }).catch((err)=>{
        res.status(500).json({status:500,products:[]});
    });
})
;


router.route('/products/:id/inventory')
.get(function(req,res){
    console.log(req.query.params);
    InventoryController
    .get(req.query)
    .then((products)=>{
        res.status(200).json({statu:200,inventories:InventoryController.getJSONDocument(products)});
    })
    .catch((err)=>{
        res.status(404).json({statu:404,inventories:[]});
    });
})
.post(function(req,res){
    console.log(req.body);
    InventoryController
    .create(req.body).then((product)=>{
        res.status(200).json({status:200,inventories:product.dataValues});
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({status:500,inventories:[]});
    });
});

router.route('/products/:productId/inventory/:id')
.get(function(req,res){
    console.log(req.query.params);
    InventoryController
    .get(req.query)
    .then((products)=>{
        res.status(200).json({statu:200,inventories:InventoryController.getJSONDocument(products)});
    })
    .catch((err)=>{
        res.status(404).json({statu:404,inventories:[]});
    });
})
.put(function(req,res){
    console.log(req.body);
    InventoryController
    .update(req.params.id,req.body).then((product)=>{
        res.status(200).json({status:200,inventories:product.dataValues});
    }).catch((err)=>{
        res.status(500).json({status:500,inventories:[]});
    });
});


router.route('/products/:id/images')
.get(function(req,res){
    console.log("i m here");
    console.log(req.query.params);
})
.post(function(req,res){
    ProductController
    .get({id:req.params.id})
    .then((products)=>{
        upload(req, res, function (err) {
            if (err) {
                console.log(err);
                res.status(500).json({status:500,images:[]});
            }
            var images=[];
            req.files.map((file,index)=>{
                var path = file.path.slice(0,file.path.lastIndexOf('.'));
                var ext = file.path.slice(file.path.lastIndexOf('.'));
                images.push({
                    ProdutId:req.params.id,
                    type:file.mimetype,
                    path:'http://localhost:3000/',
                    actual:file.path,
                    'xxl':path+'-1024'+ext,
                    'xl':path+'-512'+ext,
                    'lg':path+'-256'+ext,
                    'md':path+'-128'+ext,
                    'sm':path+'-64'+ext,
                    'xs':path+'-32'+ext
                });
            });
            async.map(images,function(file,index){
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
                    })
                    products[0].createProductImage(file);
                })
                return "a";
            }
            ,function(err,results){
                console.log(results);
            });
            res.status(200).json({status:200,images:images});
        });
    })
});

router.route('/products/:id/inventory/:inventoryid/images')
.get(function(req,res){
    console.log("i m here");
    console.log(req.query.params);
})
.post(function(req,res){
    ProductController
    .get({id:req.params.id})
    .then((products)=>{
        upload(req, res, function (err) {
            if (err) {
                console.log(err);
                res.status(500).json({status:500,images:[]});
            }
            var images=[];
            req.files.map((file,index)=>{
                var path = file.path.slice(0,file.path.lastIndexOf('.'));
                var ext = file.path.slice(file.path.lastIndexOf('.'));
                images.push({
                    InventoryId:req.params.inventoryid,
                    ProdutId:req.params.id,
                    type:file.mimetype,
                    path:'http://localhost:3000/',
                    actual:file.path,
                    'xxl':path+'-1024'+ext,
                    'xl':path+'-512'+ext,
                    'lg':path+'-256'+ext,
                    'md':path+'-128'+ext,
                    'sm':path+'-64'+ext,
                    'xs':path+'-32'+ext
                });
            });
            async.map(images,function(file,index){
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
                    })
                    products[0].createProductImage(file);
                })
                return "a";
            }
            ,function(err,results){
                console.log(results);
            });
            res.status(200).json({status:200,images:images});
        });
    })
});

/*
router.route('/:tablename/:id?')
.get(function(req,res){
    var table;
    switch(req.params.tablename){
        case 'menu':
            table = Menus;
            break;
        case 'product':
            table = Products;
            break;
        case 'catalog':
            break;
        case 'recommendations':
            break;
        case 'ratings':
            break;
        case 'reviews':
            break;
        case 'customer':
            break;
        case 'cart':
            break;
            
    }
    console.log(Menus.rawAttributes);
    table.get(req.params.id).then(function(data,err){
        if(err){
            res.status(404).json({});
        }
        var m = []
        _.map(data,(menu,index)=>{
            m.push(menu.dataValues);
        });
        res.status(200).json(m);
    });    
});
*/
module.exports= router;