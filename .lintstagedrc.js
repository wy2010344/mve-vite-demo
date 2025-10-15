export default {
  '**/*.{ts,tsx,js,jsx}': ['prettier --write', 'eslint --fix'],
  '**/*.{json,md,css,scss}': ['prettier --write'],
  '!docs/**': 'echo "Skipping docs directory"',
};
