'use strict';
var moment = require('moment');
module.exports = function(sequelize, DataTypes) {

var Product = sequelize.define('Products', 
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            type:DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        category:{
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,
            }
        },
        subcategory:{
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,
            }
        },
        VendorId:{
            allowNull: false,
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        manufacturename:{
            allowNull: false,
            type: DataTypes.STRING,
            defaultValue: 'none',
        },
        modelno:{
            allowNull: false,
            type: DataTypes.STRING,
            defaultValue: 'none',
        },
        materialtype:{
            allowNull: false,
            type: DataTypes.STRING,
        }, 
        sku: {
            type:DataTypes.TEXT,
            allowNull: true
        }, 
        isfeatured:{
            allowNull: true,  
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isnew:{
            allowNull: true,  
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },    
        issale:{
            allowNull: true,  
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isbestseller:{
            allowNull: true,  
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isdeal:{
            allowNull: true,  
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        ishot:{
            allowNull: true,  
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },            
        isactive:{
            allowNull: true,  
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },            
        isdeleted:{
            allowNull: true,  
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        gender:{
            allowNull: false,  
            type: DataTypes.ENUM('m','f','u')
        }, 
        agegroup:{
            allowNull: false,  
            type: DataTypes.ENUM('n','i','k','t','y','a','s')
        }, 
        shortdesc:{
            allowNull: true,  
            type: DataTypes.STRING(512),
            defaultValue: "no description availiable"
        }, 
        longdesc:{
            allowNull: true,  
            type: DataTypes.TEXT,
            defaultValue: "no description availiable"
        }, 
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: function(){
                return moment().format('YYYY-MM-DD');
            }
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: function(){
                return moment().format('YYYY-MM-DD');
            }        
        }               
    }
);



// /* Relationship */
Product.associate = (models) => {
    Product.hasMany(models.Catalogs);
    Product.hasMany(models.ProductImages);
    //Product.hasOne(models.Materials);
    //Product.hasOne(models.Manufactures);
    Product.hasOne(models.Ratings);
    Product.hasOne(models.Reviews);    
    Product.belongsToMany(models.Products, { foreignKey: 'ProductId', through: models.Recommendations,as: 'ProductRecommendations'});
    Product.hasMany(models.Inventories);
    Product.hasMany(models.OrderItems);
}

Product.hooks = (models) => {
    Product.afterCreate((product, options) => {
        product.createRating({star1:0,star2:0,star3:0,star4:0});
    });   
    Product.beforeDestroy((product, options) => {
        product.getRatings().then((ratings)=>{
            ratings.destroy();
        });
    });     
}


Product.getColumns = () => {
    return [
        'id','name','category','subcategory','VendorId','manufacturename','modelno',
        'materialtype','isfeatured','isnew','isdeleted','gender','agegroup','shortdesc',
        'longdesc','createdAt','updatedAt'
    ]
}

// Object.assign(Product.prototype, {
//     addRating: function(star) {
//         console.log(th)
//     }
// });

// /* Class Methods */

Product.getCategories = (VendorId) => {
    return new Promise(function(resolve,reject){
        sequelize.query('SELECT DISTINCT "agegroup","category", "subcategory" FROM "Products" where "isdeleted"=false and "VendorId"='+VendorId+" ORDER BY 1,2,3 ", {type: sequelize.QueryTypes.SELECT}).then((data) => {
            resolve(data);
        }).catch((err)=>{
            reject(err);
        });
    });    
}

Product.query = (sql) => {
    return new Promise(function(resolve,reject){
        sequelize.query(sql, {type: sequelize.QueryTypes.SELECT}).then((data) => {
            resolve(data);
        }).catch((err)=>{
            reject(err);
        });
    });    
}


// Product.getCategories = () => {
//     return new Promise(function(resolve,reject){
//         sequelize.query('SELECT DISTINCT category, subcategory FROM "Products"', {type: sequelize.QueryTypes.SELECT}).then((data) => {
//             resolve(data);
//         }).catch((err)=>{
//             reject(err);
//         });
//     });    
// }

// Product.get = function(id){
//     var where = {
//        isdeleted: false 
//     }
//     if(id){
//         where = {
//             id: id 
//         }
//     }
//     return this.findAll({
//         include:[
//         {
//             model:sequelize.models.Menus
//         },
//         {
//            model:sequelize.models.Catalogs 
//         }
//         ],
//         where:where
//     });
// };

// Product.getAll = function(id){
//     return this.findAll();
// };

// Product.delete = function(id){
//     return this.update({isdeleted: true},{where:{id:id}});
// };

// Product.destroy = (id) => {
//     return new Promise(function(resolve,reject){
//         Product.find({where:{id: id}}).then(function(product,err){
//             if(product){
//                 product.destroy(true);
//                 resolve(true);
//             }else{
//                 reject(false);
//             }
//         });
//     });
// };

return Product
}