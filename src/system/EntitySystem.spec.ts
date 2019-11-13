import { expect } from 'chai';
import { Aspect, World, EntitySystem } from '../index';

describe('entity system', () => {

    class MyEntitySytem extends EntitySystem {
        constructor(aspect: Aspect) {
            super(aspect);
        }

        protected process(entity: number): void {
        }
    }

    it('use its aspect to check whether an entity match or not', () => {
        let aspectA = new Aspect().all('A').one('B');
        let aspectB = new Aspect().one('B').none('C');
        let systemA = new MyEntitySytem(aspectA);
        let systemB = new MyEntitySytem(aspectB);

        let world = new World();
        world
            // .addSystem(systemA)
            // .addSystem(systemB)
            .init();

        let entity = world.create();

        expect(systemA.accept(entity, ['A'])).to.be.false;
        expect(systemA.accept(entity, ['A', 'B'])).to.be.true;
        expect(systemA.accept(entity, ['B'])).to.be.false;
        expect(systemA.accept(entity, ['A', 'C'])).to.be.false;

        expect(systemB.accept(entity, ['A'])).to.be.false;
        expect(systemB.accept(entity, ['A', 'B'])).to.be.true;
        expect(systemB.accept(entity, ['B'])).to.be.true;
        expect(systemB.accept(entity, ['B', 'C'])).to.be.false;
    });
});