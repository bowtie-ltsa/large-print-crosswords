const maxHeight = 10 * 96 // 10 inches - for u.s. letter size paper with 1 inch margins
const minFontSize = 13 // pixels
const maxFontSize = 16
const puzInterval = 100 // milliseconds

function processPuzzle(puz, puzIndex) {
    console.log(`Processing puzzle ${puzIndex}: "${puz.Title}"`)

    let newDiv = document.createElement('div')
    newDiv.innerHTML = document.getElementById('puzzle').innerHTML
    newDiv.innerHTML = newDiv.innerHTML.replace(/id="([^"]+)"/g, `id="$1-${puzIndex}"`)
    newDiv.id = `puzzle-${puzIndex}`
    newDiv.className = 'puzzle'
    newDiv.style.fontSize = maxFontSize + 'px'

    let puzContainer = document.getElementById('all-puzzles')
    puzContainer.appendChild(newDiv)

    document.getElementById(`title-${puzIndex}`).innerHTML = `${puz.Title} - ${puz.Author} - ${puz.Date}`
    document.getElementById(`crossword-div-${puzIndex}`).innerHTML = JSON.stringify(puz.Layout, null, 2)
    let td = document.getElementById(`crossword-td-${puzIndex}`)
    document.getElementById(`clues-main-div-${puzIndex}`).innerHTML = JSON.stringify(puz.DownClue, null, 2)
    td.style.width = (td.clientHeight - 2) + 'px' // make it exactly square (fails if puzzle wants to be too wide)

    // for small puzzles, the gutter can have multiple columns
    let gutterDiv = document.getElementById(`clue-gutter-div-${puzIndex}`)
    let minColumnWidth = 1.7 * 96 // 1.7 inches
    gutterDiv.style.columnCount = Math.max(1, Math.floor(gutterDiv.clientWidth / minColumnWidth))

    // arrangeClues(puzIndex)
    // setTimeout(() => adjustToFit(puzIndex), puzInterval)
}

function adjustToFit(puzIndex) {
    console.log(`puz[${puzIndex}]: adjusting to fit`)
    arrangeClues(puzIndex)

    puzzleDiv = document.getElementById(`puzzle-${puzIndex}`)

    puzFontSize = parseInt(puzzleDiv.style.fontSize)
    let currentHeight = puzzleDiv.offsetHeight
    if (puzFontSize > minFontSize && currentHeight > maxHeight) {
        puzFontSize = puzFontSize - 1
        console.log(`puz[${puzIndex}]: reducing font size to ${puzFontSize}`)
        puzzleDiv.style.fontSize = puzFontSize + 'px'
        setTimeout(() => adjustToFit(puzIndex), puzInterval)
        return
    }

    // console.log(`puz[${puzIndex}]: done`)
    console.log(`puz[${puzIndex}]: clues arranged; checking beauty`)
    setTimeout(() => checkBeauty(puzIndex), puzInterval)
}

function checkBeauty(puzIndex) {
    let mainDiv = document.getElementById(`clues-main-div-${puzIndex}`)
    let mainDivHeight = mainDiv.offsetHeight
    let minimumMainDivHeight = 0.5 * 96 // half an inch (about 3 lines of text)

    let gridAndGutterDiv = document.getElementById(`grid-and-gutter-${puzIndex}`)
    let gridAndGutterHeight = gridAndGutterDiv.offsetHeight

    if (mainDivHeight + gridAndGutterHeight > maxHeight) {
        console.log(`puz[${puzIndex}]: puzzle must span two pages: put grid-and-gutter above main clues so it can hopefully be entirely on page 1`)
        let puzzleDiv = document.getElementById(`puzzle-${puzIndex}`)
        puzzleDiv.insertBefore(gridAndGutterDiv, mainDiv)
        puzzleDiv.style.fontSize = maxFontSize + 'px' // restore font size
        // consider setting timeout to again reduce font size, if the bigger font makes it 3 pages instead of 2
        return
    }

    if (mainDivHeight > minimumMainDivHeight) {
        console.log(`puz[${puzIndex}]: beautiful as is - done.`)
        return
    }

    console.log(`puz[${puzIndex}]: we can make it prettier (${mainDivHeight} < ${minimumMainDivHeight})`)
    let gutterDiv = document.getElementById(`clue-gutter-div-${puzIndex}`)
    while (mainDiv.lastElementChild) {
        console.log(`puz[${puzIndex}]: beautifying ${mainDiv.lastElementChild.innerText}`)
        let firstGutterLine = gutterDiv.firstElementChild
        gutterDiv.insertBefore(mainDiv.lastElementChild, gutterDiv.firstElementChild)
    }
    setTimeout(() => finalCheck(puzIndex), puzInterval)
    return
}

