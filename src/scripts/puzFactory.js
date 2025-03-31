// this script adds the factory class `create()` to the Puz class;
// it can't be done directly in puz.js because the subclasses are not yet defined.

import Puz from './puz.js'
import Uni from './uni.js'

// puzClasses is a list of known subclasses, used by the factory method create().
Puz.puzClasses = {
    uni: Uni
}

// create is the factory method used to create a new instance of a subclass.
Puz.create = async function (puzType, puzDate) {
    const puzClass = this.puzClasses[puzType]
    if (!puzClass) {
        throw new Error(`Unknown puzzle type: ${puzType}`)
    }
    const instance = new puzClass(puzDate)
    instance.puzType = puzType
    try {
        this.mockMode ? instance.mock() : await instance.fetch()
        // todo: this.parse()
    } catch (error) {
        throw new Error(
            `Failed to create "${puzType}" puzzle for date ${puzDate}`,
            { cause: error })
    }
    return instance
}

export default Puz
