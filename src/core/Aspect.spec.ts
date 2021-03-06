import { expect } from 'chai'
import { Aspect } from '../index'

describe ('Aspect', () => {

    describe('all', () => {
        it('should accepts entity if it has all the required components', () => {
            let aspect = new Aspect().all("a", "b", "c");
            let result = aspect.accept(["a", "b", "c"]);
            expect(result).to.be.true;
        });
        it('should refuses entity if it has not all the required components', () => {
            let aspect = new Aspect().all("a", "b", "c");
            let result = aspect.accept(["a", "c"]);
            expect(result).to.be.false;
        });
    });

    describe('one', () => {
        it('should accepts entity if it has at least one of the required components', () => {
            let aspect = new Aspect().one("a", "b", "c");
            expect(aspect.accept(["a"])).to.be.true;
            expect(aspect.accept(["b"])).to.be.true;
            expect(aspect.accept(["c"])).to.be.true;
            expect(aspect.accept(["a", "e"])).to.be.true;
            expect(aspect.accept(["a", "b"])).to.be.true;
        });
        it('should refuses entity if it has none of all the required components', () => {
            let aspect = new Aspect().one("a", "b", "c");
            expect(aspect.accept([])).to.be.false;
            expect(aspect.accept(["d"])).to.be.false;
        });
    });

    describe('none', () => {
        it('should accepts entity if it has none of the excluded components', () => {
            let aspect = new Aspect().none("a", "b", "c");
            expect(aspect.accept([])).to.be.true;
            expect(aspect.accept(["e"])).to.be.true;
        });
        it('should refuses entity if it has any of the excluded components', () => {
            let aspect = new Aspect().none("a", "b", "c");
            expect(aspect.accept(["a"])).to.be.false;
            expect(aspect.accept(["a", "d"])).to.be.false;
        });
    });

    describe('combinations', () => {
        it('all and one', () => {
            let aspect = new Aspect().all("a", "b").one("c", "d");
            expect(aspect.accept(["a", "b"])).to.be.false;
            expect(aspect.accept(["a", "b", "c"])).to.be.true;
            expect(aspect.accept(["a", "b", "d"])).to.be.true;
            expect(aspect.accept(["a", "c", "d"])).to.be.false;
            expect(aspect.accept(["a", "b", "c", "d"])).to.be.true;
            expect(aspect.accept(["a", "b", "c", "d", "e"])).to.be.true;
        });

        it('all and none', () => {
            let aspect = new Aspect().all("a", "b").none("c", "d");
            expect(aspect.accept(["a", "b"])).to.be.true;
            expect(aspect.accept(["a", "b", "c"])).to.be.false;
            expect(aspect.accept(["a", "b", "d"])).to.be.false;
            expect(aspect.accept(["a", "b", "c", "d"])).to.be.false;
            expect(aspect.accept(["a", "c"])).to.be.false;
            expect(aspect.accept(["a", "d"])).to.be.false;
        });

        it('one and none', () => {
            let aspect = new Aspect().one("a", "b").none("c", "d");
            expect(aspect.accept([])).to.be.false;
            expect(aspect.accept(["a"])).to.be.true;
            expect(aspect.accept(["b"])).to.be.true;
            expect(aspect.accept(["a", "c"])).to.be.false;
            expect(aspect.accept(["e", "d"])).to.be.false;
            expect(aspect.accept(["c", "d"])).to.be.false;
        });

        it('all, one and none', () => {
            let aspect = new Aspect().all("a", "b").one("c", "d").none("e");
            expect(aspect.accept(["a", "b"])).to.be.false;
            expect(aspect.accept(["a", "b", "c"])).to.be.true;
            expect(aspect.accept(["a", "b", "d"])).to.be.true;
            expect(aspect.accept(["a", "b", "c", "d"])).to.be.true;
            expect(aspect.accept(["a", "b", "c", "e"])).to.be.false;
            expect(aspect.accept(["a", "c", "d"])).to.be.false;
            expect(aspect.accept(["a", "b", "c", "d", "f"])).to.be.true;
        });
    });
});