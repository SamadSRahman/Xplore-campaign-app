"use-client";

import React, { useEffect, useRef } from "react";
import "./styles.css";
import Head from "next/head";

export default function RedirectionPage({ link, metaData, isSocial }) {
  const anchorRef = useRef();

  useEffect(() => {
    if (anchorRef.current) {
      // anchorRef.current.click();
    }
  }, [link, anchorRef]);

  return (
    <>
      <Head>
        <meta
          name="apple-itunes-app"
          content="app-clip-bundle-id=com.xircular.XplorePromote.Clip, app-clip-display=card"
        />
        <link
          rel="canonical"
          href="https://appclip.apple.com/id?p=com.xircular.XplorePromote.Clip"
        />
      </Head>
      <main>
        <div className="container">
          <div className="content-section">
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
          </div>
        </div>
      </main>
    </>
  );
}
