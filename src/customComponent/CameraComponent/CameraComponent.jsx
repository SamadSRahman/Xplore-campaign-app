import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from './CameraComponent.module.css';
import CampaignPreview from "../../pages/CampaignPreview/CampaignPreview";
import useEndUser from "../../lib/utils/useEndUser";

const CameraComponent = () => {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraScreen, setIsCameraScreen] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();
  const {campaignId, screen, shortId} = useParams();
  const {endUserUpload} = useEndUser()

  useEffect(() => {
    const openCamera = async () => {
      localStorage.removeItem("userUploadUrl")
      if (!isCameraActive) return;

      try {
        const constraints = {
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            facingMode: "environment" // Prefer back camera on mobile devices
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Wait for metadata to load
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
          };
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
        alert("Unable to access camera. Please check permissions.");
      }
    };

    openCamera();

    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isCameraActive]);

  useEffect(()=>{
    if(screen!=="camera_screen"){
        setIsCameraScreen(false)
    }
  },[screen])

  const handleCapture = async () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Stop camera tracks
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
    }

    // Ensure video is ready and has dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error("Video dimensions are not set");
      return;
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    
    // Clear the canvas first
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the video frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Capture and set image
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9); // Use JPEG with 90% quality
    setCapturedImage(imageDataUrl);
    localStorage.setItem("imageData", imageDataUrl)
    setIsCameraActive(false);

    const base64toBlob = (base64Data) => {
      const byteCharacters = atob(base64Data.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: 'image/jpeg' });
    };
    
    // Convert Blob to File
    const base64toFile = (base64Data, filename) => {
      const blob = base64toBlob(base64Data);
      return new File([blob], filename, { type: 'image/jpeg' });
    };
    
    const imageFile = base64toFile(imageDataUrl, `campaign_image_${Date.now()}.jpg`);

   await endUserUpload(imageFile)
   if(window.location.origin==="https://xplr.live"){
    navigate(`/${shortId}/contact_us_screen`);
   }
   else
    navigate(`/campaign/${campaignId}/contact_us_screen`);
  };

  // const handleRetake = () => {
  //   setCapturedImage(null);
  //   setIsCameraActive(true);
  // };

  // const handleContinue = () => {
  //   // Navigate to contact us page
  //   navigate(`/campaign/${campaignId}/contact_us_screen`);
  // };

  if(!isCameraScreen){
    return(<CampaignPreview/>)
  }

  return (
    <div className={styles.container}>
      {isCameraActive ? (
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={styles.videoPlayer}
          />
          <button 
            onClick={handleCapture} 
            className={styles.captureButton}
          >
            Capture
          </button>
        </div>
      ) : (
        <div>
          {/* {capturedImage && (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className={styles.imagePreview}
            />
          )} */}
          {/* <div className={styles.buttonContainer}>
            <button 
              onClick={handleRetake} 
              className={styles.retakeButton}
            >
              Retake
            </button>
            <button 
              onClick={handleContinue} 
              className={styles.continueButton}
            >
              Continue
            </button>
          </div> */}
        </div>
      )}
      
      {/* Hidden canvas for capturing images */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CameraComponent;