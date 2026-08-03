export default {
  '!(docs|public)/**/*.{ts,tsx,js,jsx}': ['prettier --write', 'eslint --fix'],
  '!(docs|public)/**/*.{json,md,css,scss}': ['prettier --write'],
};
