/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

// yoPanic
//exports.partial = function (req, res) {
//  var partial = req.params.partial;
//  res.render('/' + partial);
//};
//
//exports.id = function (req, res) {
//  var partial = req.params.partial,
//    id = req.params.id;
//    res.render('/' + partial + "/" + id);
//};