import * as express from 'express';
import * as fs from 'fs';
import * as ytdl from 'ytdl-core';
const path = require('path');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
import * as ffmpeg from 'fluent-ffmpeg';
ffmpeg.setFfmpegPath(ffmpegPath);

const router = express.Router();

const DOMAIN_NAME = 'soloroom.ykhorizon.dev'
const rootDir = path.dirname(path.dirname(path.dirname(__dirname)));
const downloadDir ='apps/backend/download';

function downloadVideo({ name, url }) {
  return new Promise((resovle, reject) => {
    const output = path.resolve(rootDir, downloadDir , name);
    const video = ytdl(url);
    video.pipe(fs.createWriteStream(output));
    video.on('end', () => {
      resovle();
    });
    video.on('error', (error) => {
      reject(error)
    });
  })
}

function fetchYoutubeVideoInfo(id) {
  return new Promise((resolve, reject) => {
    ytdl.getInfo(id).then(info => {
      resolve(info);
    }).catch(error => {
      reject(error);
    })
  })
}

function cropVideoWithRange({ sourcePath, destPath, start, duration}) {
  ffmpeg(sourcePath)
    .setStartTime(start)
    .setDuration(duration)
    .output(destPath)
    .on('end', function(err) {
      if(!err) {
        console.log('conversion is Done')
      }
    })
    .on('error', function(err, stdout, stderr) {
      console.error('error: ', err.error, err, stderr)
    }).run();
}

function convertSecondToTimeFormat(second) {
  return new Date(+second * 1000).toISOString().substr(11, 8)
}

function parseVideoIdFromURL(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}


router.post('/v1/api/solo', (req, res) => {
  const { source_url, range } = req.body;
  const { start, end } = range;
  const duration = parseInt(end, 10) - parseInt(start, 10);

  Promise.all([
    fetchYoutubeVideoInfo(parseVideoIdFromURL(source_url)),
    downloadVideo({
      name: 'video.mp4',
      url: source_url
    }) ])
    .then((values) => {
      const videoLengthSeconds = values[0].videoDetails.lengthSeconds;
      if (end >= videoLengthSeconds || start < 0) {
        console.warn('error range');
        return;
      }
      cropVideoWithRange({
        sourcePath:'./apps/backend/download/video.mp4',
        start: convertSecondToTimeFormat(start),
        duration,
        destPath: path.resolve(rootDir, downloadDir, 'cropped_video.mp4')
      });
    });

  // id, name, user, audio_path, view_times, created_time
  // video_song, video_id, video_url, origninal_artist,
  // composer/songwriter, performance_artist, arrangement_artist
  // license, license_owner


  // [user] =(download)(upload)=> [solo audio] =(transcribe)=> [sheetmusic]
  // [user/transcriber] [cover_artist] [artist] [license_owner]

  const file = 'aaaa.mp4'
  const url = `http://${DOMAIN_NAME}/solo/${file}`;
  res.send({
    id: 1,
    name: 'youtube_video_title',
    url
  });
});


export default router;
