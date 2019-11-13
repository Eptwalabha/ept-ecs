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

    public accept(entity: number, components: string[]): boolean {
        const present = this.entities.includes(entity);
        const valid = this.aspect.accept(components);
        if (!present && valid) {
            this.entities.push(entity);
            return true;
        } else if (present && !valid) {
            this.entities = this.entities.filter(sEntity => sEntity !== entity);
        }
        return valid;
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

    protected processEntities(): void {
        for (const entity of this.entities) {
            this.process(entity);
        }
    }

    protected abstract process(entity: number): void;

    /* tslint:disable:no-empty */
    public processSystem(): void {}

}
