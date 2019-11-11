# IMPORTANT NOTE:
## This is a work in progress!
This means:
- All the basic functionality are there, but this library isn't optimized yet.
- Right now, the test coverage isn't what it should be (this will change eventually) so bugs might be present.

# ECS
## Entity-component-system
[![NPM](https://nodei.co/npm/ept-ecs.png?compact=true)](https://npmjs.org/package/ept-ecs)

This project is an attempt to make a small and easy to use ecs for web game.

## Glossary:
- `World`: This is where all the magic happens. Each time its process method is called, all the registered systems are executed. 
- `Entity`: It's just an **id**, it represents anything you'd like.
- `Component`: The **«data»** of your entity, the component is attached to one (and only one) entity.
- `System`: You place the **logic** of your game in this beast. A system can process a set of entities that match a certain configuration of components.
- `Aspect`: This will help you define what kind of entities your systems should process.
- `Manager`: This handles the linking between components and entities.
 
## Example with code
You can find an example of game using `ept-ecs` on [github](https://github.com/Eptwalabha/ept-ecs-shmup)

## Setup

### How to create a new world?
``` typescript
import {World} from 'ept-ecs'
let world: World = new World();
```

in order to work, we need to:
1. register all the component's managers
2. add every systems to the world
3. initiate the world

#### Registering a component manager
``` typescript
world.registerComponent(managerName, default);
```
`managerName`: is the name of the manager (two managers cannot have the same name).  
`default`: is an instance of `Component`, this will be the default component's value when adding this component to an entity. 

#### Add a system to the world
``` typescript
world.addSystem(system, enable);
```
`system`: is an instance of `System`, a «System» holds the «logic» of the world.  
`enable`: set this to false if you don't want the `world` to process this system rigth away.  

#### Initiate the world
``` typescript
world.init();
```
The entire world creation's process can be chained up as such:
``` typescript
world
    .registerComponent(...)
    ...
    .registerComponent(...)
    .addSystem(...)
    ...
    .addSystem(...)
    .init();
```
#### Running the world
to process the `world`, you need to call:
``` typescript
world.process(delta);
```
`delta`: is the amount of time between now and the last call to `process()`. It can be in second or millisecond, it's up to you. However, you should stick to the unit you choose and use the same for all your systems.

### How to create a custom component?
Instances of `Component` are simple structures that contain the data of our game.
``` typescript
// in Explosive.ts
import {Component} from 'ept-ecs'
class Explosive extends Component {
    public fuseLength: number;
    constructor(fuseLength: number = 100) {
        super();
        this.fuseLength = fuseLength;
    }
}

// in Activate.ts
import {Component} from 'ept-ecs'
class Activate extends Component {
}
```
You should **never** put logic inside your components. This is what **systems are made for!**
### How to work with components?

#### Managers
In this library, entities are only uniq ids. To attach any king of data (components) to them, you need to use `Managers`.
Each components registered to the world has one. To fetch a specific manager:
``` typescript
import {World, Manager} from 'ept-ecs'
let world: World = new World();
world
    .registerComponent("explosive", new Explosive(10))
    .init();
let entityId: number = world.create();
let explosiveManager: Explosive = world.getComponentManager("explosive");
// add the default component to entityId
explosiveManager.add(entityId);
// add a new component to entityId
explosiveManager.add(entityId, new Explosive(100));
// remove the component
explosiveManager.remove(entity);
```

#### Update the data in the component
Once you have the manager, you can start altering the values of your components.
``` typescript
let explosiveManager: Manager = world.getComponentManager("explosive");
let explosive: Explosive = explosiveManager.fetch(entityId) as Explosive;
explosive.fuseLength = 300;
```
*notes*:
- notice the component has been casted as `Explosive`.
- **VERY Important**: the method `fetch(entityId)` creates a new Component (a clone of the default value) if entityId doesn't have one. If you need to check if an entity has (or not) a component, you must use the `has(entityId)` method.

### Systems
Each time you call `world.process(delta);` every (active) systems are processed sequentially.

There are 6 types of system:
- `System`: the most basic, it doesn't handle any entity.
- `EntitySystem`: this one handles every entities that match its `Aspect` (more on that later)
- `DelayedSystem`: this system is set with an internal clock that will decrease with the `delta` you pass to world. It's only processed when its internal clock reaches zero. Like `System` it doesn't handle any entity.
- `DelayedEntitySystem`: A combination of `EntitySystem` and `DelayedSystem`.
- `IntervalSystem`: this system is executed at a regular interval.
- `IntervalEntitySystem`: Same as `IntervalSystem`, but it will process every entities that match its `Aspect`

### Aspect
`Aspect` are used by `EntitySystem`, `IntervalEntitySystem` and `DelayedEntitySystem`. They define what composition of components an entity should (or should not) have in order to be processed by a system.  
The aspect is set at the creation of the system.  
Let's say we want our system to handle every entities that have the components **"explosive"** and **"activate"**.
This is how you define this combination:  
``` typescript
new Aspect().all("explosive", "activate");
```
Good, now lets say that you want our system to process either a **"dynamite"** a **"tntbox"** or a **"canon"**  
``` typescript
new Aspect()
    .all("explosive", "activate")
    .one("dynamite", "tntbox", "cannon");
```
Finally, we agree that our system cannot process an entity if it's **"wet"**.  
``` typescript
new Aspect()
    .all("explosive", "activate")
    .one("dynamite", "tntbox", "cannon");
    .none("wet");
```

## Code examples:
### use of `Aspect` for an `EntitySystem`
In this example, the system is handling any entity that is an **"active"** **"explosive"** that can either be a **"dynamite"** or a **"tntbox"** but who isn't **"wet"** nor **"defective"**  
``` typescript
import {Aspect, EntitySystem, Manager, World} from 'ept-ecs';

export class ExplosiveCountDownSystem extends EntitySystem {
    private explosiveManager: Manager;

    public constructor() {
        super(
            new Aspect()
                .all("explosive", "activate")
                .one("dynamite", "tntbox")
                .none("wet", "defective")
        );
    }

    public init(world: World): void {
        super.init(world);
        this.explosiveManager = this.world.getComponentManager("explosive");
    }

    public process(entity: number): void {
        let explosive = this.explosiveManager.fetch(entity) as Explosive;
        explosive.fuseLength -= this.world.delta;
        if (explosive.fuseLength <= 0) {
            this.world.remove(entity);
        }
    }
}
``` 

### `DelayedEntitySystem`
In this example, we have a system that automaticaly destroy any projectile 5 seconds after it has been thrown.  
In order to work, this system requires a bit more code. You need to implement the `updateEntityDelay` function of `DelayedEntitySystem`.  
The `updateEntityDelay` returns `true` or `false` if an entity needs to be process or not.  
``` typescript
import { DelayedEntitySystem, Manager } from 'ept-ecs'
import { TimeToLiveProjectile } from '../components/TimeToLiveProjectile';

export class DeleteOldProjectileSystem extends DelayedEntitySystem {
    private ttlProjectileManager: Manager;

    public init() {
        this.ttlProjectileManager = this.world.getComponentManager("ttlProjectile");
    }

    updateEntityDelay(entity: number): boolean {
        let ttlProjectile = this.ttlProjectileManager.fetch(entity) as TimeToLiveProjectile;
        ttlProjectile.ttl -= this.world.delta;
        return ttlProjectile.ttl <= 0;
    }
    
    protected process(entity: number): void {
        this.world.remove(entity);
        // do other stuf
    }
}
```
The component `TimeToLiveProjectile`:
``` typescript
import { Component } from "ept-ecs";

export class TimeToLiveProjectile extends Component {
    public ttl: number = 1000;
}
```

### `IntervalEntitySystem`
In this example, we need a system that decrease the health of all enemies every 20 seconds:
``` typescript
export class DamageOverTimeSystem extends IntervalEntitySystem {
    private healthManager: Manager;
    private deadManager: Manager;

    constructor(interval: number = 20000) {
        super(
            new Aspect()
                .all("health")
                .none("dead", "invinsible"),
            interval
        );
    }

    public init() {
        this.healthManager = this.world.getComponentManager("health");
        this.deadManager = this.world.getComponentManager("dead");
    }

    protected process(entity: number): void {
        let health = this.healthManager.fetch(entity) as Health;
        health.amount -= 10;
        if (health.amount <= 0) {
            this.deadManager.add(entity);
        }
    }
}
```
*notes*:  
- The `IntervalEntitySystem` will process all of its entities every time it's triggered. See the following example if you want to have an interval «per» entity.

### `IntervalEntitySystem` per entity
In order to do a «per» entity interval, you need to use `DelayedEntitySystem` and reset the entity's timer every time it's been call.  
``` typescript
export class IntervalPerEntitySystem extends DelayedEntitySystem {
    private entityIntervalManager: Manager;

    public init() {
        this.entityIntervalManager = this.world.getComponentManager("entityInterval");
    }

    updateEntityDelay(entity: number): boolean {
        let entityInterval = this.entityIntervalManager.fetch(entity) as EntityInterval;
        entityInterval.ttl -= this.world.delta;
        return entityInterval.ttl <= 0;
    }
    
    protected process(entity: number): void {
        let entityInterval = this.entityIntervalManager.fetch(entity) as EntityInterval;
        entityInterval.ttl += entityInterval.interval;
    }
}
```
The component `EntityInterval`:
``` typescript
export class EntityInterval extends Component {
    public ttl: number = 1000;
    public interval: number = 1000;
}
```

## TODO

- [ ] Optimize everything
- [x] Add a DelayedEntitySystem
- [x] Add a IntervalSystem & IntervalEntitySystem
- [ ] Battle test the bloody thing
- [ ] Host it on Github
- [x] Write examples on how to use/implement Systems
- [ ] Write a proper wiki on how to use the lib
