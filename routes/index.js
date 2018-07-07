module.exports = function (app) {
//  app.set('view engine', 'ejs');
	app.use('/',require('./homepage.js'));
	app.use('/ubike', require('./ubike.js'));
	app.use('/train', require('./train.js'));
	app.use('/tycbus', require('./tycbus.js'));
	app.use('/linecallback', require('./linecallback.js'));
	//app.use(static('public'));
  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.status(404).render('404')
    }
  })
}