module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', {
      runtime: 'automatic' // Используем автоматический импорт для React 19
    }]
  ]
};