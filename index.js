let express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const Services = require('./services/greet');
const Routes = require('./routes/routes');
let Greetings = require('./greetings');

const pg = require('pg');
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
let greetMe = Greetings();
let services = Services(pool);
let routes = Routes(services, greetMe);

const app = express();
app.use(session({
    secret: 'greetings exercise',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// handlebars
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

app.get('/', routes.homeRoute);
app.post('/greet', routes.greetUser);
app.get('/greet/:name/:language', routes.greetOnUrl);
app.get('/greeted', routes.listAll);
app.get('/add/:name', routes.tableData);
app.get('/reset', routes.clearDb);

let PORT = process.env.PORT || 3007;
app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});