function finalCheck(puzIndex) {
    console.log(`puz[${puzIndex}]: final check`)

    puzzleDiv = document.getElementById(`puzzle-${puzIndex}`)
    let currentHeight = puzzleDiv.offsetHeight
    if (currentHeight > maxHeight) {
        console.log(`puz[${puzIndex}]: ugh, now puzzle won't fit on the page; abandon beauty!`)
        adjustToFit(puzIndex)
        return
    }

    console.log(`puz[${puzIndex}]: done!`)
}

function arrangeClues(puzIndex) {
    let gutterDiv = document.getElementById(`clue-gutter-div-${puzIndex}`)
    console.log(`puz[${puzIndex}]: gutter height = ${gutterDiv.clientHeight}`)
    let gridTd = document.getElementById(`crossword-td-${puzIndex}`)
    console.log(`puz[${puzIndex}]: grid container WxH = ${gridTd.clientWidth}x${gridTd.clientHeight}`)
    if (gutterDiv.clientHeight === 0 && gridTd.clientWidth < gridTd.clientHeight) {
        // clues haven't been added to gutter yet, and grid is not square - puzzle wants to be wider than it can be
        console.log(`puz[${puzIndex}]: grid should be narrower so cells can be square`)

        // find the stylesheet rule for grid cells, and decrease the width and height
        let styleSheets = document.styleSheets
        for (let i = 0; i < styleSheets.length; i++) {
            let rules = styleSheets[i].cssRules
            if (!rules) {
                continue
            }
            for (let j = 0; j < rules.length; j++) {
                if (rules[j].selectorText == 'table.crossword td') {
                    let width = parseInt(rules[j].style.width)
                    let height = parseInt(rules[j].style.height)
                    if (width > 10 && height > 10) {
                        rules[j].style.width = (width - 1) + 'px'
                        rules[j].style.height = (height - 1) + 'px'
                        console.log(`puz[${puzIndex}]: reducing width and height to ${width - 1}`)
                        setTimeout(() => adjustToFit(puzIndex), puzInterval)
                        return
                    }
                }
            }
        }

        return
    }

    let puzzleDiv = document.getElementById(`puzzle-${puzIndex}`)
    let gutterWidth_px =  (puzzleDiv.offsetWidth - gridTd.offsetWidth)
    let gutterWidth_in = gutterWidth_px / 96
    console.log(`puz[${puzIndex}]: gutter width is ${gutterWidth_in} inches (${gutterWidth_px}px)`)
    if (gutterWidth_in < 1) {
        console.log(`puz[${puzIndex}]: gutter is too narrow; we will not put any clues in the gutter`)
        return
    }


    let gutterMinWidth = 1.7 * 96 // 1.7 inches
    console.log(`puz[${puzIndex}]: gutter width across all columns is ${gutterDiv.clientWidth}, min width is ${gutterMinWidth}`)
    if (gutterDiv.clientWidth < gutterMinWidth) {
        console.log(`puz[${puzIndex}]: gutter is too narrow; we will not put any clues in the gutter`)
    } else {
        console.log(`puz[${puzIndex}]: gutter is wide enough; we will put clues in the gutter`)

        // move bottom lines from clues-main-div to clue-gutter-div until clue-gutter-div is taller than crossword-div
        while (gutterTooShort(puzIndex)) {
            let lastLine = document.getElementById(`clues-main-div-${puzIndex}`).lastElementChild
            if (!lastLine) {
                break
            }
            console.log(`puz[${puzIndex}]: moving ${lastLine.innerText}`)
            let gutterDiv = document.getElementById(`clue-gutter-div-${puzIndex}`)
            gutterDiv.insertBefore(lastLine, gutterDiv.firstElementChild)
        }

        console.log(`puz[${puzIndex}]: checking gutter one last time`)
        if (gutterTooTall(puzIndex)) {
            // move first line of clue-gutter-div back to clues-main-div
            let firstLine = document.getElementById(`clue-gutter-div-${puzIndex}`).firstElementChild
            console.log(`puz[${puzIndex}]: restoring ${firstLine.innerText}`)
            document.getElementById(`clues-main-div-${puzIndex}`).appendChild(firstLine)
        }
    }

    // is this the right spot to move clues from main to basement?
}

function gutterTooShort(puzIndex) {
    return document.getElementById(`clue-gutter-div-${puzIndex}`).offsetHeight
        < document.getElementById(`crossword-div-${puzIndex}`).offsetHeight
}

function gutterTooTall(puzIndex) {
    let puzFontSize = parseInt(document.getElementById(`puzzle-${puzIndex}`).style.fontSize)
    return document.getElementById(`clue-gutter-div-${puzIndex}`).offsetHeight
        > document.getElementById(`crossword-div-${puzIndex}`).offsetHeight + puzFontSize
}
