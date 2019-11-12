import {Aspect} from '../core';
import {System} from '../system';

export abstract class EntitySystem extends System {
    protected entities: number[];
    private aspect: Aspect;

    public constructor(aspect: Aspect) {
        super();
        this.aspect = aspect;
        this.entities = [];
    }

    public accept(entity: number, components: string[]): void {
        const present = this.entities.includes(entity);
        const valid = this.aspect.accept(components);
        if (!present && valid) {
            this.entities.push(entity);
        } else if (present && !valid) {
            this.entities = this.entities.filter(sEntity => sEntity !== entity);
        }
    }

    public removeEntities(entitiesToRemove: number[]) {
        this.entities = this.entities.filter(entity => !entitiesToRemove.includes(entity));
    }

    public doProcessSystem(): void {
        if (this.isEnable()) {
            this.beforeProcess();
            this.processEntities();
            this.afterProcess();
        }
    }

    /* tslint:disable:no-empty */
    protected processSystem(): void {}

    protected processEntities(): void {
        for (const entity of this.entities) {
            this.process(entity);
        }
    }

    protected abstract process(entity: number): void;

}
