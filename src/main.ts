import './style.css'; // Import CSS for styling
import { Game } from './game';

// eslint-disable-next-line no-console
console.log('CGAA initializing...');

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.start();

  // Optional: Add cleanup logic if needed
  // window.addEventListener('beforeunload', () => {
  //   game.stop();
  // });
});
