import {Component} from "../core/Component";

export class Manager {
    public defaultValue: Component;
    public container: {
        [id: number]: Component
    };

    constructor(defaultValue: Component) {
        this.defaultValue = defaultValue;
        this.container = {};
    }

    public add(entityId: number, component?: Component): void {
        if (component === undefined) {
            this.container[entityId] = {...this.defaultValue};
        } else {
            this.container[entityId] = component;
        }
    }

    public fetch(entityId: number): Component {
        if (this.container[entityId] === undefined) {
            this.container[entityId] = {...this.defaultValue};
        }
        return this.container[entityId];
    }

    public remove(entityId): void {
        delete this.container[entityId];
    }
}
