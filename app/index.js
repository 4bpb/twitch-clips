import {getClips,downloadClips,main,convertClips,combineClips} from './tools.js';
import fetch from 'node-fetch';
import * as fs from 'fs';


let game_list = ['Rocket League']
let period = 'LAST_WEEK'
let limit = 20

main(game_list).then((data) => {
    let file = data
    getClips('Rocket League',period,limit).then((data) => {
        let counter = 0
        data.forEach(async element => {
            
            let url = element.node.url
            let v_t = element.node.durationSeconds
            //video_time = video_time + v_t
            let id = element.node.slug
            
            await downloadClips(id,file).then((data) => {
                //console.log(data)
                counter++
                if(counter == limit){
                    convertClips(file).then(async (data) => {
                        await combineClips(file).then((data) => {
                            console.log(data)
                        })
                    })
                }
            })
            
        });
    })
})

