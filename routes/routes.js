// let Greetings = require('../greetings');
// const Services = require('../services/greet');
// const Routes = require('../routes/routes');
// let greetMe = Greetings();
// let greet = Services;

module.exports = function(services){    
    async function listAll(req, res) {
      try {
        let results = await services.myData();
        let database = results.rows;
        res.render('greeted', {
          database
        });
      } catch (err) {
        res.send(err.stack);
      }
    }

    async function greetUser(req,res){
        try {
    let name = req.body.name;
    let language = req.body.language;
    let greetName = greetMe.allGreetings(language, name);
  
    if (language === undefined || name === '') {
      let updating =  greet.updateDB;
      return updating;
    } else {
      let inserting = greet.insertDb;
      return inserting;
    }
  
    // let counting = await pool.query('select count(*) from greetings');
    // let databaseLength = counting.rows[0].count;

    res.render('home', {
      greetName,
      databaseLength,
    });
  } catch(err){
    res.send(err.stack)
  }
    }

    async function countNames(req, res){
      let counting = greet.countAll;
      return counting.rows;
    }
    return{
      listAll,
      greetUser,
      countNames
    }
}