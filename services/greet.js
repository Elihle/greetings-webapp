module.exports = function (pool) {
    async function myData () {
        let result = await pool.query('select * from greetings');
        return result.rows;
    }

    async function selectUser (name) {
        let results = await pool.query('select * from greetings where greeted_names = $1', [name]);
        return results.rows;
    }

    async function updateUser (spottedCount, name) {
        await pool.query('UPDATE greetings SET spotted_greetings = $1 where greeted_names = $2', [spottedCount, name]);
    }

    async function insertUser (name, language) {
        await pool.query('INSERT INTO greetings (greeted_names, spotted_greetings, languages) values ($1, $2, $3)', [name, 1, language]);
    }

    async function tryAddUser (name, language) {
        let user = await selectUser(name);

        if (user.length !== 0) {
            let spottedCount = user[0].spotted_greetings;
            spottedCount++;
            await updateUser(spottedCount, name);
        } else {
            await insertUser(name, language);
        }
    }

    async function countAll () {
        let counting = await pool.query('select count(*) from greetings');
        let databaseLength = counting.rows[0].count;
        return databaseLength;
    }

    async function getUserCounter (username) {
        let counting = await pool.query('select * from greetings where greeted_names = $1', [username]);
        let count = counting.rows[0].spotted_greetings;
        return count;
    }

    async function resetDb () {
        let results = pool.query('delete from greetings');
        return results;
    }

    return {
        myData,
        selectUser,
        updateUser,
        insertUser,
        tryAddUser,
        countAll,
        getUserCounter,
        resetDb
    };
};
