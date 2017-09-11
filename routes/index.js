'use strict';
var _ = require('lodash');
var router = require('express').Router();
var customer = require('./customer');
var admin = require('./admin');
var api = require('./api');
router.use('/', customer);
router.use('/admin', admin);
router.use('/api', api);


/**
 * This route execute when all routers are failed to load
 */

router.route('*.html')
.get((req,res)=>{
    res.status(404).render('404');
})

module.exports = router;