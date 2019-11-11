import { expect } from 'chai'
import { World } from '../core';


describe("component manager", () => {

    it("should delete all components when an entity is removed", () => {

        let world = new World();
        world
            .registerComponent("A")
            .registerComponent("B");

        let managerComponentA = world.getComponentManager("A");
        let managerComponentB = world.getComponentManager("B");

        let entity = world.create();

        managerComponentA.add(entity);
        managerComponentB.add(entity);

        expect(world.componentManager.getAllComponents(entity)).to.deep.equal(["A", "B"]);

        world.remove(entity);
        world.process();

        expect(world.componentManager.getAllComponents(entity)).to.deep.equal([]);
    });
});