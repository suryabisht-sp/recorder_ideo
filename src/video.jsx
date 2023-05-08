import { useEffect, useRef, useState } from "react"

import React from "react";


const mimeType = "video/webm";


const VideoRecorder = () => {
    const [flipV, setFlipV] = useState(false)
     const [permission, setPermission] = useState(false);
   const mediaRecorder = useRef(null);
const liveVideoFeed = useRef(null);
const [recordingStatus, setRecordingStatus] = useState("inactive");
const [stream, setStream] = useState(null);
const [videoChunks, setVideoChunks] = useState([]);
const [recordedVideo, setRecordedVideo] = useState(null);

    const flip = () => {
        if (flipV == false) {
            setFlipV(true);
        } else {
            setFlipV(false);
        }
        pausedRecordingVideo();
        if (recordingStatus === "recording"|| recordingStatus === "paused") {
            setRecordingStatus("inactive")
            setTimeout(() => {
            resumeRecordingVideo()
         }, 1000);
        }
    };  

    useEffect(() => {
        getMicrophonePermission()
    },[flipV])


    var constraintsVideo = { audio: false, video: { facingMode: (flipV) ? "user" : "environment" } };
    var constraintsAudio = { audio: true };
       
      const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia(constraintsAudio);
                 const videoStream = await navigator.mediaDevices.getUserMedia(constraintsVideo);
                   setPermission(true);
                 const combinedStream = new MediaStream([
                ...videoStream.getVideoTracks(),
                ...audioStream.getAudioTracks(),
            ]);
                setStream(combinedStream);
                document.getElementById("vidBox").srcObject = videoStream
               } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    const startRecordingVideo = () => {            
    setRecordingStatus("recording");
    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    let localVideoChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
        if (typeof event.data === "undefined") return;
        if (event.data.size === 0) return;
        localVideoChunks.push(event.data);
    };
        setVideoChunks(localVideoChunks);
    };
    
    const stopRecording = () => {
    setPermission(false);
    setRecordingStatus("inactive");
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
        const videoBlob = new Blob(videoChunks, { type: mimeType });
        const videoUrl = URL.createObjectURL(videoBlob);
        setRecordedVideo(videoUrl);
        setVideoChunks([]);
    };
};

    const pausedRecordingVideo=() => {
        setRecordingStatus("paused");
        mediaRecorder.current.pause();
        
    }
    
    const resumeRecordingVideo = () => {
        setRecordingStatus("recording");
        mediaRecorder.current.resume();
    }
    
    return (
        <div>
            <video autoPlay id="vidBox" style={{ width: "250px", height: "250px", border: "1px solid #fff" }}> </video>
            <video autoPlay controls src={recordedVideo}></video>
            {!permission ? (
                <button onClick={() => { getMicrophonePermission() }} type="button">
                            Get Microphone
                        </button>
                    ): null}
            {permission ? (
                <div>
                        <button type="button" onClick={() => { startRecordingVideo() }}>
                            Record
                </button>
                 <button type="button" onClick={() => { pausedRecordingVideo() }}>
                            Paused
                    </button>
                      <button type="button" onClick={() => { resumeRecordingVideo() }}>
                            Resume
                    </button>
                    </div>
                    ): null}
            <button value="false" id="flipV" onClick={() => {
                flip()
            }}>
                Rotate
            </button>
            <video id="gum" autoPlay muted></video>
            <video id="recorded" autoPlay loop></video>
            <div>           
                <button id="stop" onClick={() => { stopRecording() }} >Stop Recording</button>
                {/* <button id="play" onClick={() => { play() }} >Play</button> */}

                <button id="download" >Download</button>
            </div>  </div>
)




}




export default VideoRecorder