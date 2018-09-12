#Consensys 2018 Developer Program Avoding_common_attacks.md

### This is Final project for Consensys 2018 Developer Program

## BattleShip Board Game

### This document explain the way to avoid common attacks.

#### First, This Project is made by using truffle, ganache, metamask.

#### But Smart Contract Code is written in Remix, and it was tested whenever make function to prevent logic bug.

#### And In this Contracts, There are no recursive function. Even there are few function call in function. Also this project doesn't use dynamic array.

#### Integer overflow problem, in this project, almost integer is unsigned integer which is doesn't have to subtract. Only subtract integer is ship_num but it is only 1 each time and when ship_num is going 0 at 1, game is end.

#### Also, in this project, User cann't enter integer value by typing. User can only enter address which doesn't matter it is bad value.

#### Finally, in this project, Game Contract is owned by Main Contract(BattleShip), User cann't have big power. And this project will run on private networks, it is free from off chain safety, cross chain reply attacks.
