# IMPORTANT NOTE:
## This is a work in progress!
All the basic functionalities are here, but this library isn't optimized yet.

# ECS
## Entity-component-system
[![NPM](https://nodei.co/npm/ept-ecs.png?compact=true)](https://npmjs.org/package/ept-ecs)

This project is an attempt to make a small and easy to use ecs for web game.

## Setup

### How to create a new world?
``` typescript
import {World} from 'ept-ecs/lib'
let world: World = new World();
```

in order to work, we need to:
1. register all the components managers
2. add the systems to the world
3. init the world

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
`delta`: is the amount of time between now and the last call to `process()`

### How to create a custom component?
Instances of `Component` are simple structures that contain the data of our game.
``` typescript
// in Book.ts
import {Component} from 'ept-ecs/lib'
class Book extends Component {
    public nbrPages: number;
    constructor(amount: number = 100) {
        super();
        this.nbrPages = amount;
    }
}

// in Damage.ts
import {Component} from 'ept-ecs/lib'
class Damage extends Component {
}
```

### How to work with components?

#### Managers
In this library, entities are only uniq ids. To attach any king of data (components) to them, you need to use `Managers`.
Each components registered to the world has one. To fetch a specific manager:
``` typescript
let world = new World();
world
    .registerComponent("book", new Book(10))
    .init();
let entityId = world.create();
let bookManager = world.getComponentManager("book");
// add the default component to entityId
bookManager.add(entityId);
// add a new component to entityId
bookManager.add(entityId, new Book(100));
// remove the component
bookManager.remove(entity);
```

#### Update the data in the component
Once you have the manager, you can start altering the values of the component.
``` typescript
let bookManager = world.getComponentManager("book");
let book: Book = bookManager.fetch(entityId) as Book;
book.nbrPages = 100;
```
*notes*:
- notice the component has been casted as `Book`.
- the method `fetch` sets a new Component (a clone of the default value) if entityId doesn't have the required component.

## TODO

1. Optimize everything
2. Add a DelayedEntitySystem
3. Battle test the bloody thing
4. Host it on Github
5. Write a proper wiki on how to use the lib
6. Provide a «real» example
