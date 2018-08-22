let express = require('express');
let Greetings = require('./greetings');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

let app = express();
let greetMe = Greetings();

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));
// parse application/json
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function (req, res) {
  let count = greetMe.countAllGreets();
  res.render('home', {count});
});

app.post('/greet', function (req, res) {
  let name = req.body.name;
  let language = req.body.language;
  let greetName = greetMe.allGreetings(language, name);
  let count = greetMe.countAllGreets();

  res.render('home', {greetName,count});
});

app.get('/greet/:name/:language', function (req, res) {
  let name = req.params.name;
  let language = req.params.language;
  let greetName = greetMe.allGreetings(language, name);
  let count = greetMe.countAllGreets();
  console.log(req.params);
  
  res.render('home', {greetName, count});
});

let PORT = process.env.PORT || 3007;
app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});