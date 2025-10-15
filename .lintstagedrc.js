export default {
  '!(docs)/**/*.{ts,tsx,js,jsx}': ['prettier --write', 'eslint --fix'],
  '!(docs)/**/*.{json,md,css,scss}': ['prettier --write'],
};
