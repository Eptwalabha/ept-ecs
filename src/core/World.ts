import {System} from "../system/System";
import {ComponentManager, Manager} from "./ComponentManager";
import {Component} from "./Component";

export class World {

    private systems: Array<System>;
    private componentManager: ComponentManager;
    private lastId: number;

    constructor() {
        this.lastId = 0;
        this.componentManager = new ComponentManager();
    }

    public registerComponent(name: string, defaultValue: Component) {
        this.componentManager.register(name, defaultValue);
    }

    public registerComponents(...components: Array<{name: string; defaultValue: Component}>) {
        for (let i = 0; i < components.length; ++i) {
            this.componentManager.register(components[i].name, components[i].defaultValue);
        }
    }

    public getComponentManager(name: string): Manager {
        return this.componentManager.getManager(name);
    }

    public createEntity() {
        return ++this.lastId;
    }
}
