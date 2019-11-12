import { World } from '../core';

export abstract class System {
    protected world: World;
    private enable: boolean = true;

    public constructor() {
        this.enable = true;
        this.world = new World();
    }

    public init(world: World) {
        this.world = world;
    }

    public setEnable(enable: boolean) {
        this.enable = enable;
    }

    public isEnable() {
        return this.enable;
    }

    /* tslint:disable:no-empty */
    public accept(entity: number, components: string[]): void {}

    /* tslint:disable:no-empty */
    public removeEntities(entitiesToRemove: number[]): void {}

    public doProcessSystem(): void {
        if (this.isEnable()) {
            this.beforeProcess();
            this.processSystem();
            this.afterProcess();
        }
    }

    /* tslint:disable:no-empty */
    protected beforeProcess(): void {}

    protected abstract processSystem(): void;

    /* tslint:disable:no-empty */
    protected afterProcess(): void {}
}
