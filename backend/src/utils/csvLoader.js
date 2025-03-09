const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');

const loadBanksData = () => {
  return new Promise((resolve, reject) => {
    const banks = [];
    fs.createReadStream(path.join(__dirname, '../../data/banks.csv'))
      .pipe(parse({ columns: true }))
      .on('data', (data) => {
        banks.push({
          bic: data.BIC,
          charge: parseInt(data.Charge)
        });
      })
      .on('end', () => {
        resolve(banks);
      })
      .on('error', reject);
  });
};

const loadLinksData = () => {
  return new Promise((resolve, reject) => {
    const links = [];
    fs.createReadStream(path.join(__dirname, '../../data/links.csv'))
      .pipe(parse({ columns: true }))
      .on('data', (data) => {
        links.push({
          fromBic: data.FromBIC,
          toBic: data.ToBIC,
          time: parseInt(data.TimeTakenInMinutes)
        });
      })
      .on('end', () => {
        resolve(links);
      })
      .on('error', reject);
  });
};

module.exports = {
  loadBanksData,
  loadLinksData
}; 