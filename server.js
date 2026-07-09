const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock Pokemon data
const mockPokemons = [
  {
    id: 1,
    name: 'Pikachu',
    type: ['Electric'],
    color: 'Yellow',
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
  },
  {
    id: 2,
    name: 'Charizard',
    type: ['Fire', 'Flying'],
    color: 'Orange',
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png'
  },
  {
    id: 3,
    name: 'Blastoise',
    type: ['Water'],
    color: 'Blue',
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png'
  },
  {
    id: 4,
    name: 'Venusaur',
    type: ['Grass', 'Poison'],
    color: 'Green',
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png'
  },
  {
    id: 5,
    name: 'Mewtwo',
    type: ['Psychic'],
    color: 'Purple',
    legendary: true,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png'
  },
  {
    id: 6,
    name: 'Mew',
    type: ['Psychic'],
    color: 'Pink',
    legendary: true,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png'
  },
  {
    id: 7,
    name: 'Articuno',
    type: ['Ice', 'Flying'],
    color: 'Cyan',
    legendary: true,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png'
  },
  {
    id: 8,
    name: 'Zapdos',
    type: ['Electric', 'Flying'],
    color: 'Yellow',
    legendary: true,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png'
  },
  {
    id: 9,
    name: 'Moltres',
    type: ['Fire', 'Flying'],
    color: 'Red',
    legendary: true,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png'
  },
  {
    id: 10,
    name: 'Gyarados',
    type: ['Water', 'Flying'],
    color: 'Blue',
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png'
  },
  {
    id: 11,
    name: 'Dragonite',
    type: ['Dragon', 'Flying'],
    color: 'Brown',
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png'
  },
  {
    id: 12,
    name: 'Alakazam',
    type: ['Psychic'],
    color: 'Purple',
    legendary: false,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png'
  }
];

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pokemon API is running!' });
});

app.get('/api/pokemons', (req, res) => {
  const { name, type, color, legendary } = req.query;

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

  // Filter by color (case insensitive)
  if (color) {
    filteredPokemons = filteredPokemons.filter(pokemon =>
      pokemon.color.toLowerCase() === color.toLowerCase()
    );
  }

  // Filter by legendary status
  if (legendary !== undefined) {
    const isLegendary = legendary === 'true';
    filteredPokemons = filteredPokemons.filter(pokemon =>
      pokemon.legendary === isLegendary
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
  const colors = [...new Set(mockPokemons.map(pokemon => pokemon.color))];
  res.json({
    success: true,
    data: colors.sort()
  });
});

// Serve static files from the frontend build directory
const frontendBuildPath = path.join(__dirname, '../pokemon-frontend/build');
app.use(express.static(frontendBuildPath));

// Serve the React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Pokemon API server running on http://localhost:${PORT}`);
});
