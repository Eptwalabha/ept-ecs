import { expect, should } from 'chai'
import { spy } from 'sinon'
import { World, System } from '../index'

class SystemTest extends System {
    public call = [];

    beforeProcess(): void {
        this.call.push("beforeProcess");
    }

    protected processSystem(): void {
        this.call.push("processSystem");
    }

    afterProcess(): void {
        this.call.push("afterProcess");
    }
}

describe ('System', () => {

    it('call the System process method on world update', () => {
        let world = new World();
        let system = new SystemTest();
        world.addSystem(system);
        world.init();
        let spyOnDoProcessSystem = spy(system, "doProcessSystem");
        let spyOnProcessSystem = spy(system, "processSystem");
        world.process();
        expect(spyOnProcessSystem.called);
        expect(spyOnDoProcessSystem.called);
    });

    it('will call processSystem only if the system is not active', () => {
        let world = new World();
        let system = new SystemTest();
        let spyOnProcessSystem = spy(system, "processSystem");

        world.addSystem(system)
        system.setEnable(false);
        world.init();
        world.process();
        expect(!spyOnProcessSystem.called);
        system.setEnable(true);
        world.process();
        expect(spyOnProcessSystem.called);
    });

    it('will call in order beforeProcess processSystem then afterProcess when world is processed', () => {
        let world = new World();
        let system = new SystemTest();

        world.addSystem(system)
        world.process();

        expect(system.call).to.deep.equal(["beforeProcess", "processSystem", "afterProcess"]);
    });
});