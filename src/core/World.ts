import {System} from "../system/System";
import {ComponentManager} from "../manager/ComponentManager";
import {Manager} from "../manager/Manager";
import {Component} from "./Component";

export class World {

    private systems: Array<System>;
    public componentManager: ComponentManager;
    private lastId: number;
    public delta: number;
    public cumulativeDelta: number;
    private toDelete: Array<number>;
    private toUpdate: Array<number>;

    constructor() {
        this.lastId = 0;
        this.delta = 0;
        this.cumulativeDelta = 0;
        this.componentManager = new ComponentManager();
        this.systems = [];
        this.toDelete = [];
        this.toUpdate = [];
    }

    public registerComponent(name: string, defaultValue: Component): World {
        this.componentManager.register(this, name, defaultValue);
        return this;
    }

    public addSystem(system: System, enable: boolean = true): World {
        system.setEnable(enable);
        this.systems.push(system);
        return this;
    }

    public init(): void {
        for (let system of this.systems) {
            system.init(this);
        }
    }

    public getComponentManager(name: string): Manager {
        return this.componentManager.getManager(name);
    }

    public create() {
        let id = ++this.lastId;
        this.toUpdate.push(id);
        return id;
    }

    private beforeProcess() {
        for (let entity of this.toUpdate) {
            let components = this.componentManager.getAllComponents(entity);
            for (let system of this.systems) {
                system.accept(entity, components);
            }
        }
        this.toUpdate = [];
    }

    public process(delta: number): void {
        this.delta = delta;
        this.cumulativeDelta += delta;
        for (let system of this.systems) {
            this.beforeProcess();
            system.processSystem();
            this.afterProcess();
        }
    }

    private afterProcess(): void {
        for (let system of this.systems) {
            system.removeEntities(this.toDelete);
        }
        this.toDelete = [];
    }

    public update(entity: number): void {
        if (this.toUpdate.indexOf(entity) === -1) {
            this.toUpdate.push(entity);
        }
    }

    public remove(entity: number): void {
        if (this.toDelete.indexOf(entity) === -1) {
            this.toDelete.push(entity);
        }
    }
}
