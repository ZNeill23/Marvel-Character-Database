const publicKey = '7b302d92ad845f98ad4f7ff03eb68c3e';
const privateKey = '39f7956074ab64676a2a03bbbaf865d3cec789b6'; 
const baseUrl = 'https://gateway.marvel.com/v1/public/characters';

async function fetchCharacters(query = '') {
    const ts = new Date().getTime();
    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

    // Show loading message
    document.getElementById('loading-message').style.display = 'block';

    try {
        const response = await fetch(`${baseUrl}?nameStartsWith=${query}&ts=${ts}&apikey=${publicKey}&hash=${hash}`);
        const data = await response.json();

        // Hide loading message
        document.getElementById('loading-message').style.display = 'none';

        displayCharacters(data.data.results);
    } catch (error) {
        console.error("Error fetching characters:", error);

        // Hide loading message if there's an error
        document.getElementById('loading-message').style.display = 'none';
    }
}

// Function to display characters on the page
function displayCharacters(characters) {
    const characterGrid = document.getElementById('character-grid');
    characterGrid.innerHTML = ''; // Clear previous results

    if (characters.length === 0) {
        characterGrid.innerHTML = '<p>No characters found.</p>';
        return;
    }

    characters.forEach(character => {
        const characterCard = document.createElement('div');
        characterCard.classList.add('character-card');

        const img = document.createElement('img');
        img.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;
        img.alt = character.name;

        const name = document.createElement('h2');
        name.textContent = character.name;

        characterCard.appendChild(img);
        characterCard.appendChild(name);
        characterGrid.appendChild(characterCard);
    });
}

// Event listener for search input
document.getElementById('search-bar').addEventListener('input', (event) => {
    const query = event.target.value.trim();
    if (query) {
        fetchCharacters(query);
    } else {
        document.getElementById('character-grid').innerHTML = ''; // Clear results if input is empty
    }
});

// Debounce function to limit the number of API calls
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Event listener for search input with debounce
const searchInput = document.getElementById('search-bar');
searchInput.addEventListener('input', debounce((event) => {
    const query = event.target.value.trim();
    if (query) {
        fetchCharacters(query);
    } else {
        document.getElementById('character-grid').innerHTML = ''; // Clear results if input is empty
    }
}, 300)); // Adjust delay (in milliseconds) as needed
