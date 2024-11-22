import fetch from 'node-fetch';

// stealth applied
// revealed applied
// windows of 10 second or w/e
(async function() {
  let logs = [
    'https://dps.report/45mT-20231102-115928_void',
    'https://dps.report/ssoP-20231102-122509_void',
    'https://dps.report/f5DJ-20231102-123411_void',
    'https://dps.report/nkrV-20231102-124100_void',
    'https://dps.report/s1Xb-20231102-124828_void',
  ]
  for (let url of logs) {
    // let url = 'https://dps.report/O08l-20231002-152104_golem';
    await process(url);
  }
  printStats();
})();

let stats = {};

function addTargetDps(logUrl, phaseName, account, approxTargetDps) {
  if (!stats.hasOwnProperty(phaseName)) {
    stats[phaseName] = {};
  }
  if (!stats[phaseName][account]) {
    stats[phaseName][account] = {
      max: 0,
      logUrl: '',
    };
  }

  if (stats[phaseName][account].max > approxTargetDps) {
    return;
  }
  stats[phaseName][account].max = approxTargetDps;
  stats[phaseName][account].logUrl = logUrl;
}

async function process(logUrl) {
  let logUrlApi = logUrl.replace('report/', 'report/getJson?permalink=');
  const res = await fetch(logUrlApi);
  const log = await res.json();

  let phaseNames = [
    'Jormag',
    'Primordus',
    'Kralkatorrik',
    'Mordremoth',
    'Zhaitan',
    'Soo-Won 1',
    'Soo-Won 2',
  ];

  for (let phaseName of phaseNames) {
    let phaseIndex = log.phases.findIndex(a => a.name === phaseName);
    let phase = log.phases[phaseIndex];
    if (!phase) {
      continue;
    }
    // If it's the last phase then it might be truncated
    if (phaseIndex === log.phases.length - 1) {
      continue;
    }
    let targetIndex = phase.targets[0];

    for (let player of log.players) {
      let damages = player.targetDamage1S[targetIndex][phaseIndex];
      let approxTargetDps = Math.round(damages.at(-1) / damages.length);

      addTargetDps(logUrl, phaseName, player.account, approxTargetDps);
    }
  }
}

function printStats() {
  let maxPlayerName = 0;
  for (let phaseName of Object.keys(stats)) {
    for (let account of Object.keys(stats[phaseName])) {
      let name = account.split('.')[0];
      maxPlayerName = Math.max(maxPlayerName, name.length);
    }
  }


  for (let phaseName of Object.keys(stats)) {
    console.log(phaseName);
    let players = [];
    for (let account of Object.keys(stats[phaseName])) {
      let name = account.split('.')[0];
      name = name.padEnd(maxPlayerName, ' ');
      players.push(Object.assign({
        name,
      }, stats[phaseName][account]));
    }
    players.sort((a, b) => {
      return b.max - a.max;
    });
    for (let player of players) {
      console.log(player.name + ': ' + player.logUrl + ' ' + player.max);
    }
  }
}

