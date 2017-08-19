var _ = require('lodash');
//var ProductController = require('./controllers/productcontroller');
var {ProductController} = require ('./controllers/');

// MenuController.getCategories().then((menus)=>{
//     var m=[]
//     _.map(menus,(menu,index)=>{
//         m.push(menu.dataValues);
//     });
//     console.log(m);
// }).catch((err)=>{
//     console.log(err);
// });

// console.log(products);

//var Models = require('./models');
//var {Menus, Products, Orders, Customers} = require('./models');
//console.log(Models);
/*
Menus.get(1).then(function(data,err){
    if(err){
        console.log(err);
    }
    var m = []
    _.map(data,(menu,index)=>{
        m.push(menu.dataValues);
    });
    console.log(m);
});

Menus.get().then(function(data,err){
    if(err){
        console.log(err);
    }
    var m=[]
    _.map(data,(menu,index)=>{
        m.push(menu.dataValues);
    });
    console.log(m);
});

*/

// ProductController.getCategories().then(function(data){
//     _.map(data,(value,index)=>{
//         console.log(value.category,value.subcategory);
//     })
// }).catch((err)=>{
//     console.log(err);
// });

// ProductController.get().then(function(data,err){
//     if(err){
//         console.log(err);
//     }
//     var m=[]
//     _.map(data,(product,index)=>{
//         m.push(product.dataValues);
//     });
//     console.log(m);
// });

// Orders.get().then(function(data,err){
//     if(err){
//         console.log(err);
//     }
//     var m=[]
//     _.map(data,(product,index)=>{
//         m.push(product.dataValues);
//     });
//     console.log(m);
// });


// Customers.get().then(function(data,err){
//     if(err){
//         console.log(err);
//     }
//     var m=[]
//     _.map(data,(product,index)=>{
//         m.push(product.dataValues);
//     });
//     console.log(m);
// });

// console.log(Products.destroy(10).then((data)=>{
//     console.log("delted",data);
// }).catch((err)=>{
//     console.log("not found",err);
// }));


//Menus.delete(12);

// ProductController.create({
//     name:'test product',
//     category: 'category 3',
//     subcategory: 'sub category4',
//     isfeatured: true,
//     isnew: true,
//     agegroup:'n',
//     gender:'m'
// }).then((product)=>{
//     console.log(product.dataValues);
// }).catch((err)=>{
//     console.log(err);
// });

// ProductController.get({
//     category: 'category 3',
//     subcategory: 'sub category4',
//     isfeatured: true,
//     isnew: true,
//     include:{
//         Catalogs:true,
//         Ratings:true,
//         Recommendations:true,
//         Reviews:true,
//     }
// }).then((products)=>{
//     _.map(products,(product,index)=>{
//         //product.getProductRecommendations();
//         //product.getMenu();
//         console.log(product.id,product.MenuId,product.Menu.category);
//     })
// }).catch((err)=>{
//     console.log(err);
// });

ProductController.get({
    id:1,
}).then((products)=>{
    var img={"ProdutId":"1","type":"image/jpeg","actual":"uploads/ebc71602-1033-4616-9648-7b4a128ae3fa.jpg","xl":"uploads/ebc71602-1033-4616-9648-7b4a128ae3fa-512.jpg","lg":"uploads/ebc71602-1033-4616-9648-7b4a128ae3fa-256.jpg","md":"uploads/ebc71602-1033-4616-9648-7b4a128ae3fa-128.jpg","sm":"uploads/ebc71602-1033-4616-9648-7b4a128ae3fa-64.jpg","xs":"uploads/ebc71602-1033-4616-9648-7b4a128ae3fa-32.jpg"};    
    products[0].createProductImage(img);
}).catch((err)=>{
    console.log(err);
});


// ProductController.getId(3).then((product)=>{
//     product.getMenu().then(function(menu){
//         console.log(menu.category);
//     })
//     // product.getProductRecommendations();
// }).catch((err)=>{
//     console.log(err);
// });

// ProductController.getCategories(0).then((data)=>{
//     console.log(data);
// })