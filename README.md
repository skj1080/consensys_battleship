#Consensys 2018 Developer Program README.md

### This is Final project for Consensys 2018 Developer Program

## BattleShip Board Game

#### In This Project, User can play BattleShip Game.

#### To Play Game, Users have to execute 'npm run dev' in project folder.

#### And then it will be opened at 'localhost:3030'

#### After truffle migrate, to play game, folloow next steps.

#### 1. push the button Make Game or Join New Game.(if you push Make Game, you have to fill Opponent.If you don't have opponent, enter 0x0. Also If you push Join New Game, you should enter Game Contract Address)

#### 2. On the left, at Game Address selectbox, select the game address which you want to play and push Join Game to join game.(if you join game contract but can't see, push Find Game button.)

#### 3. By pushing Game Board, You have to setting your ship location. Your Ship will be located in order of 1 battleship(size 4), 2 cruiser(size 3), 3 destroyer(size 2), 4 submarine(size 1). You can rotate ship by checking Vertical.

#### 4. When you complete ship setting, You can prepare for game start by Ready Button.

#### 5. Each Player prepared, Game Start. You can attack your opponent by pushing Game Board.

#### 6. If Your attack is hit, The Button you pushed will be red and you can attack again. Otherwise that will be blue and give turn to your opponent.

#### 7. The player who attacked all ships wins. And Each player can see their ship location.

## Development Environment

#### This project is made in Windows10, and using truffle, ganache, metamask, google chrome.
