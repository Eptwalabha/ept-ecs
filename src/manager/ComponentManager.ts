import {Component} from "../core/Component";
import {Manager} from "./Manager";

interface IManager {
    [name: string]: Manager;
}

export class ComponentManager {

    private managers: IManager;

    constructor() {
        this.managers = {};
    }

    public register(name: string, component: Component): void {
        this.managers[name] = new Manager(component);
    };

    public getManager(name: string): Manager {
        return this.managers[name];
    }
}