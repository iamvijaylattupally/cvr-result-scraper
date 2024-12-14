import { connect } from 'puppeteer-real-browser';
import express from "express";
import bodyParser from 'body-parser';
import cors from "cors"

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3030, () => {
    console.log(`Port running at 3030`);
});
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.get("/",(req,res)=>{
    res.send("Welcome to result scraper")
})
app.post("/getresults", async (req, res) => {
    const { link, rollnumbers } = req.body;
    console.log(link);
    console.log(rollnumbers);

    if (!link || !/^https?:\/\//i.test(link)) {
        return res.status(400).json({ error: "Invalid or missing link in request body." });
    }
    if (!rollnumbers || !Array.isArray(rollnumbers) || rollnumbers.length === 0) {
        return res.status(400).json({ error: "Roll numbers are missing or not an array in request body." });
    }

    try {
        const results = [];
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const { browser, page } = await connect({
            headless: false,
            args: [],
            customConfig: {},
            turnstile: true,
            connectOption: {},
            disableXvfb: false,
            ignoreAllFlags: false,
        });

        for (const rollnumber of rollnumbers) {
            await page.goto(link);
            await delay(5000);

            await page.waitForSelector('input[name="srno"]');
            await page.type('input[name="srno"]', rollnumber);

            await page.waitForSelector('button[name="phase1"]');
            await page.click('button[name="phase1"]');
            try {
                await page.waitForNavigation({ timeout: 3000 });
                console.log('Navigation completed!');
            } catch (err) {
                console.log('Navigation did not occur. Handling dynamic content instead.');
            }

            const rollNumber = await page.$eval(
                'table.bttable.blue tr:nth-child(1) td:nth-child(2)',
                (el) => el.innerText.trim()
            );
            const name = await page.$eval(
                'table.bttable.blue tr:nth-child(2) td:nth-child(2)',
                (el) => el.innerText.trim()
            );

            const subjectDetails = await page.$$eval('table.bttable.blue tbody.zebra-striped tr', (rows) =>
                rows.map((row) => {
                    const cells = row.querySelectorAll('td');
                    return {
                        subject: cells[0].innerText.trim(),
                        grade: cells[1].innerText.trim(),
                        status: cells[2].innerText.trim(),
                        credits: parseInt(cells[3].innerText.trim(), 10),
                    };
                })
            );

            let tables = await page.$$('table.bttable.blue');
            let tbody = await tables[2].$('tbody');
            let rows = await tbody.$$('tr');

            let sgpa = null;
            try {
                sgpa = await rows[0].$('td:nth-child(2)');
                sgpa = parseFloat(await sgpa.evaluate(el => el.innerText.trim()));
            } catch (err) {
                console.error('Error extracting SGPA:', err);
            }

            let cgpa = null;
            try {
                cgpa = await rows[1].$('td:nth-child(2)');
                cgpa = parseFloat(await cgpa.evaluate(el => el.innerText.trim()));
            } catch (err) {
                console.error('Error extracting CGPA:', err);
            }

            const resultData = {
                rollNumber: rollNumber,
                name: name,
                subjects: subjectDetails,
                sgpa: sgpa,
                cgpa: cgpa,
            };

            results.push(resultData);
        }
        browser.close()
        res.status(200).json(results);
    } catch (error) {
        console.error("Error in scraping:", error);
        res.status(500).json({ error: "Failed to scrape results." });
    }
});
