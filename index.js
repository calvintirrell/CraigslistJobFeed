// import puppeteer library and assign to variable
const puppeteer = require('puppeteer');

// function called getJobs()
async function getJobs() {

    // some basic settings and setup for puppeteer
    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport: null
    });

    // 'await': tells program to wait for a specific result (in browser) before moving on
    const page = await browser.newPage();

    // craigslist url
    const url = 'https://seattle.craigslist.org/search/jjj?query=analyst&sort=date&bundleDuplicates=1&search_distance=20&postal=98101';

    // go to craigslist url
    await page.goto(url);

    // wait for '.result-row' to load then continue
    await page.waitForSelector('.result-row');

    // for each '.result-row' element found; gather the information below
    const results = await page.$$eval('.result-row', rows => {
        return rows.map(row => {
            const properties = {};

            // gets the title of the job posting
            const titleElement = row.querySelector('.result-title');
            properties.title = titleElement.innerText;

            // gets the url for the job posting
            properties.url = titleElement.getAttribute('href');

            // gets the location for the job posting
            // second line looks slightly different from others as some listings don't include job locations (Seattle, Bellevue, etc)
            const locationElement = row.querySelector('.result-hood');
            properties.location = locationElement  ? locationElement.innerText : '';

            // gets the distance for the job posting from a specified zip code
            const distanceElement = row.querySelector('.maptag');
            properties.distance = distanceElement.innerText;

            // returns the above info for each job listing
            return properties;
        })
    })

    // print out the results
    console.log(results);

    // screenshot saves to project folder
    await page.screenshot({
        path: 'craigslist_jobs_image.png'
    });

    // close browser when done
    browser.close()
}

// call getJobs function
getJobs();