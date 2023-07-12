
//This is where the timer will be stored
//use web scraping to get exact times of events

//Retrieve events from scraper.js
const eventsPromise = require('./scraper.js');

//If there are events, set the timer
eventsPromise.then((events) => {
    //If there are no events, don't set the timer obviously - maybe send a message to the channel saying chungus
    if (events == null) {
        console.log("No events found.");
        return;
    }

    //Set the timer
    let currentTime = new Date();
    let timeInRS = Number((currentTime.getHours()+4)%24)*60+Number(currentTime.getMinutes());

    //Convert events to JSON for easier access and all that
    let eventsJSON = 
    [
        {
            name: events[0][0].split('\n')[0],
            in: (Number(events[0][1].split(':')[0])*60+Number(events[0][1].split(':')[1])+1440) - timeInRS,
        },
        {
            name: events[1][0].split('\n')[0],
            in: (Number(events[1][1].split(':')[0])*60+Number(events[1][1].split(':')[1])+1440) - timeInRS,
        },
        {
            name: events[2][0].split('\n')[0],
            in: (Number(events[2][1].split(':')[0])*60+Number(events[2][1].split(':')[1])+1440) - timeInRS,
        },
    ]

    console.log(eventsJSON);

    let soonest = eventsJSON[0];
    for (let i = 1; i < eventsJSON.length; i++) {
        if (eventsJSON[i].in > 0 && eventsJSON[i].in < soonest.in) {
            soonest = eventsJSON[i];
        }
    }

    if (soonest.in < 15) {
        module.exports = soonest;
    } else {
        module.exports = null;
    }
});
