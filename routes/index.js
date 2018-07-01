module.exports = function (app) {
	
  app.use('/',require('./homepage'));
  app.use('/ubike', require('./ubike'));
  app.use('/train', require('./train'));
  app.use('/tycbus', require('./tycbus'));

  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.status(404).render('404')
    }
  })
}