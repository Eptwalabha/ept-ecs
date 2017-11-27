import {World} from "../core/World";
import {Aspect} from "../core/Aspect";

export abstract class System {
    private entities: Array<number>;
    protected world: World;
    private enable: boolean = true;
    private aspect: Aspect;

    public constructor(aspect: Aspect) {
        this.enable = true;
        this.aspect = aspect;
        this.entities = [];
    }

    public accept(entity: number, components: Array<string>): void {
        if (this.aspect.accept(components)) {
            this.entities.push(entity);
        }
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

    public removeEntities(entitiesToRemove: Array<number>) {
        let newEntities: Array<number> = [];
        for (let entity of this.entities) {
            if (entitiesToRemove.indexOf(entity) === -1) {
                newEntities.push(entity);
            }
        }
        this.entities = newEntities;
    }

    public processSystem() {
        if (this.isEnable()) {
            this.beforeProcess();
            this.processEntities();
            this.afterProcess();
        }
    }

    private processEntities(): void {
        for (let entity of this.entities) {
            this.process(entity);
        }
    }

    protected beforeProcess(): void {}

    protected abstract process(entity: number): void;

    protected afterProcess(): void {}
}
