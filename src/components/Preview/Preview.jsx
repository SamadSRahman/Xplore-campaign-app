"use client"; // Mark this as a client component

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./Preview.module.css";
import { detectEnvironment, appClipURL, handleBtnClick } from "../../app/utils";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { uid } from "uid";
import DivkitRenderer from "../DivkitRenderer/DivkitRenderer";
import { blankBackgroundJSON } from "@/app/utils";
import RedirectionPage from "../RedirectionPage/RedirectionPage";
import CameraComponent from "@/customComponent/CameraComponent/CameraComponent";
import ChatBotComponent from "@/customComponent/ChatBotComponent/ChatBotComponent";
import useAnalytics from "@/hooks/useAnalytics";


export default function Preview({ campaignId, layouts, campaignData, longId }) {
  const params = useParams();
  const router = useRouter();
  localStorage.setItem("longId", longId)
  const { postAnalyticData } = useAnalytics();
  const [layout, setLayout] = useState({ layoutJSON: blankBackgroundJSON });
  const [showRedirectionPage, setShowRedirectionPage] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");

  const [isLoadingPopup, setIsLoadingPopup] = useState(false);
  const enviroment = detectEnvironment();
  const [showPopup, setShowPopup] = useState(false);
  const [isCameraScreen, setIsCameraScreen] = useState(false);
  const [isNativeSignup, setIsNativeSignup] = useState(false);
  const [isChatbot, setIsChatbot] = useState(false)

  useEffect(() => {
    if (enviroment.deviceType === "mobile" && enviroment.isIOS) {
      setRedirectUrl(
        `${appClipURL}&shortId=${campaignId}&sourcename=${enviroment.platform}`
      );
      setShowRedirectionPage(true);
    } else {
      //   getLayoutByShortId(campaignId);
    }
  }, [campaignId]);

    useEffect(() => {
      const isAnalyticsPosted = JSON.parse(sessionStorage.getItem("isAnalyticsPosted"))
      if (campaignId && !enviroment.isIOS && !isAnalyticsPosted) {
        const longId = localStorage.getItem("longId")
        postAnalyticData({
          campaignID: longId,
          source: enviroment.platform === "browser" ? "other" : enviroment.platform,
        });    
        sessionStorage.setItem("isAnalyticsPosted", JSON.stringify(true))
      }
    }, []);

  useEffect(() => {
    const variables = layout.layoutJSON?.card?.variables;

    console.log("layout:", layout);
    if (layout.name === "landing_screen") {
      const isNativeSignupNeeded = variables.find((ele)=>ele.name==="nativeSignInNeeded");
      setIsNativeSignup(isNativeSignupNeeded?.value??false)

    }
    if (layout.name === "splash_screen") {
      const screenDuration = variables.find((ele)=>ele.name==="screen_duration")
      console.log("screen_duration", screenDuration?.value);
      // setSplashScreenDuration(screenDuration.value)
      console.log("Checking for initial screen");
      const initialLayout = layouts.find((ele) => ele.isInitial === true);
      if (initialLayout) {
        setTimeout(() => {
          router.push(`/${campaignId}/${initialLayout.name}`);
          console.log("time out triggered");
        }, screenDuration?.value?screenDuration.value*1000:2000);
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
    } 
    else if (screen === "camera_screen") {
      setIsCameraScreen(true);
    }
    else if (screen === "chatbot_screen") {
      setIsChatbot(true);
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
    return <CameraComponent params={params} />;
  }
  if (isChatbot) {
    return <ChatBotComponent router={router} />;
  }

  return (
    <div className={styles.container}>
        
      {showRedirectionPage ? (
        <RedirectionPage link={redirectUrl} metaData={campaignData} />
      ) : (
        <div className={styles.cardWrapper}>
          {(showPopup && isNativeSignup) && (
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
