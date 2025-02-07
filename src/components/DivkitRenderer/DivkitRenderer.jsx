"use client"; // Mark this as a client component

import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import styles from "./DivkitRenderer.module.css";

import { lottieExtensionBuilder,   } from "@divkitframework/divkit/client";
import Lottie from "lottie-web/build/player/lottie";
import {render} from '@divkitframework/divkit/client'
import '@divkitframework/divkit/dist/client.css';
import ChatBotComponent from "@/customComponent/ChatBotComponent/ChatBotComponent";
import Image360Viewer from "@/customComponent/ImageViewer/ImageViewer";
const DivkitRenderer = ({ divkitJson, onClick }) => {
    
    
  const extensions = new Map();
  extensions.set("lottie", lottieExtensionBuilder(Lottie.loadAnimation));
  const divkitContainer = useRef(null);

  const captureRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  function handleCustomAction(e) {
    const btnAction = e.url?.split("://")[1].split("?")[0];
    if (btnAction === "capture") {
      handleCaptureClick();
      return;
    }
    onClick(e);
  }

  const handleCaptureClick = () => {
    if (captureRef.current) {
      const imageData = captureRef.current();
      setCapturedImage(imageData);
    }
  };

  // Define the custom element before render
  useEffect(() => {
    if (typeof window !== "undefined" && !customElements.get("custom-card")) {
      class CustomCardElement extends HTMLElement {
        connectedCallback() {
          const container = document.createElement("div");
          this.appendChild(container);
          ReactDOM.createRoot(container).render(<Image360Viewer />);
        }

        disconnectedCallback() {
          const container = this.firstElementChild;
          if (container) {
            ReactDOM.unmountComponentAtNode(container);
          }
        }
      }
      customElements.define("custom-card", CustomCardElement);
    }

    if (typeof window !== "undefined" && !customElements.get("chatbot-card")) {
      class ChatbotCardElement extends HTMLElement {
        connectedCallback() {
          const container = document.createElement("div");
          this.appendChild(container);
          ReactDOM.createRoot(container).render(<ChatBotComponent />);
        }

        disconnectedCallback() {
          const container = this.firstElementChild;
          if (container) {
            ReactDOM.unmountComponentAtNode(container);
          }
        }
      }
      customElements.define("chatbot-card", ChatbotCardElement);
    }
  }, []);

  useEffect(() => {
    if (divkitContainer.current) {
      render({
        extensions,
        // hydrate: true,
        onCustomAction: handleCustomAction,
        id: "divkit-root",
        target: divkitContainer.current,
        typefaceProvider: (fontName) => {
          const fontFamily = `custom-font-${fontName}`;
          if (!document.getElementById(fontFamily)) {
            const style = document.createElement("style");
            style.id = fontFamily;
            style.textContent = `
              @font-face {
                font-family: 'custom-font-${fontName}';
                src: url(https://xplr.live/api/v1/font/getFontFile?specificName=${fontName}) format('truetype');
              }
            `;
            document.head.appendChild(style);
          }
          return `"custom-font-${fontName}", sans-serif`;
        },
        json: divkitJson,
        customComponents: new Map([
          ["threesixty_card", { element: "custom-card" }],
          ["chatbot_card", { element: "chatbot-card" }],
        ]),
        onError(details) {
          console.error("Divkit rendering error:", details.error);
        },
      });
    }

    return () => {
      if (divkitContainer.current) {
        divkitContainer.current.innerHTML = "";
      }
    };
  }, [divkitJson]);

  return <div id="divkit-root" className={styles.renderDiv} ref={divkitContainer} />;
};

export default DivkitRenderer;