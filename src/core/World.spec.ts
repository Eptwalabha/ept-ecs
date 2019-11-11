import { expect } from 'chai'
import { World } from '../index'

describe ('World', function () {

    describe('Entity creation', function () {
        it('should return a different entity id', function () {
            var world = new World();
            var idA = world.create();
            var idB = world.create();
            expect(idA).to.not.equal(idB);
        });

        it('should recycles entities when deleted', function () {
            var world = new World();
            world.init();
            var idA = world.create();
            var idB = world.create();
            world.remove(idA);
            world.process();
            var idC = world.create();
            var idD = world.create();
            expect(idA).to.equal(1);
            expect(idB).to.equal(2);
            expect(idC).to.equal(1);
            expect(idD).to.equal(3);
        });
    });
});