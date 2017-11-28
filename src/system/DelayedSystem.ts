import {System} from "../system";

export abstract class DelayedSystem extends System {
    private delay: number;
    private initialDelay: number;

    public constructor(delay: number, initial?: number) {
        super();
        this.delay = delay;
        this.initialDelay = (initial === undefined) ? delay: initial;
    }

    public doProcessSystem(): void {
        if (this.isEnable()) {
            this.delay -= this.world.delta;
            if (this.delay <= 0) {
                this.beforeProcess();
                this.processSystem();
                this.afterProcess();
                this.delay += this.initialDelay;
            }
        }
    }

    protected abstract processSystem(): void;
}
