var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect("/catalog")
}),

router.get('/users/cool/',function(req,res,next) {
  res.send('2222')
})

module.exports = router;
