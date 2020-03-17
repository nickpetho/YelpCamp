const port = 3000;
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	flash = require('connect-flash'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	passportLocalMongoose = require('passport-local-mongoose'),
	seedDB = require('./seeds'),
	User = require('./models/user');

// Requiring Routes
var campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes = require('./routes/comments'),
	indexRoutes = require('./routes/index');

// App Config.
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
//seedDB();

// Passport Config.
app.use(
	require('express-session')({
		secret: 'Some roast beef some chicken a pizza',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

//Tell Express to listen for requests (start server)
app.listen(port, function() {
	console.log(`Server has started on Port ${port}`);
});
