module.exports = function (pool) {
  async function myData() {
    let result = await pool.query('select * from greetings');
    return result.rows;
  }

  async function inputData(name, language) {
    await pool.query('INSERT INTO greetings (greeted_names, spotted_greetings, languages) values ($1, $2, $3)', [name, 1, language]);
  }

  async function countAll() {
    let counting = await pool.query('select count(*) from greetings');
    return counting.rows;

  }

  async function updateDb(){
    await pool.query('UPDATE greetings SET spotted_greetings = $1 where greeted_names = $2 ', [spottedCount, name]);

  }

  async function insertDb(){
  await pool.query('INSERT INTO greetings (greeted_names, spotted_greetings, languages) values ($1, $2, $3)', [name, 1, language]);

  }

  async function selectNames(){
  await pool.query('SELECT * from greetings where greeted_names = $1', [name])
  }

  async function updateNames(){
    pool.query('UPDATE greetings SET spotted_greetings = $1 where greeted_names = $2 ', [spottedCount, name]);
  }

  async function add(name, language){
          let user = await selectNames;
          if (user.rows.length != 0) {
            let spottedCount = user.rows[0].spotted_greetings;
            spottedCount++;
            await updateNames;
          } else {
            await pool.query('INSERT INTO greetings (greeted_names, spotted_greetings, languages) values ($1, $2, $3)', [name, 1, language]);
          }

  }

  return {
    myData,
    inputData,
    countAll,
    updateDb,
    insertDb,
    add
  }
}
