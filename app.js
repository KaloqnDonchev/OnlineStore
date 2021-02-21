/* eslint-disable global-require */
// Module dependencies.
const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const expressMongoDb = require('express-mongo-db');
const soap = require('soap');
const { MongoClient, ObjectId } = require('mongodb');


const routes = {
  index: require('./routes/index'),
  categories: require('./routes/categories'),
  pdp: require('./routes/pdp'),
};

const app = express();

// All environments
app.use(expressMongoDb('mongodb://localhost:27017/onlineShop'));
app.set('port', 1666);
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.cookieParser('61d333a8-6325-4506-96e7-a180035cc26f'));
app.use(session({
  secret: 'forkpoint training',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);
app.use(express.errorHandler());
const client = new MongoClient('mongodb://localhost:27017/onlineShop');


// App routes
app.get('/', routes.index);
app.get('/categories/*', routes.categories);
app.get('/product/:productId', routes.pdp);

client.connect(() => {
  const db = client.db('onlineShop');
  soap.createClient('http://infovalutar.ro/curs.asmx?wsdl', (err, clientSoap) => {
    clientSoap.lastdateinserted((error, date) => {
      let latestDate = new Date(date.lastdateinsertedResult);
      latestDate.setHours(latestDate.getHours() + 2);
      latestDate = latestDate.toISOString();
      clientSoap.getall({ dt: latestDate }, (Error, result) => {
        const currencies = result.getallResult.diffgram.DocumentElement.Currency;
        db.collection('currencies').update({ _id: ObjectId('5fae71e83f764d0d8c94a8d3') }, { currencies });
        client.close();
      });
    });
  });
});

// Run server
http.createServer(app).listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`);
});
