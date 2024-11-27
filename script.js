function rhymesRequested(){
    document.getElementById("rhymesList").value = document.getElementById("rhymesList").defaultValue;

    const wordList = new Set(
        [
            'a', 'akesi', 'ala', 'alasa', 'ale', 'ali', 'anpa', 'ante', 'anu', 'awen', 
            'e', 'en', 'esun', 'ijo', 'ike', 'ilo', 'insa', 'jaki', 'jan', 'jelo', 
            'jo', 'kala', 'kalama', 'kama', 'kasi', 'ken', 'kepeken', 'kijetesantakalu', 
            'kili', 'kiwen', 'ko', 'kon', 'ku', 'kule', 'kulupu', 'kute', 'la', 'lape', 
            'laso', 'lawa', 'len', 'lete', 'li', 'lili', 'linja', 'lipu', 'loje', 'lon', 
            'luka', 'lukin', 'lupa', 'ma', 'mama', 'mani', 'meli', 'mi', 'mije', 'moku', 
            'moli', 'monsi', 'monsuta', 'mu', 'mun', 'musi', 'mute', 'nanpa', 'nasa', 
            'nasin', 'nena', 'ni', 'nimi', 'noka', 'o', 'olin', 'ona', 'open', 'pakala', 
            'pali', 'palisa', 'pan', 'pana', 'pi', 'pilin', 'pimeja', 'pini', 'pipi', 
            'poka', 'poki', 'pona', 'pu', 'sama', 'seli', 'selo', 'seme', 'sewi', 
            'sijelo', 'sike', 'sin', 'sina', 'sinpin', 'sitelen', 'sona', 'soweli', 
            'suli', 'suno', 'supa', 'suwi', 'tan', 'taso', 'tawa', 'telo', 'tenpo', 
            'toki', 'tomo', 'tonsi', 'tu', 'unpa', 'uta', 'utala', 'walo', 'wan', 
            'waso', 'wawa', 'weka', 'wile'
        ]
    );

    var word = document.getElementById("nimi").value;

    if(wordList.has(word)){
        const rhymes = new Map();
        wordList.forEach(word => {
            for (let i = 0; i < word.length - 1; i++) {
                const rhyme = word.substring(i);
                if (!rhymes.has(rhyme)) {
                    rhymes.set(rhyme, new Set());
                }
                rhymes.get(rhyme).add(word);
            }
        });

        const syllabes = new Map();
        const vowels = new Set(["a", "e", "i", "o", "u"]);
        wordList.forEach(word =>{
            if (!syllabes.has(word)) {
                syllabes.set(word, new Set());
            }
            if(word.length < 3){
                syllabes.get(word).add(word);
            }
            else{
                let i = 0;
                let x = 2;
                if(vowels.has(Array.from(word)[0])){
                    if(!(word.length>=3 && Array.from(word)[1]=="n" && !vowels.has(Array.from(word)[2]))){
                        i++;
                        syllabes.get(word).add(Array.from(word)[0]);
                    }
                }
                for(i; i<word.length-1; i+=x){
                    x=2;
                    var toAdd = Array.from(word)[i] + Array.from(word)[i+1];
                    if(i==word.length-2 && Array.from(word)[i+2]=="n"){
                        toAdd += Array.from(word)[i+2];
                        x=3;
                    }
                    else if(i<word.length-2 && Array.from(word)[i+2]=="n" && !vowels.has(Array.from(word)[i+3])){
                        toAdd += Array.from(word)[i+2];
                        x=3;
                    }
                    syllabes.get(word).add(toAdd);
                }
            }
        });

        const solution = new Set();
        var numberSyllabes = document.getElementById("nanpakalama").value;
        var typeSama = document.getElementById("sama").value;

        var toRhyme="";
        for(let j=syllabes.get(word).size-numberSyllabes; j<syllabes.get(word).size; j++){
            toRhyme += Array.from(syllabes.get(word))[j];
        }
        if(typeSama == "sama sama"){
            rhymes.get(toRhyme).forEach(word => solution.add(word));
        }
        else{
            const vowelArray = new Array();
            let a = 0;
            Array.from(toRhyme).forEach(letter =>{
                a++;
                if(vowels.has(letter)||(a==Array.from(toRhyme).length && letter=="n")) vowelArray.push(letter);
            });
            for (let [key, value] of rhymes.entries()) {
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
            document.getElementById("rhymesList").appendChild(document.createElement("br"));
        });
    }
    else{
        document.getElementById("rhymesList").value = "nimi lon ala";
    }
}

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
        labelLinkedin: "LinkedIn",
        labelGithub: "Github"
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
        labelLinkedin: "LinkedIn",
        labelGithub: "Github"
    },
    tok: {
        labelNimi: "o pana e nimi:",
        labelSama: "o pana e sama:",
        samaOption1: "sama sama",
        samaOption2: "sama poka",
        labelSyllabes: "o pana e nanpa kalama pini tawa sama:",
        buttonSend: "o tawa",
        labelResults: "nimi sama:",
        labelAuthor: "jan Ine li pali e lipu ni",
        labelLinkedin: "ilo Linkedin",
        labelGithub: "ilo Github"
    }
};

function changeLanguage(lang) {
    location.hash = lang;
    if (window.location.hash) {
        if (window.location.hash == "#es") {
            for(let [key, value] of Object.entries(language.es)){
                document.getElementById(key).textContent = value;
                if(document.getElementById(key).nodeName=="INPUT")document.getElementById(key).value= value;
            }
        }
        else if (window.location.hash == "#eng") {
            for(let [key, value] of Object.entries(language.eng)){
                document.getElementById(key).textContent = value;
                if(document.getElementById(key).nodeName=="INPUT")document.getElementById(key).value= value;
            }
        }
        else if (window.location.hash == "#tok") {
            for(let [key, value] of Object.entries(language.tok)){
                document.getElementById(key).textContent = value;
                if(document.getElementById(key).nodeName=="INPUT")document.getElementById(key).value= value;
            }
        }
    } 
}