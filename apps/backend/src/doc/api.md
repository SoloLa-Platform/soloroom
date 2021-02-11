# Backend service API

## Create Solo
Create a trimmed solo audio from youtube downloaded video

### Example
```bash
curl -X POST -H "Content-Type: application/json; charset=utf-8" 
--data="{ config: 
{ yt_url='https://www.youtube.com/watch?v=Tl8CaZVMQzw', 
  interval: [{ begin: 30, end:60 }]
}"
"https://soloroom/v1/api/solo"
```

### Success
Successfully create a solo

HTTP Status 200
```JSON
{
  id: '1',
  name: 'youtube_video_title',
  path: 'http://localhost/[username]/solo/[hash].mp3'
}
```

### Error: youtube video fail to download 

HTTP Response status: 412 Precondition Failed
```JSON
{
   message: 'youtube video fail to download'
}
```

### Error: The interval exceeds song begin or end
HTTP Response status: 500 Internal Server Error
{
  message: 'The interval exceeds song begin or end'
}

