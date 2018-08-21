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
  let returnValue = greetMe.allGreets();
  res.render('home', {
    returnValue
  });
});

app.post('/greet', function (req, res) {
  let greeted = req.body.input;
  let input = req.body.language;
  let greetName = greetMe.allGreetings(input, greeted);

  res.render('home', {
    greetName
  })
  console.log(greeted)
});

let PORT = process.env.PORT || 3007;
app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});