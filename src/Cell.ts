import GameConfig from '@/GameConfig';

export default class Cell extends Phaser.Geom.Rectangle {
    public active: boolean;
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, position: TwoDimensionPosition, active: boolean) {
        super(
            position.x * GameConfig.CELL_SIZE, 
            position.y * GameConfig.CELL_SIZE, 
            GameConfig.CELL_SIZE - 1, 
            GameConfig.CELL_SIZE - 1
        );

        this.scene = scene;
        this.active = active;
    }
}