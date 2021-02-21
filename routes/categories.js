let myObject;
function getObject(theObject, lastUrlId, secondLastUrlId) {
  let result = null;
  if (theObject instanceof Array) {
    for (let i = 0; i < theObject.length; i++) {
      result = getObject(theObject[i], lastUrlId, secondLastUrlId);
    }
  } else {
    for (const prop in theObject) {
      if (prop == 'parent_category_id') {
        if (theObject.id == lastUrlId && theObject.parent_category_id == secondLastUrlId) {
          myObject = theObject;
        }
      }
      if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
        result = getObject(theObject[prop], lastUrlId, secondLastUrlId);
      }
    }
  }
  return result;
}

module.exports = function routeCategory(req, res) {
  const urlParams = req.params[0].split('/');
  const lastUrlId = urlParams[urlParams.length - 1];
  const secondLastUrlId = urlParams[urlParams.length - 2];
  if (urlParams.length === 1) {
    req.db.db('onlineShop').collection('categories').find({ id: lastUrlId }).toArray()
      .then((data) => {
        if (data.length) {
          res.render('categories', { data, url: req.params[0] });
        } else {
          res.json({ error: 'Page not found' });
        }
      });
  } else if (urlParams.length === 3) {
    req.db.db('onlineShop').collection('products').find({ primary_category_id: lastUrlId }).toArray()
      .then((productObj) => {
        if (productObj) {
          res.render('plp', { productObj, url: req.params[0] });
        } else {
          res.json({ error: 'Product not found' });
        }
      });
  } else {
    req.db.db('onlineShop').collection('categories').find().toArray()
      .then((dataObject) => {
        getObject(dataObject, lastUrlId, secondLastUrlId);
        if (myObject) {
          res.render('categories', { data: [myObject], url: req.params[0] });
        } else {
          res.json({ error: 'Item not found' });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
