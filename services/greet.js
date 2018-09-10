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
  return {
    myData,
    inputData,
    countAll
  }
}