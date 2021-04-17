import { streamers } from './streamers.js';

export const getStreamers = (filter) => {
  // clean embed to html
  document.getElementById("twitch-embed").innerHTML = "";

  let allChannels = [];

  streamers.forEach(element => {
    console.log(element.channel)
    if (element.showstream){
      allChannels.push(
        fetch(`https://api.twitch.tv/kraken/search/streams?query=${element.channel}`, {
          headers: {
            accept: 'application/vnd.twitchtv.v5+json',
          'client-id': 'b31o4btkqth5bzbvr9ub2ovr79umhh',
          }
        })
        .then(response => response.json())
        .then(({ streams }) => streams))
    }    
  })

  return Promise.all(allChannels).then(streams => {
    const lives = streams.filter(item => item.length)
    let warzoneLives = []

    console.log('filter', filter)
    if (filter === 'affiliate') {
      warzoneLives = lives.flat().filter(item => (
        // item.game.includes('Warzone') &&
        item.channel.broadcaster_type === filter &&
        hasChannelExist(item.channel.name)
      ));
      console.log("affialite", warzoneLives)
    } else if (filter === 'noAffiliate') {
      warzoneLives = lives.flat().filter(item => (
        // item.game.includes('Warzone') &&
        item.channel.broadcaster_type === '' &&
        hasChannelExist(item.channel.name)
      ));
      console.log("noAffiliate", warzoneLives)
    } else {
      warzoneLives = lives.flat().filter(item => hasChannelExist(item.channel.name));
      console.log("all", warzoneLives)
    }

    const randomWarzoneLives = shuffleArray(warzoneLives)

    randomWarzoneLives.map(({ channel }, index) => {
      
      if(index < 6 ){
        new Twitch.Embed(`twitch-embed`, {
          width: 540,
          height: 380,
          //muted: true,
          volume: '0.1',
          channel: `${channel.name}`,
          // only needed if your site is also embedded on embed.example.com and othersite.example.com
          parent: ["embed.example.com", "othersite.example.com"],
        });
      }
    })

    return warzoneLives
  })
}

// Devuelve array de Streamers con orden aleatorio
function shuffleArray(array) { return array.sort(() => Math.random() - 0.5); }

function hasChannelExist (channel) {
  return streamers.some(item => item.channel === channel)
}

export function setUserList (usersActive) {
  let ul = document.createElement('ul');
  ul.setAttribute('id','users');
  document.getElementById('list').appendChild(ul)

  streamers.forEach(channel => {
    const nameChannel = channel.channel
    let li = document.createElement('li')
    li = addBackagroundActive(usersActive, nameChannel, li)
    ul.appendChild(li)
    let a = document.createElement('a')
    a.setAttribute('href', `https://www.twitch.tv/${nameChannel}`)
    a.setAttribute('target', 'blank_')
    a.style.color = 'white'
    a.innerHTML= channel.name
    li.appendChild(a)
  })
}

function addBackagroundActive(usersActive, nameChannel, li) {
  usersActive.forEach(user => {
    if(user.channel.name === nameChannel) {
      li.style.backgroundColor = 'green'
    }
  })

  return li
}