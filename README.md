# IMPORTANT NOTES:
## This is a work in progress!
This current version is nowhere near usable… no joke!  
I only published this to check that I could publish something on npm :p  
If I wasted your time… my apologies. It was not my intention.  

I'll change the revision to 1.1.0 when the library is exploitable. 

# ECS
## Entity-component-system
[![NPM](https://nodei.co/npm/ept-ecs.png?compact=true)](https://npmjs.org/package/ept-ecs)

This project is an attempt to make a small and easy to use ecs for web game.

### How to create a new world?
``` typescript
import { World } from 'ept-ecs/lib'

let world: World = new World();
```

in order to work, we need to:
- register all the components managers
- add all the systems that will be used

#### Registering a component manager
``` typescrit
world.registerComponent(managerName, default);
```
`managenName`: is the name of the manager (two managers cannot have the same name).  
`default`: is an instance of `Component`, this will be the default component's value when adding this component to an entity. 

#### Add a system to the world
``` typescript
world.addSystem(system, enable);
```
`system`: is an instance of `System`, a «System» holds the «logic» of the world.  
`enable`: set this to false if you don't want the `world` to process this system rigth away.  

#### Running the world
to process the `world`, you need to call:
```
world.process(delta);
```
`delta`: is the amount of time between now and the last call to `process()`

### How to create a custom component?
``` typescript
// in Book.ts
import { Component } from 'ept-ecs/lib'

class Book extends Component {
    public nbrPages: number;
    constructor(amount: number = 100) {
        super();
        this.nbrPages = amount;
    }
}
```