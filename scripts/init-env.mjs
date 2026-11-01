import fs from 'node:fs';
import path from 'node:path';

const apps = ['shiphub-api', 'shiphub-web'];

for (const app of apps) {
  const examplePath = path.join(app, '.env.example');
  const envPath = path.join(app, '.env');

  if (!fs.existsSync(examplePath)) {
    console.log(`${app}: .env.example not found`);
    continue;
  }

  if (fs.existsSync(envPath)) {
    console.log(`${app}: .env already exists. Skipping.`);
    continue;
  }

  fs.copyFileSync(examplePath, envPath);
  console.log(`${app}: .env created.`);
}