let express = require('express');
let Greetings = require('./greetings');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

let greetMe = Greetings();
const pg = require("pg");
const Pool = pg.Pool;
// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}

const flash = require('express-flash');
const session = require('express-session');

// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder@localhost:5432/greetings';

const pool = new Pool({
  connectionString,
  ssl: useSSL
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
  let counting = await pool.query('select count(*) from greetings');
  let databaseLength = counting.rows[0].count;
  res.render('home', {
    databaseLength
  });
});

app.post('/greet', async function (req, res) {
  try {
    let name = req.body.name;
    let language = req.body.language;
    let greetName = greetMe.allGreetings(language, name);
  
    if (language === undefined || name === '') {
  
    } else {
      let user = await pool.query('select * from greetings where greeted_names = $1', [name]);
      if (user.rows.length != 0) {
        let spottedCount = user.rows[0].spotted_greetings;
        spottedCount++;
        await pool.query('UPDATE greetings SET spotted_greetings = $1 where greeted_names = $2 ', [spottedCount, name]);
      } else {
        await pool.query('INSERT INTO greetings (greeted_names, spotted_greetings, languages) values ($1, $2, $3)', [name, 1, language]);
      }
    }
  
    let counting = await pool.query('select count(*) from greetings');
    let databaseLength = counting.rows[0].count;
  
    res.render('home', {
      greetName,
      databaseLength,
    });
  } catch(err){
    res.send(err.stack)
  }

});

app.get('/greet/:name/:language', async function (req, res) {
  let name = req.params.name;
  let language = req.params.language;
  let greetName = greetMe.allGreetings(language, name);
  // let count = greetMe.countAllGreets();

  let user = await pool.query('select * from greetings where greeted_names = $1', [name]);
  if (user.rows.length != 0) {
    let spottedCount = user.rows[0].spotted_greetings;
    spottedCount++;
    await pool.query('UPDATE greetings SET spotted_greetings = $1 where greeted_names = $2', [spottedCount, name]);
  } else {
    await pool.query('INSERT INTO greetings (greeted_names, spotted_greetings, languages) values ($1, $2, $3)', [name, 1, language]);
  }
  let counting = await pool.query('select count(*) from greetings');
  let databaseLength = counting.rows[0].count;

  res.render('home', {
    greetName,
    databaseLength,
    user
  });
});

//keep in database
app.get('/greeted', async function (req, res) {
  try {
    let results = await pool.query('select * from greetings');
    let database = results.rows;
    res.render('greeted', {
      database
    });
  } catch (err) {
    res.send(err.stack);
  }
});

app.get('/add/:name', async function (req, res) {
  let username = req.params.name;
  let counting = await pool.query('select * from greetings where greeted_names = $1', [username]);
  let count = counting.rows[0].spotted_greetings;
  res.render('add', {
    count,
    username
  });
});

app.get('/reset', async function (req, res) {
  let reset = await pool.query('delete from greetings');
  res.render('home', {
    reset
  })
});

let PORT = process.env.PORT || 3007;
app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});