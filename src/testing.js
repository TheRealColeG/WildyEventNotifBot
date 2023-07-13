function testingMatrices() {
    let events = [
        [ 'King Black Dragon Rampage\nSpecial', '05:00' ],
        [ 'Infernal Star\nSpecial', '19:00' ],
        [ 'Evil Bloodwood Tree\nSpecial', '00:00' ]
    ];

    

    eventsJSON = [
        {
            name: events[0][0],
            when: Number(events[0][1].split(':')[0])*60+Number(events[0][1].split(':')[1])+1440
        },
        {
            name: events[1][0],
            when: Number(events[1][1].split(':')[0])*60+Number(events[1][1].split(':')[1])+1440
        },
        {
            name: events[2][0],
            when: Number(events[2][1].split(':')[0])*60+Number(events[2][1].split(':')[1])+1440
        },
    ];

    return eventsJSON;
}
let currentTime = new Date();
let timeInRS = Number((currentTime.getHours()+4)%24)*60+Number(currentTime.getMinutes());

let events = testingMatrices();

// console.log(events);

// console.log(
//     events[0].when - timeInRS,
//     events[1].when - timeInRS,
//     events[2].when - timeInRS
// )

//declare async function so that await can be used
async function test() {
    let timerFile = require('./timer.js');
    let timerPromise = await timerFile.timer;
    console.log(timerPromise);
}

//test();

async function timeouts(str) {
    console.log(str);
}

async function callingTimeouts() {
    //await for the specified amount of time, then call the function repeatedly
    await(new Promise(resolve => setTimeout(resolve, 3000)).then(() => {
        setInterval(timeouts, 1000, "1 second");
    }));
}

callingTimeouts();