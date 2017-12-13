import {System} from "../system";

export abstract class IntervalSystem extends System {
    protected delay: number;
    protected interval: number;

    public constructor(interval: number, delay?: number) {
        super();
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
                this.processSystem();
                this.afterProcess();
                this.delay += this.interval;
            }
        }
    }
}
