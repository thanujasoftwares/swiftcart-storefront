var router = require('express').Router();

router.route('/')
.get(function(req,res){
    res.render('admin/index');
});

module.exports = router;