import useEndUser from "@/hooks/useEndUser";
import axios from "axios";

export async function fetchCampaignData(campaignId) {
  try {
    const response = await axios.get(
      `https://xplr.live/api/v1/viewLayout/${campaignId}`
    );
    console.log("response:", response.data);

    const campaign = response.data?.campaign?.initialLayout?.campaign;
    const layouts = response.data.campaign
      ? response.data.campaign.layouts
      : response.data.profile.layouts;
    const longId = response?.data?.campaign?.id;

    return {
      longId,
      profileData :{
        layouts:layouts
      },
      campaignData: {
        title: campaign?.name,
        description: campaign?.description,
        image: campaign?.images[0]?.url, // Handle cases where images may be missing
      },
      layouts, // Ensure `layouts` is properly returned
    };
    // return metaData;
  } catch (error) {
    console.error(error);
  }
}

const getDeviceInfo = () => {
  const ua = navigator.userAgent;

  // Device type detection
  let deviceType;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceType = "tablet";
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    deviceType = "mobile";
  } else {
    deviceType = "desktop";
  }

  // OS detection
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); // For iPad Pro
  const isAndroid = /Android/.test(ua);

  return {
    deviceType,
    os: isIOS ? "ios" : isAndroid ? "android" : "other",
    isIOS,
    isAndroid,
  };
};

// Social platform detection
const getPlatform = () => {
  const ua = navigator.userAgent;
  const url = window.location.href;

  // Instagram webview detection
  if (ua.includes("Instagram")) {
    return "instagram";
  }

  // Facebook webview detection
  if (
    ua.includes("FBAN") ||
    ua.includes("FBAV") ||
    url.includes("fb_iframe_origin")
  ) {
    return "facebook";
  }

  // LinkedIn webview detection
  if (ua.includes("LinkedInApp") || url.includes("linkedin")) {
    return "linkedin";
  }

  // Twitter webview detection
  if (ua.includes("Twitter") || url.includes("twitter")) {
    return "twitter";
  }

  // General webview detection for iOS and Android
  if (ua.includes("wv") || ua.includes("WebView")) {
    return "webview";
  }

  return "browser";
};

// Combined utility function
export const detectEnvironment = () => {
  const deviceInfo = getDeviceInfo();
  const platform = getPlatform();

  return {
    ...deviceInfo,
    platform,
    isMobile: deviceInfo.deviceType === "mobile",
    isTablet: deviceInfo.deviceType === "tablet",
    isDesktop: deviceInfo.deviceType === "desktop",
    isSocialPlatform: ["instagram", "facebook", "linkedin", "twitter"].includes(
      platform
    ),
    isWebview:
      platform === "webview" ||
      ["instagram", "facebook", "linkedin", "twitter"].includes(platform),
  };
};
export function generateRandomId(length = 8) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters[randomIndex];
  }

  return randomId;
}

export const appClipURL =
  "https://appclip.apple.com/id?p=com.xircular.XplorePromote.Clip";
export const playStoreURL =
  "https://play.google.com/store/apps/details?id=com.xircular.xplorecampaign";

const { submitContactForm, updateInterestedProduct, endUserUpload } =
  useEndUser();

