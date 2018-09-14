module.exports = function Greetings (stored) {
    let greetedNames = stored || {};

    function greet (language, name) {
        if (greetedNames[name] === undefined) {
            greetedNames[name] = 0;
        }
        if (language === 'English') {
            return 'Hello, ' + name.toUpperCase();
        }
        if (language === 'Afrikaans') {
            return 'Hallo, ' + name.toUpperCase();
        }
        if (language === 'isiXhosa') {
            return 'Molo, ' + name.toUpperCase();
        }
    }

    function greetSpottedCounter () {
        let storedNames = greetedNames;
        return Object.keys(storedNames).length;
    }

    function greetCounter () {
        return greetedNames;
    }

    return {
        allGreetings: greet,
        countAllGreets: greetSpottedCounter,
        countAllNames: greetCounter
    };
};
