/*eslint-env jasmine */
import {giotto} from '../';


describe("Test giotto constructor", () => {

    it("Check basic properties", () => {
        expect(typeof(giotto)).toBe('function');
        expect(typeof(giotto.version)).toBe('string');
    });
});
