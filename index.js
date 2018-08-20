let express = require('express');
let Greetings = require('./greetings');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');

let app = express();
let greetMe = Greetings();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
extended: false
}));
// parse application/json
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function(req, res){
let greeted = greetMe.allGreetings();
let input = greetMe.allGreetings();
let greetMsg = greetMe.allGreetings();

greetMe.setInput(greeted);
console.log(greeted);
res.render('home', {greeted, input, greetMsg});
});

app.post('/greet', function(req, res){
  // let greete = greetMe.allGreetings();

let greeted = req.body.greet;
let input = req.body.enterInput;
let greetMsg = req.body.greetMsg;

greetMe.setInput(greeted);
greetMe.setOptions(input);

console.log(greeted);
res.render('home', {greeted, input, greetMsg})
});

app.post('/action', function(req, res){
let greetMsg = greetMe.setInput();
greetMe.allGreetings(greetMsg);
res.render('home', {greetMsg});
});

let PORT = process.env.PORT || 3007;
app.listen(PORT, function(){
console.log('App starting on port', PORT);
});