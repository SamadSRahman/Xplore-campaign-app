"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from './CameraComponent.module.css';
import Preview from "@/components/Preview/Preview";
import useEndUser from "@/hooks/useEndUser";

const CameraComponent = ({ params }) => {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraScreen, setIsCameraScreen] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const router = useRouter();
  const { campaignId, screen, shortId } = params;
  const { endUserUpload } = useEndUser();

  useEffect(() => {
    const openCamera = async () => {
      localStorage.removeItem("userUploadUrl");
      if (!isCameraActive || typeof window === 'undefined') return;

      try {
        const constraints = {
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            facingMode: "environment"
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
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

  useEffect(() => {
    if (screen !== "camera_screen") {
      setIsCameraScreen(false);
    }
  }, [screen]);

  const handleCapture = async () => {
    console.log("triggered");
    
    if (!canvasRef.current || !videoRef.current) return;
    console.log("line 69");
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error("Video dimensions are not set");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(imageDataUrl);
    localStorage.setItem("imageData", imageDataUrl);
    console.log("imageData", imageDataUrl);

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
    
    const base64toFile = (base64Data, filename) => {
      const blob = base64toBlob(base64Data);
      return new File([blob], filename, { type: 'image/jpeg' });
    };
    
    const imageFile = base64toFile(imageDataUrl, `campaign_image_${Date.now()}.jpg`);

    await endUserUpload(imageFile);
    if (typeof window !== 'undefined' && window.location.origin === "https://xplr.live") {
      router.push(`/${campaignId}/contact_us_screen`);
    } 
  };

  if (!isCameraScreen) {
    return <Preview />;
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
          {/* Content when camera is inactive */}
        </div>
      )}
      {/* Canvas is always rendered but hidden */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CameraComponent;