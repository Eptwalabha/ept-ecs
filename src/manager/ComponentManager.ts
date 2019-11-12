import {World, Component} from '../core';
import {Manager} from './Manager';

interface IManager {
    [name: string]: Manager;
}

export class ComponentManager {

    private managers: IManager;

    constructor() {
        this.managers = {};
    }

    public register(world: World, name: string, component: Component): void {
        this.managers[name] = new Manager(world, component);
    }

    public getManager(name: string): Manager {
        return this.managers[name];
    }

    public getAllComponents(entity: number): string[] {
        const components: string[] = [];
        Object.keys(this.managers).forEach(name => {
            if (this.managers[name].has(entity)) {
                components.push(name);
            }
        });
        return components;
    }

    public cleanEntitiesComponents(entities: number[]): void {
        Object.keys(this.managers).forEach(name => {
            entities.forEach(entity => {
                this.managers[name].clean(entity);
            });
        });
    }
}
