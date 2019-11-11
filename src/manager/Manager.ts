import {World, Component} from "../core";

export class Manager {
    public defaultValue: Component;
    private world: World;

    public container: {
        [id: number]: Component
    };

    constructor(world: World, defaultValue: Component) {
        this.world = world;
        this.defaultValue = defaultValue;
        this.container = {};
    }

    public add(entity: number, component?: Component): void {
        if (component === undefined) {
            this.container[entity] = {...this.defaultValue};
        } else {
            this.container[entity] = component;
        }
        this.world.update(entity);
    }

    public fetch(entity: number): Component {
        if (this.container[entity] === undefined) {
            this.container[entity] = {...this.defaultValue};
            this.world.update(entity);
        }
        return this.container[entity];
    }

    public remove(entity): void {
        delete this.container[entity];
        this.world.update(entity);
    }

    public has(entity): boolean {
        return this.container[entity] !== undefined;
    }

    public clean(entity): void {
        delete this.container[entity];
    }
}
