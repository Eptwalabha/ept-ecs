import {EntitySystem} from "../system";
import {Aspect} from "../core/Aspect";

export abstract class DelayedEntitySystem extends EntitySystem {
    private entitiesToProcess: Array<number>;

    public constructor(aspect: Aspect) {
        super(aspect);
        this.entitiesToProcess = [];
    }

    public abstract updateEntityDelay(entity: number): boolean;

    private updateEntitiesDelay() {
        this.entitiesToProcess = [];
        for (let entity of this.entities) {
            if (this.updateEntityDelay(entity)) {
                this.entitiesToProcess.push(entity);
            }
        }
    }

    protected processEntities(): void {
        for (let entity of this.entitiesToProcess) {
            this.process(entity);
        }
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
