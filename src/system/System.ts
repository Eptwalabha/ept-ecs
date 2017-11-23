export abstract class System {
    private entities: Array<number>;

    public addEntity(id: number) {
        if (this.entities.indexOf(id) === -1) {
            this.entities.push(id);
        }
    }

    public removeEntity(id: number) {
        let newEntities: Array<number> = [];
        this.entities.forEach(function (entityId) {
            if (entityId !== id) {
                newEntities.push(entityId);
            }
        });
        this.entities = newEntities;
    }

    public processAll(delta: number) {
        for (let i = 0; i < this.entities.length; ++i) {
            this.process(delta, this.entities[i]);
        }
    }

    public abstract process(delta: number, id: number): void;

}
