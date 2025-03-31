// this module fetches puzzles from the web and returns them as objects

import Puz from './puzFactory.js';

async function fetchPuzzles(event) {
    // for now we fetch a puzzle for the one date specified by the user.
    // eventually we will allow the user to specify multiple dates and 'latest'
    // eventually we will allow the user to specify multiple and different puzzles

    const puzTypes = 'uni' // hard code for now
    const typeList = puzTypes.split(' ')

    const puzDates = document.getElementById('puzzle-date').value
    if (!puzDates) {
        alert('Please select a date.')
        return
    }
    const dateList = puzDates.split(' ')

    try {
        const puzList = await fetchAllPuzzlesInParallel(typeList, dateList)
        console.log(`Fetched ${puzList.length} puzzles:`)
        puzList.forEach(puz => {
            // console.log(JSON.stringify(puz, null, 2))
            console.log(puz)
        })
    } catch (error) {
        console.error('Error in fetchPuzzles:', error)
        alert('Failed to fetch puzzles. Please try again later.')
    }
}

// returns an array of puz objects
async function fetchAllPuzzlesInSerial(puzTypes, puzDates) {
    for (const puzDate of puzDates) {
        for (const puzType of puzTypes) {
            const puzList = [];
            try {
                console.log(`Fetching "${puzType}" puzzle for date ${puzDate}`);
                const puz = await Puz.create(puzType, puzDate);
                puzList.push(puz);
                console.log(`Fetched puzzle ${puzType} for date ${puzDate}:`);
                console.log(JSON.stringify(puz, null, 2));
            } catch (error) {
                console.error(`Error fetching puzzle ${puzType} for date ${puzDate}:`, error);
                console.error(`Cause:`, error.cause);
                alert(`Failed to fetch the puzzle ${puzType} for date ${puzDate}. Please try again.`);
            }
        } // next type
    } // next date
}

// returns an array of puz objects.
// caution: the problem with parallel fetches is that some sites might
// have rate limits, and if we hit them we might get blocked. NYT does this.
// so we should probably do a serial fetch or with fancy delays for some puzzles.
async function fetchAllPuzzlesInParallel(puzTypes, puzDates) {
    const puzList = []
    const promises = []
    const messages = []

    for (const puzDate of puzDates) {
        for (const puzType of puzTypes) {
            console.log(`Preparing to fetch "${puzType}" puzzle for date ${puzDate}`);
            promises.push(
                Puz.create(puzType, puzDate)
                    .then(puz => {
                        puzList.push(puz);
                        console.log(`Fetched "${puzType}" puzzle for date ${puzDate}:`)
                        console.log(JSON.stringify(puz, null, 2))
                    })
                    .catch(error => {
                        console.error(`Error fetching "${puzType}" puzzle for date ${puzDate}:`, error)
                        messages.push(`Failed to fetch the "${puzType}" puzzle for date ${puzDate}.`)
                    })
            );
        }
    }

    await Promise.all(promises);

    if (messages.length > 0) {
        console.log(`showing ${messages.length} error messages`)
        alert(messages.join('\n'));
    }

    return puzList;
}

export default fetchPuzzles
