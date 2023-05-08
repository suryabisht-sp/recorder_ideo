import { useState } from "react"

import React from "react";
const VideoRecorder = () => {
    const [flipV, setFlipV] = useState(false)
 var recordedBlobs;
    var gumVideo
     const flip = () => {
        if (flipV == false) {
            setFlipV(true);
        } else {
            setFlipV(false);
        }
        startVideo();
        console.log("flip", flipV)
    };  

 const handleSuccess = (stream) => {
        let chunks = [];
        window.stream = stream;
        if (window.URL) {
            const medRec = new MediaRecorder(stream);
            window.mediaStream = stream;
            window.mediaRecorder = medRec;
            medRec.start();
            medRec.ondataavailable = (e) => {
                chunks.push(e.data);
            };
            document.getElementById("gum").srcObject = stream
        } else {
            gumVideo = stream;
        }
    }

    function handleError(error) {
        console.log('navigator.getUserMedia error: ', error);
    }

    var constraints = { audio: true, video: { facingMode: (flipV) ? "user" : "environment" } };
    const startVideo = () => {
         console.log("contrait", constraints)
        navigator.mediaDevices.getUserMedia(constraints).
            then(handleSuccess).catch(handleError);
    }

    return (
     <div>
            <button value="false" id="flipV" onClick={() => {
                flip()
            }}>
                Rotate
            </button>
            <video id="gum" autoPlay muted></video>
            <video id="recorded" autoPlay loop></video>
            <div>
                {/* <button id="record" onClick={() => { startRecording() }} >Start Recording</button>
                <button id="stop" onClick={() => { stopRecording() }} >Stop Recording</button>
                <button id="play" onClick={() => { play() }} >Play</button> */}

                <button id="download" >Download</button>
            </div>  </div>
)




}




export default VideoRecorder