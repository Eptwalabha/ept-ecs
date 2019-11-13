import { expect } from 'chai'
import { World, Component } from '../core';

describe('manager', () => {

    class MyComponent extends Component {
        public value: string;

        constructor(myValue: string = 'not set') {
            super();
            this.value = myValue;
        }
    }

    describe('manager fetch', () => {
        it('should add the default component to an entity if it has none', () => {

            let world = new World();
            world.registerComponent('A', new MyComponent('default value'));
            world.init();

            let entity = world.create();
            let manager = world.getComponentManager('A');

            let component = manager.fetch(entity) as MyComponent;

            expect(component.value).to.be.eq('default value');
        });
    });
});