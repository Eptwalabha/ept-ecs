import {System} from '../system/System';
import {ComponentManager} from '../manager/ComponentManager';
import {Manager} from '../manager/Manager';
import {Component} from './Component';

export class World {

    private systems: System[];
    public componentManager: ComponentManager;
    private lastId: number;
    public delta: number;
    public cumulativeDelta: number;
    private toDelete: number[];
    private toUpdate: number[];
    private availableIds: number[];

    constructor() {
        this.lastId = 0;
        this.delta = 0;
        this.cumulativeDelta = 0;
        this.componentManager = new ComponentManager();
        this.systems = [];
        this.toDelete = [];
        this.toUpdate = [];
        this.availableIds = [];
    }

    public registerComponent(name: string, defaultValue?: Component): World {
        const defaultComponent: Component = defaultValue ? defaultValue : new Component();
        this.componentManager.register(this, name, defaultComponent);
        return this;
    }

    public addSystem(system: System, enable: boolean = true): World {
        system.setEnable(enable);
        this.systems.push(system);
        return this;
    }

    public init(): void {
        this.systems.forEach(system => system.init(this));
    }

    public getComponentManager(name: string): Manager {
        return this.componentManager.getManager(name);
    }

    public create() {
        let entityId = this.availableIds.pop();
        if (entityId === undefined) {
            entityId = ++this.lastId;
        }
        this.toUpdate.push(entityId);
        return entityId;
    }

    private beforeProcess() {
        this.toUpdate.forEach(entity => {
            const components = this.componentManager.getAllComponents(entity);
            this.systems.forEach(system => system.accept(entity, components));
        });
        this.toUpdate = [];
    }

    public process(delta: number = 0): void {
        this.delta = delta;
        this.cumulativeDelta += delta;
        this.systems.forEach(system => {
            this.beforeProcess();
            system.doProcessSystem();
            this.afterProcess();
        });
        this.afterProcess();
    }

    private afterProcess(): void {
        if (this.toDelete.length > 0) {
            this.systems.forEach(system => system.removeEntities(this.toDelete));
            this.componentManager.cleanEntitiesComponents(this.toDelete);
            this.toDelete.forEach(entityId => {
                if (!this.availableIds.includes(entityId)) {
                    this.availableIds.push(entityId);
                }
            });
            this.toDelete = [];
        }
    }

    public update(entity: number): void {
        if (!this.toUpdate.includes(entity)) {
            this.toUpdate.push(entity);
        }
    }

    public remove(entity: number): void {
        if (!this.toDelete.includes(entity)) {
            this.toDelete.push(entity);
        }
    }
}
