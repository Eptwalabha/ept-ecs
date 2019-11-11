import { expect } from 'chai'
import { spy } from 'sinon'
import { World, Aspect, Component } from '../core';
import { DelayedEntitySystem } from './DelayedEntitySystem';
import { Manager } from '../manager';

describe("delayed entity system", () => {

    class MyDelayedEntitySystem extends DelayedEntitySystem {

        private timerManager: Manager;

        public init(world: World) {
            super.init(world),
            this.timerManager = world.getComponentManager("Timer");
        }

        public updateEntityDelay(entity: number): boolean {
            let timer = this.timerManager.fetch(entity) as Timer
            timer.timeBeforeProcess -= this.world.delta;
            return timer.timeBeforeProcess <= 0;
        }

        protected process(entity: number): void { }
    }

    class Timer extends Component {
        public timeBeforeProcess = 10;

        constructor(timer: number) {
            super();
            this.timeBeforeProcess = timer;
        }
    }

    it("sould process entity once after a certain time", () => {
        let world = new World();
        let aspect = new Aspect().all("Timer");
        let myDelayedEntitySystem = new MyDelayedEntitySystem(aspect);
        let spyOnProcessEntity = spy(myDelayedEntitySystem, "process");

        world
            .registerComponent("Timer", new Timer(10))
            .addSystem(myDelayedEntitySystem)
            .init();

        let entityA = world.create();
        let entityB = world.create();
        world.getComponentManager("Timer").add(entityA);
        world.getComponentManager("Timer").add(entityB, new Timer(20));

        world.process(5);

        expect(spyOnProcessEntity.notCalled);

        world.process(10);

        expect(spyOnProcessEntity.withArgs(entityA).calledOnce);
        expect(spyOnProcessEntity.withArgs(entityB).notCalled);

        world.process(10);

        expect(spyOnProcessEntity.withArgs(entityA).notCalled);
        expect(spyOnProcessEntity.withArgs(entityB).calledOnce);

        world.process(10);

        expect(spyOnProcessEntity.withArgs(entityA).notCalled);
        expect(spyOnProcessEntity.withArgs(entityB).notCalled);
    });
});