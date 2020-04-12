import React, { useState, useEffect } from "react";
import Track from "./Track";

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function TrackUploader({ onTrackReady }) {
  const [audioData, setAudioData] = useState(null);
  const [cdgData, setCdgData] = useState(null);

  useEffect(() => {
    function onChange() {
      if (audioData && cdgData) {
        onTrackReady(new Track(audioData, cdgData));
      }
    }
    onChange();
  }, [audioData, cdgData, onTrackReady]);

  const onFilesUploaded = async (e) => {
    const { files } = e.target;
    for (var i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop().toLowerCase();
      const decoded = new Uint8Array(await readFileAsync(file));
      if (ext === "cdg") {
        setCdgData(decoded);
      } else if (ext === "mp3") {
        setAudioData(decoded);
      }
    }
  };

  const uploadInput = (
    <input type="file" accept=".mp3,.cdg" onChange={onFilesUploaded} multiple />
  );

  if (audioData && cdgData) {
    return <div>All set!</div>;
  } else if (cdgData && !audioData) {
    return (
      <div>
        {uploadInput}
        <p>Please add an audio file.</p>
      </div>
    );
  } else if (audioData && !cdgData) {
    return (
      <div>
        {uploadInput}
        <p>Please add a cdg file.</p>
      </div>
    );
  } else {
    return (
      <div>
        {uploadInput}
        <p>Please upload an MP3 and CDG file.</p>
      </div>
    );
  }
}

export default TrackUploader;