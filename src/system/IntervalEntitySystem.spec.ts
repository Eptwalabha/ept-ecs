import { expect } from 'chai'
import { fake, SinonSpy } from 'sinon'
import { World, Aspect, IntervalEntitySystem } from '../index';


describe('interval entity system', () => {

    class MyIntervalEntitySystem extends IntervalEntitySystem {
        private fakeCallback: SinonSpy;

        constructor(aspect: Aspect, interval: number, callback: SinonSpy) {
            super(aspect, interval);
            this.fakeCallback = callback;
        }

        protected process(entity: number): void {
            this.fakeCallback(entity);
        }
    }

    class MyIntervalEntitySystemWithDelay extends IntervalEntitySystem {
        private fakeCallback: SinonSpy;

        constructor(interval: number, delay: number, callback: SinonSpy) {
            super(new Aspect(), interval, delay);
            this.fakeCallback = callback;
        }

        protected process(entity: number): void {
            this.fakeCallback(entity);
        }
    }

    it ('should process matching entities at regular interval', () => {
        let callback: SinonSpy = fake();
        let world = new World();
        let aspect = new Aspect().all('A').none('B');
        let interval = 10;
        let myIntervalSystem = new MyIntervalEntitySystem(aspect, interval, callback);

        world
            .registerComponent('A')
            .registerComponent('B')
            .addSystem(myIntervalSystem)
            .init();

        let entityA = world.create();
        let entityB = world.create();
        world.getComponentManager('A').add(entityA);
        world.getComponentManager('A').add(entityB);

        world.process(5);
        expect(callback.notCalled);

        world.process(5);
        expect(callback.calledWith(entityA));
        expect(callback.calledWith(entityB));

        world.getComponentManager('B').add(entityB);
        world.process(10);
        expect(callback.calledWith(entityA));
        expect(!callback.calledWith(entityB));

        world.process(9);
        expect(callback.notCalled);

        world.getComponentManager('B').remove(entityB);
        world.process(1);
        expect(callback.calledWith(entityA));
        expect(callback.calledWith(entityB));
    });

    it('should delay the interval function when delay is set', () => {
        let callback: SinonSpy = fake();
        let world = new World();
        let interval = 10;
        let initialDelay = 15;
        let system = new MyIntervalEntitySystemWithDelay(interval, initialDelay, callback);

        world
            .addSystem(system)
            .init();

        let entity = world.create();

        world.process(10);
        expect(callback.notCalled);

        system.setEnable(false);
        world.process(10);
        expect(callback.notCalled);

        system.setEnable(true);
        world.process(10);
        expect(callback.notCalled);

        world.process(5);
        expect(callback.calledWith(entity));

        world.process(10);
        expect(callback.calledWith(entity));
    });


    describe('delta time bigger than system\'s interval', () => {

        it('should call process every time world.process() is called until the system catches up its delay', () => {
            let callback: SinonSpy = fake();
            let world = new World();
            let aspect = new Aspect();
            let interval = 10;
            let myIntervalSystem = new MyIntervalEntitySystem(aspect, interval, callback);

            world
                .addSystem(myIntervalSystem)
                .init();

            let entity = world.create();

            world.process(30);
            expect(callback.calledWith(entity));

            world.process(0);
            expect(callback.calledWith(entity));

            world.process(0);
            expect(callback.calledWith(entity));

            world.process(0);
            expect(callback.notCalled);
        });

        it('only calls process once if catchUpDelay is set to false', () => {
            let callback: SinonSpy = fake();
            let world = new World();
            let aspect = new Aspect();
            let interval = 10;
            let myIntervalSystem = new MyIntervalEntitySystem(aspect, interval, callback);
            myIntervalSystem.enableCatchUpDelay(false);

            world
                .addSystem(myIntervalSystem)
                .init();

            let entity = world.create();

            world.process(39);
            expect(callback.calledWith(entity));

            world.process(0);
            expect(callback.notCalled);

            world.process(1);
            expect(callback.calledWith(entity));
        });
    });

});