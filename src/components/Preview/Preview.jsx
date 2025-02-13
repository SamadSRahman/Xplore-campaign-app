"use client"; // Mark this as a client component

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// import CameraComponent from "../../customComponent/CameraComponent/CameraComponent";

import styles from "./Preview.module.css";
import { detectEnvironment, appClipURL, handleBtnClick } from "../../app/utils";
// import useAnalytics from "../../lib/utils/useAnalytics";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
;
import { uid } from "uid";
import DivkitRenderer from "../DivkitRenderer/DivkitRenderer";
import { blankBackgroundJSON } from "@/app/utils";
import RedirectionPage from "../RedirectionPage/RedirectionPage";
import Head from "next/head";

export default function Preview({ campaignId, layouts, campaignData }) {
  const params = useParams();
  const router = useRouter();
  //   const { postAnalyticData } = useAnalytics();
  const [layout, setLayout] = useState({ layoutJSON: blankBackgroundJSON });
  const [showRedirectionPage, setShowRedirectionPage] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");

  const [isLoadingPopup, setIsLoadingPopup] = useState(false);
  const enviroment = detectEnvironment();
  const [showPopup, setShowPopup] = useState(false);
  const [isCameraScreen, setIsCameraScreen] = useState(false);

  useEffect(() => {
    if (enviroment.deviceType === "mobile" && enviroment.isIOS) {
      setRedirectUrl(
        `${appClipURL}&shortId=${campaignId}&sourcename=${enviroment.platform}`
      );
      // setShowRedirectionPage(true);
    } else {
      //   getLayoutByShortId(campaignId);
    }
  }, [campaignId]);

  //   useEffect(() => {
  //     if (campaignId && !enviroment.isIOS) {
  //       postAnalyticData({
  //         campaignID: campaignId,
  //         source: enviroment.platform === "browser" ? "other" : enviroment.platform,
  //       });
  //     }
  //   }, [campaignId]);

  useEffect(() => {
    if (layout.name === "splash_screen") {
      console.log("Checking for initial screen");
      const initialLayout = layouts.find((ele) => ele.isInitial === true);
      if (initialLayout) {
        setTimeout(() => {
          router.push(`/${campaignId}/${initialLayout.name}`);
        }, 1000);
      } else {
        console.log("No initial screen found");
      }
    }
  }, [layout]);

  useEffect(() => {
    if (!layouts?.length) return;
    const screen = params.screen;

    if (screen === "landing_screen") {
      const userData = localStorage.getItem("userData");
      if (!userData) {
        const popupShownCampaigns = JSON.parse(
          sessionStorage.getItem("popupShownCampaigns") || "[]"
        );
        if (!popupShownCampaigns.includes(campaignId)) {
          setShowPopup(true);
          sessionStorage.setItem(
            "popupShownCampaigns",
            JSON.stringify([...popupShownCampaigns, campaignId])
          );
        }
      }
    } else if (screen === "camera_screen") {
      setIsCameraScreen(true);
    }

    if (screen === undefined || screen === "splash_screen") {
      const splashLayout = layouts.find((ele) => ele.name === "splash_screen");
      if (splashLayout) {
        setLayout(splashLayout);
      }
    } else {
      const newLayout = layouts.find((ele) => ele.name === screen);
      if (!newLayout) {
        console.warn(`Layout not found for screen: ${screen}`);
        return;
      }
      const variables = newLayout.layoutJSON?.card?.variables;
      const googleData = localStorage.getItem("userData");
      const imageData = localStorage.getItem("userUploadUrl");

      if (variables && Array.isArray(variables)) {
        try {
          if (googleData) {
            const googleDataObj = JSON.parse(googleData);
            variables.forEach((variable) => {
              if (!variable || typeof variable !== "object") return;
              if (variable.name === "email" && googleDataObj.email) {
                variable.value = googleDataObj.email;
              }
              if (variable.name === "userName" && googleDataObj.name) {
                variable.value = googleDataObj.name;
              }
              if (variable.name === "phone" && googleDataObj.phone) {
                variable.value = googleDataObj.phone;
              }
            });
          }
          if (imageData) {
            variables.forEach((variable) => {
              if (!variable || typeof variable !== "object") return;
              if (variable.name === "picture") {
                variable.value = imageData;
              }
            });
          }
          newLayout.layoutJSON.card.variables = variables;
        } catch (error) {
          console.error("Error processing user data:", error);
        }
      }
      setLayout(newLayout);
    }
  }, [params.screen, layouts]);

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoadingPopup(true);

    try {
      const visitorId = localStorage.getItem("visitorId") || uid(8);
      const deviceId = localStorage.getItem("deviceId") || uid(8);

      const response = await fetch(
        "https://xplr.live/api/v1/endUser/googleSignin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${credentialResponse.credential}`,
          },
          body: JSON.stringify({
            visitorId: visitorId,
            campaignID: campaignId,
            deviceId: deviceId,
          }),
        }
      );

      const data = await response.json();

      if (data.status) {
        localStorage.setItem("userData", JSON.stringify(data.user));
        setShowPopup(false);
      } else {
        console.error("Login failed:", data.message);
        setShowPopup(false);
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    } finally {
      setIsLoadingPopup(false);
    }
  };

  if (isCameraScreen) {
    // return <CameraComponent />;
  }

  return (
    <div className={styles.container}>
        
      {showRedirectionPage ? (
        <RedirectionPage link={redirectUrl} metaData={campaignData} />
      ) : (
        <div className={styles.cardWrapper}>
          {showPopup && (
            <div className={styles.popupOverlay}>
              <div className={styles.popup}>
                <h2>Sign in with Google</h2>
                <p>Sign in to personalize your experience</p>
                <div className={styles.popupButtons}>
                  {isLoadingPopup ? (
                    <div className={styles.loader}>Loading...</div>
                  ) : (
                    <GoogleOAuthProvider clientId="1026223734987-p8esfqcf3g2r71p78b2qfapo6hic8jh0.apps.googleusercontent.com">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={(error) =>
                          console.error("Google login error:", error)
                        }
                        useOneTap
                        type="standard"
                        theme="filled_blue"
                        render={({ onClick }) => (
                          <button
                            onClick={onClick}
                            className={styles.googleButton}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              backgroundColor: "blue",
                            }}
                          >
                            <img
                              src={googleLogo}
                              alt="google logo"
                              style={{
                                width: "25px",
                                height: "25px",
                                backgroundColor: "white",
                                borderRadius: "50%",
                              }}
                            />
                            Sign in with Google
                          </button>
                        )}
                      />
                    </GoogleOAuthProvider>
                  )}
                  <button
                    className={styles.skipButton}
                    onClick={() => setShowPopup(false)}
                    disabled={isLoadingPopup}
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          )}
          <DivkitRenderer
            divkitJson={layout.layoutJSON}
            onClick={(action) =>
              handleBtnClick(action, router, campaignId, "", layouts)
            }
          />
        </div>
      )}
    </div>
  );
}
