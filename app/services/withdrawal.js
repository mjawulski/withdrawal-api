'use strict';

module.exports = {
  withdrawCash(amount) {
    return new Promise(function(resolve, reject) {
      if (amount) {
        amount = +amount;
        if (isNaN(amount) || amount < 0) {
          reject('Invalid Argument');
        }

        const notesToWithdraw = getNotes(amount);
        if (notesToWithdraw && notesToWithdraw.length) {
          resolve(notesToWithdraw);
        } else {
          reject('Note unavailable');
        }
      } else {
        resolve([]);
      }
    });
  }
};

function getNotes(amount) {
  const availableNotes = [100, 50, 20, 10];
  const notesToWithdraw = [];
  while (amount > 0) {
    const biggestAvailableNote = availableNotes.find(note => note <= amount);
    if (biggestAvailableNote) {
      amount -= biggestAvailableNote;
      notesToWithdraw.push(biggestAvailableNote);
    } else {
      break;
    }
  }
  if (amount === 0 && notesToWithdraw.length) {
    return notesToWithdraw;
  } else {
    return [];
  }
}
