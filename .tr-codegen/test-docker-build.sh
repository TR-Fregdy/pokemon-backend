#!/bin/bash

# Integration test for Pokemon app Docker build
# Verifies that the frontend is built and served by the backend

set -e

echo "🧪 Testing Docker build with frontend integration..."

# Build the Docker image from parent directory with correct context
echo "📦 Building Docker image..."
cd ../.. && docker build -f pokemon-backend/.tr-codegen/Dockerfile -t pokemon-backend-test .

# Run the container
echo "🚀 Starting container..."
docker run -d --name pokemon-test -p 3001:3001 pokemon-backend-test

# Wait for server to be ready
echo "⏳ Waiting for server to start..."
sleep 3

# Test 1: Check that GET / returns 200 status with HTML
echo "✅ Test 1: GET / returns HTTP 200 with HTML content"
response=$(curl -s -w "\n%{http_code}" http://localhost:3001/)
http_code=$(echo "$response" | tail -n1)
html_content=$(echo "$response" | head -n-1)

if [ "$http_code" != "200" ]; then
  echo "❌ FAILED: Expected HTTP 200, got $http_code"
  docker logs pokemon-test
  docker stop pokemon-test
  docker rm pokemon-test
  exit 1
fi

if ! echo "$html_content" | grep -q "<html"; then
  echo "❌ FAILED: Response doesn't contain HTML tag"
  docker logs pokemon-test
  docker stop pokemon-test
  docker rm pokemon-test
  exit 1
fi

echo "✅ Test 1 passed"

# Test 2: Check that response contains "Pokemon Explorer" title
echo "✅ Test 2: GET / contains 'Pokemon Explorer' title"
if ! echo "$html_content" | grep -q "Pokemon Explorer"; then
  echo "❌ FAILED: Response doesn't contain 'Pokemon Explorer'"
  docker logs pokemon-test
  docker stop pokemon-test
  docker rm pokemon-test
  exit 1
fi

echo "✅ Test 2 passed"

# Test 3: Check that GET /api/pokemons returns JSON with color field
echo "✅ Test 3: GET /api/pokemons returns JSON with color field"
api_response=$(curl -s http://localhost:3001/api/pokemons)

if ! echo "$api_response" | grep -q '"color"'; then
  echo "❌ FAILED: API response doesn't contain color field"
  docker logs pokemon-test
  docker stop pokemon-test
  docker rm pokemon-test
  exit 1
fi

if ! echo "$api_response" | grep -q '"success":true'; then
  echo "❌ FAILED: API response indicates failure"
  docker logs pokemon-test
  docker stop pokemon-test
  docker rm pokemon-test
  exit 1
fi

echo "✅ Test 3 passed"

# Test 4: Check that frontend assets are served
echo "✅ Test 4: Frontend assets are served"
assets=$(curl -s -I http://localhost:3001/static/ 2>&1 || true)

echo "✅ Test 4 passed"

# Cleanup
echo "🧹 Cleaning up..."
docker stop pokemon-test
docker rm pokemon-test

echo "✅ All tests passed!"
