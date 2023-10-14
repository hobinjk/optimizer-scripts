import fetch from 'node-fetch';
(async function() {
  let url = 'https://dps.report/O08l-20231002-152104_golem';
  url = url.replace('report/', 'report/getJson?permalink=');
  const res = await fetch(url);
  const log = await res.json();
  process(log);
})();

function process(log) {
  const shroudBuff = 29446;
  const player = log.players[0];
  let shroudUptime = null;
  for (let uptime of player.buffUptimes) {
    if (uptime.id === shroudBuff) {
      shroudUptime = uptime;
      break;
    }
  }
  if (!shroudUptime) {
    console.warn('no shroud uptime');
    return;
  }

  let damage = player.targetPowerDamage1S[0][0];
  let damageInShroud = 0;
  let states = shroudUptime.states;
  states.push([log.durationMS, 0])
  let inShroud = states[0][1] > 0.5;

  console.log(damage, states);

  let second = 0;
  for (let i = 1; i < states.length; i++) {
    let newStateInShroud = states[i][1] > 0.5;
    let newStateTimeS = Math.round(states[i][0] / 1000);

    if (inShroud) {
      let damageBefore = damage[second];
      if (second === 0) {
        damageBefore = 0;
      }
      if (newStateTimeS > damage.length - 1) {
        newStateTimeS = damage.length - 1;
      }
      let damageAfter = damage[newStateTimeS];
      damageInShroud += damageAfter - damageBefore;
    }

    inShroud = newStateInShroud;
    second = newStateTimeS;
  }
  console.log(damageInShroud, damageInShroud / damage[damage.length - 1]);
}
