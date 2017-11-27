export class Aspect {

    private allComponents: Array<string>;
    private oneComponents: Array<string>;
    private noneComponents: Array<string>;

    public constructor() {
        this.allComponents = [];
        this.oneComponents = [];
        this.noneComponents = [];
    }

    public accept (components: Array<string>): boolean {
        return this.checkAll(components) && this.checkOne(components) && this.checkNone(components);
    }

    public all(...components: Array<string>): Aspect {
        this.allComponents = components;
        return this;
    }

    public one(...components: Array<string>): Aspect {
        this.oneComponents = components;
        return this;
    }

    public none(...components: Array<string>): Aspect {
        this.noneComponents = components;
        return this;
    }

    private checkAll(components: Array<string>) {
        let fun = (component: string) => {
            return components.indexOf(component) !== -1;
        };
        return this.allComponents.length === 0 || this.allComponents.every(fun);
    }

    private checkOne(components: Array<string>) {
        let fun = (component: string) => {
            return components.indexOf(component) !== -1;
        };
        return this.oneComponents.length === 0 || this.oneComponents.some(fun);
    }

    private checkNone(components: Array<string>) {
        let fun = (component: string) => {
            return components.indexOf(component) === -1;
        };
        return this.noneComponents.length === 0 || this.noneComponents.every(fun);
    }
}