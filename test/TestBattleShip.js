var BattleShip = artifacts.require("BattleShip");
var BattleShip_Game = artifacts.require("BattleShip_Game");

var BattleShip_Game_address;
var BattleShip_Game_instance;

contract('BattleShip1',function(accounts){
  it("make Game instace",function(){

    var address;
    return BattleShip.deployed().then(function(instance){
      address = instance;
      return instance.new_game(accounts[1]);
    }).then(function(next){
      return address.find_game();
    }).then(function(res){
      BattleShip_Game_address = res[0];
      BattleShip_Game_instance = BattleShip_Game.at(BattleShip_Game_address)
    })
  })
})

contract('BattleShip2', function(accounts) {
  it("should make new BattleShip_Game contract and find it", function() {
    var address;
    return BattleShip.deployed().then(function(instance){
        address = instance;
        return instance.new_game(0x0);
      }).then(function(result){
        return address.find_game();
      }).then(function(res){
        assert.equal(res[0].length,accounts[0].length,"Check return address")
      })
  })
})

contract('BattleShip3', function(accounts) {
  it("should make new BattleShip_Game with other address",function(){
    var address;
    var game_address;
    var BGinstance;
    return BattleShip.deployed().then(function(instance){
      address = instance;
      return address.new_game(accounts[1]);
    }).then(function(next){
      return address.find_game();
    }).then(function(res){
      game_address = res[0];
      BGinstance = BattleShip_Game.at(game_address)
      return BGinstance.get_player()
    }).then(function(result){
      assert.equal(result[0], accounts[0], "Accounts 0 is not equal");
      assert.equal(result[1], accounts[1], "Accounts 1 is not equal");
    })
  })
})

contract('BattleShip4', function(accounts) {
  it("should read list BattleShip_Game contracts", function() {
    var address;
    return BattleShip.deployed().then(function(instance){
      address = instance;
      return instance.new_game(0x0);
      }).then(function(result){
        return address.new_game(0x0);
      }).then(function(result){
        return address.new_game(0x0);
      }).then(function(result){
        return address.new_game(0x0);
      }).then(function(result){
        return address.find_game();
      }).then(function(res){
        assert.equal(res.length, 4, "Doesn't return 4 address");
      })
  })
})

contract('BattleShip5', function(accounts) {
  it("should read list BattleShip_Game contracts only join in", function() {
    var address;
    return BattleShip.deployed().then(function(instance){
      address = instance;
      return instance.new_game(0x0);
      }).then(function(result){
        return address.new_game(0x0,{from:accounts[1]});
      }).then(function(result){
        return address.new_game(0x0,{from:accounts[1]});
      }).then(function(result){
        return address.new_game(0x0);
      }).then(function(result){
        return address.find_game();
      }).then(function(res){
        var temp = res;
        while(temp.indexOf('0x0000000000000000000000000000000000000000') != -1){
          temp.splice(temp.indexOf('0x0000000000000000000000000000000000000000'),1);
        }
        assert.equal(temp.length, 2, "Doesn't return 2 address");
      })
  })
})
contract('BattleShip_Game',function(accounts){
  it("Join Game",function(){
    var address;
    var game_address;
    var BGinstance;
    return BattleShip.deployed().then(function(instance){
      address = instance;
      return address.new_game(0x0);
    }).then(function(next){
      return address.find_game();
    }).then(function(res){
      game_address = res[0];
      BGinstance = BattleShip_Game.at(game_address)
      return BGinstance.join({from:accounts[2]})
    }).then(function(nex){
      return BGinstance.get_player()
    }).then(function(result){
      assert.equal(result[0], accounts[0], "Accounts 0 is not equal");
      assert.equal(result[1], accounts[2], "Accounts 2 is not equal");
    })
  }),

  it("Setting Ship and Get data",function(){
    return BattleShip_Game_instance.map_setting(true,3,3).then(function(next){
      return BattleShip_Game_instance.player_map_data.call(0,0)
    }).then(function(res){
      assert.equal(res.c[0], 33, "expected map setting");
    })
  }),

  it("Check my player number",function(){
    return BattleShip_Game_instance.get_player_num().then(function(res){
      console.log(res.c)
      assert.equal(res.c[0], 0, "expected player number 0");
    })
  })
})
