const { faker } = require('@faker-js/faker');

module.exports.data = (userContext, events, done) => {
  userContext.vars.user_id = getRandomNumber(1, 100);
  userContext.vars.price = getRandomNumber(5000, 30000);
  done();
};

// Function to generate a random number between min (inclusive) and max (inclusive)
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}