const handleNativeCameraCapture = (
  router,
  campaignId,
  nextScreen,
  setIsImageUploading
) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.capture = "environment"; // Opens the rear camera
  input.style.display = "none";

  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsImageUploading(true);
    try {
      await endUserUpload(file); // Upload converted JPEG file
      // Redirect after success
      if (nextScreen) {
        router.push(`/${campaignId}/${nextScreen}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setIsImageUploading(false);
    }
  };

  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
};

async function getWhatsAppOTP(phone, code) {
  try {
    const campaignId = localStorage.getItem("longId");
    const response = await axios.post(
      `https://xplr.live/api/v1/enduser/auth/whatsapp/getOtp`,
      {
        countryCode: code,
        phone: phone,
        campaignId: campaignId,
        // 6289718501
      }
    );
    console.log(response.data);
    if (response.data.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}
async function getSMSOTP(phone, code) {
  try {
    const campaignId = localStorage.getItem("longId");
    const response = await axios.post(
      `https://xplr.live/api/v1/endUser/auth/sms/getOtp`,
      {
        countryCode: code,
        phone: phone,
        campaignId: campaignId,
        // 6289718501
      }
    );
    console.log(response.data);
    if (response.data.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}
async function verifyWhatsAppOTP(otp) {
  try {
    const campaignId = localStorage.getItem("longId");
    const phone = localStorage.getItem("phone");
    const code = localStorage.getItem("countryCode");
    const response = await axios.post(
      `https://xplr.live/api/v1/enduser/auth/whatsapp/verifyOtp`,
      {
        countryCode: code,
        phone: phone,
        otp: otp,
        campaignId: campaignId,
        // 6289718501
      }
    );
    console.log(response.data);
    if (response.data.success) {
      localStorage.setItem("endUserToken", response.data.token);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (error.response.data.message === "Invalid OTP") {
      alert("Invalid OTP");
    }
    console.error(error);
  }
}
async function verifySMSOTP(otp) {
  try {
    const campaignId = localStorage.getItem("longId");
    const phone = localStorage.getItem("phone");
    const code = localStorage.getItem("countryCode");
    const response = await axios.post(
      `https://xplr.live/api/v1/enduser/auth/sms/verifyOtp`,
      {
        countryCode: code,
        phone: phone,
        otp: otp,
        campaignId: campaignId,
        // 6289718501
      }
    );
    console.log(response.data);
    if (response.data.success) {
      localStorage.setItem("endUserToken", response.data.token);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (error.response.data.message === "Invalid OTP") {
      alert("Invalid OTP");
    }
    console.error(error);
  }
}

export async function handleBtnClick(
  action,
  router,
  shortId,
  campaignId,
  layouts,
  setIsImageUploading
) {
  console.log("Action clicked:", action);

  // Helper function for navigation
  const navigateTo = (path) => {
    if (shortId?.length > 0) {
      router.push(`/${shortId}/${path}`);
    } else {
      router.push(`/campaign/${campaignId}/${path}`);
    }
  };

  // Helper function to extract parameters from the URL
  const getParams = (url) => new URLSearchParams(url.split("?")[1]);

  // Helper function for form data preparation
  const prepareFormData = (params, selectedVariables) => {
    const otherFields = {};
    selectedVariables.forEach((variable) => {
      const value = params.get(variable);
      if (
        value &&
        !["userName", "email", "phone", "consent_checkbox"].includes(variable)
      ) {
        otherFields[variable] = value;
      }
    });
    const deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      const id = generateRandomId();
      localStorage.setItem("deviceId", id);
    }
    const longId = localStorage.getItem("longId");
    return {
      name: params.get("userName"),
      email: params.get("email") || "",
      phone: params.get("phone"),
      visitorId: localStorage.getItem("visitorId") || "",
      deviceId: localStorage.getItem("deviceId"),
      campaignID: longId,
      otherFields,
    };
  };

  // Determine the action type
  const btnAction = action.url?.split("://")[1]?.split("?")[0];
  console.log("Button action:", btnAction);

  try {
    switch (btnAction) {
      case "emailAddress":
        if (action.email) {
          window.location.href = `mailto:${action.email}`;
        }
        break;

      case "share":
        if (navigator.share) {
          await navigator.share({
            title: "Check this out!",
            text: "Here's something interesting for you.",
            url: action.attachmentUrl || `${window.location.origin}/${shortId}`,
          });
          console.log("Content shared successfully!");
        } else {
          alert("Web Share API is not supported in your browser.");
        }
        break;

      case "phoneNumber":
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );
        if (isMobile) {
          window.location.href = `tel:${action.phone}`;
        } else {
          await navigator.clipboard.writeText(action.phone);
          alert(`Phone number ${action.phone} copied to clipboard`);
        }
        break;

      case "socialMedia":
        if (action.socialProfile) {
          window.open(action.socialProfile, "_blank");
        }
        break;

      case "webLink":
        if (action.webUrl) {
          window.open(action.webUrl, "_blank");
        }
        break;

      case "camera":
        const cameraParams = getParams(action.url);
        const cameraScreenIdentifier =
          cameraParams.get("screen_name") || cameraParams.get("id");
        console.log("next layout", cameraScreenIdentifier);
        handleNativeCameraCapture(
          router,
          shortId,
          cameraScreenIdentifier,
          setIsImageUploading
        );
        break;

      case "chatbot":
        const chatbotParams = getParams(action.url)
        console.log("chatbotParams", chatbotParams.get("chatbot_name"),chatbotParams.get("qus_header") );
        const chatbotName = chatbotParams.get("chatbot_name")
        const chatbotHeader = chatbotParams.get("qus_header")
        sessionStorage.setItem("chatbot_name",chatbotName||"Chatbot" )
        sessionStorage.setItem("qus_header",chatbotHeader|| "What do you want to know?" )
        navigateTo("chatbot_screen");
        break;

      case "submit":
        const params = getParams(action.url);
        const isCheckboxChecked = params.get("consent_checkbox") === "true";
        const missingVariables = action.selected_variables.filter(
          (variable) => {
            if (variable === "consent_checkbox") return false;
            const value = params.get(variable);
            return !value || value.trim() === "";
          }
        );

        if (!isCheckboxChecked) {
          alert("Please agree to the terms and conditions first");
          return;
        }

        //   if (missingVariables.length > 0) {
        //     alert("Please fill in all required fields");
        //     return;
        //   }

        const formData = prepareFormData(params, action.selected_variables);
        console.log("FormData:", formData);

        await submitContactForm(formData);
        const screenName = params.get("screen_name");
        if (screenName) {
          navigateTo(screenName);
        }
        updateInterestedProduct(campaignId);
        break;

      case "map":
        if (action.latitude && action.longitude) {
          const mapsUrl = `https://www.google.com/maps?q=${action.latitude},${action.longitude}`;
          window.open(mapsUrl, "_blank");
        }
        break;

      case "contact":
        const contactParams = getParams(action.url);
        const contactScreenName = contactParams.get("screen_name");
        const interestedProduct = contactParams.get("interested_product");
        if (interestedProduct) {
          localStorage.setItem("interestedProduct", interestedProduct);
        }
        if (contactScreenName) {
          navigateTo(contactScreenName);
        }
        break;

      case "open":
      case "productDetails":
        const openParams = getParams(action.url);
        const screenIdentifier =
          openParams.get("screen_name") || openParams.get("id");
        const foundLayout = layouts.find(
          (ele) => ele.name === screenIdentifier || ele.id === screenIdentifier
        );

        if (foundLayout || screenIdentifier === "camera_screen") {
          navigateTo(screenIdentifier);
        } else {
          console.log(`Screen ${screenIdentifier} not found`);
        }
        break;

      case "backBtn":
        const backParams = getParams(action.url);
        const backScreenName = backParams.get("screen_name");
        if (backScreenName) {
          navigateTo(backScreenName);
        } else {
          router.back(); // Go back
        }
        break;
      case "whatsappOtpIntegration/getOtp": {
        const phone = action.phone??localStorage.getItem("phone");
        const countryCode = action.country_code??localStorage.getItem("countryCode");
        console.log("phone:", phone);
        console.log("countryCode:", countryCode);
        localStorage.setItem("phone", phone);
        localStorage.setItem("countryCode", countryCode);
        const isOTPSent = await getWhatsAppOTP(phone, countryCode);
        if (isOTPSent) {
          alert(`An OTP has been sent to your WhatsApp number ${phone}`);
          navigateTo("verify_whatsapp_otp_screen");
        }
        break;
      }

      case "whatsappOtpIntegration/verifyOtp": {
        const url2 = action.url.replace("xplore-promote://", "https://"); // Replace scheme for parsing
        const parsedUrl2 = new URL(url2);
        const whatsAppParams2 = new URLSearchParams(parsedUrl2.search);
        
        
        const otp = whatsAppParams2.get("otp");
        const nextScreen = whatsAppParams2.get("screen_name");

        console.log("otp:", otp);
        console.log("nextScreen:", nextScreen);
        const isOTPVerified = await verifyWhatsAppOTP(otp);
        if (isOTPVerified) {
          navigateTo(nextScreen ?? "landing_screen");
        }
        break;
      }
      case "smsIntegration/getOtp": {
            console.log("phone:", action.phone);
        console.log("code:", action.country_code);
       const localPhone =  localStorage.getItem("phone")
       const localCountryCode = localStorage.getItem("countryCode")
        const isOTPSent = await getSMSOTP(action.phone??localPhone, action.country_code??localCountryCode);
        if (isOTPSent) {
          alert(`An OTP has been sent to your number ${action.phone??localPhone}`);
          navigateTo("verify_otp_screen");
        }
        break;
      }
      case "smsIntegration/verifyOtp":{
        console.log("otp:", action.otp);
        const isOTPVerified = await verifySMSOTP(action.otp);
        if (isOTPVerified) {
          navigateTo(action.screen_name ?? "landing_screen");
        }
        break;
      }

      default:
        console.warn("Unknown button action:", btnAction);
    }
  } catch (error) {
    console.error("Error handling button click:", error);
  }
}

export const blankBackgroundJSON = {
  card: {
    log_id: "div2_sample_card",
    states: [
      {
        state_id: 0,
        div: {
          visibility_action: {
            log_id: "visible",
          },
          background: [
            {
              color:
                "@{getDictOptColor('#00ffffff', local_palette, 'bg_primary', theme)}",
              type: "solid",
            },
          ],
          height: {
            type: "match_parent",
          },
          orientation: "overlap",
          type: "container",
        },
      },
    ],
    variables: [
      {
        type: "dict",
        name: "local_palette",
        value: {
          bg_primary: {
            name: "Primary background",
            light: "#fff",
            dark: "#000",
          },
          color0: {
            name: "Secondary background",
            light: "#eeeeee",
            dark: "#000",
          },
        },
      },
    ],
  },
  templates: {
    input_text: {
      type: "input",
      text_variable: "my_borderless_text",
      width: {
        type: "match_parent",
      },
      height: {
        type: "wrap_content",
      },
      text_alignment_horizontal: "left",
      margins: {
        left: 16,
        top: 20,
        right: 16,
        bottom: 16,
      },
      paddings: {
        left: 16,
        top: 10,
        right: 16,
        bottom: 10,
      },
      alignment_horizontal: "center",
      alignment_vertical: "center",
      font_size: 16,
      font_weight: "medium",
      text_color: "#000000",
      hint_color: "#888888",
      highlight_color: "#e0bae3",
      line_height: 22,
      accessibility: {
        description: "Enter text here",
        hint: "Type your response",
        state_description: "Active input field",
      },
      autocapitalization: "sentences",
      keyboard_type: "default",
      background: [
        {
          type: "solid",
          color: "#f8f8f8",
        },
      ],
      border: {
        corner_radius: 8,
        stroke: {
          color: "#cccccc",
          width: 1,
        },
      },

      enter_key_type: "done",
      on_focus: [
        {
          type: "highlight",
          highlight_color: "#d3d3d3",
        },
      ],
      visibility: "visible",
      max_length: 100,
      mask: {
        type: "text",
        pattern: "[A-Za-z0-9 ]*",
      },
      text_alignment_horizontal: "left",
      text_alignment_vertical: "center",
    },
    _template_lottie: {
      type: "gif",
      scale: "fit",
      extensions: [
        {
          id: "lottie",
          $params: "lottie_params",
        },
      ],
      gif_url: "https://yastatic.net/s3/home/divkit/empty2.png",
    },
    _template_button: {
      type: "text",
      text_alignment_horizontal: "center",
      text_alignment_vertical: "center",
      border: {
        $corner_radius: "corners",
      },
      paddings: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
      },
      width: {
        type: "wrap_content",
      },
    },
    _template_close: {
      accessibility: {
        description: "Закрыть",
        mode: "merge",
        type: "button",
      },
      actions: [
        {
          log_id: "close_popup",
          url: "div-screen://close",
        },
      ],
      image_url:
        "https://yastatic.net/s3/home/div/div_fullscreens/cross2.3.png",
      tint_color: "#73000000",
      type: "image",
    },
    //     _template_list_text_only: {
    //       type: 'container',
    //       orientation: 'vertical',
    //       items: [
    //         {
    //           type: 'foreach', // Allows dynamic rendering based on list_items
    //           in: 'list_items',
    //           template: {
    //             type: 'text',
    //             $text: 'list_item_text',
    //             $text_color: 'list_item_color',
    //             $font_size: 'list_item_size',
    //             line_height: 32,
    //             $font_weight: 'list_item_weight',
    //             width: {
    //               type: 'wrap_content',
    //               constrained: true,
    //             },
    //           },
    //         },
    //       ],
    // }
  },
};
