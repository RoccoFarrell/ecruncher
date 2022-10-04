const puppeteer = require('puppeteer');

function playerInfo () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch()
            const page = await browser.newPage()
            await page.goto("https://www.hltv.org/stats/players/13239/qikert")

            let playerInfoObj = await page.evaluate(() => {
                let resultsObj = {};
                let statRows = document.querySelectorAll('.stats-row')

                //get player name
                let player_name = document.querySelector('.summaryNickname').innerText
                resultsObj["player_name"] = player_name

                //get all stats for player
                statRows.forEach(row => {
                    let spanQuery = row.querySelectorAll('span');
                    let statName = spanQuery[0].innerText;
                    let statValue = spanQuery[1].innerText;
                    resultsObj[statName] = statValue;
                 })

                return resultsObj;
            })

            browser.close()
            return resolve(playerInfoObj)
        } catch (e) {
            return reject(e)
        }
    })
}

function getStatsTable () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch()
            const page = await browser.newPage()
            await page.goto("https://www.hltv.org/stats/players/matches/13239/qikert?startDate=2022-08-13&endDate=2022-09-13")

            let matchHistoryObj = await page.evaluate(() => {
                let matchHistory = []
                let tableRows = document.querySelectorAll('.stats-table tbody tr')
                tableRows.forEach(row => {
                    let rowObj = {};
                    let rowTDs = row.querySelectorAll('td')
                    rowObj.gameDate = rowTDs[0].innerText
                    rowObj.playerTeam = rowTDs[1].innerText.split(" ")[0]
                    rowObj.roundWins = rowTDs[1].innerText.split(" ")[1].replace("(","").replace(")","")
                    rowObj.opponentTeam = rowTDs[2].innerText.split(" ")[0]
                    rowObj.roundLosses = rowTDs[2].innerText.split(" ")[1].replace("(","").replace(")","")
                    rowObj.map = rowTDs[3].innerText
                    rowObj.kills = rowTDs[4].innerText.split(" - ")[0]
                    rowObj.deaths = rowTDs[4].innerText.split(" - ")[1]
                    rowObj.plusMinus = rowTDs[5].innerText
                    rowObj.rating = rowTDs[6].innerText
                    matchHistory.push(rowObj)
                })

                return matchHistory

            }) 

            browser.close()
            return resolve(matchHistoryObj)
        } catch (e) {
            return reject(e)
        }
    })
}

playerInfo().then(console.log).catch(console.error)
getStatsTable().then(console.log).catch(console.error)