// Puz represents a generic crossword puzzle.
// Subclasses must determine how to fetch and parse specific types of crossword puzzles.
// Clients must call the static factory method Puz.create() to create an instance of a specific subclass.
// The factory method will call fetch() to get the puzzle data.
class Puz {
    static mockMode = true // when true, the factory method create() will call mock() instead of fetch()

    // The constructor is used by the async factory method create().
    // Don't create instances of subclasses directly; use Puz.create() instead.
    constructor(puzDate) {
        this.puzDate = puzDate
    }

    /*abstract*/ mock() {
        throw new Error("Method 'mock()' must be implemented in the base classes.")
    }

    /*abstract*/ fetch() {
        throw new Error("Method 'fetch()' must be implemented in the base classes.")
    }

    /*abstract*/ parse() {
        throw new Error("Method 'parse()' must be implemented in the base classes.")
    }

    render() {
        throw new Error("Method 'render()' not yet implemented.")
    }
}

export default Puz