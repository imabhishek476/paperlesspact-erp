import React, { useEffect, useRef, useState } from 'react'
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";

const AudioComponent = ({setAudioBlob})=>{

  const recorderControls = useVoiceVisualizer();
  const {
      // ... (Extracted controls and states, if necessary)
      recordedBlob,
      error,
      audioRef,
      audioData,
      saveAudioFile,
      audioSrc,
      bufferFromRecordedBlob,
  } = recorderControls;

  // Get the recorded audio blob
  useEffect(() => {
      if (!recordedBlob) return;
      console.log(bufferFromRecordedBlob)
      console.log(audioSrc)
      console.log(audioData)
      console.log(recordedBlob);
      console.log(audioRef)
      // saveAudioFile()
  }, [recordedBlob, error]);

  // Get the error when it occurs
  useEffect(() => {
      if (!error) return;

      console.error(error);
  }, [error]);

    return (
      <div className='min-w-[200px]'>
        <VoiceVisualizer isDownloadAudioButtonShown={true} ref={audioRef} controls={recorderControls} />
      </div>
    )
  };

export default AudioComponent