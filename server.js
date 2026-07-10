const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend static files if available
const frontendBuildPath = path.join(__dirname, './pokemon-frontend/build');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
}

// Mock Pokemon data
const mockPokemons = [
  {
    id: 1,
    name: 'Pikachu',
    type: ['Electric'],
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    color: 'Yellow'
  },
  {
    id: 2,
    name: 'Charizard',
    type: ['Fire', 'Flying'],
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
    color: 'Red'
  },
  {
    id: 3,
    name: 'Blastoise',
    type: ['Water'],
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png',
    color: 'Blue'
  },
  {
    id: 4,
    name: 'Venusaur',
    type: ['Grass', 'Poison'],
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',
    color: 'Green'
  },
  {
    id: 5,
    name: 'Mewtwo',
    type: ['Psychic'],
    legendary: true,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png',
    color: 'Purple'
  },
  {
    id: 6,
    name: 'Mew',
    type: ['Psychic'],
    legendary: true,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png',
    color: 'Pink'
  },
  {
    id: 7,
    name: 'Articuno',
    type: ['Ice', 'Flying'],
    legendary: true,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png',
    color: 'Light Blue'
  },
  {
    id: 8,
    name: 'Zapdos',
    type: ['Electric', 'Flying'],
    legendary: true,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png',
    color: 'Yellow'
  },
  {
    id: 9,
    name: 'Moltres',
    type: ['Fire', 'Flying'],
    legendary: true,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png',
    color: 'Red'
  },
  {
    id: 10,
    name: 'Gyarados',
    type: ['Water', 'Flying'],
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png',
    color: 'Blue'
  },
  {
    id: 11,
    name: 'Dragonite',
    type: ['Dragon', 'Flying'],
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png',
    color: 'Blue'
  },
  {
    id: 12,
    name: 'Alakazam',
    type: ['Psychic'],
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png',
    color: 'Purple'
  }
];

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pokemon API is running!' });
});

app.get('/api/pokemons', (req, res) => {
  const { name, type, legendary, color } = req.query;

  let filteredPokemons = [...mockPokemons];

  // Filter by name (case insensitive)
  if (name) {
    filteredPokemons = filteredPokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Filter by type (case insensitive)
  if (type) {
    filteredPokemons = filteredPokemons.filter(pokemon =>
      pokemon.type.some(t => t.toLowerCase() === type.toLowerCase())
    );
  }

  // Filter by legendary status
  if (legendary !== undefined) {
    const isLegendary = legendary === 'true';
    filteredPokemons = filteredPokemons.filter(pokemon =>
      pokemon.legendary === isLegendary
    );
  }

  // Filter by color (case insensitive)
  if (color) {
    filteredPokemons = filteredPokemons.filter(pokemon =>
      pokemon.color && pokemon.color.toLowerCase() === color.toLowerCase()
    );
  }

  res.json({
    success: true,
    count: filteredPokemons.length,
    data: filteredPokemons
  });
});

app.get('/api/pokemons/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const pokemon = mockPokemons.find(p => p.id === id);
  
  if (!pokemon) {
    return res.status(404).json({
      success: false,
      message: 'Pokemon not found'
    });
  }
  
  res.json({
    success: true,
    data: pokemon
  });
});

// Get all unique types
app.get('/api/types', (req, res) => {
  const types = [...new Set(mockPokemons.flatMap(pokemon => pokemon.type))];
  res.json({
    success: true,
    data: types.sort()
  });
});

// Get all unique colors
app.get('/api/colors', (req, res) => {
  const colors = [...new Set(mockPokemons.map(pokemon => pokemon.color).filter(Boolean))];
  res.json({
    success: true,
    data: colors.sort()
  });
});

