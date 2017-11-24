import {System} from "../system/System";
import {ComponentManager} from "../manager/ComponentManager";
import {Manager} from "../manager/Manager";
import {Component} from "./Component";

export class World {

    private systems: Array<System>;
    private componentManager: ComponentManager;
    private lastId: number;
    private delta: number;
    private cumulativeDelta: number;

    constructor() {
        this.lastId = 0;
        this.delta = 0;
        this.cumulativeDelta = 0;
        this.componentManager = new ComponentManager();
        this.systems = [];
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

    public addSystem(system: System, enable: boolean = true) {
        system.setEnable(enable);
        system.setWorld(this);
        this.systems.push(system);
    }

    public process(delta: number) {
        this.delta = delta;
        this.cumulativeDelta += delta;
        for (let system of this.systems) {
            if (system.isEnable()) {
                system.processAll();
            }
        }
    }
}
