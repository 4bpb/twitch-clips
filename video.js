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
            if(video != 'list.txt' && video != '.DS_Store' && video != 'combined.mp4'){
                fs.appendFileSync('./videos/'+element+'/list.txt',('file '+video+'\n'))


                list += `file ${video}`
                list += "\n"




            
            }
        });

        var writeStream = fs.createWriteStream('./videos/'+element+'/list.txt')

        writeStream.write(list)

        writeStream.end()


        exec(`ffmpeg -hwaccel cuda -safe 0 -f concat -i  ${'./videos/'+element+'/list.txt'}  -c copy -copyinkf -vsync 1 -s 1920x1080 -sws_flags lanczos -c:v h264 ${'./videos/'+element+'/combined.mp4'}`, {maxBuffer: 1024 * 100000},(error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            else{
                console.log("videos are successfully merged")
        }
            
        })
    }
});