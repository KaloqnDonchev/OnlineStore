module.exports = function routePDP(req, res) {
  const { productId } = req.params;
  req.db.db('onlineShop').collection('products').findOne({ id: productId })
    .then((product) => {
      req.db.db('onlineShop').collection('currencies').findOne()
        .then((currenciesObj) => {
          const { currencies } = currenciesObj;
          res.render('pdp', { product, currencies });
        });
    });
};
