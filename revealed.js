import fetch from 'node-fetch';

// stealth applied
// revealed applied
// windows of 10 second or w/e
(async function() {
  let logs = [
    'https://dps.report/45mT-20231102-115928_void',
    // 'https://dps.report/ssoP-20231102-122509_void',
    // 'https://dps.report/f5DJ-20231102-123411_void',
    // 'https://dps.report/nkrV-20231102-124100_void',
    // 'https://dps.report/s1Xb-20231102-124828_void',
  ]
  for (let url of logs) {
    console.log(url);
    // let url = 'https://dps.report/O08l-20231002-152104_golem';
    url = url.replace('report/', 'report/getJson?permalink=');
    const res = await fetch(url);
    const log = await res.json();
    process(log);
  }
})();

let window = 10000;

function addStateEvent(events, uptimeEvent) {
  for (let event of events) {
    if (Math.abs(event.time - uptimeEvent.time) > window) {
      continue;
    }
    event.events.push(uptimeEvent);
    return;
  }
  events.push({
    time: uptimeEvent.time,
    events: [uptimeEvent],
  });
}

function addStateEvents(events, player, uptime) {
  const name = player.account.split('.')[0];
  for (let stateData of uptime.states) {
    let time = stateData[0];
    let active = stateData[1] > 0.5;
    if (!active) {
      continue;
    }
    addStateEvent(events, {
      name,
      time,
    });
  }
}

function process(log) {
  const stealthEvents = [];
  const revealEvents = [];

  const stealthBuff = 10269;
  const revealedBuff = 890;

  for (let player of log.players) {
    for (let uptime of player.buffUptimes) {
      if (uptime.id === revealedBuff) {
        addStateEvents(revealEvents, player, uptime);
      } else if (uptime.id === stealthBuff) {
        addStateEvents(stealthEvents, player, uptime);
      }
    }
  }

  for (const stealthEvent of stealthEvents) {
    if (stealthEvent.events.length < 10 && stealthEvent.events.length > 1) {
      console.log('stealth missed someone', stealthEvent);
    }
  }
  for (const revealEvent of revealEvents) {
    revealEvent.events.sort((a, b) => a.time - b.time);
    let closestStealth = null;
    let closestDist = window;
    for (const stealthEvent of stealthEvents) {
      let dist = Math.abs(revealEvent.time - stealthEvent.time);
      if (!closestStealth || dist < closestDist) {
        closestStealth = stealthEvent;
        closestDist = dist;
      }
    }
    if (!closestStealth || closestDist > 3000) {
      continue;
    }
    console.log('reveal', revealEvent);
    console.log('closestStealth', closestDist, closestStealth);
  }
}
