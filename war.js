import fetch from 'node-fetch';
(async function() {
  // const res = await fetch('https://dps.report/getJson?permalink=4gCd-20230214-204655_golem');
  // const res = await fetch('https://dps.report/getJson?permalink=aSwf-20230216-210051_golem');
  // const res = await fetch('https://dps.report/getJson?permalink=HzZk-20221213-184016_golem');
  // const res = await fetch('https://dps.report/getJson?permalink=0ImQ-20230502-185448_golem');
  // const res = await fetch('https://dps.report/getJson?permalink=D1Pu-20230615-085048_golem');
  const res = await fetch('https://dps.report/getJson?permalink=Pypi-20231003-192433_golem');
  const log = await res.json();
  process(log);
})();

function process(log) {
  console.log(log.ski)
  const weaponSwapId = -2;
  const player = log.players[0];
  let swaps = null;
  for (let skillCasts of player.rotation) {
    if (skillCasts.id === weaponSwapId) {
      swaps = skillCasts;
      break;
    }
  }
  if (!swaps) {
    console.warn('no swaps found');
    return;
  }

  let damage = player.targetDamage1S[0][0];
  let damageOnFirst = 0;
  let damageOnSecond = 0;
  let inFirst = true;
  let skills = swaps.skills;

  console.log(damage, skills);

  let damageBeforeSwap = 0;
  // Add fake weapon swap at end to count the last section of damage
  skills.push({
    castTime: log.durationMS,
  });
  for (let i = 0; i < skills.length; i++) {
    let cast = skills[i];
    let timeS = Math.round(cast.castTime / 1000);
    let damageAtSwap = damage[timeS];
    let damageOnWeapon = damageAtSwap - damageBeforeSwap;
    damageBeforeSwap = damageAtSwap;
    if (inFirst) {
      damageOnFirst += damageOnWeapon;
    } else {
      damageOnSecond += damageOnWeapon;
    }

    inFirst = !inFirst;
  }
  console.log('first, second, ratio', damageOnFirst, damageOnSecond,
    damageOnFirst / (damageOnFirst + damageOnSecond));
}
