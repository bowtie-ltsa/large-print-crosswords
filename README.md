# large-print-crosswords

Large-Print-Crosswords (LPC) formats crossword puzzles from the interwebs for printing in large fonts while still fitting them onto a single printed page.

- Produces HTML files so you can use your browser to do the printing.
- Can fetch several puzzles at a time, so you can print several pages in one go.

## How to use it and limitations

These current instructions are much too complicated. Our goal is to convert this to a simple web page, so that all you have to do is browse to a page, fill out a form, and click a button. And we'll do all that right in the browser - none of your data will be sent to us. Stay tuned.

For now, these are the instructions. They work, but might be more effort than its worth.

1. Download or clone this repo to your local box.

2. Install Docker / Docker Desktop on your box. (Perhaps podman could be used instead.)

3. Get to a bash prompt. (On windows, you can install git-scm to do that)

   > **TO-DO**: create a \*.cmd or \*.ps1 script equivalent to the bash script, for windows users, so that they don't have to have git-bash or similar.

4. Execute `./large-print-crosswords.sh`
   - optional parameter 1: list of crosswords to fetch, e.g. "uni atl club". Defaults to "uni" (universal crossword).
   - optional parameter 2: list of dates to fetch, e.g. "2025-03-21 2025-03-22 2025-03-23". Defaults to today's date.
   - optional env variables: NYT_USER and NYT_PASS (required for new york times puzzles).

     > **NOTE** NYT puzzles are password-protected **and** rate-limited:
       - Don't try to pull several NYT puzzles in a row without a pause of a few seconds inbetween.
       - An easy way to do this is to pull another puzzle along with the NYT puzzles (e.g. "uni nyt" "2025-03-21 2025-03-22 2025-03-23").
       - If you exceed their rate limit, the account will be locked out for about a day. You don't have to do anything except wait to regain access.

       > **TO-DO**: add logic to ensure minimum delay of a few seconds between NYT puzzle pulls, so the user doesn't have to think about it.

   - examples:

     ```bash
     # produce 6 crosswords: 2 puzzles x 3 dates
     # produces a single *.html file that prints on 6 pages total
     # (3 sheets of paper if printing double-sided)
     ./large-print-crosswords.sh "uni atl" "2025-02-17 2025-02-18 2025-02-19"

     # produce 6 crosswords: 1 puzzle x 6 dates -- generate the dates from script.
     # the date generation understands month boundaries, leap years etc
     ./large-print-crosswords.sh "uni" "$(./date-sequence.sh 2025-02-27 6)"

     # fetch nyt puzzles with user name and password **bundled with another non-nyt puzzle**
     # ⚠️ CAUTION! we sprinkle in fetches of the "universal crossword"
     # to avoid running afould of new york times rate limits. See notes above.
         export NYT_USER="" # put your username/email address here
         export NYT_PASS="" # put your password here; these creds are sent to nyt only.
     ./large-print-crosswords.sh "nyt uni" "$(./date-sequence.sh 2025-02-27 3)"
     ```
