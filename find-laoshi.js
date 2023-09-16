import fetch from 'node-fetch';
(async function() {
  // const res = await fetch('https://dps.report/getJson?permalink=rgyk-20221201-104257_golem');
  for (let i = 10; i < 100; i++) {
    let link = `XI5L-20230521-1759${i}_golem`;
    const res = await fetch(`https://dps.report/getJson?permalink=${link}`);
    const log = await res.json();
    console.log(i, log);
  }
})();
