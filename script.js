const wordList = new Set(
    [
        'a', 'n', 'akesi', 'ala', 'alasa', 'ale', 'ali', 'anpa', 'ante', 'anu', 'awen', 
        'e', 'en', 'esun', 'ijo', 'ike', 'ilo', 'insa', 'jaki', 'jan', 'jelo', 
        'jo', 'kala', 'kalama', 'kama', 'kasi', 'ken', 'kepeken', 'kijetesantakalu', 'misikeke',
        'kili', 'kiwen', 'ko', 'kon', 'ku', 'kin', 'kule', 'kulupu', 'kute', 'la', 'lape', 
        'laso', 'lawa', 'len', 'lete', 'li', 'lili', 'linja', 'lipu', 'loje', 'lon', 
        'luka', 'lukin', 'lupa', 'ma', 'mama', 'mani', 'meli', 'mi', 'mije', 'moku', 
        'moli', 'monsi', 'monsuta', 'mu', 'mun', 'musi', 'mute', 'nanpa', 'nasa', 
        'nasin', 'nena', 'ni', 'nimi', 'noka', 'o', 'olin', 'ona', 'open', 'pakala', 
        'pali', 'palisa', 'pan', 'pana', 'pi', 'pilin', 'pimeja', 'pini', 'pipi', 
        'poka', 'poki', 'pona', 'pu', 'sama', 'seli', 'selo', 'seme', 'sewi', 
        'sijelo', 'sike', 'sin', 'sina', 'soko', 'sinpin', 'sitelen', 'sona', 'soweli', 
        'suli', 'su', 'suno', 'supa', 'suwi', 'tan', 'taso', 'tawa', 'telo', 'tenpo', 
        'toki', 'tomo', 'tonsi', 'tu', 'unpa', 'uta', 'utala', 'walo', 'wan', 
        'waso', 'wawa', 'weka', 'wile'
    ]
);
const vowels = new Set(["a", "e", "i", "o", "u"]);
let language = {
    eng: {
        labelNimi: "Write a word:",
        labelSama: "Choose a type of rhyme:",
        samaOption1: "Consonant",
        samaOption2: "Assonant",
        labelSyllabes: "Choose how many syllabes to rhyme:",
        buttonSend: "Rhyme",
        labelResults: "Words that rhyme:",
        labelAuthor: "By jan Ine",
        labelWebsite: "My website",
        labelGithub: "Github",
        labelGitlab: "Gitlab",
        wordNotFound : "Word not in list"
    },
    es: {
        labelNimi: "Escribe una palabra:",
        labelSama: "Elige un tipo de rima:",
        samaOption1: "Consonante",
        samaOption2: "Asonante",
        labelSyllabes: "Elige cuántas silabas a rimar:",
        buttonSend: "Rimar",
        labelResults: "Palabras que riman:",
        labelAuthor: "Hecho por jan Ine",
        labelWebsite: "Mi web",
        labelGithub: "Github",
        labelGitlab: "Gitlab",
        wordNotFound: "La palabra no existe en la lista"
    },
    tok: {
        labelNimi: "o pana e nimi:",
        labelSama: "o pana e sama:",
        samaOption1: "sama sama",
        samaOption2: "sama poka",
        labelSyllabes: "o pana e nanpa pi kalama pini tawa sama:",
        buttonSend: "o tawa",
        labelResults: "nimi sama:",
        labelAuthor: "tan jan Ine",
        labelWebsite: "lipu mi",
        labelGithub: "ilo Github",
        labelGitlab: "ilo Gitlab",
        wordNotFound: "nimi li lon ala"
    },
    fr: {
        labelNimi: "Donnez le mot:",
        labelSama: "Donnez le type de rime:",
        samaOption1: "Assonant",
        samaOption2: "Consonant",
        labelSyllabes: "Donnez le nombre des syllabes à rimer:",
        buttonSend: "Rimer",
        labelResults: "Mots qui riment:",
        labelAuthor: "Fait par jan Ine",
        labelWebsite: "Mon site",
        labelGithub: "Github",
        labelGitlab: "Gitlab",
        wordNotFound: "Le mot n'est pas dans la liste"
    }
};
const rhymesMap = new Map();
const syllabesMap = new Map();

function initialization(){
    //initialization for a map in which the key is a substring of a word and the value
    //is a set of all words that rhyme with that substring
    wordList.forEach(word => {
        for (let i = 0; i < word.length - 1; i++) {
            const rhyme = word.substring(i);
            if (!rhymesMap.has(rhyme)) {
                rhymesMap.set(rhyme, new Set());
            }
            rhymesMap.get(rhyme).add(word);
        }
    });

    //initialization for a map in which the key is a word and the value
    //is all of its syllabes
    wordList.forEach(word =>{
        if (!syllabesMap.has(word)) {
            //if the word is not yet on the map we create it with an empty set associated
            syllabesMap.set(word, new Array());
        }
        if(word.length < 3){
            //if the word only has 2 letters then it only has one syllabe (itself)
            syllabesMap.get(word).push(word);
        }
        else{
            let i = 0; //to go through the letters of the word
            let x = 2; //to advance letters when a syllabe is added
            const wordArray = Array.from(word); //array made of letters from the word

            //if the first letter is a vowel (which is not followed by an n+vowel combination), 
            //that first letter is its own syllabe
            if(vowels.has(wordArray[0])){
                if(!(word.length>=3 && wordArray[1]=="n" && !vowels.has(wordArray[2]))){
                    i++;
                    syllabesMap.get(word).push(wordArray[0]);
                }
            }

            for(i; i<word.length-1; i+=x){
                x=2;
                //a basic syllabe is composed of the next 2 letters
                var toAdd = wordArray[i] + wordArray[i+1];
                //if the next letter is the last, and it is an n, the n is also part of the syllabe
                if(i==word.length-2 && wordArray[i+2]=="n"){
                    toAdd += wordArray[i+2];
                    x=3;
                }
                //if the next letter is an n not followed by a vowel, the n is also part of the syllabe
                else if(i<word.length-2 && wordArray[i+2]=="n" && !vowels.has(wordArray[i+3])){
                    toAdd += wordArray[i+2];
                    x=3;
                }
                //once we have fully defined the syllabe we add it to the set
                syllabesMap.get(word).push(toAdd);
            }
        }
    });
}

