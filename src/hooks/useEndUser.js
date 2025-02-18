import axios from "axios";

export default function useEndUser(){

  let API_BASE_URL = "https://xplr.live/api";
//   let API_BASE_URL = "https://pre.xplore.xircular.io/api";
//   if (
//     window.location.origin === "https://xplr.live" || 
//     window.location.origin.includes("localhost") ||
//     window.location.origin.includes("vercel")
//   ) {
//     console.log(window.location.origin);
//     API_BASE_URL = "https://xplr.live/api";
//   }

  const submitContactForm = async (formData, campaignID) => {
    try {
      // Validate required fields
      // if (!formData.name?.trim()) {
      //   alert("Please enter your name");
      //   return;
      // }

      // if (!formData.email?.trim()) {
      //   alert("Please enter your email");
      //   return;
      // }

      // // Basic email validation
      // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // if (!emailRegex.test(formData.email)) {
      //   alert("Please enter a valid email address");
      //   return;
      // }

      // // Phone validation if provided
      // if (formData.phone) {
      //   const phoneRegex = /^\d{10}$/;
      //   if (!phoneRegex.test(formData.phone)) {
      //     alert("Please enter a valid 10-digit phone number");
      //     return;
      //   }
      // }

      // // Website URL validation if provided
      // if (formData.otherDetails?.website) {
      //   try {
      //     new URL(formData.otherDetails.website);
      //   } catch {
      //     alert("Please enter a valid website URL");
      //     return;
      //   }
      // }

      const response = await fetch(`${API_BASE_URL}/v1/endUser/contactUs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          countryCode: formData.phone ? formData.countryCode || "+91" : "",
          phone: formData.phone,
          email: formData.email,
          otherDetails: formData.otherFields,
          address: {
            city: formData.address?.city
          },
          visitorId: formData.visitorId,
          deviceId: formData.deviceId,
          campaignID: formData.campaignID
        })
      });
    
      if (!response.ok) {
          const data = await response.json()
          alert(data.message);
          
        
      
      }
      else{
        alert("Form submitted successfully");
      }

      return await response.json();
 
    } catch (error) {
      console.log('Error submitting contact form:', error);
      throw error;
    }
  };
  const updateInterestedProduct = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/endUser/updateInterestedProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitorId: localStorage.getItem('visitorId'),
          deviceId: localStorage.getItem('deviceId'), 
          productName: localStorage.getItem('interestedProduct'),
          campaignID:id
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();

    } catch (error) {
      console.error('Error updating interested product:', error);
      throw error;
    }
  };
  const saveUserDetails = async(id, visitorId, deviceId)=>{
    try {
      const response = await axios.post(`${API_BASE_URL}/v1/endUser/saveVisitorAndCampaign`,
       { body:{
        visitorId:visitorId,
        deviceId:deviceId,
        campaignID: id
       }}
      )
      console.log(response.data);
      
    } catch (error) {
      console.log(error);
      
    }
  }

  const endUserUpload = async(file)=>{
    const formData = new FormData();
    formData.append("files", file)
    formData.append
    try {
        const response = await axios.post(`${API_BASE_URL}/v1/content/uploadImage`, formData)
        console.log(response.data.data[0].cdnUrl);
        localStorage.setItem("userUploadUrl", response.data.data[0].cdnUrl);
    } catch (error) {
      console.log(error);
      
    }
  }

  return {
    submitContactForm,
    endUserUpload,
    updateInterestedProduct,
    saveUserDetails
  };

}
