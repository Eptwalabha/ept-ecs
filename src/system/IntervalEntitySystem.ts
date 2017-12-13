import {EntitySystem} from "../system";
import {Aspect} from "../core/Aspect";

export abstract class IntervalEntitySystem extends EntitySystem {
    protected delay: number;
    protected interval: number;

    public constructor(aspect: Aspect, interval: number, delay?: number) {
        super(aspect);
        this.interval = interval;
        this.delay = (delay === undefined) ? interval : delay;
    }

    protected updateDelay () {
        this.delay -= this.world.delta;
    }

    public doProcessSystem(): void {
        if (this.isEnable()) {
            this.updateDelay();
            if (this.delay <= 0) {
                this.beforeProcess();
                this.processEntities();
                this.afterProcess();
                this.delay += this.interval;
            }
        }
    }
}
