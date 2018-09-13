module.exports = function (services, greetMe) {
    async function homeRoute (req, res) {
        let databaseLength = await services.countAll();
        res.render('home', {
            databaseLength
        });
    }
    async function listAll (req, res) {
        try {
            let results = await services.myData();
            let database = results;
            res.render('greeted', {
                database
            });
        } catch (err) {
            res.send(err.stack);
        }
    }

    async function greetUser (req, res) {
        try {
            let name = req.body.name;
            let language = req.body.language;
            let greetName = greetMe.allGreetings(language, name);

            if (language === undefined || name === '') {

            } else {
                await services.tryAddUser(name, language);
            }

            let databaseLength = await services.countAll();
            res.render('home', {
                greetName,
                databaseLength,
                greetUser
            });
        } catch (err) {
            res.send(err.stack);
        }
    }

    async function greetOnUrl (req, res) {
        try {
            let name = req.params.name;
            let language = req.params.language;
            let greetName = greetMe.allGreetings(language, name);

            if (language === undefined || name === '') {

            } else {
                await services.tryAddUser(name, language);
            }

            let databaseLength = await services.countAll();
            res.render('home', {
                greetName,
                databaseLength,
                greetUser
            });
        } catch (err) {
            res.send(err.stack);
        };
    }

    async function tableData (req, res) {
        try {
            let username = req.params.name;
            let count = await services.getUserCounter(username);
            res.render('add', {
                count,
                username
            });
        } catch (err) {
            res.send(err.stack);
        }
    }

    async function clearDb (req, res) {
        try {
            let reset = await services.resetDb();
            res.render('home', {
                reset
            });
        } catch (err) {
            res.send(err.stack);
        }
    }
    return {
        listAll,
        greetUser,
        homeRoute,
        greetOnUrl,
        tableData,
        clearDb
    };
};
