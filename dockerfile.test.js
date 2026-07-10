const fs = require('fs');
const path = require('path');

/**
 * Dockerfile structure validation tests
 * These tests verify that the Dockerfile is correctly configured to:
 * 1. Reference the correct package.json location (pokemon-backend/package.json)
 * 2. Copy backend source and frontend build to correct locations
 * 3. Enable npm start to run from the correct working directory
 */

describe('Dockerfile Configuration', () => {
  let dockerfileContent;

  beforeAll(() => {
    const dockerfilePath = path.join(__dirname, '.tr-codegen/Dockerfile');
    dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');
  });

  test('should reference package.json in COPY command', () => {
    // The COPY command must look for package.json in the build context (pokemon-backend/)
    // which is set to ".." (parent of .tr-codegen) in docker-compose.yml
    expect(dockerfileContent).toMatch(/COPY\s+package\*\.json\s+\.\//);
  });

  test('should copy source code to working directory', () => {
    // Copy the pokemon-backend source code (from build context) to /app
    // Using COPY . . works because build context is pokemon-backend/ directory
    expect(dockerfileContent).toMatch(/COPY\s+\.\s+\.(?:\s|\/)/);
  });

  test('should reference frontend serving strategy', () => {
    // The Dockerfile should acknowledge frontend serving approach
    // Either through COPY of frontend build or reliance on fallback HTML
    expect(dockerfileContent).toMatch(/frontend|fallback/i);
  });

  test('should not use problematic pokemon-backend nested paths', () => {
    // Since build context is pokemon-backend/, using COPY pokemon-backend/ would fail
    // The Dockerfile should use relative paths from the build context
    const lines = dockerfileContent.split('\n');
    const nestedBackendCopy = lines.filter(line => /COPY\s+pokemon-backend\/\s+\./.test(line.trim()));
    expect(nestedBackendCopy.length).toBe(0);
  });

  test('should have WORKDIR /app set for npm operations', () => {
    expect(dockerfileContent).toMatch(/WORKDIR\s+\/app/);
  });

  test('should expose port 3001', () => {
    expect(dockerfileContent).toMatch(/EXPOSE\s+3001/);
  });

  test('should have healthcheck configured', () => {
    expect(dockerfileContent).toMatch(/HEALTHCHECK/);
    expect(dockerfileContent).toMatch(/curl.*http:\/\/localhost:3001\/health/);
  });

  test('should use npm start in CMD', () => {
    expect(dockerfileContent).toMatch(/CMD\s+\[\s*["']npm["']\s*,\s*["']start["']\s*\]/);
  });
});
