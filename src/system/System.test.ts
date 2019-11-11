import { expect } from 'chai'
import { spy } from 'sinon'
import { World, System } from '../index'

class SystemTest extends System {
    protected processSystem(): void {}
}

describe ('System', function () {

    var world = new World();
    var system = new SystemTest();

    it('call the System process method on world update', function () {
        world.addSystem(system);
        world.init();
        var spyOnSystem = spy(system, "doProcessSystem");
        world.process();
        expect(spyOnSystem.called);
    });

});