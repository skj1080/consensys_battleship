pragma solidity ^0.4.24;

contract BattleShip{
    address[] public contracts;
    function new_game(bytes20 p2) public returns(address game_address){
        BattleShip_Game game = new BattleShip_Game(msg.sender,address(p2));
        contracts.push(address(game));
        return(address(game));
    }

    function find_game() public view returns(address[]){
        require(contracts.length > 0);
        uint len = contracts.length;
        address[] memory ingame;
        ingame = contracts;
        for(uint8 i=0; i<len;i++){
            if(BattleShip_Game(contracts[i]).get_player()[0] != msg.sender && BattleShip_Game(contracts[i]).get_player()[1] != msg.sender)
                delete ingame[i];
        }
        return ingame;
    }
}

contract BattleShip_Game{

    mapping (address => bool[10][10]) player_map;
    address[2] public player;
    uint8 num;
    bool public playing;
    bool public game_end;
    bool public turn;
    uint8 public victory;
    uint8[2] player_ship_destroyed_num;
    uint8[2] player_ship_missed_num;
    uint8[20][2] public player_map_data;
    uint8[20][2] public player_ship_destroyed;
    uint8[80][2] public player_ship_missed;
    mapping (address => bool) public ready;
    mapping (address => uint8) ship_num; //later delete public

    constructor(address player0, address player2) public{
        victory = 255;
        playing = false;
        game_end = false;
        ready[msg.sender] = false;
        player[0] = player0;
        player_ship_missed_num[0] = 0;
        player_ship_destroyed_num[0] = 0;
        player_ship_missed_num[1] = 0;
        player_ship_destroyed_num[1] = 0;
        ship_num[player0] = 0;
        for(uint i=0 ; i<10; i++){
            for(uint j=0; j<10; j++){
                player_map[player0][i][j] = false;
            }
        }
        if(!(player2==address(0))){
            player[1] = player2;
            ready[player2] = false;
            ship_num[player2] = 0;
            for(i=0 ; i<10; i++){
                for(j=0; j<10; j++){
                    player_map[player2][i][j] = false;
                }
            }
        }
        for(i = 0 ; i < 20 ; i ++){
            player_map_data[0][i] = 255;
            player_map_data[1][i] = 255;
            player_ship_destroyed[0][i] = 255;
            player_ship_destroyed[1][i] = 255;
        }
        for(i=0;i<80;i++){
            player_ship_missed[0][i] = 255;
            player_ship_missed[1][i] = 255;
        }
    }

    function get_player() public view returns(address[2]){
      return player;
    }
    function get_ship_num() public view returns(uint8){
        return ship_num[msg.sender];
    }
    function join() public{
        require((player[1]==address(0) && msg.sender!=player[0]) || (player[0]==address(0) && msg.sender!=player[1]));
        if(player[1]==address(0)) player[1] = msg.sender;
        else player[0] = msg.sender;
        for(uint i=0 ; i<10; i++){
            for(uint j=0; j<10; j++){
                player_map[msg.sender][i][j] = false;
            }
        }
    }

    function get_map() public view returns(uint8[20] spot){
        if (msg.sender == player[0]) return player_map_data[0];
        else if(msg.sender == player[1]) return player_map_data[1];
    }

    function get_map_endgame() public view returns(uint8[20][2] map){
        require(game_end == true);
        return player_map_data;
    }

    function get_attacked() public view returns(uint8[20][2] destroyed,uint8[80][2] missed){
        if (msg.sender == player[0] || msg.sender == player[1]) return (player_ship_destroyed,player_ship_missed);
    }

    function get_ready() public view returns(bool){
        return ready[msg.sender];
    }

    function get_player_num() public view returns(uint8){
        if (player[0] == msg.sender) return 0;
        if (player[1] == msg.sender) return 1;
    }

    function ready() public check_player{
        require(playing == false && game_end == false && ship_num[player[num]] == 20);
        ready[player[num]] = true;
        if((ready[player[0]] == true) && (ready[player[1]] == true)) playing = true;
    }

    modifier check_player{
        require(msg.sender == player[0] || msg.sender == player[1]);
        if(msg.sender == player[0]) num = 0;
        else num = 1;
        _;
    }

    function map_setting(bool vertical, uint8 spot_x, uint8 spot_y) public check_player{
        // 4 square ship
        require(playing == false && game_end == false);
        if (ship_num[player[num]] == 0){
            if(vertical == true){
                require(spot_y <7);
                for(uint8 i = 0; i < 4; i++){
                    player_map[player[num]][spot_x][spot_y + i] = true;
                    player_map_data[num][ship_num[player[num]]] = spot_x + ((spot_y + i) * 10);
                    ship_num[player[num]]++;
                }
            }
            else{
                require(spot_x <7);
                for(i = 0; i < 4; i++){
                    player_map[player[num]][spot_x + i][spot_y] = true;
                    player_map_data[num][ship_num[player[num]]] = spot_x + i + ((spot_y) * 10);
                    ship_num[player[num]]++;
                }
            }
        }
        // 3 square ship
        else if (ship_num[player[num]] == 4 || ship_num[player[num]] == 7){
            if(vertical == true){
                require(spot_y <8 && !(player_map[player[num]][spot_x][spot_y] || player_map[player[num]][spot_x][spot_y + 1] || player_map[player[num]][spot_x][spot_y + 2]));
                for(i = 0; i < 3; i++){
                    player_map[player[num]][spot_x][spot_y + i] = true;
                    player_map_data[num][ship_num[player[num]]] = spot_x + ((spot_y + i) * 10);
                    ship_num[player[num]]++;
                }
            }
            else{
                require(spot_x <8 && !(player_map[player[num]][spot_x][spot_y] || player_map[player[num]][spot_x + 1][spot_y] || player_map[player[num]][spot_x + 2][spot_y] ));
                for(i = 0; i < 3; i++){
                    player_map[player[num]][spot_x + i][spot_y] = true;
                    player_map_data[num][ship_num[player[num]]] = spot_x + i + ((spot_y) * 10);
                    ship_num[player[num]]++;
                }
            }
        }
        // 2 square ship
        else if (ship_num[player[num]] > 9 && ship_num[player[num]] < 15){
            if(vertical == true){
                require(spot_y < 9 && !(player_map[player[num]][spot_x][spot_y] || player_map[player[num]][spot_x][spot_y + 1]));
                for(i = 0; i < 2; i++){
                    player_map[player[num]][spot_x][spot_y + i] = true;
                    player_map_data[num][ship_num[player[num]]] = spot_x + ((spot_y + i) * 10);
                    ship_num[player[num]]++;
                }
            }
            else{
                require(spot_x < 9 && !(player_map[player[num]][spot_x][spot_y] || player_map[player[num]][spot_x + 1][spot_y] ));
                for(i = 0; i < 2; i++){
                    player_map[player[num]][spot_x + i][spot_y] = true;
                    player_map_data[num][ship_num[player[num]]] = spot_x + i + ((spot_y) * 10);
                    ship_num[player[num]]++;
                }
            }
        }
        // 1 square ship
        else{
            require(ship_num[player[num]] > 15 && ship_num[player[num]] < 20 && !(player_map[player[num]][spot_x][spot_y]));
            player_map[player[num]][spot_x][spot_y] = true;
            player_map_data[num][ship_num[player[num]]] = spot_x + ((spot_y) * 10);
            ship_num[player[num]]++;
        }
    }

    function attack_ship(uint8 spot_x, uint8 spot_y) public check_player{
        require(playing == true && game_end == false);
        uint8 temp;
        temp = spot_x + 10 * spot_y;
        if(num == 0) require(turn == true);
        else require(turn == false);
        if(turn == true){
            if(player_map[player[1]][spot_x][spot_y] == true){
                ship_num[player[1]]--;
                player_ship_destroyed[1][player_ship_destroyed_num[1]] = temp;
                player_ship_destroyed_num[1]++;
                if(ship_num[player[1]] == 0) end_game(0);
            }
            else{
                turn = false;
                player_ship_missed_num[1]++;
                player_ship_missed[1][player_ship_missed_num[1]] = temp;
            }
        }
        else if(turn ==false){
            if(player_map[player[0]][spot_x][spot_y] == true){
                ship_num[player[0]]--;
                player_ship_destroyed[0][player_ship_destroyed_num[0]] = temp;
                player_ship_destroyed_num[0]++;
                if(ship_num[player[0]] == 0) end_game(1);
            }
            else{
                turn = true;
                player_ship_missed[0][player_ship_missed_num[0]] = temp;
                player_ship_missed_num[0]++;
            }
        }
    }

    function end_game(uint8 who) internal{
        if(who == 0){
            victory = 0;
            playing = false;
            game_end = true;
        }
        else{
            victory = 1;
            playing = false;
            game_end = true;
        }
    }
}
