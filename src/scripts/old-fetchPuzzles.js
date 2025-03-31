async function fetchPuzzles(event) {
    event.preventDefault() // Prevent the form from refreshing the page
    const date = document.getElementById('puzzle-date').value
    if (!date) {
        alert('Please select a date.')
        return
    }

    const url = buildUrl(date);

    try {
        const data = mockFetchUrl(url); // Use mockFetchUrl for testing
        // Uncomment the line below to use the actual fetch function
        // const data = await fetchUrl(url); // Use fetchUrl and wait for its result
        displayPuzzle(data); // Display the puzzles if the fetch is successful
    } catch (error) {
        console.error('Error in fetchPuzzles:', error);
        alert('Failed to fetch puzzles. Please try again later.');
    }
}

function buildUrl(dateString) {
    console.log(`Building url for date: ${dateString}`)
    const code = 'U2FsdGVkX18YuMv20%2B8cekf85%2Friz1H%2FzlWW4bn0cizt8yclLsp7UYv34S77X0aX%0Axa513fPTc5RoN2wa0h4ED9QWuBURjkqWgHEZey0WFL8%3D'
    return `https://embed.universaluclick.com/c/uucom/l/${code}/g/fcx/d/${dateString}/data.json`;
}

async function fetchUrl(url) {
    console.log(`Fetching URL: ${url}`)
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`network request failed with ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Puzzle data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching puzzles:', error);
        return error;
    }
}

function mockFetchUrl(url) {
    console.log(`Mocking fetch from url: ${url}`)
    const data = {
      "Layout": {
        "Line1": "0102030405-1060708-10910111213",
        "Line2": "1400000000-1150000160000000000",
        "Line3": "1700000000-1180000000000000000",
        "Line4": "1900000000200000000000-1210000",
        "Line5": "-1-1-1220000-1-1-1230024-1-1-1",
        "Line6": "252627-1-128293031000000323334",
        "Line7": "3500003637-1380000-13900000000",
        "Line8": "4000000000-1410000-14200000000",
        "Line9": "4300000000-1440000-14500000000",
        "Line10": "46000000004700000048-1-1490000",
        "Line11": "-1-1-1500000-1-1-1515253-1-1-1",
        "Line12": "545556-15700585960000000616263",
        "Line13": "640000650000000000-16600000000",
        "Line14": "670000000000000000-16800000000",
        "Line15": "6900000000-1700000-17100000000"
      },
      "Solution": {
        "Line1": "ASPEN SMU PLANK",
        "Line2": "TORTA PARTIEDON",
        "Line3": "ALOHA ASSOCIATE",
        "Line4": "DEFICITHAWK MEW",
        "Line5": "   CPR   EMS   ",
        "Line6": "GPS  LEGALEAGLE",
        "Line7": "RENAL RUM ULNAS",
        "Line8": "ASADA AMI PSATS",
        "Line9": "SCRUB TBS SASHA",
        "Line10": "SILLYGOOSE  HEY",
        "Line11": "   TRI   RNA   ",
        "Line12": "MAD IMLIKEABIRD",
        "Line13": "UNIONMADE VACAY",
        "Line14": "MINUTEMEN ATONE",
        "Line15": "SLOTH BAO LENDS"
      },
      "DownClue": "01|Just slightly\n02|One and only\n03|Univ. educator\n04|System of moral values\n05|Civil rights org.\n06|Lovers' quarrel\n07|TV show whose 1983 finale had a record 105.97 million viewers\n08|Bear, to Marcus Aurelius\n09|Afternoon espressos, perhaps\n10|Welcome gift in Honolulu\n11|First gentleman?\n12|Something passed in class\n13|Had no doubt\n16|Throw in the ___\n20|Face-to-face, to a texter\n24|Dip with a verde variety\n25|Lawn growth\n26|\"GoodFellas\" actor Joe\n27|Tiger's warning\n29|Muse whose name anagrams to \"orate\"\n30|Louisiana stew that starts with a roux\n31|Slightly off\n32|Grind, as teeth\n33|Woodworking tool\n34|College application section\n36|Insect's final stage\n37|1986 movie featuring David Bowie and dozens of puppets\n47|\"I want that!\"\n48|Before, poetically\n52|Maritime\n53|Subside\n54|Fall flowers, for short\n55|Actor Kapoor\n56|T. rex, for one\n58|Barnyard baby\n59|\"What's the big ___?\"\n60|Gambling game with Chinese origins\n61|Task bar symbol\n62|Philosopher Ayn\n63|Red No. 40 and others\n65|Like a batter after strike three",
      "AcrossClue": "01|Forest quaker\n06|Dallas alma mater of Laura Bush: Abbr.\n09|Board, aboard\n14|Mexican sandwich or Italian cake\n15|Kept celebrating\n17|Greeting in Honolulu\n18|Link (with)\n19|Vocal advocate of limiting government spending\n21|Kitten's sound\n22|EMT's technique\n23|Maine Marathon starters?\n25|Rte. finder\n28|Ace attorney\n35|Relating to kidneys\n38|What gives planter's punch its punch\n39|Counterparts to radiuses\n40|Carne ___\n41|Pal, in Paris\n42|Exams for HS juniors\n43|Attack dirt\n44|\"American Dad!\" network\n45|Obama born in 2001\n46|Goofball\n49|\"Attention, please!\"\n50|Ironman race, casually\n51|Messenger molecule\n54|Fuming\n57|Nelly Furtado's 2002 Grammy winner ... or a clue to 19- , 28- or 46-Across\n64|Built in a Big Three auto factory, say\n66|Leisure trip, informally\n67|Militia at Lexington and Concord\n68|Do penance\n69|Three-toed ___\n70|Chinese bun\n71|Gives temporarily",
      "Date": "20250204",
      "Author": "By Dan Zarin",
      "Editor": "David Steinberg",
      "Title": "Come Fly With Me",
      "Height": "15",
      "Width": "15",
      "Copyright": "Andrews McMeel Syndication",
      "AllAnswer": "ASPEN-SMU-PLANKTORTA-PARTIEDONALOHA-ASSOCIATEDEFICITHAWK-MEW---CPR---EMS---GPS--LEGALEAGLERENAL-RUM-ULNASASADA-AMI-PSATSSCRUB-TBS-SASHASILLYGOOSE--HEY---TRI---RNA---MAD-IMLIKEABIRDUNIONMADE-VACAYMINUTEMEN-ATONESLOTH-BAO-LENDS"
    }
    console.log('Mock puzzle data:', data);
    return data;
}

/**
 * Displays one crossword puzzle on the page.
 * @param {Object} data - The data object containing crossword puzzle. The structure
 *                        of this object is shown in function mockFetchUrl.
**/
function displayPuzzle(data) {
    console.log('Converting puzzle data to expected format')
    const crosswordContainer = document.getElementById('all-puzzles')
    crosswordContainer.innerHTML = '' // Clear previous puzzles

    if (!data || !data.Title || !data.Layout) {
        crosswordContainer.innerHTML = '<p>invalid or missing puzzle data for this date.</p>'
        throw new Error('invalid puzzle data')
    }

    processPuzzle(data, 0)
}
