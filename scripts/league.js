const puppeteer = require('puppeteer-extra');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

function matchInfo () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({ headless: false })
            const [page] = await browser.pages();
            await page.goto("https://gol.gg/game/stats/44337/page-game/")
            //await page.waitForNavigation();

            page.on('console', msg => console.log('PAGE LOG:', msg.text()));

            let matchInfoObj = await page.evaluate(() => {
                let resultsObj = {};
                let selectorData = document.querySelectorAll(".playersInfosLine > tbody > tr")
                console.log(selectorData)

                let playerDataArr = []
                if(selectorData.length > 0){
                    selectorData.forEach(player => {
                        let name = player.querySelectorAll('a.link-blanc')[0].innerText
                        let playerKDA = player.querySelectorAll('td:nth-of-type(3)')[0].innerText.split('/')
                        let playerKills = playerKDA[0]
                        let playerDeaths = playerKDA[1]
                        let playerAssists = playerKDA[2]
                        let playerCS = player.querySelectorAll('td:nth-of-type(4)')[0].innerText

                        playerDataArr.push({
                            name: name,
                            kills: playerKills,
                            deaths: playerDeaths,
                            assists: playerAssists,
                            cs: playerCS
                        })
                    })
                }
                resultsObj = {
                    playerArr: playerDataArr
                }

                return resultsObj;
            })

            browser.close()
            return resolve(matchInfoObj)
        } catch (e) {
            return reject(e)
        }
    })
}

matchInfo().then(console.log).catch(console.error)