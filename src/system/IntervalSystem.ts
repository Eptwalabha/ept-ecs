import {System} from '../system';

export abstract class IntervalSystem extends System {
    protected delay: number;
    protected interval: number;
    private catchUp: boolean = true;

    public constructor(interval: number, delay?: number) {
        super();
        this.interval = interval;
        this.delay = (delay === undefined) ? interval : delay;
    }

    protected updateDelay() {
        this.delay -= this.world.delta;
    }

    public enableCatchUpDelay(catchUp: boolean): void {
        this.catchUp = catchUp;
    }

    public doProcessSystem(): void {
        if (this.isEnable()) {
            this.updateDelay();
            if (this.delay <= 0) {
                this.beforeProcess();
                this.processSystem();
                this.afterProcess();
                if (this.catchUp) {
                    this.delay += this.interval;
                } else {
                    this.delay = - this.delay % this.interval;
                }
            }
        }
    }
}
