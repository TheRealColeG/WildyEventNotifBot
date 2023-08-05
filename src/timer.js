
//This is where the timer will be stored
//use web scraping to get exact times of events

//--- Timer starts here ---

async function timer() {

    //Retrieve events from scraper.js
    const eventsPromise = scrapeProduct('https://runescape.wiki/w/Wilderness_Flash_Events').then((events) => {

        if (eventsPromise == null) {
            console.log("No events found.");
            return;
        }

        //If there are events, set the timer

        //Set the timer
        let currentTime = new Date();
        let timeInRS = Number((currentTime.getHours()+4)%24)*60+Number(currentTime.getMinutes());

        //Convert events to JSON for easier access and all that
        let eventsJSON = 
        [
            {
                name: events[0][0].split('\n')[0],
                in: convertTimes(events[0][1], timeInRS)
            },
            {
                name: events[1][0].split('\n')[0],
                in: convertTimes(events[1][1], timeInRS)
            },
            {
                name: events[2][0].split('\n')[0],
                in: convertTimes(events[2][1], timeInRS)
            },
        ];

        console.log(eventsJSON);

        let soonest = eventsJSON[0];
        for (let i = 1; i < eventsJSON.length; i++) {
            if (eventsJSON[i].in > 0 && eventsJSON[i].in < soonest.in) {
                soonest = eventsJSON[i];
            }
        }

        if (soonest.in <= 59 && soonest.in >= 0) {
            console.log("exporting soonest event");
            return soonest;
        } else {
            console.log(`event not soon enough: ${soonest.in} minutes to go`);
            return;
        }
    });

    return eventsPromise;

};

function convertTimes(eventTime, rsTime) {
    let eventTimeInMinutes = Number(eventTime.split(':')[0])*60+Number(eventTime.split(':')[1]);
    let timeUntil = eventTimeInMinutes - rsTime;
    if (timeUntil < 0) {
        timeUntil += 1440;
    }
    return timeUntil;
}

//---Timer ends here---

//---Scraper starts here---

const puppeteer = require('puppeteer');

async function scrapeProduct(url) {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    let status = null; 
    try {
        //attempt to go to the page
        await page.goto(url, {timeout: 0});
    } catch (err) {
        //if it fails, log why, then try again
        console.log(err);
    } finally {
        //try again in 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));
        status = await page.goto(url, {timeout: 0});
    }

    //if it fails again, return
    if (status == null) {
        console.log("status is null");
        return;
    }
    
    if (Number(status.status()) != Number(200)) {
        console.log(status.status());
        return;
    }
    
    const specialEvents = await page.evaluate(() => {
        const table = document.getElementById('reload');
        if (table == null) {
            console.log("tds is null");
            return;
        }

        const tds2 = Array.from(table.querySelectorAll('tr'));
        const withoutDupes = tds2.filter(item => item.innerText.includes('Special\t'));
        return withoutDupes.map(item => item.innerText.split('\t'));
    });

    await browser.close();

    return specialEvents;
}

//---Scraper ends here---


//export this timer
module.exports = timer;


