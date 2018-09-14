let express = require('express');
const flash = require('express-flash');
const session = require('express-session');
let greetServices = require('../services/greet');
let assert = require('assert');
const pg = require('pg');
const Pool = pg.Pool;
// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
const app = express();

app.use(flash());
app.use(session({
    secret: 'greetings exercise',
    resave: false,
    saveUninitialized: true
}));
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder@localhost:5432/greetings';
const pool = new Pool({
    connectionString,
    ssl: useSSL
});

describe('count names in database', function () {
    beforeEach(async function () {
        await pool.query('delete from greetings');
    });
    it('should return return 0', async function () {
        let greet = greetServices(pool);
        let results = await greet.myData();
        assert.strictEqual(results.length, 0);
    });

    beforeEach(async function () {
        await pool.query('delete from greetings');
    });
    it('should return one greeted person', async function () {
        let greet = greetServices(pool);
        await greet.insertUser('Lihle', 'Molo');
        let results = await greet.myData();
        assert.strictEqual(results.length, 1);
    });

    beforeEach(async function () {
        await pool.query('delete from greetings');
    });
    it('should return two greeted people', async function () {
        let greet = greetServices(pool);
        await greet.insertUser('Lihle', 'Molo');
        await greet.insertUser('Ayanda', 'Molo');
        let results = await greet.myData();
        assert.strictEqual(results.length, 2);
    });

    beforeEach(async function () {
        await pool.query('delete from greetings');
    });
    it('count number of people greeted', async function () {
        let greet = greetServices(pool);
        await greet.insertUser('Lihle', 'Molo');
        await greet.insertUser('Ayanda', 'Molo');
        let results = await greet.countAll();
        assert.strictEqual(results, 2);
    });

    after(function () {
        pool.end;
    });
});
