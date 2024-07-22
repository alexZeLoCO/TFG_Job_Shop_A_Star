module.exports = {
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@components', './src/components'],
          ['@colors', './src/colors.ts']
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx']
      }
    }
  }
};