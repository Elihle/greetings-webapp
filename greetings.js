module.exports = function Greetings(stored) {
  let greetedNames = stored || {};
  let name = '';
  let language = '';

  function greet(language, name) {
    if (greetedNames[name] === undefined) {
      greetedNames[name] = 0;
      // localStorage.setItem('greetedNames',JSON.stringify(greetedNames));
    }
    if (language === 'English') {
      return 'Hello, ' + name;
    }
    if (language === 'Afrikaans') {
      return 'Hallo, ' + name;
    }
    if (language === "isiXhosa") {
      return 'Molo, ' + name;
    }
  }

  function setName(value) {
    name = value;
  }

  function setLanguage(value) {
    language = value;
  }

  function greetSpottedCounter() {
    // let storedNames = JSON.parse(localStorage.getItem("greetedNames"));
    //  return Object.keys(storedNames).length;
    return storedNames;
  }

  function greetCounter() {
    return greetedNames;
  }

  return {
    allGreetings: greet,
    countAllGreets: greetSpottedCounter,
    countAllNames: greetCounter,
    setInput: setName,
    setOptions: setLanguage
  }
}