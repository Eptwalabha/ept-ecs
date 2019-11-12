export class Aspect {

    private allComponents: string[];
    private oneComponents: string[];
    private noneComponents: string[];

    public constructor() {
        this.allComponents = [];
        this.oneComponents = [];
        this.noneComponents = [];
    }

    public accept(components: string[]): boolean {
        return this.checkAll(components) && this.checkOne(components) && this.checkNone(components);
    }

    public all(...components: string[]): Aspect {
        this.allComponents = components;
        return this;
    }

    public one(...components: string[]): Aspect {
        this.oneComponents = components;
        return this;
    }

    public none(...components: string[]): Aspect {
        this.noneComponents = components;
        return this;
    }

    private checkAll(components: string[]) {
        return this.allComponents.length === 0 || this.allComponents.every((componentName: string) => components.includes(componentName));
    }

    private checkOne(components: string[]) {
        return this.oneComponents.length === 0 || this.oneComponents.some((componentName: string) => components.includes(componentName));
    }

    private checkNone(components: string[]) {
        return this.noneComponents.length === 0 || this.noneComponents.every((componentName: string) => !components.includes(componentName));
    }
}
