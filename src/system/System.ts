import {World} from "../core/World";

export abstract class System {
    protected world: World;
    private enable: boolean = true;

    public constructor() {
        this.enable = true;
    }

    public accept(entity: number, components: Array<string>): void {}

    public init(world: World) {
        this.world = world;
    }

    public setEnable(enable: boolean) {
        this.enable = enable;
    }

    public isEnable() {
        return this.enable;
    }

    public removeEntities(entitiesToRemove: Array<number>) {}

    public doProcessSystem(): void {
        if (this.isEnable()) {
            this.beforeProcess();
            this.processSystem();
            this.afterProcess();
        }
    }

    protected beforeProcess(): void {}

    protected abstract processSystem(): void;

    protected afterProcess(): void {}
}
