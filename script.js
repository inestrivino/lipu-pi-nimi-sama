// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const addWordButton = document.getElementById('add-word-button');
let closeButton;
let modal;
const body = document.body;

// Check for saved theme preference or use preferred color scheme
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
} else if (prefersDark) {
    body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update button emoji
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌓';
});

// Open and close modals
addWordButton.addEventListener('click', () => {
    modal = document.getElementById('add-word-modal');
    modal.classList.remove('hidden');
    // Get the close button and add event listener
    closeButton = document.querySelector('#add-word-modal .close');
    closeButton.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
});

// Change language
document.addEventListener('DOMContentLoaded', function() {
    // Set up language selector
    const languageSelector = document.getElementById('language');

    // Load saved language preference or use browser language
    const savedLanguage = localStorage.getItem('language') ||
                         navigator.language.split('-')[0] ||
                         'en';

    // Set the select element to the current language
    languageSelector.value = savedLanguage;

    // Load initial language
    loadLanguage(savedLanguage);

    // Add event listener for language changes
    languageSelector.addEventListener('change', (event) => {
        changeLanguage(event.target.value);
    });
});

async function changeLanguage(lang) {
    await setLanguagePreference(lang);
    await loadLanguage(lang); // Load the new language without reloading
}

async function loadLanguage(lang) {
    try {
        const langData = await fetchLanguageData(lang);
        updateContent(langData);

        // Update the language selector to show the current language
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

function setLanguagePreference(lang) {
    localStorage.setItem('language', lang);
    // Removed location.reload() to avoid page refresh
}

function updateContent(langData) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.innerHTML = langData[key];
    });
}

// Function to fetch language data
async function fetchLanguageData(lang) {
    const response = await fetch(`translations/${lang}.json`);
    return response.json();
}
