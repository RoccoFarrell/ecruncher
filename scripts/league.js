const puppeteer = require('puppeteer-extra');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

function matchInfo () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({ headless: false })
            const [page] = await browser.pages();
            await page.goto("https://gol.gg/players/player-matchlist/1932/season-S12/split-Summer/tournament-ALL/")

            page.on('console', msg => console.log('PAGE LOG:', msg.text()));

            let matchInfoObj = await page.evaluate(() => {
                let resultsObj = {};
                let selectorData = document.querySelectorAll(".table_list > tbody > tr")
                console.log(selectorData)

                let playerName = document.querySelectorAll('h1:nth-of-type(1)')[0].innerText

                let playerDataArr = []
                if(selectorData.length > 0){
                    selectorData.forEach(match => {
                        let champion = match.querySelectorAll('td:nth-of-type(1)')[0].innerText
                        let result = match.querySelectorAll('td:nth-of-type(2)')[0].innerText
                        let playerKDA = match.querySelectorAll('td:nth-of-type(3)')[0].innerText.split('/')
                        let playerKills = playerKDA[0]
                        let playerDeaths = playerKDA[1]
                        let playerAssists = playerKDA[2]
                        let matchDuration = match.querySelectorAll('td:nth-of-type(5)')[0].innerText
                        let matchDate = match.querySelectorAll('td:nth-of-type(6)')[0].innerText
                        let game = match.querySelectorAll('td:nth-of-type(7)')[0].innerText
                        let tournament = match.querySelectorAll('td:nth-of-type(8)')[0].innerText

                        playerDataArr.push({
                            player: playerName,
                            champion: champion,
                            result: result,
                            kills: playerKills,
                            deaths: playerDeaths,
                            assists: playerAssists,
                            matchDuration: matchDuration,
                            matchDate: matchDate,
                            game: game,
                            tournament: tournament
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