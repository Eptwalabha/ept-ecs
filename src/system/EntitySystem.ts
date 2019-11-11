import {Aspect} from "../core";
import {System} from "../system";

export abstract class EntitySystem extends System {
    protected entities: Array<number>;
    private aspect: Aspect;

    public constructor(aspect: Aspect) {
        super();
        this.aspect = aspect;
        this.entities = [];
    }

    public accept(entity: number, components: Array<string>): void {
        var present = this.entities.includes(entity);
        var valid = this.aspect.accept(components);
        if (!present && valid) {
            this.entities.push(entity);
        } else if (present && !valid) {
            this.entities = this.entities.filter(sEntity => sEntity !== entity);
        }
    }

    public removeEntities(entitiesToRemove: Array<number>) {
        this.entities = this.entities.filter(entity => !entitiesToRemove.includes(entity));
    }

    public doProcessSystem(): void {
        if (this.isEnable()) {
            this.beforeProcess();
            this.processEntities();
            this.afterProcess();
        }
    }

    protected processEntities(): void {
        for (let entity of this.entities) {
            this.process(entity);
        }
    }

    protected abstract process(entity: number): void;

    public processSystem(): void {}
}
