// --- THEME TOGGLE FUNCTIONALITY ---

//Necessary variables
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

//If there is already a preferred theme, it is automatically chosen
if (savedTheme) {
  body.setAttribute('data-theme', savedTheme);
} else if (prefersDark) {
  body.setAttribute('data-theme', 'dark');
  themeToggle.textContent = '☀️';
}

// Toggle theme when clicked
themeToggle.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  // Update button emoji
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌓';
});

// --- MODALS FUNCTIONALITY ---
const addWordButton = document.getElementById('add-word-button');
let modal;
let closeButton;

//Opens the modal to add a word
addWordButton.addEventListener('click', () => {
  modal = document.getElementById('add-word-modal');
  modal.classList.remove('hidden');
  // Get the close button and add event listener to close
  closeButton = document.querySelector('#add-word-modal .close');
  closeButton.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
});

document.getElementById("add-word-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const newWord = document.getElementById("new-word").value.trim();

  wordDB.addWord(newWord);
  // Reset the form
  this.reset();

  // Close the modal
  const modal = document.getElementById("add-word-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
});

// --- CHANGE LANGUAGE FUNCTIONALITY ---

// When the page is first loaded
document.addEventListener('DOMContentLoaded', function () {
  const languageSelector = document.getElementById('language');
  //If the user has set a preferred language then that one is loaded
  const savedLanguage = localStorage.getItem('language') ||
    navigator.language.split('-')[0] ||
    'en';
  languageSelector.value = savedLanguage;
  loadLanguage(savedLanguage);
  languageSelector.addEventListener('change', (event) => {
    changeLanguage(event.target.value);
  });
});

// When a new language is chosen
async function changeLanguage(lang) {
  await setLanguagePreference(lang);
  await loadLanguage(lang);
}

// Fetches and updates information for the chosen language
async function loadLanguage(lang) {
  try {
    const langData = await fetchLanguageData(lang);
    updateContent(langData);
    document.getElementById('language').value = lang;
    document.documentElement.lang = lang;
  } catch (error) {
    console.error('Error loading language:', error);
    // Fallback to English if there's an error
    if (lang !== 'en') {
      await loadLanguage('en');
    }
  }
}

// Set a new language as the preference
function setLanguagePreference(lang) {
  localStorage.setItem('language', lang);
}

// Update the information
function updateContent(langData) {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.innerHTML = langData[key];
  });
}

// Fetches the data from the relevant json
async function fetchLanguageData(lang) {
  const response = await fetch(`translations/${lang}.json`);
  return response.json();
}

// --- SEARCH FUNCTIONALITY ---
document.querySelector(".search-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const word = document.getElementById("nimi").value.trim();
  const numSyllables = parseInt(document.getElementById("nanpakalama").value);
  const rhymeType = document.getElementById("sama").value;

  try {
    const rhymes = wordDB.findRhymes(word, numSyllables, rhymeType);
    displayRhymes(rhymes);
  } catch (error) {
    console.error(error);
  }
});

// --- RHYME FINDING FUNCTIONALITY ---

class WordDatabase {
  constructor() {
    this.words = new Set();
    this.rhymesMap = new Map();
    this.syllablesMap = new Map();
    this.vowels = new Set(["a", "e", "i", "o", "u"]);
  }

  // Add a new word to the database
  addWord(word) {
    if (!this.words.has(word)) {
      this.words.add(word);
      this._updateWordMaps(word);
    }
  }

  // Update maps with a new word
  _updateWordMaps(word) {
    for (let i = 0; i < word.length - 1; i++) {
      const rhyme = word.substring(i);
      if (!this.rhymesMap.has(rhyme)) {
        this.rhymesMap.set(rhyme, new Set());
      }
      this.rhymesMap.get(rhyme).add(word);
    }
    this._calculateSyllables(word);
  }