// Fallback route for SPA client-side routing
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, './pokemon-frontend/build/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Serve a basic HTML page if React build is not available
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pokemon Explorer</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          header {
            background-color: #ff5722;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
          }
          h1 {
            margin: 0;
            font-size: 2.5em;
          }
          .filters {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .filter-group {
            margin-bottom: 15px;
          }
          label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #333;
          }
          select, input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1em;
          }
          button {
            background-color: #ff5722;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1em;
          }
          button:hover {
            background-color: #e64a19;
          }
          .pokemon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
          }
          .pokemon-card {
            background: white;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.2s;
          }
          .pokemon-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          }
          .pokemon-image {
            width: 150px;
            height: 150px;
            object-fit: contain;
            margin-bottom: 10px;
          }
          .pokemon-name {
            font-weight: bold;
            font-size: 1.1em;
            margin-bottom: 5px;
          }
          .pokemon-type {
            font-size: 0.9em;
            color: #666;
          }
          .no-results {
            text-align: center;
            padding: 40px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <header>
          <h1>Pokemon Explorer</h1>
        </header>

        <div class="filters">
          <div class="filter-group">
            <label for="name-filter">Search by Name:</label>
            <input type="text" id="name-filter" placeholder="e.g., Pikachu">
          </div>

          <div class="filter-group">
            <label for="color-filter">Filter by Color:</label>
            <select id="color-filter">
              <option value="">All Colors</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="type-filter">Filter by Type:</label>
            <select id="type-filter">
              <option value="">All Types</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="legendary-filter">Legendary:</label>
            <select id="legendary-filter">
              <option value="">All Pokemon</option>
              <option value="true">Legendary Only</option>
              <option value="false">Non-Legendary Only</option>
            </select>
          </div>

          <button onclick="loadPokemon()">Search</button>
          <button onclick="resetFilters()">Reset</button>
        </div>

        <div id="pokemon-list" class="pokemon-grid"></div>

        <script>
          async function loadColors() {
            try {
              const response = await fetch('/api/colors');
              const data = await response.json();
              const select = document.getElementById('color-filter');
              data.data.forEach(color => {
                const option = document.createElement('option');
                option.value = color;
                option.textContent = color;
                select.appendChild(option);
              });
            } catch (error) {
              console.error('Failed to load colors:', error);
            }
          }

          async function loadTypes() {
            try {
              const response = await fetch('/api/types');
              const data = await response.json();
              const select = document.getElementById('type-filter');
              data.data.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                select.appendChild(option);
              });
            } catch (error) {
              console.error('Failed to load types:', error);
            }
          }

          async function loadPokemon() {
            const nameFilter = document.getElementById('name-filter').value;
            const colorFilter = document.getElementById('color-filter').value;
            const typeFilter = document.getElementById('type-filter').value;
            const legendaryFilter = document.getElementById('legendary-filter').value;

            let url = '/api/pokemons?';
            const params = [];
            if (nameFilter) params.push('name=' + encodeURIComponent(nameFilter));
            if (colorFilter) params.push('color=' + encodeURIComponent(colorFilter));
            if (typeFilter) params.push('type=' + encodeURIComponent(typeFilter));
            if (legendaryFilter) params.push('legendary=' + encodeURIComponent(legendaryFilter));

            url += params.join('&');

            try {
              const response = await fetch(url);
              const data = await response.json();
              displayPokemon(data.data);
            } catch (error) {
              console.error('Failed to load pokemon:', error);
            }
          }

          function displayPokemon(pokemon) {
            const container = document.getElementById('pokemon-list');

            if (!pokemon || pokemon.length === 0) {
              container.innerHTML = '<div class="no-results">No Pokemon found matching your filters.</div>';
              return;
            }

            container.innerHTML = pokemon.map(p => \`
              <div class="pokemon-card">
                <img src="\${p.image}" alt="\${p.name}" class="pokemon-image">
                <div class="pokemon-name">\${p.name}</div>
                <div class="pokemon-type">\${p.type.join(', ')}</div>
                \${p.color ? '<div class="pokemon-type">Color: ' + p.color + '</div>' : ''}
              </div>
            \`).join('');
          }

          function resetFilters() {
            document.getElementById('name-filter').value = '';
            document.getElementById('color-filter').value = '';
            document.getElementById('type-filter').value = '';
            document.getElementById('legendary-filter').value = '';
            loadPokemon();
          }

          // Load initial data and pokemon list
          window.addEventListener('DOMContentLoaded', async () => {
            await loadColors();
            await loadTypes();
            await loadPokemon();
          });
        </script>
      </body>
      </html>
    `;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Pokemon API server running on http://localhost:${PORT}`);
});
