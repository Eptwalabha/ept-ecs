import {System} from '../system';

export abstract class DelayedSystem extends System {
    protected delay: number;

    public constructor(delay: number) {
        super();
        this.delay = delay;
    }

    protected updateDelay() {
        this.delay -= this.world.delta;
    }

    public doProcessSystem(): void {
        if (this.isEnable()) {
            this.updateDelay();
            if (this.delay <= 0) {
                this.beforeProcess();
                this.processSystem();
                this.afterProcess();
                this.delay = 0;
                this.setEnable(false);
            }
        }
    }

    public addDelay(delay: number, enable: boolean = true) {
        this.setEnable(enable);
        this.delay += delay;
    }

    protected abstract processSystem(): void;
}
