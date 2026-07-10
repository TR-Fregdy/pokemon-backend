const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Mock Pokemon data
const mockPokemons = [
  {
    id: 1,
    name: 'Pikachu',
    type: ['Electric'],
    legendary: false,
    color: 'Yellow',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
  },
  {
    id: 2,
    name: 'Charizard',
    type: ['Fire', 'Flying'],
    legendary: false,
    color: 'Orange',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png'
  },
  {
    id: 3,
    name: 'Blastoise',
    type: ['Water'],
    legendary: false,
    color: 'Blue',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png'
  },
  {
    id: 4,
    name: 'Venusaur',
    type: ['Grass', 'Poison'],
    legendary: false,
    color: 'Green',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png'
  },
  {
    id: 5,
    name: 'Zapdos',
    type: ['Electric', 'Flying'],
    legendary: true,
    color: 'Yellow',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png'
  }
];

// Create a test app
const app = express();
const path = require('path');
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../pokemon-frontend/build')));

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
      pokemon.color.toLowerCase() === color.toLowerCase()
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

describe('Pokemon API', () => {
  describe('GET / (Static Files)', () => {
    it('should return 200 status code for root route', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
    });

    it('should return HTML content type for root route', async () => {
      const res = await request(app).get('/');
      expect(res.type).toMatch(/html/);
    });

    it('should return valid HTML markup for root route', async () => {
      const res = await request(app).get('/');
      expect(res.text).not.toBe('Cannot GET /');
      expect(res.text).toMatch(/<!DOCTYPE|<html/i);
    });

    it('should not return API error for root route', async () => {
      const res = await request(app).get('/');
      expect(res.body.success).not.toBe(false);
    });

    it('should return 200 status and contain Pokemon Explorer title', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Pokemon Explorer');
    });

    it('should return HTML with React root div', async () => {
      const res = await request(app).get('/');
      expect(res.text).toContain('id="root"');
    });

    it('should be able to serve static JavaScript files', async () => {
      const res = await request(app).get('/static/js/main.7a5e4f5a.js');
      expect(res.status).toBe(200);
      expect(res.type).toMatch(/javascript/);
    });
  });

  describe('GET /api/colors', () => {
    it('should return an array of unique colors', async () => {
      const res = await request(app).get('/api/colors');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should include Yellow color', async () => {
      const res = await request(app).get('/api/colors');
      expect(res.body.data).toContain('Yellow');
    });

    it('should return sorted colors', async () => {
      const res = await request(app).get('/api/colors');
      expect(res.body.data).toEqual([...res.body.data].sort());
    });

    it('should return only unique colors', async () => {
      const res = await request(app).get('/api/colors');
      const colors = res.body.data;
      const uniqueColors = [...new Set(colors)];
      expect(colors.length).toBe(uniqueColors.length);
    });
  });

  describe('GET /api/pokemons?color=', () => {
    it('should filter Pokemon by color', async () => {
      const res = await request(app).get('/api/pokemons?color=Yellow');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should include Pikachu when filtering by Yellow color', async () => {
      const res = await request(app).get('/api/pokemons?color=Yellow');
      const pikachu = res.body.data.find(p => p.name === 'Pikachu');
      expect(pikachu).toBeDefined();
      expect(pikachu.color).toBe('Yellow');
    });

    it('should exclude non-yellow Pokemon when filtering by Yellow', async () => {
      const res = await request(app).get('/api/pokemons?color=Yellow');
      const allYellow = res.body.data.every(p => p.color === 'Yellow');
      expect(allYellow).toBe(true);
    });

    it('should handle case-insensitive color filtering', async () => {
      const res1 = await request(app).get('/api/pokemons?color=Yellow');
      const res2 = await request(app).get('/api/pokemons?color=yellow');
      expect(res1.body.data.length).toBe(res2.body.data.length);
    });

    it('should work in combination with other filters', async () => {
      const res = await request(app).get('/api/pokemons?color=Yellow&legendary=true');
      expect(res.status).toBe(200);
      const allYellowLegendary = res.body.data.every(
        p => p.color === 'Yellow' && p.legendary === true
      );
      expect(allYellowLegendary).toBe(true);
    });
  });

  describe('API Routes Preserved', () => {
    it('should not break API routes when serving static files', async () => {
      const res = await request(app).get('/api/colors');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should still filter by color correctly', async () => {
      const res = await request(app).get('/api/pokemons?color=Yellow');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].color).toBe('Yellow');
    });
  });
});
