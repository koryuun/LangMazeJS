import { Game as MainGame } from './scenes/Game';
import { AUTO, Scale,Game, CANVAS } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: CANVAS,
    width: 512 + 8,
    height: 512 + 8,
    parent: 'game-container',
    backgroundColor: '#FFFFFF',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    scene: [
        MainGame
    ]
};



//export default new Game(config);
new Game(config)
