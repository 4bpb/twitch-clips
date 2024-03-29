import { exec } from 'child_process';
import * as fs from 'fs';

let folders = fs.readdirSync('./videos')


folders.forEach(element => {
    if(element != '.DS_Store'){
        let videos = fs.readdirSync('./videos/'+element)

        fs.writeFileSync('./videos/'+element+'/list.txt','')
        
        try {
            fs.rmSync('./videos/'+element+'/combined.mp4')
        } catch (error) {
            //console.log(error)
        }

        let list = ''
        videos.forEach(video => {
            if(video != 'list.txt' && video != '.DS_Store' && video != 'combined.mp4' && video.split('.')[1] != 'ts'){
                fs.appendFileSync('./videos/'+element+'/list.txt',('file '+video+'\n'))


                list += `file ${video}.ts`
                list += "\n"




                exec('ffmpeg -i ./videos/'+element+'/'+video+' -c copy -bsf:v h264_mp4toannexb -f mpegts ./videos/'+element+'/'+video+'.ts', {maxBuffer: 1024 * 100000},(error, stdout, stderr) => {
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

        var writeStream = fs.createWriteStream('./videos/'+element+'/list.txt')

        writeStream.write(list)

        writeStream.end()
//${'./videos/'+element+'/list.txt'}

        exec('ffmpeg -f concat -safe 0 -i ./videos/'+element+'/list.txt'+' -c copy ./videos/'+element+'/'+element+'_OUTPUT.mp4', {maxBuffer: 1024 * 100000},(error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            else{
                console.log("Videos are Successfully Merged for "+element)
        }
            
        })
    }
});