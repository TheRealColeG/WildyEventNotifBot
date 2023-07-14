const puppeteer = require('puppeteer');

async function scrapeProduct(url) {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    let status = await page.goto(url, {timeout: 0});
    
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

module.exports = scrapeProduct('https://runescape.wiki/w/Wilderness_Flash_Events');