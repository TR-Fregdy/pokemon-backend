#!/bin/bash

# Integration test for Docker build - verifies frontend is built and copied to public/
# This test checks:
# 1. Docker image builds successfully
# 2. GET / returns HTTP 200 status with HTML content
# 3. Response contains 'Pokemon Explorer' title
# 4. Response contains 'Filter by Color' dropdown label
# 5. GET /api/pokemons?color=Yellow returns JSON array
# 6. GET /api/pokemons?color=Yellow includes Pikachu
# 7. GET /api/pokemons?color=Yellow includes Zapdos

set -e

echo "========== Docker Integration Test =========="
echo ""

# Test 1: Docker image builds successfully
echo "Test 1: Building Docker image..."
if (cd ../.. && docker build -f pokemon-backend/.tr-codegen/Dockerfile -t pokemon-backend-test .) 2>&1; then
  echo "✓ Docker image built successfully"
else
  echo "✗ Docker build failed"
  exit 1
fi

echo ""

# Test 2-4: Start container and test HTTP endpoints
echo "Test 2-4: Testing HTTP endpoints..."
CONTAINER_ID=$(docker run -d -p 3001:3001 pokemon-backend-test)
trap "docker stop $CONTAINER_ID; docker rm $CONTAINER_ID" EXIT

# Wait for service to start
echo "Waiting for service to start..."
sleep 5

# Test 2: GET / returns HTTP 200
echo "Test 2: Checking GET / returns 200..."
HTTP_STATUS=$(curl -s -o /tmp/response.html -w "%{http_code}" http://localhost:3001/)
if [ "$HTTP_STATUS" = "200" ]; then
  echo "✓ GET / returned HTTP 200"
else
  echo "✗ GET / returned HTTP $HTTP_STATUS (expected 200)"
  exit 1
fi

# Test 3: Response contains 'Pokemon Explorer'
echo "Test 3: Checking response contains 'Pokemon Explorer'..."
if grep -q "Pokemon Explorer" /tmp/response.html; then
  echo "✓ Response contains 'Pokemon Explorer'"
else
  echo "✗ Response does not contain 'Pokemon Explorer'"
  cat /tmp/response.html
  exit 1
fi

# Test 4: Response contains 'Filter by Color'
echo "Test 4: Checking response contains 'Filter by Color'..."
if grep -q "Filter by Color" /tmp/response.html; then
  echo "✓ Response contains 'Filter by Color'"
else
  echo "✗ Response does not contain 'Filter by Color'"
  cat /tmp/response.html
  exit 1
fi

echo ""

# Test 5-7: API endpoints
echo "Test 5-7: Testing API endpoints..."

# Test 5: GET /api/pokemons?color=Yellow returns JSON array
echo "Test 5: Checking GET /api/pokemons?color=Yellow returns JSON..."
YELLOW_RESPONSE=$(curl -s http://localhost:3001/api/pokemons?color=Yellow)
if echo "$YELLOW_RESPONSE" | grep -q '"data"'; then
  echo "✓ GET /api/pokemons?color=Yellow returned JSON with data"
else
  echo "✗ GET /api/pokemons?color=Yellow did not return valid JSON"
  echo "Response: $YELLOW_RESPONSE"
  exit 1
fi

# Test 6: Response includes Pikachu
echo "Test 6: Checking response includes 'Pikachu'..."
if echo "$YELLOW_RESPONSE" | grep -q "Pikachu"; then
  echo "✓ Response includes 'Pikachu'"
else
  echo "✗ Response does not include 'Pikachu'"
  echo "Response: $YELLOW_RESPONSE"
  exit 1
fi

# Test 7: Response includes Zapdos (also Yellow)
echo "Test 7: Checking response includes 'Zapdos'..."
if echo "$YELLOW_RESPONSE" | grep -q "Zapdos"; then
  echo "✓ Response includes 'Zapdos'"
else
  echo "✗ Response does not include 'Zapdos'"
  echo "Response: $YELLOW_RESPONSE"
  exit 1
fi

echo ""
echo "========== All tests passed! =========="
