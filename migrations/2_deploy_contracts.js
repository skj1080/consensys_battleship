var BattleShip = artifacts.require("BattleShip");

module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(BattleShip);
};
