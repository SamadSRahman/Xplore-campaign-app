"use-client";

import React, { useEffect, useRef, useState } from "react";
import "./styles.css";

export default function RedirectionPage({ link, metaData, isSocial }) {
  const anchorRef = useRef();

  useEffect(() => {
    if (anchorRef.current) {
      // anchorRef.current.click();
    }
  }, [link, anchorRef]);
  function handlePlaceHolderClick() {
    if (anchorRef.current) {
      anchorRef.current.click();
    }
  }
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  return (
    <>
      <main>
        <div className="container">
          {/* <img src="https://res.cloudinary.com/dljvlt6tu/image/upload/v1739165845/curved-red-arrow-png_ucehfm.png" alt="" className="arrow-image" /> */}
          {/* <div className="content-section">
            <div className="card">
              <div className="welcome-header">
                <h1 className="welcome-title">Welcome</h1>
                <h2 className="welcome-subtitle">to</h2>
              </div>
              <div className="content-container">
                <h3 className="app-title">{metaData?.title}</h3>
                {metaData?.description && (
                  <p className="app-description">{metaData?.description}</p>
                )}

                {metaData?.image && (
                  <div className="image-container">
                    <img
                      src={metaData.image}
                      alt={metaData?.title || "Welcome"}
                      className="app-image"
                    />
                  </div>
                )}
                <a
                  ref={anchorRef}
                  href={link}
                  target={isSocial ? "_blank" : ""}
                  className="continue-button"
                >
                  Continue
                </a>
              </div>
            </div>
          </div> */}
          <a
            ref={anchorRef}
            href={link}
            target={isSocial ? "_blank" : ""}
            className="continue-button"
          >
            Continue
          </a>
         
            <img
              src={
                "https://xplore.objectstore.e2enetworks.net/1739431486249-ef06a1444d3411be.gif"
              }
              className="spinner"
              alt=""
              hidden={isImageLoaded}
            />
         
            <div hidden={!isImageLoaded} onClick={handlePlaceHolderClick} className="campaign-card">
              <img
                src={metaData.image}
                alt=""
                onLoad={() => setIsImageLoaded(true)}
              />
              <div className="footer-section">
                <span>Tap to open the experience</span>
                <img
                  src={
                    "https://xplore.objectstore.e2enetworks.net/1739430199366-1250e107bc85cff3.png"
                  }
                  alt=""
                />
              </div>
            </div>
       
        </div>
      </main>
    </>
  );
}
