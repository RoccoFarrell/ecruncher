const fetch = require('node-fetch');

async function matchInfo () {

    let matchData = []

    let response = await fetch('https://api.opendota.com/api/matches/6701044160')
    let response_object = await response.json()

        let direTeam = response_object['dire_team']['name']
        let radiantTeam = response_object['radiant_team']['name']

        let players = response_object['players']

        for (index in Object.keys(players)){
            let playerObj = {}
            playerObj.player_slot = players[index]['player_slot']
            playerObj.player_name = players[index]['name']
            playerObj.player_kills = players[index]['kills']
            playerObj.player_deaths = players[index]['deaths']
            playerObj.player_assists = players[index]['assists']
            playerObj.player_lasthits = players[index]['last_hits']
            playerObj.player_denies = players[index]['denies']
            playerObj.player_level = players[index]['level']
            playerObj.player_time = (parseInt(players[index]['duration'])/60)
            playerObj.player_win = players[index]['win']

            if (parseInt(playerObj.player_win) == 1) {
                playerObj.win_loss = 'W'
            } else {
                playerObj.win_loss = 'L'
            }

            if (parseInt(playerObj.player_slot) < 5) {
                playerObj.player_team = radiantTeam
            } else {
                playerObj.player_team = direTeam
            }

            matchData.push(playerObj)

        }
    return (matchData)

}

matchInfo().then(console.log).catch(console.error)