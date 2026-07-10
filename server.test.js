const express = require('express');
const cors = require('cors');

// Import or inline the app creation
const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

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

  return app;
};

// Tests
describe('Pokemon Backend API', () => {
  let app;
  let request;

  beforeAll(async () => {
    // Dynamically require supertest only for tests
    request = require('supertest');
    app = createApp();
  });

  describe('GET /api/pokemons', () => {
    test('should return all Pokemon when no filters applied', async () => {
      const response = await request(app)
        .get('/api/pokemons')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(12);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should filter Pokemon by color query parameter', async () => {
      const response = await request(app)
        .get('/api/pokemons?color=Red')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);

      // All returned Pokemon should have Red color
      response.body.data.forEach(pokemon => {
        expect(pokemon.color.toLowerCase()).toBe('red');
      });
    });

    test('should return Pikachu when filtering by Yellow color', async () => {
      const response = await request(app)
        .get('/api/pokemons?color=Yellow')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThanOrEqual(1);

      const pikachu = response.body.data.find(p => p.name === 'Pikachu');
      expect(pikachu).toBeDefined();
      expect(pikachu.color).toBe('Yellow');
    });

    test('should return only Pokemon with matching color', async () => {
      const response = await request(app)
        .get('/api/pokemons?color=Blue')
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify only blue Pokemon are returned
      const expectedBlue = ['Blastoise', 'Gyarados', 'Dragonite'];
      response.body.data.forEach(pokemon => {
        expect(pokemon.color).toBe('Blue');
        expect(expectedBlue).toContain(pokemon.name);
      });
    });

    test('should support case-insensitive color filtering', async () => {
      const response1 = await request(app)
        .get('/api/pokemons?color=yellow')
        .expect(200);

      const response2 = await request(app)
        .get('/api/pokemons?color=Yellow')
        .expect(200);

      const response3 = await request(app)
        .get('/api/pokemons?color=YELLOW')
        .expect(200);

      expect(response1.body.count).toBe(response2.body.count);
      expect(response2.body.count).toBe(response3.body.count);
    });

    test('should combine color filter with other filters', async () => {
      const response = await request(app)
        .get('/api/pokemons?color=Yellow&legendary=true')
        .expect(200);

      expect(response.body.success).toBe(true);

      // Should return only legendary yellow Pokemon (Zapdos)
      response.body.data.forEach(pokemon => {
        expect(pokemon.color).toBe('Yellow');
        expect(pokemon.legendary).toBe(true);
      });
    });
  });

  describe('GET /api/colors', () => {
    test('should support /api/colors endpoint', async () => {
      const response = await request(app)
        .get('/api/colors')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('should return all unique colors', async () => {
      const response = await request(app)
        .get('/api/colors')
        .expect(200);

      const expectedColors = ['Blue', 'Green', 'Light Blue', 'Pink', 'Purple', 'Red', 'Yellow'];
      expect(response.body.data).toEqual(expect.arrayContaining(expectedColors));
    });

    test('should return colors in sorted order', async () => {
      const response = await request(app)
        .get('/api/colors')
        .expect(200);

      const colors = response.body.data;
      const sortedColors = [...colors].sort();
      expect(colors).toEqual(sortedColors);
    });
  });

  describe('Pokemon data structure', () => {
    test('Pokemon objects should have color field', async () => {
      const response = await request(app)
        .get('/api/pokemons')
        .expect(200);

      response.body.data.forEach(pokemon => {
        expect(pokemon).toHaveProperty('color');
        expect(typeof pokemon.color).toBe('string');
      });
    });
  });
});

// Export the createApp function for use in the actual server
module.exports = createApp;
