import fetch from 'node-fetch';
// bountiful is players[0].statsAll[0].avgBoons btw
(async function() {
  const res = await fetch('https://dps.report/getJson?permalink=5ShG-20230714-032530_golem');
  const log = await res.json();
  process(log);
})();

const Attunement = {
  Fire: 'Fire',
  Water: 'Water',
  Earth: 'Earth',
  Air: 'Air',
};

const attIds = {
  '42264': {
    primary: Attunement.Air,
    secondary: Attunement.Air,
  },
  '43470': {
    primary: Attunement.Fire,
    secondary: Attunement.Fire
  },
  '44857': {
    primary: Attunement.Earth,
    secondary: Attunement.Earth
  },
  '-6': {
    primary: Attunement.Fire,
    secondary: Attunement.Air,
  },
  '-7': {
    primary: Attunement.Fire,
    secondary: Attunement.Earth,
  },
  '-8': {
    primary: Attunement.Water,
    secondary: Attunement.Fire
  },
  '-11': {
    primary: Attunement.Air,
    secondary: Attunement.Fire,
  },
  '-12': {
    primary: Attunement.Air,
    secondary: Attunement.Water
  },
  '-13': {
    primary: Attunement.Air,
    secondary: Attunement.Earth,
  },
  '-14': {
    primary: Attunement.Earth,
    secondary: Attunement.Fire,
  },
  '-15': {
    primary: Attunement.Earth,
    secondary: Attunement.Water,
  },
};

function process(log) {
  const player = log.players[0];
  let pureUptimes = {
    [Attunement.Air]: 0,
    [Attunement.Earth]: 0,
    [Attunement.Fire]: 0,
    [Attunement.Water]: 0,
  };
  let weaverUptimes = {
    [Attunement.Air]: 0,
    [Attunement.Earth]: 0,
    [Attunement.Fire]: 0,
    [Attunement.Water]: 0,
  };

  for (const attId of Object.keys(attIds)) {
    const att = attIds[attId];
    let attUptime = null;
    for (let uptime of player.buffUptimes) {
      if (uptime.id.toString() === attId) {
        attUptime = uptime;
        break;
      }
    }
    if (!attUptime) {
      continue;
    }
    console.log('hmm', att, attUptime.buffData[0].uptime);
    pureUptimes[att.primary] += attUptime.buffData[0].uptime;
    if (att.primary !== att.secondary) {
      weaverUptimes[att.primary] += attUptime.buffData[0].uptime;
    }
    weaverUptimes[att.secondary] += attUptime.buffData[0].uptime;
  }
  console.log('pureUptimes', pureUptimes);
  console.log('weaverUptimes', weaverUptimes);
}
