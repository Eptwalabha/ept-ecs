var chai = require('chai'),
    expect = chai.expect,
    World = require('../../dist/core/World').World;

describe ('World', function () {

    describe('Entity creation', function () {
        it('should return a different entity id', function () {
            var world = new World();
            var idA = world.createEntity();
            var idB = world.createEntity();
            expect(idA).to.not.equal(idB);
        });
    });
});