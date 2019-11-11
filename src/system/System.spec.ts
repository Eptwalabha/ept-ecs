import { expect } from 'chai'
import { fake, SinonSpy } from 'sinon'
import { World, System } from '../index'

describe('System', () => {

    class SystemTest extends System {
        public callback: SinonSpy;

        constructor(callback: SinonSpy) {
            super();
            this.callback = callback;
        }

        beforeProcess(): void {
            this.callback("beforeProcess");
        }

        protected processSystem(): void {
            this.callback("processSystem");
        }

        afterProcess(): void {
            this.callback("afterProcess");
        }
    }


    it('call the System process method on world update', () => {
        let world = new World();
        let callback: SinonSpy = fake();
        let system = new SystemTest(callback);

        world.addSystem(system);
        world.init();
        world.process();

        expect(callback.calledWith("beforeProcess"));
        expect(callback.calledWith("processSystem"));
        expect(callback.calledWith("afterProcess"));
    });

    it('will call processSystem only if the system is not active', () => {
        let world = new World();
        let callback: SinonSpy = fake();
        let system = new SystemTest(callback);

        world.addSystem(system)
        system.setEnable(false);
        world.init();
        world.process();

        expect(callback.notCalled);

        system.setEnable(true);
        world.process();

        expect(callback.calledWith("beforeProcess"));
        expect(callback.calledWith("processSystem"));
        expect(callback.calledWith("afterProcess"));
    });

});