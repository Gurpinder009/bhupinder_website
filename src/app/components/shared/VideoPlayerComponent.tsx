import React from 'react'
import '@videojs/react/video/skin.css';
import { VideoPlayer, VideoSkin } from '@videojs/react/video';
import { HlsJsVideo } from '@videojs/react/media/hlsjs-video';



export default function VideoPlayerComponent({ videoSrc }: { videoSrc: string }) {
    return (
        <VideoPlayer>
            <VideoSkin style={{ width: '100%', aspectRatio: '16 / 9' }}>
                <HlsJsVideo src={videoSrc} playsInline />
            </VideoSkin>
        </VideoPlayer>
    )
}
