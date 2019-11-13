import { expect } from 'chai'
import { fake, SinonSpy } from 'sinon';
import { IntervalSystem } from '../system'
import { World } from '../core';

describe('interval system', () => {

    class MyIntervalSystem extends IntervalSystem {
        private callback: SinonSpy;

        constructor(interval: number, delay: number, callback: SinonSpy) {
            super(interval, delay);
            this.callback = callback;
        }

        protected processSystem(): void {
            this.callback();
        }

    }

    it('should call process at a regular interval', () => {
        let callback: SinonSpy = fake();
        let world = new World();
        let interval = 10;
        let myIntervalSystem = new MyIntervalSystem(interval, 10, callback);

        world
            .addSystem(myIntervalSystem)
            .init();

        world.process(5);
        expect(callback.notCalled);

        world.process(10);
        expect(callback.called);

        world.process(5);
        expect(callback.called);

        world.process(9);
        expect(callback.notCalled);

        world.process(1);
        expect(callback.called);
    });

    it('should not call process if disabled', () => {
        let callback: SinonSpy = fake();
        let world = new World();
        let interval = 10;
        let myIntervalSystem = new MyIntervalSystem(interval, 10, callback);

        world
            .addSystem(myIntervalSystem)
            .init();

        world.process(10);
        expect(callback.called);

        world.process(9);
        expect(callback.notCalled);

        myIntervalSystem.setEnable(false);
        world.process(1);
        expect(callback.notCalled);

        myIntervalSystem.setEnable(true);
        world.process(1);
        expect(callback.called);
    });
    
    describe('delta time bigger than system\'s interval', () => {
        it('should call process at every world.process until it is not late anymore', () => {
            let callback: SinonSpy = fake();
            let world = new World();
            let interval = 10;
            let myIntervalSystem = new MyIntervalSystem(interval, 10, callback);

            world
                .addSystem(myIntervalSystem)
                .init();
            
            world.process(30);
            expect(callback.called);

            world.process(0);
            expect(callback.called);

            world.process(0);
            expect(callback.called);

            world.process(0);
            expect(callback.notCalled);

            world.process(10);
            expect(callback.called);
        });

        it('should call process only once', () => {
            let callback: SinonSpy = fake();
            let world = new World();
            let interval = 10;
            let myIntervalSystem = new MyIntervalSystem(interval, 10, callback);
            myIntervalSystem.enableCatchUpDelay(false);

            world
                .addSystem(myIntervalSystem)
                .init();
            
            world.process(30);
            expect(callback.called);

            world.process(0);
            expect(callback.notCalled);

            world.process(19);
            expect(callback.called);

            world.process(0);
            expect(callback.notCalled);

            world.process(1);
            expect(callback.called);
        });



    });
});