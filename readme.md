# Twitch framework for chatbot and overlay

Tested on windows only
## requirement

node 18+

obs plugins https://github.com/obsproject/obs-websocket/releases

## Config

copy file `./server/.env-example` to `./server/.env`

and file `./overlay/srv/.env-example` to `./overlay/srv/.env`

and edit these files for config app

you can find clientID and secret when making application on
https://dev.twitch.tv/console

## launch

launch server `cd ./server && yarn install && yarn server`

return main folder `cd ..`

and launch overlay `cd ./overlay && yarn install && yarn overlay`
## create command (wip)

in `./server/listeners.ts` you can add listeners command 