import {World} from "../core/World";

export abstract class System {
    private entities: Array<number>;
    protected world: World;
    private enable: boolean = true;

    public constructor() {
        this.enable = true;
        this.entities = [];
    }

    protected abstract match (entity: number): boolean;

    public init(world: World) {
        this.world = world;
    }

    public setEnable(enable: boolean) {
        this.enable = enable;
    }

    public isEnable() {
        return this.enable;
    }

    public tryEntity(entity: number) {
        if (this.entities.indexOf(entity) === -1 && this.match(entity)) {
            this.entities.push(entity);
        }
    }

    public removeEntities(entitiesToRemove: Array<number>) {
        let newEntities: Array<number> = [];
        for (let entity of this.entities) {
            if (entitiesToRemove.indexOf(entity) === -1) {
                newEntities.push(entity);
            }
        }
        this.entities = newEntities;
    }

    public processAll() {
        for (let entity of this.entities) {
            this.process(entity);
        }
    }

    public beforeProcess(): void {}

    protected abstract process(entity: number): void;

    public afterProcess(): void {}
}