  // Calculate syllables for a word
  _calculateSyllables(word) {
    const syllables = [];
    const wordArray = Array.from(word);

    if (word.length < 3) {
      this.syllablesMap.set(word, [word]);
      return;
    }

    let i = 0;
    // Check if first letter is a vowel that forms its own syllable
    if (this.vowels.has(wordArray[0])) {
      if (!(word.length >= 3 && wordArray[1] === "n" && !this.vowels.has(wordArray[2]))) {
        syllables.push(wordArray[0]);
        i = 1;
      }
    }

    // Process remaining syllables
    while (i < word.length) {
      let syllable = wordArray[i];

      // Check for basic 2-letter syllable
      if (i + 1 < word.length) {
        syllable += wordArray[i + 1];

        // Check for n at the end of syllable
        if (i + 2 < word.length && wordArray[i + 2] === "n" && !this.vowels.has(wordArray[i + 3])) {
          syllable += wordArray[i + 2];
          i += 3;
        } else if (i + 2 === word.length && wordArray[i + 2] === "n") {
          syllable += wordArray[i + 2];
          i += 3;
        } else {
          i += 2;
        }
      } else {
        i++;
      }
      syllables.push(syllable);
    }

    this.syllablesMap.set(word, syllables);
  }

  // Initialize with default Toki Pona words
  initialize() {
    const defaultWords = [
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
    ];

    defaultWords.forEach(word => this.addWord(word));
  }

  // Find rhymes for a word
  findRhymes(word, numSyllables, rhymeType) {
    const solution = new Set();
    let syllables = this.syllablesMap.get(word);

    // If we don't have syllable info, calculate it
    if (!syllables) {
      this._calculateSyllables(word);
      syllables = this.syllablesMap.get(word);
    }

    // Build the rhyme string from the last N syllables
    let toRhyme = "";
    const startIndex = syllables.length - numSyllables;
    for (let j = Math.max(0, startIndex); j < syllables.length; j++) {
      toRhyme += syllables[j];
    }

    // Find matching rhymes based on choice
    if (rhymeType === "sama sama") {
      if (this.rhymesMap.has(toRhyme)) {
        this.rhymesMap.get(toRhyme).forEach(word => {
          if(this.words.has(word)) solution.add(word);
      });
      }
    } else {
      const vowelPattern = this._getVowelPattern(toRhyme);
      for (const [key, value] of this.rhymesMap.entries()) {
        if (Math.abs(key.length - toRhyme.length) <= 1) {
          const keyVowelPattern = this._getVowelPattern(key);
          if (keyVowelPattern === vowelPattern) {
            value.forEach(word => solution.add(word));
          }
        }
      }
    }

    return Array.from(solution).filter(w => w !== word); // Exclude the original word
  }

  // Get vowel pattern for assonant rhymes
  _getVowelPattern(str) {
    let pattern = "";
    const letters = Array.from(str);

    for (let i = 0; i < letters.length; i++) {
      if (this.vowels.has(letters[i]) ||
        (i === letters.length - 1 && letters[i] === "n")) {
        pattern += letters[i];
      }
    }

    return pattern;
  }
}

// Initialize the word database
const wordDB = new WordDatabase();
wordDB.initialize();

function displayRhymes(rhymes) {
  const resultsDiv = document.getElementById("results");
  const noResultsDiv = document.getElementById("no-results");

  // Hide both sections initially
  resultsDiv.classList.add("hidden");
  noResultsDiv.classList.add("hidden");

  // Clear previous results
  resultsDiv.innerHTML = "";

  if (rhymes.length === 0) {
    // Show no results message
    noResultsDiv.classList.remove("hidden");
    return;
  }

  // Show results section
  resultsDiv.classList.remove("hidden");

  // Create a card for each rhyme
  rhymes.forEach(rhyme => {
    const card = document.createElement("div");
    card.className = "result-card";

    const wordName = document.createElement("h3");
    wordName.className = "word-name";
    wordName.textContent = rhyme;

    card.appendChild(wordName);
    resultsDiv.appendChild(card);
  });
}