function rhymesRequested(){
    //this deletes what was previously shown on the list of rhymes
    document.getElementById("rhymesList").value = document.getElementById("rhymesList").defaultValue;
    //now we take the word the user wants to rhyme
    var word = document.getElementById("nimi").value;

    if(wordList.has(word)){
        const solution = new Set();
        //we take the number of syllabes we want to rhyme
        var numberSyllabes = document.getElementById("nanpakalama").value;
        //we take the type of rhyme we want to do
        var typeSama = document.getElementById("sama").value;

        //this variable will form the text string to be rhymed
        var toRhyme="";
        //for each syllabe the word has until we've reached the number of syllabes to rhyme
        //we add the syllabe to the toRhyme string
        for(let j=syllabesMap.get(word).length-numberSyllabes; j<syllabesMap.get(word).length; j++){
            toRhyme += syllabesMap.get(word)[j];
        }

        //now that we have the string to be rhymed we need to find matches
        //if we want full rhyme, then we only need to take the set of rhymes from the map for that entry
        if(typeSama == "sama sama"){
            rhymesMap.get(toRhyme).forEach(word => solution.add(word));
        }
        //if we want a rhyme based on vowels, then we must do other checks
        else{
            //this array will hold the vowels (and final n if it exists) that our toRhyme sections has
            const vowelArray = new Array();
            let a = 0;
            Array.from(toRhyme).forEach(letter =>{
                a++;
                if(vowels.has(letter)||(a==Array.from(toRhyme).length && letter=="n")) vowelArray.push(letter);
            });
            //for all entries in the map of rhymes, we check that the entry has the same collection of vowels
            //(and possibly final n) and if it does match we add its list of rhymes to our solution
            for (let [key, value] of rhymesMap.entries()) {
                let wantedLength = Array.from(toRhyme).length;
                if(Array.from(key).length+1==wantedLength) wantedLength--;
                else if(Array.from(key).length-1==wantedLength) wantedLength++;
                if(Array.from(key).length == wantedLength){
                    const tempVowelArray = new Array();
                    let a = 0;
                    Array.from(key).forEach(letter =>{
                        a++;
                        if(vowels.has(letter)||(a==Array.from(key).length && letter=="n")) tempVowelArray.push(letter);
                    });
                    var condition = true;
                    if(tempVowelArray.length!=vowelArray.length){condition = false};
                    for(let i=0; i<tempVowelArray.length&&condition; i++){
                        if(tempVowelArray[i]!=vowelArray[i]) condition = false;
                    }
                    if(condition) value.forEach(word => solution.add(word));
                }
            }
        }
        
        solution.forEach(rhyme => {
            document.getElementById("rhymesList").append(rhyme + " ");
            //document.getElementById("rhymesList").appendChild(document.createElement("br"));
        });
    }
    else{
        //if the word does not exist we display an error message
        var text;
        if (window.location.hash) {
            if (window.location.hash == "#es") {
                text = language.es.wordNotFound;
            }
            else if (window.location.hash == "#eng") {
                text = language.eng.wordNotFound;
            }
            else if (window.location.hash == "#tok") {
                text = language.tok.wordNotFound;
            }
        }
        document.getElementById("rhymesList").value = text;
    }
}

function changeLanguage(lang) {
    location.hash = lang;
    if (window.location.hash) {
        if (window.location.hash == "#es") {
            for(let [key, value] of Object.entries(language.es)){
                document.getElementById(key).textContent = value;
                if(document.getElementById(key).nodeName=="INPUT")document.getElementById(key).value= value;
                if(document.getElementById("rhymesList").value==language.eng.wordNotFound || document.getElementById("rhymesList").value==language.tok.wordNotFound) document.getElementById("rhymesList").value = language.es.wordNotFound;
            }
        }
        else if (window.location.hash == "#eng") {
            for(let [key, value] of Object.entries(language.eng)){
                document.getElementById(key).textContent = value;
                if(document.getElementById(key).nodeName=="INPUT")document.getElementById(key).value= value;
                if(document.getElementById("rhymesList").value==language.es.wordNotFound || document.getElementById("rhymesList").value==language.tok.wordNotFound) document.getElementById("rhymesList").value = language.eng.wordNotFound;
            }
        }
        else if (window.location.hash == "#fr") {
            for(let [key, value] of Object.entries(language.fr)){
                document.getElementById(key).textContent = value;
                if(document.getElementById(key).nodeName=="INPUT")document.getElementById(key).value= value;
                if(document.getElementById("rhymesList").value==language.fr.wordNotFound || document.getElementById("rhymesList").value==language.tok.wordNotFound) document.getElementById("rhymesList").value = language.fr.wordNotFound;
            }
        }
        else if (window.location.hash == "#tok") {
            for(let [key, value] of Object.entries(language.tok)){
                document.getElementById(key).textContent = value;
                if(document.getElementById(key).nodeName=="INPUT")document.getElementById(key).value= value;
                if(document.getElementById("rhymesList").value==language.es.wordNotFound || document.getElementById("rhymesList").value==language.eng.wordNotFound) document.getElementById("rhymesList").value = language.tok.wordNotFound;
            }
        }
    } 
}