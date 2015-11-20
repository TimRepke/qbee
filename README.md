# qbee
A mopidy based multiuser frontend for shared playlists with voting.

# Configuration

In the /config folder copy all `*.sample` files and adapt the values as you want them. Following are a few 
hints on different external services you can use (and how to configure them).

## Soundcloud
based on https://github.com/mopidy/mopidy-soundcloud

1. You must register for a user account at http://www.soundcloud.com/
2. You need a SoundCloud authentication token for Mopidy from http://www.mopidy.com/authenticate
3. Add the authentication token to the mopidy.conf config file:

```
[soundcloud]
auth_token = 1-1111-1111111
explore_songs = 25 #optional
```

## Spotify
based on https://github.com/mopidy/mopidy-spotify

Before starting Mopidy, you must add your Spotify Premium username and password to your Mopidy configuration file:

```
[spotify]
username = alice
password = secret
```

There are more options available, please check the repository's readme.

## YouTube
based on https://github.com/mopidy/mopidy-youtube

No configuration needed. The only supported config value is `youtube/enabled` which can be set to false to disable the extension.

## Google Music
based on https://github.com/mopidy/mopidy-gmusic

There are are a number of options, please refer to the "Configuration" section of the repositories readme.

## Local Library
TODO

# Running the System

```bash
# running it the first time
$ docker-compose build

# starting the servers 
$ docker-compose up
```

When changes are made in some docker files, do a `docker-compose rm` and build again.