# IMPORTANT NOTES:
## This is a work in progress!
This current version (1.0.7) is nowhere near usable… no joke!  
I only published this to check that I could publish something on npm :p  
If I wasted your time… my apologies. It was not my intention.  

I'll change the revision to 1.1.0 when the library is exploitable. 

# ECS
## Entity-component-system

This project is an attempt to make a small and easy to use ecs for web game.

### How to create a new world?
``` typescript
import { World } from 'ept-ecs/lib'

let world: World = new World();
```

### How to create a custom component?
``` typescript
// in HealthComponent.ts
import { Component } from 'ept-ecs/lib'

class Health extends Component {
    public amount: number;
    constructor(amount: number = 100) {
        super();
        this.amount = amount;
    }
}

// in your game code
import { HealthComponent } from './HealthComponent'
...
let default: HealthComponent = new HealthComponent(100);
world.registerComponent("hp", default);
```
