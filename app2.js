//Username: appuser
//Access key ID: AKIAJOJXLVJPS6VDTDSA
//Secreat: 0Bskrw8BR4z+L2+aPVQABVBkg5F6LH65YwUA5Mwu

var dynamoose = require('dynamoose');
var Schema = dynamoose.Schema;

dynamoose.AWS.config.update({
  accessKeyId: 'AKIAJOJXLVJPS6VDTDSA',
  secretAccessKey: '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',
  region: 'ap-south-1'
});

var MenuSchema = new Schema({
    id: Number, 
    category: String, 
    subcategory: String 
},{
        create: true, 
        upate: false, 
        waitForActive: true, 
        waitForActiveTimeout: 180000,  
        throughput: {
            read: 5,
            write: 2
        }
});
MenuSchema.statics.getAll = function(cb){
  this.scan().exec(cb)
}


var Menu = dynamoose.model('Menu', MenuSchema)
// var newmenu = new Menu({
//     id: 0, 
//     category: 'Category 1', 
//     subcategory: 'Sub Category 10' 
// });

// newmenu.save(function (err) {
//   if(err) { return console.log(err); }
//   console.log('Ta-da!');
// });

// var newmenu = new Menu({
//     id: 1, 
//     category: 'Category 2', 
//     subcategory: 'Sub Category 20' 
// });

// newmenu.save(function (err) {
//   if(err) { return console.log(err); }
//   console.log('Ta-da!');
// });

// Menu.getAll(function(err, menus){
//     menus.forEach(function(menu){
//       console.log(menu)
//     })
// })

Menu.getAll(function(err, menus){
    menus.forEach(function(menu){
      console.log(menu.id)
    })
});