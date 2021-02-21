module.exports = function routeIndex(req, res) {
  req.db.db('onlineShop').collection('categories').find().toArray()
    .then((data) => {
      if (data.length) res.render('categories', { data, url: req.params[0] });
      else res.json({ error: 'Page not found' });
    });
};
