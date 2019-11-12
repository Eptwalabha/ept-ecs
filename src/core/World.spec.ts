import { expect } from 'chai'
import { World, Aspect } from '../index'
import { EntitySystem } from '../system';
import { fake, SinonSpy } from 'sinon';

describe ('World', function () {

    class MockSystem extends EntitySystem {
        private callback: SinonSpy;

        constructor(aspect: Aspect, callback: SinonSpy) {
            super(aspect);
            this.callback = callback;
        }

        protected process(entity: number): void {
            this.callback(entity);
        }
    }

    describe('Entity creation', function () {
        it('should return a different entity id', function () {
            let world = new World();
            let idA = world.create();
            let idB = world.create();
            expect(idA).to.not.equal(idB);
        });

        it('should recycles entities when deleted', function () {
            let world = new World();
            world.init();
            let idA = world.create();
            let idB = world.create();
            world.remove(idA);
            world.process();
            let idC = world.create();
            let idD = world.create();
            expect(idA).to.equal(1);
            expect(idB).to.equal(2);
            expect(idC).to.equal(1);
            expect(idD).to.equal(3);
        });

        it('should remove an entity from a system when it\' deleted from world', () => {
            let world = new World();
            let callback = fake();
            let system = new MockSystem(new Aspect().all('A'), callback);
            world
                .registerComponent('A')
                .addSystem(system);
            
            let entity = world.create();
            world.getComponentManager('A').add(entity);
            world.init();

            world.remove(entity);
            world.remove(entity);
            world.process(0);

            expect(callback.notCalled);

            world.remove(entity);
            world.process(0);
            expect(callback.notCalled);

        });

        it('should not process systems that are initially disabled', () => {
            let world = new World();
            let callback = fake();
            let system = new MockSystem(new Aspect().all('A'), callback);
            world
                .registerComponent('A')
                .addSystem(system, false);

            let entity = world.create();
            world.getComponentManager('A').add(entity);
            world.init();

            world.process(1);
            expect(callback.notCalled);
            system.setEnable(true);

            world.process(1);
            expect(callback.calledWith(entity));
        });
    });
});