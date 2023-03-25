# Twitch framework for chatbot and overlay

Tested on windows only
## requirement

require nodejs 18 or above  

Obs 5.0.1 plugins is installed by default in OBS 29
https://github.com/obsproject/obs-websocket/releases

## Config

copy file `./server/.env-example` to `./server/.env`

and file `./overlay/srv/.env-example` to `./overlay/srv/.env`

and edit these files for config app

* twitch_broadcaster is needed for redemption listener can be found information https://dev.twitch.tv/console
  * TWITCH_BROADCASTER_SECRET= 
  * TWITCH_BROADCASTER_CLIENT=
  * TWITCH_BROADCASTER_ID=
* Needed if you want to use other account for bot, put same value of Twitch Broadcaster if you don't have it 
  * TWITCH_BOT_SECRET=
  * TWITCH_BOT_CLIENT=
  * TWITCH_BOT_ID=
* TWITCH_CHANNEL= the channel name to listen
* You can found obs settings in tools > websocket params
  * OBS_SOCKET_PORT= 
  * OBS_SOCKET_PASSWORD=
* if you change these value don't forget to whitelist app in twitch and spotify
  * SERVER_PORT=8085
  * SERVER_ADDRESS=http://localhost:8085

* STORAGE_FOLDER=storage
* SOUNDS_PATH=../overlay/public/sounds
* You can find at spotify https://developer.spotify.com/dashboard/login
  * SPOTIFY_CLIENT=
  * SPOTIFY_SECRET=

you can find clientID and secret when making application on
https://dev.twitch.tv/console

add uri redirect whitelist http://localhost:8085/twurple

for spotify clientId and secret by making app on https://developer.spotify.com/dashboard/login

add uri redirect whitelist http://localhost:8085/spotify
## Install
```
cd ./server && yarn install
// return main folder 
cd ..
cd ./overlay && yarn install
```

## Create token before launch

open you navigator with your broadcaster twitch session and launch

`cd ./server && yarn broadcaster-create-token`

if you have bot account
open you navigator with your bot twitch session and launch

`cd ./server && yarn bot-create-token`

## launch

launch server `cd ./server && yarn server`

return main folder `cd ..`

and launch overlay `cd ./overlay && yarn overlay`

## create command (wip)

in `./server/listeners.ts` you can add or remove listeners command or rewards