import {World} from "../core/World";

export abstract class System {
    private entities: Array<number>;
    protected world: World;
    private enable: boolean = true;

    public setEnable(enable: boolean) {
        this.enable = enable;
    }

    public isEnable() {
        return this.enable;
    }

    public addEntity(entity: number) {
        if (this.entities.indexOf(entity) === -1) {
            this.entities.push(entity);
        }
    }

    public removeEntity(entity: number) {
        let newEntities: Array<number> = [];
        this.entities.forEach(function (entityId) {
            if (entityId !== entity) {
                newEntities.push(entityId);
            }
        });
        this.entities = newEntities;
    }

    public processAll() {
        for (let entity of this.entities) {
            this.process(entity);
        }
    }

    protected abstract process(entity: number): void;

    public setWorld(world: World) {
        this.world = world;
    }
}
