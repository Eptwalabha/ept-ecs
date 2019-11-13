import { expect } from 'chai'
import { fake, SinonSpy } from 'sinon'
import { World, Aspect, Component } from '../core';
import { DelayedEntitySystem } from './DelayedEntitySystem';

describe('delayed entity system', () => {

    class MyDelayedEntitySystem extends DelayedEntitySystem {

        private fakeCallback: SinonSpy;

        constructor(callback: SinonSpy) {
            super(new Aspect().all('Timer').none('Executed'));
            this.fakeCallback = callback;
        }

        public init(world: World) {
            super.init(world);
        }

        public updateEntityDelay(entity: number): boolean {
            let manager = this.world.getComponentManager('Timer');
            let timer = manager.fetch(entity) as Timer
            timer.timeBeforeProcess -= this.world.delta;
            return timer.timeBeforeProcess <= 0;
        }

        public process(entity: number): void {
            this.fakeCallback(entity);
        }
    }

    class Timer extends Component {
        public timeBeforeProcess = 10;

        constructor(timer: number) {
            super();
            this.timeBeforeProcess = timer;
        }
    }

    it('should not be process if disabled', () => {

        let world = new World();
        let fakeCallback: SinonSpy = fake();
        let myDelayedEntitySystem = new MyDelayedEntitySystem(fakeCallback);

        world
            .registerComponent('Timer', new Timer(10))
            .addSystem(myDelayedEntitySystem)
            .init();
            
        let entity = world.create();
        let entityTimer = world.getComponentManager('Timer').fetch(entity) as Timer;

        expect(entityTimer.timeBeforeProcess).to.eq(10);

        world.process(5);
        expect(entityTimer.timeBeforeProcess).to.eq(5);
        expect(fakeCallback.notCalled);

        myDelayedEntitySystem.setEnable(false);
        world.process(10);
        expect(entityTimer.timeBeforeProcess).to.eq(5);
        expect(fakeCallback.notCalled);

        myDelayedEntitySystem.setEnable(true);
        world.process(5);
        expect(entityTimer.timeBeforeProcess).to.eq(0);
        expect(fakeCallback.calledWith(entity));

    });

    it('should process entity once after a certain time', () => {
        let world = new World();
        let fakeCallback: SinonSpy = fake();
        let myDelayedEntitySystem = new MyDelayedEntitySystem(fakeCallback);

        world
            .registerComponent('Timer', new Timer(10))
            .addSystem(myDelayedEntitySystem)
            .init();

        let entityA = world.create();
        let entityB = world.create();
        world.getComponentManager('Timer').add(entityA, new Timer(10));
        world.getComponentManager('Timer').add(entityB, new Timer(20));

        world.process(5);

        expect(fakeCallback.notCalled);

        world.process(10);

        expect(fakeCallback.calledWith(entityA));
        expect(!fakeCallback.calledWith(entityB));

        world.process(10);

        expect(!fakeCallback.calledWith(entityA));
        expect(fakeCallback.calledWith(entityB));

        world.process(10);

        expect(!fakeCallback.calledWith(entityA));
        expect(!fakeCallback.calledWith(entityB));
    });
});