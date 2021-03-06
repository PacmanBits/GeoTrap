var express      = require('express')       ;
var path         = require('path')          ;
var favicon      = require('serve-favicon') ;
var logger       = require('morgan')        ;
var cookieParser = require('cookie-parser') ;
var bodyParser   = require('body-parser')   ;

// DB/mongoose stuff
var dbConfig = require('./db.js')  ;
var mongoose = require('mongoose') ;

mongoose.connect(dbConfig.url);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// Configuring Passport
var passport       = require('passport')        ;
var expressSession = require('express-session') ;

// Secret is a seed for encrypting passwords, or a salt - not really sure which, but it's important either way
app.use(expressSession({secret: 'd41d8cd98f00b204e9800998ecf8427e'}));
app.use(passport.initialize());
app.use(passport.session());

// connect-flash:  middleware for storing/retrieving messages in sessions
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next)
{
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development')
{
	app.use(function(err, req, res, next)
	{
		res.status(err.status || 500);
		
		res.render('error', {
			message : err.message,
			error   : err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next)
{
	res.status(err.status || 500);
	
	res.render('error', {
		message : err.message,
		error   : {}
	});
});


module.exports = app;
