import {EntitySystem} from '../system';
import {Aspect} from '../core/Aspect';

export abstract class DelayedEntitySystem extends EntitySystem {
    private entitiesToProcess: number[];

    public constructor(aspect: Aspect) {
        super(aspect);
        this.entitiesToProcess = [];
    }

    public abstract updateEntityDelay(entity: number): boolean;

    private updateEntitiesDelay() {
        this.entitiesToProcess = [];
        this.entities.forEach(entity => {
            if (this.updateEntityDelay(entity)) {
                this.entitiesToProcess.push(entity);
            }
        });
    }

    protected processEntities(): void {
        this.entitiesToProcess.forEach(entity => this.process(entity));
        this.entitiesToProcess = [];
    }

    public doProcessSystem(): void {
        if (this.isEnable()) {
            this.updateEntitiesDelay();
            this.beforeProcess();
            this.processEntities();
            this.afterProcess();
        }
    }
}
