import fetch from 'node-fetch';
import * as fs from 'fs';
import { exec } from 'child_process';


export function main(game_list){
    const main = new Promise((resolve, reject) => {
        try {
            game_list.forEach(element => {
                let date_ob = new Date();
                let date = ("0" + date_ob.getDate()).slice(-2);

                // current month
                let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

                // current year
                let year = date_ob.getFullYear();

                let file = year + "_" + month + "_" + date  + "_" + element
                if(file.includes(' ')){
                    file = file.replace(' ', '_')
                }

                try {
                    if (!fs.existsSync('./videos/'+file)) {
                    fs.mkdirSync('./videos/'+file,{ recursive: true });
                    
                    }
                } catch (err) {
                    console.error(err);
                }
                resolve(file)
            });
            
        } catch (error) {
            reject(error)
        }
      })
      return main
}
export function getClips(game,period,limit){
    const getClips = new Promise(async (resolve, reject) => {

        try {
            let response = await fetch('https://gql.twitch.tv/gql', {
                method: 'POST',
                headers: {
                    'Host': 'gql.twitch.tv',
                    'Accept': 'application/json',
                    'Accept-Charset': 'utf-8',
                    'Client-Id': '85lcqzxpb9bqu9z6ga1ol55du',
                    'Accept-Language': 'en-us',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([
                    {
                        'variables': {
                            'input': {
                                'period': period
                            },
                            'identifier': null,
                            'cursor': null,
                            'limit': limit,
                            'gameName': game
                        },
                        'query': 'query TopGameClips($gameName: String, $identifier: ID, $input: GameClipsInput, $limit: Int, $cursor: Cursor) {\n  game(name: $gameName, id: $identifier) {\n    __typename\n    clips(first: $limit, after: $cursor, criteria: $input) {\n      __typename\n      pageInfo {\n        __typename\n        hasNextPage\n      }\n      edges {\n        __typename\n        cursor\n        node {\n          __typename\n          ...ClipFragment\n        }\n      }\n    }\n  }\n}\nfragment ClipFragment on Clip {\n  __typename\n  id\n  slug\n  creationState\n  game {\n    __typename\n    ...GameFragment\n  }\n  clipTitle: title\n  broadcaster {\n    __typename\n    ...UserFragment\n    stream {\n      __typename\n      id\n    }\n  }\n  curator {\n    __typename\n    ...UserFragment\n  }\n  video {\n    __typename\n    ...VideoFragment\n  }\n  videoOffsetSeconds\n  url\n  creationState\n  clipViewCount: viewCount\n  durationSeconds\n  createdAt\n  isPublished\n  previewImage: thumbnailURL(width: 480, height: 272)\n  tinyClipThumbnail: thumbnailURL(width: 86, height: 45)\n  smallClipThumbnail: thumbnailURL(width: 260, height: 147)\n  mediumClipThumbnail: thumbnailURL(width: 480, height: 272)\n  videoQualities {\n    __typename\n    ...ClipVideoQualityFragment\n  }\n}\nfragment GameFragment on Game {\n  __typename\n  ...GameIdentityFragment\n  smallBoxArtURL: boxArtURL(width: 54, height: 72)\n  mediumBoxArtURL: boxArtURL(width: 141, height: 188)\n  largeBoxArtURL: boxArtURL(width: 285, height: 380)\n  smallCoverURL: coverURL(width: 600, height: 90)\n  mediumCoverURL: coverURL(width: 1200, height: 180)\n  largeCoverURL: coverURL(width: 1800, height: 270)\n  logoURL\n  giantBombID\n  followersCount\n  viewersCount\n  broadcastersCount\n  gameTags: tags(tagType: CONTENT) {\n    __typename\n    id\n    tagName\n    localizedName\n  }\n}\nfragment GameIdentityFragment on Game {\n  __typename\n  id\n  gameName: name\n  gameDisplayName: displayName\n}\nfragment UserFragment on User {\n  __typename\n  ...IdentityFragment\n  smallProfileImageURL: profileImageURL(width: 300)\n  mediumProfileImageURL: profileImageURL(width: 600)\n  bannerImageURL\n  followers(first: 1) {\n    __typename\n    totalCount\n  }\n  lastBroadcast {\n    __typename\n    title\n    game {\n      __typename\n      ...GameIdentityFragment\n    }\n    startedAt\n  }\n  profileViewCount\n  bio: description\n  userCreatedAt: createdAt\n  updatedAt\n  roles {\n    __typename\n    ...UserRolesFragment\n  }\n  broadcastSettings {\n    __typename\n    isMature\n    language\n  }\n  profileURL\n  primaryColorHex\n}\nfragment IdentityFragment on User {\n  __typename\n  userID: id\n  name: login\n  displayName\n}\nfragment UserRolesFragment on UserRoles {\n  __typename\n  isAffiliate\n  isPartner\n  isStaff\n}\nfragment VideoFragment on Video {\n  __typename\n  id\n  lengthSeconds\n  tinyVideoThumbnail: previewThumbnailURL(width: 86, height: 45)\n  smallVideoThumbnail: previewThumbnailURL(width: 260, height: 147)\n  mediumVideoThumbnail: previewThumbnailURL(width: 480, height: 272)\n  largeVideoThumbnail: previewThumbnailURL(width: 640, height: 362)\n  recordedAt\n  publishedAt\n  viewCount\n  owner {\n    __typename\n    ...UserFragment\n  }\n  game {\n    __typename\n    ...GameFragment\n  }\n  title\n  broadcastType\n  status\n  self {\n    __typename\n    isRestricted\n  }\n  contentTags {\n    __typename\n    ...TagFragment\n  }\n  muteInfo {\n    __typename\n    mutedSegmentConnection {\n      __typename\n      nodes {\n        __typename\n        duration\n        offset\n      }\n    }\n  }\n}\nfragment TagFragment on Tag {\n  __typename\n  id\n  localizedName\n  tagName\n  localizedDescription\n  isLanguageTag\n  isAutomated\n  scope\n}\nfragment ClipVideoQualityFragment on ClipVideoQuality {\n  __typename\n  quality\n  sourceURL\n}'
                    }
                ])
            })

            let data = await response.json()

            let clips = data[0].data.game.clips.edges
            
            console.log(getDateTime()+' '+period+' '+game+' Clips (Top '+limit+')')
        
            let video_time = 0
        
            // clips.forEach(element => {
            //     let url = element.node.url
            //     let v_t = element.node.durationSeconds
            //     video_time = video_time + v_t
            //     let id = element.node.slug
            //     console.log(getDateTime()+'  '+id)
            //     //params(id,file,game)
        
            // });

            resolve(clips)
        } catch (error) {
            reject(new Error('Error in getClips ' + error))
        }

        
      })


      return getClips
}
export function downloadClips(id,file){
    const downloadClips = new Promise(async (resolve, reject) => {
        try {
            let tokens = await fetch('https://gql.twitch.tv/gql', {
            method: 'POST',
            headers: {
                'Host': 'gql.twitch.tv',
                'User-Agent': 'Twitch 221032018411199948 (iPhone; iOS 15.4.1; en_US)',
                'X-App-Version': '12.8',
                'Accept-Language': 'en-us',
                'X-Apple-Os-Version': '15.4.1',
                'Accept-Charset': 'utf-8',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Apple-Model': 'iPhone 12',
                'Authorization': 'OAuth kqc0p0c43hq20zi132vje4ws0rbim7'
            },
            body: JSON.stringify({
                'variables': {
                    'slug': id,
                    'tokenParams': {
                        'playerType': 'clips',
                        'platform': 'web'
                    }
                },
                'query': 'query ClipAccessToken($slug: ID!, $tokenParams: PlaybackAccessTokenParams!) {\n  clip(slug: $slug) {\n    __typename\n    playbackAccessToken(params: $tokenParams) {\n      __typename\n      ...PlaybackAccessTokenFragment\n    }\n  }\n}\nfragment PlaybackAccessTokenFragment on PlaybackAccessToken {\n  __typename\n  signature\n  value\n}'
            })
        })
        let data = await tokens.json()

        let sig = data.data.clip.playbackAccessToken.signature
        let token = data.data.clip.playbackAccessToken.value
    
        let token_split = token.split('"clip_uri":"')
        let another_split = token_split[1].split('","')
        
    
        let video_url = another_split[0]


        let video = await fetch(video_url+'?'+ new URLSearchParams({
            token: token,
            sig: sig
        }), {
            headers: {
                'Host': 'production.assets.clips.twitchcdn.net',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'User-Agent': 'Twitch/221032018411199948 CFNetwork/1331.0.7 Darwin/21.4.0'
            }
        });
    
    
        await new Promise((resolve, reject) => {
            const fileStream = fs.createWriteStream('./videos/'+file+'/'+id+'.mp4');
            video.body.pipe(fileStream);
            video.body.on("error", (err) => {
              reject(err);
            });
            fileStream.on("finish", function() {
                console.log(getDateTime()+'  '+'Finished Downloading '+' ID '+id)
              resolve();
            });
          })
          resolve();
        } catch (error) {
            reject(new Error('Error in downloadClips ' + error))
        }

        
      })
      return downloadClips
}
export function convertClips(folder){
    const convertClips = new Promise(async (resolve, reject) => {
        try {
            let list = ''
            let videos = fs.readdirSync('./videos/'+folder)
            videos.forEach(video => {
                if(video != 'list.txt' && video != '.DS_Store' && video != 'combined.mp4' && video.split('.')[1] != 'ts'){
                    fs.appendFileSync('./videos/'+folder+'/list.txt',('file '+video+'\n'))
    
    
                    list += `file ${video}.ts`
                    list += "\n"
    
    
    
    
                    exec('ffmpeg -i ./videos/'+folder+'/'+video+' -c copy -bsf:v h264_mp4toannexb -f mpegts ./videos/'+folder+'/'+video+'.ts', {maxBuffer: 1024 * 100000},(error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                            return;
                        }
                        else{
                            console.log("Converted "+video)
                    }
                        
                    })
    
    
                }
            });
            resolve('Done');
            var writeStream = fs.createWriteStream('./videos/'+folder+'/list.txt');

            writeStream.write(list);
    
            writeStream.end();
        } catch (error) {
            reject(new Error('Error in convertClips ' + error))
        }

        
      })
      return convertClips
}
export function combineClips(folder){
    const combineClips = new Promise(async (resolve, reject) => {
        try {
            exec('ffmpeg -f concat -safe 0 -i ./videos/'+folder+'/list.txt'+' -c copy ./videos/'+folder+'/'+folder+'_OUTPUT.ts', {maxBuffer: 1024 * 100000},(error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                else{
                    resolve("Videos are Successfully Merged for "+folder)
            }
                
            })
        } catch (error) {
            reject(new Error('Error in combineClips ' + error))
        }


      })
      return combineClips
}








function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}