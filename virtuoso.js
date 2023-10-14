import fetch from 'node-fetch';
(async function() {
  let url = 'https://dps.report/5rrD-20231003-202531_golem';
  url = url.replace('report/', 'report/getJson?permalink=');
  const res = await fetch(url);
  const log = await res.json();
  process(log);
})();

const bladeSkillIds = {
  69311: 'bladecall (non-virt)', // just in case
  62560: 'bladecall',
  10218: 'mind stab',
  10333: 'mirror blade',
  10221: 'phantasmal berserker',
  62554: 'cutter burst',
  62510: 'flying cutter',
  62607: 'unstable bladestorm',
  62522: 'twin blade restoration',
  62573: 'psychic force',
  62553: 'rain of swords',
  35637: 'sword of decimation',
  24755: 'thousand cuts',
  62602: 'bladesong dissonance',
  62617: 'bladesong harmony 1',
  62586: 'bladesong harmony 2',
  62616: 'bladesong sorrow',
  62597: 'bladeturn requiem',
  25513: 'phantasmal blade',
};

function process(log) {
  const target = log.targets[0];
  const damageTaken = target.totalDamageTaken[0];

  let bladeCrits = 0;
  for (let skillData of damageTaken) {
    if (!bladeSkillIds[skillData.id]) {
      continue;
    }
    bladeCrits += skillData.crit;
  }
  const durationS = log.durationMS / 1000;

  console.log('blade crits/s', bladeCrits / durationS);
}

