var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    ECS = require('../../dist/ept-ecs'),
    World = ECS.World,
    System = ECS.System;

describe ('System', function () {

    var world = new World();
    var system = new System();

    before(function () {
        world = new World();
        world.addSystem(system);
        world.init();
    });

    it('call the System process method on world update', function () {
        var toto = sinon.spy(system, "doProcessSystem");
        world.process();
        assert(toto.called);
    });

});