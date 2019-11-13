import { expect } from 'chai'
import { DelayedSystem } from './DelayedSystem';
import { fake, SinonSpy } from 'sinon';
import { World } from '../core';

describe('delayed system', () => {

    class MyDelayedSystem extends DelayedSystem {
        private callback: SinonSpy;

        constructor(delay: number, callback: SinonSpy) {
            super(delay);
            this.callback = callback;
        }

        protected processSystem(): void {
            this.callback();
        }
    }

    it('should call process after the given delay', () => {
        let world = new World();
        let callback = fake();
        world
            .addSystem(new MyDelayedSystem(10, callback))
            .init();
        
        world.process(5);
        expect(callback.notCalled);

        world.process(5);
        expect(callback.called);

        world.process(10);
        expect(callback.notCalled);
    });

    it('should not update delay if the system is disabled', () => {
        let world = new World();
        let callback = fake();
        world
            .addSystem(new MyDelayedSystem(10, callback), false)
            .init();

        world.process(20);
        expect(callback.notCalled);
    });

    describe('delayed system addDelay', () => {
        it('should add delay to the system timer', () => {
            let world = new World();
            let callback = fake();
            let system = new MyDelayedSystem(10, callback);
            world
                .addSystem(system)
                .init();

            world.process(5);
            expect(callback.notCalled);

            system.addDelay(10);
            world.process(5);
            expect(callback.notCalled);

            world.process(10);
            expect(callback.called);
        });

        it('can add delay and disable system at the same time', () => {
            let world = new World();
            let callback = fake();
            let system = new MyDelayedSystem(10, callback);
            world
                .addSystem(system)
                .init();

            world.process(5);
            expect(callback.notCalled);

            system.addDelay(10, false);
            world.process(15);
            expect(callback.notCalled);

            expect(system.isEnable()).to.be.false;
        });
    });
});