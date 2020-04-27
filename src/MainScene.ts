import Cell from "@/Cell";
import GameConfig from "@/GameConfig";

const SCENE_KEY: string = 'main-scene';

export default class MainScene extends Phaser.Scene {
    private cells: Cell[] = [];;
    private generation: number;
    private graphics: Phaser.GameObjects.Graphics | undefined;
    private stageWidth: number;
    private stageHeight: number;
    private timer: any;

    constructor() {
        super(SCENE_KEY);

        this.stageWidth = GAME_WIDTH / GameConfig.CELL_SIZE;
        this.stageHeight = GAME_HEIGHT / GameConfig.CELL_SIZE;
        this.generation = 0;
    }

    public init(): void {
    }

    public preload(): void {
        this.graphics = this.add.graphics({ fillStyle: { color: GameConfig.CELL_COLOR }});
    }

    public create(): void {
        this.generation = 1;
        Array.from(Array(this.stageSize).keys()).forEach(index => {
            this.cells.push(new Cell(this, this.numberToPosition(index), GameConfig.CELL_SEED > Math.random()));
        });

        this.timer = this.time.addEvent({
            delay: GameConfig.DELAY_INTERVAL,
            callback: this.nextGeneration,
            callbackScope: this,
            loop: true
        });
    }

    public update(): void {
        this.graphics?.clear();
        this.cells.forEach(cell => {
            cell.active && this.graphics?.fillRectShape(cell)
        });
    }

    private nextGeneration(): void {
        this.generation++;
        Array.from(Array(this.stageSize).keys()).forEach(index => {
            const active = this.cells[index].active;
            const score = this.neighborScore(index);

            if (active && (2 > score || 3 < score)) {
                this.cells[index].active = false;
            } else if (!active && 3 == score) {
                this.cells[index].active = true;
            }
        });
    }

    private neighborScore(index: number): number {
        const neighbor = { up: false, down: false, left: false, right: false };
        const position = this.numberToPosition(index);
        
        if (0 <= (position.x - 1)) neighbor.left = true;
        if (this.stageWidth >= (position.x + 1)) neighbor.right = true;
        if (0 <= (position.y - 1)) neighbor.up = true;
        if (this.stageHeight >= (position.y + 1)) neighbor.down = true;

        let score = 0;

        if (neighbor.up && neighbor.left && this.cells[this.positionToNumber({ x: position.x - 1, y: position.y - 1 })]?.active) score++;
        if (neighbor.up && this.cells[this.positionToNumber({ x: position.x, y: position.y - 1 })]?.active) score++;
        if (neighbor.up && neighbor.right && this.cells[this.positionToNumber({ x: position.x + 1, y: position.y - 1 })]?.active) score++;
        if (neighbor.left && this.cells[this.positionToNumber({ x: position.x - 1, y: position.y })]?.active) score++;
        if (neighbor.right && this.cells[this.positionToNumber({ x: position.x + 1, y: position.y })]?.active) score++;
        if (neighbor.down && neighbor.left && this.cells[this.positionToNumber({ x: position.x - 1, y: position.y + 1 })]?.active) score++;
        if (neighbor.down && this.cells[this.positionToNumber({ x: position.x, y: position.y + 1 })]?.active) score++;
        if (neighbor.down && neighbor.right && this.cells[this.positionToNumber({ x: position.x + 1, y: position.y + 1 })]?.active) score++;

        return score;
    }

    private get stageSize(): number {
        return this.stageWidth * this.stageHeight;
    }

    private positionToNumber(position: TwoDimensionPosition): number {
        return (this.stageWidth * position.y) + position.x;
    }

    private numberToPosition(index: number): TwoDimensionPosition {
        const result = { x: 0, y: 0 };

        if (0 < index) {
            result.y = Math.floor(index / this.stageWidth);
            result.x = index - (result.y * this.stageWidth);
        }

        return result;
    }
}