module.exports = function (app) {
  app.use('/',require('./homepage'));
  
 // app.use('/signup', require('./signup'))
 // app.use('/signin', require('./signin'))
  //app.use('/signout', require('./signout'))
  app.use('/ubike', require('./ubike'));
  //app.use('/comments', require('./comments'))

  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.status(404).render('404')
    }
  })
}