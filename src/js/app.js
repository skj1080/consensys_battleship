App = {
  web3Provider: null,
  contracts: {},

  init: function() {

    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('BattleShip.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var BattleShipArtifact = data;
      App.contracts.BattleShip = TruffleContract(BattleShipArtifact);

      // Set the provider for our contract
      App.contracts.BattleShip.setProvider(App.web3Provider);
      //contract address
      //console.log(BattleShipArtifact.networks[5777].address)
      // Use our contract to retrieve and mark the adopted pets
  //    return App.markAdopted();
    });
    $.getJSON('BattleShip_Game.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var BattleShipGArtifact = data;
        App.contracts.BattleShip_Game = TruffleContract(BattleShipGArtifact);

        // Set the provider for our contract
        App.contracts.BattleShip_Game.setProvider(App.web3Provider);
        //console.log(App)
        //console.log(App.contracts)
        // Use our contract to retrieve and mark the adopted pets
      }).then(function(res){
        //console.log(res);
        App.FindGame()});

  },

  clicka: function(btn_id){
    var GameAddress = $("#BoardName1").text();
    var BGinstance = App.contracts.BattleShip_Game.at(GameAddress);
    var checkbox_Val = $('input[name="check_vertical"]:checked').val();
    var btn_val =  $(".btn-atk").eq(btn_id).val();
    var x = btn_id % 10;
    var y = (btn_id - x) / 10;
    BGinstance.playing.call().then(function(res){
      if(res == true){ //Game Playing
        BGinstance.attack_ship(x,y).then(function(res){
          BGinstance.get_attacked().then(function(dis){
            App.game_display(dis)
        })
      })
    }
      else if(res == false){ //Game Waitting
        if(btn_val == 2){
          if(checkbox_Val == 'checked'){
            BGinstance.map_setting(true,x,y).then(function(res){
              for(i=0;i<100;i++) $(".btn-look").eq(i).css('background-color','#CCEEFF')
              BGinstance.get_map().then(function(res){setTimeout(function(){BGinstance.get_map.call().then(res => App.checkmapdata(res))},2000);})
            })
              $(".btn-atk").eq(btn_id).css('background-color','lime')
              $(".btn-atk").eq(btn_id).val(1)
          }
          else {
            BGinstance.map_setting(false,x,y).then(function(res){
            for(i=0;i<100;i++) $(".btn-look").eq(i).css('background-color','#CCEEFF')
            BGinstance.get_map().then(function(res){setTimeout(function(){BGinstance.get_map.call().then(res => App.checkmapdata(res))},2000);})
          })
              $(".btn-atk").eq(btn_id).css('background-color','lime')
              $(".btn-atk").eq(btn_id).val(1)
          }
        }
      }
    })
  },

  clickb: function(btn_id){
      var btn_val =  $(".btn-atk").eq(btn_id).val();
      if(btn_val==0){
            $(".btn-atk").eq(btn_id).css('background-color','palegreen')
            $(".btn-atk").eq(btn_id).val(2)
        }
  },

  clickc: function(btn_id){
      var btn_val =  $(".btn-atk").eq(btn_id).val();
      if(btn_val < 3){
       $(".btn-atk").eq(btn_id).css('background-color','#CCEEFF')
       $(".btn-atk").eq(btn_id).val(0)
      }
  },
  makenewGame: function() {
      var battleshipInstance;
      const receiver = $('#receiver').val()
      if(receiver.length != 0){

      var game_contract = App.contracts.BattleShip.deployed().then(function(instance) {
        battleshipInstance = instance;
        //var result = battleshipInstance.new_game(receiver);
        //$('#address_result').text(result)
        var result = battleshipInstance.new_game(receiver).then(function(resolve){
            App.FindGame();
        })
        }).catch(function(err) {
          console.log(err.message);
      });
    }
  },
  joinGame: function() {
    var GameAddress = $("#addressbox option:selected").text();
    var BGinstance = App.contracts.BattleShip_Game.at(GameAddress);
    $("#BoardName1").text(GameAddress)
    for(i=0;i<100;i++){
    $(".btn-atk").eq(i).css('background-color','#CCEEFF')
    $(".btn-atk").eq(i).val(0)
  }
  BGinstance.get_attacked().then(function(res){
    App.game_display(res);
  });
    //BGinstance.player.call(0).then(res => abcd = res).then(function(err,res){console.log(abcd)});
    //BGinstance.get_map().then(res => console.log(res))
    BGinstance.playing.call().then(function(res){
      BGinstance.game_end.call().then(function(end){
        if(end == false){
          if(res == true){ //Game Playing
              alert("Game Playing")
              App.CheckTurn();
            }
            else if(res == false){ //Game Waitting
              alert("Waitting for players' ready")
              BGinstance.get_ready.call().then(function(res){
                if(res == true){
                  alert("You are already ready")
                }
                else if(res == false){
                  alert("You have to be ready")
                }
              })
            }
          }
          else{
            BGinstance.victory.call().then(function(res){
              BGinstance.get_player_num().then(function(result){
                if(result.c[0] == res) {
                  alert("You Win!")
                  for(i=0;i<100;i++){
                    $(".btn-atk").eq(i).val(5);
                  }
                }
                else{
                  alert("You Lose....")
                  BGinstance.get_map_endgame().then(function(res){
                    var opennum;
                    opennum = 1 - result.c[0]
                    App.checkmapdata_end(res[opennum])
                  })
                }
              })
            })
          }
      })
    })
    for(i=0;i<100;i++) $(".btn-look").eq(i).css('background-color','#CCEEFF')
    BGinstance.get_map().then(function(res){App.checkmapdata(res)})
    },

    refresh: function(){
        var GameAddress = $("#addressbox option:selected").text();
        var BGinstance = App.contracts.BattleShip_Game.at(GameAddress);
        $("#BoardName1").text(GameAddress)
        for(i=0;i<100;i++){
        $(".btn-atk").eq(i).css('background-color','#CCEEFF')
        $(".btn-atk").eq(i).val(0)
      }BGinstance.get_attacked().then(function(res){
              App.game_display(res);
            })
        for(i=0;i<100;i++) $(".btn-look").eq(i).css('background-color','#CCEEFF')
        BGinstance.get_map().then(function(res){App.checkmapdata(res)})

        BGinstance.game_end.call().then(function(end){
          if(end == true){
            BGinstance.victory.call().then(function(res){
              BGinstance.get_player_num().then(function(result){
                if(result.c[0] == res){
                  alert("You Win!")
                  for(i=0;i<100;i++){
                    $(".btn-atk").eq(i).val(5);
                  }
                }
                else{
                   alert("You Lose....")
                   BGinstance.get_map_endgame().then(function(res){
                     var opennum;
                     opennum = 1 - result.c[0]
                     App.checkmapdata_end(res[opennum])
                   })
                 }
              })
            })
          }
        })

    },

    joinGame_new: function() {
      var GameAddress = $('#new_id').val();
      var BGinstance = App.contracts.BattleShip_Game.at(GameAddress);
      BGinstance.join().then(function(res){
        $("#BoardName1").text(GameAddress);
        App.FindGame();
      })
      },

  checkmapdata: function(get_map_result){
    var temp =[];
    for(i=0;i<20;i++) {
      temp.push(get_map_result[i].c[0]);
      $(".btn-look").eq(temp[i]).css('background-color','green');
      $(".btn-look").eq(temp[i]).val(1);
    }
    //console.log(temp);
    return temp;
  },
  checkmapdata_end: function(get_map_result){
      var temp =[];
      for(i=0;i<20;i++) {
        temp.push(get_map_result[i].c[0]);
        $(".btn-atk").eq(temp[i]).css('background-color','red');
      }
      for(i=0;i<100;i++){
        $(".btn-atk").eq(i).val(5);
      }
      return temp;
    },

  check4ready: function(get_map_result){
      var GameAddress = $("#BoardName1").text();
      var BGinstance = App.contracts.BattleShip_Game.at(GameAddress);
      var temp =[];
      for(i=0;i<20;i++) {
        temp.push(get_map_result[i].c[0]);
      }
      if(temp.indexOf(255) == -1)
        BGinstance.ready()
      else {
        alert("You have to complete arrangement Ship")
      }
  },

  zeroAddressDel:function(addarray){
    var temp = [];
    $("#addressbox").find("option").remove();
    for(i=0;i<addarray.length;i++){
      if(addarray[i] != 0x0000000000000000000000000000000000000000){
        temp.push(addarray[i])
        $('#addressbox').append($("<option value='"+i+"'>"+addarray[i]+"</option>"))
      }
    }
    //for(j=0;j<$("#addressbox option").size();j++)
    //  console.log($("#addressbox option").eq(j).text())
    return temp;
  },

  readyGame: function(){
      var GameAddress = $("#BoardName1").text();
      var BGinstance = App.contracts.BattleShip_Game.at(GameAddress);
      BGinstance.get_map().then(function(res){App.check4ready(res)})
  },

  FindGame: function() {
      var bts;
      var addr;
      App.contracts.BattleShip.deployed().then(function(instance){
        bts = instance;
        bts.find_game().then(res => App.zeroAddressDel(res))
      })
  },

  CheckTurn: function() {
      var GameAddress = $("#BoardName1").text();
      var BGinstance = App.contracts.BattleShip_Game.at(GameAddress);
      var temp;
      BGinstance.turn.call().then(function(res){
        if(res == true) temp = 1;
        else temp = 0;
        BGinstance.get_player_num().then(function(result){
          if(result.c[0] + temp == 1) alert("Your Turn");
          else alert("Opponent's Turn")
        })
        //console.log(res.c[0])
      })
  },
  copy: function(){
    var temp = $("#addressbox option:selected").text();
    var t = document.createElement("textarea");
    document.body.appendChild(t);
    t.value = temp;
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
    alert("copy "+temp); //Optional Alert, 삭제해도 됨
  },

  game_display: function(input){
      var GameAddress = $("#BoardName1").text();
      var BGinstance = App.contracts.BattleShip_Game.at(GameAddress);
      var destroyed = input[0];
      var missed = input[1];
      //console.log(destroyed[0])
      //console.log(missed[0])
      BGinstance.get_player_num().then(function(res){
          if (res.c[0] == 0){
              for(i=0;i<20;i++){
                    for(i=0;i<20;i++){
                        if(destroyed[1][i].c[0] != 255){
                          //console.log(destroyed[1][i].c[0])
                          $(".btn-atk").eq(destroyed[1][i].c[0]).css('background-color','red')
                          $(".btn-atk").eq(destroyed[1][i].c[0]).val(3)
                        }
                        if(destroyed[0][i].c[0] != 255) {$(".btn-look").eq(destroyed[0][i].c[0]).css('background-color','red')
                        }
                    }
                    for(i=0;i<80;i++){
                          if(missed[1][i].c[0] != 255){
                              //console.log(missed[1][i].c[0])
                              $(".btn-atk").eq(missed[1][i].c[0]).css('background-color','blue')
                              $(".btn-atk").eq(missed[1][i].c[0]).val(4)
                            }
                          if(missed[0][i].c[0] != 255) {$(".btn-look").eq(missed[0][i].c[0]).css('background-color','blue')
                          }
                    }
              }
          }
          else if(res.c[0] == 1){
                for(i=0;i<20;i++){
                    if(destroyed[0][i].c[0] != 255){
                      //console.log(destroyed[0][i].c[0])
                      $(".btn-atk").eq(destroyed[0][i].c[0]).css('background-color','red')
                      $(".btn-atk").eq(destroyed[0][i].c[0]).val(3)
                    }
                    if(destroyed[1][i].c[0] != 255) {$(".btn-look").eq(destroyed[1][i].c[0]).css('background-color','red')
                    }
                }
                for(i=0;i<80;i++){
                      if(missed[0][i].c[0] != 255){
                          //console.log(missed[0][i].c[0])
                          $(".btn-atk").eq(missed[0][i].c[0]).css('background-color','blue')
                          $(".btn-atk").eq(missed[0][i].c[0]).val(4)
                        }
                      if(missed[1][i].c[0] != 255) {$(".btn-look").eq(missed[1][i].c[0]).css('background-color','blue')
                      }
                }
          }
      })
  }

};

$(function() {
  $(window).load(function() {
    App.init();

  });
});
