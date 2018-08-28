let express = require('express');
let Greetings = require('./greetings');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

// let app = express();
let greetMe = Greetings();

const session = require('express-session');
const pg = require("pg");
const Pool = pg.Pool;
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

app.get('/', async function (req, res) {
  let count = greetMe.countAllGreets();

  res.render('home', {count});
});

app.post('/greet', async function (req, res) {
  let name = req.body.name;
  let language = req.body.language;
  let greetName = greetMe.allGreetings(language, name);
  let count = greetMe.countAllGreets();

  // if (name != '' && language != undefined){
  //   let user = await pool.query('SELECT * FROM greetings WHERE greeted_names = $1, [name]');
  //   if (user.rows.length === 0){
  //    await pool.query('INSERT INTO greetings(greeted_names, spotted_greetings) values ($1, $2)', [name, language]);
  //     await pool.query('INSERT INTO countGreet (count) values ($1)', [1]);
  //     greetMe.alGreetings(name, language);
  //   }
  //   else {
  //     let counter = await pool.query('SELECT ')
  //   }
  // }
  res.render('home', {greetName,count});
});

app.get('/greet/:name/:language', async function (req, res) {
  let name = req.params.name;
  let language = req.params.language;
  let greetName = greetMe.allGreetings(language, name);
  let count = greetMe.countAllGreets();
  
  res.render('home', {greetName, count});
});

app.get('/greeted', async function (req, res) {
  try {
    let results = await pool.query('select * from greetings');
    let database = results.rows;
    res.render('greeted', {database});
  } catch (err) {
    res.send(err.stack);
  }
});

let PORT = process.env.PORT || 3007;
app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});