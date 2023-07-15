async function checkForEvent() {

    //Create timer for wildy events
    //use timer.js for events
    const timerFunc = require('./timer.js');

    const result = timerFunc().then((event) => {

        if (event == null) {
                console.log("Event not within 15 minutes.");
                return;
        }
        //If we get here, there is an event within 15 minutes

        console.log(event);
        return event;
    });

    return result;

}

checkForEvent();
setInterval(checkForEvent, 60 * 1000);