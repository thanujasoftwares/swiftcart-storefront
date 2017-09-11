var express = require('express');
var path = require('path');
var cors = require('cors');
const commandLineArgs = require('command-line-args');
const optionDefinitions = [
    { name: 'port', alias: 'p', type: Number,defaultOption: 3000 }
  ]
const options = commandLineArgs(optionDefinitions);

if(!options){
    options.port = 3000;
}

var bodyParser = require('body-parser');
var routes = require('./routes/index.js');
const uuidv1 = require('uuid/v1');
var serverSession = require('express-session');
//var clientSession = require('client-session');
var app = express();

/* TEMPLATE ENGINE */
app.set('views', path.join(__dirname, 'views','mimity'));
app.set('view engine', 'ejs');

/* CORS */
app.use(function(req, res, next) {
    var allowedOrigins = ['http://127.0.0.1:4200', 'http://localhost:4200', 'http://127.0.0.1:4200', 'http://localhost:4200','http://www.hsshopie.com','http://www.fashionlegendary.com'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }    
   res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, content-type, Authorization, Content-Type, Accept,x-session-token,Pragma,Cache-Control,If-Modified-Since");
   res.header('Access-Control-Allow-Credentials', true);   
   next();
});

// app.use(cors({
//     optionsSuccessStatus:200,
//     preflightContinue:true,
//     credentials:true,
//     origin:[/\.localhost\$/]
// }));


/* UPLOAD */
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',extended: true, parameterLimit:50000 }));

var cookieParser = require('cookie-parser');
app.use(cookieParser());


/* SESSION */

app.use(serverSession({
    //cookieName: 'user',
    secret: 'MyAwesomeKiran',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    genid: function(req) {
        return uuidv1() // use UUIDs for session IDs
    },    
}));

// app.use(function (req, res, next) {
//     if (!req.session.views) {
//       console.log("i m here");
//       req.session.views = {}
//     }
  
//     // get the url pathname
//     var pathname = parseurl(req).pathname
  
//     // count the views
//     req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
  
//     next();
// })

/* ROUTES */
app.use('/', routes);


// app.use(function(req, res, next) {
//     if (req.user.token) {
//       res.setHeader('x-session-Token', uuidv1());
//     } else {
//       // setting a property will automatically cause a Set-Cookie response
//       // to be sent
//       var token = uuidv1();
//       req.user.token = token;
//       res.setHeader('x-session-Token', token);
//     }
//     next();
// });

/* REDIRECTS */
app.use('/',express.static(path.join(__dirname, 'www','mimity')));
app.use('/admin',express.static(path.join(__dirname, 'views','admin')));
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));


console.log("Launching Port Number: "+options.port);
app.listen(options.port);