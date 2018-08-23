let express = require('express');
let Greetings = require('./greetings');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

let app = express();
let greetMe = Greetings();

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local){
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder@localhost:5432/greetings';

const pool = new Pool({
    connectionString,
    ssl : useSSL
  });

const app = express();
app.use(session({
    secret: 'keyboard cat5 run all 0v3r',
    resave: false,
    saveUninitialized: true
}));

//handlebars
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

app.post('/add', async function(req, res) {
  let personName = req.body.greeted_names;
  if (personName && personName !== '') {
      await pool.query('insert into greeted (greeted_names, spotted_greetings) values ($1, $2)' , [personName, 1]);    
  }

  res.redirect('/');
});

let PORT = process.env.PORT || 3007;
app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});