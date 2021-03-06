import React, { useEffect } from "react";
import { Node_API_URL, Python_API_URL } from "../Constants";
import axios from "axios";
import Webcam from "react-webcam";
import CameraOff from "../video-not-working.png";
import SignsBanner from "../signs-banner.jpeg";
import "./index.css";
const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  const audioElementRef = React.useRef(null);
  const [imageSrc, setImageSrc] = React.useState(null);
  const [toggleCam, setToggleCam] = React.useState(true);
  const [result, setResult] = React.useState("");

  // useEffect(() => {
  //   let clear;
  //   if (toggleCam) {
  //     clear = setInterval(capture, 100);
  //   }

  //   return () => {
  //     clearInterval(clear);
  //   };
  // });

  const speak = (e) => {
    const audio = audioElementRef.current;
    audio.setAttribute("type", "audio/ogg;codecs=opus");
    audio.setAttribute(
      "src",
      `${Node_API_URL}api/v1/synthesize?text=${result}&voice=en-US_AllisonV3Voice&download=true&accept=audio%2Fmp3`
    );
  };
  function predict(image) {
    const data = { image_txt: image };
    axios
      .post(Node_API_URL + "api/v1/predict", data)
      // .post(Python_API_URL + "predict", { image_txt: image })
      .then((response) => {
        response.data =
          document.getElementById("result").value + " " + response.data;
        response.data.trim();
        setResult(response.data);
      })
      .catch((e) => {
        console.log("error", e);
      });
  }

  const capture = React.useCallback(() => {
    const image = webcamRef.current.getScreenshot();
    console.log(image);
    setImageSrc(image);
    predict(image);
  }, [webcamRef]);

  return (
    <div>
      <h1>SIGN LANGUAGE INTERPRETER</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="dataCard">
            <div className="row">
              <div className="col-md-6">
                {toggleCam && (
                  <button
                    onClick={capture}
                    className="webcam-controls"
                    autoFocus
                  >
                    <span className="fa-stack fa-lg icons">
                      <i
                        className="fa fa-camera fa-2x icons"
                        title="Capture Sign"
                      ></i>
                    </span>{" "}
                    Capture Sign
                  </button>
                )}
              </div>

              <div className="col-md-6">
                {toggleCam ? (
                  <button
                    onClick={() => {
                      setToggleCam(!toggleCam);
                    }}
                    className="webcam-controls"
                  >
                    <span class="fa-stack fa-lg icons">
                      <i className="fa fa-video-camera fa-stack-1x"></i>
                      <i
                        class="fa fa-ban fa-stack-2x"
                        title="Turn off camera"
                      ></i>
                    </span>{" "}
                    Turn off camera
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setToggleCam(!toggleCam);
                    }}
                    className="webcam-controls"
                  >
                    <i
                      className="fa fa-video-camera fa-2x icons"
                      title="Turn on camera"
                      onClick={() => {
                        setToggleCam(!toggleCam);
                      }}
                    ></i>{" "}
                    Turn on camera
                  </button>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <textarea
                  type="text"
                  value={result}
                  name="result"
                  id="result"
                  onChange={(e) => {
                    setResult(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                {result && (
                  <button className="webcam-controls" onClick={speak}>
                    <i class="fa fa-volume-up fa-2x icons"></i>
                    Speak
                  </button>
                )}
              </div>
              <div className="col-md-6">
                {result && (
                  <audio
                    ref={audioElementRef}
                    autoPlay
                    id="audio"
                    className={`audio`}
                    controls="controls"
                  >
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="dataCard">
            {toggleCam ? (
              <div className="col">
                <Webcam
                  audio={false}
                  height={338}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={600}
                  forceScreenshotSourceSize={true}
                  videoConstraints={videoConstraints}
                  mirrored={true}
                />
                <div className="camera-border"></div>
              </div>
            ) : (
              <img src={CameraOff} />
            )}
          </div>
        </div>
      </div>
      <div className="signs-banner-div">
        <img src={SignsBanner} />
      </div>
    </div>
  );
};

export default WebcamCapture;
