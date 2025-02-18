import axios from "axios";
import { useState } from "react";

export default function useAnalytics() {
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);
  const [performancedata, setPerformanceData] = useState({});
  const token = localStorage.getItem("accessToken");
  const channel = localStorage.getItem("channel");

  let API_BASE_URL = 'https://xplr.live/api'; 
  if(window.location.origin==="https://pre.xplore.xircular.io"){ 
   API_BASE_URL = 'https://pre.xplore.xircular.io/api';
  }


  const getperformamceAnalyticsData = async (campaignId) => {
    const response = await fetch(
      `${API_BASE_URL}/v1/analytics/getAll/${campaignId}`
    );
    const data = await response.json();
    console.log("Response of performance analytics", data.data);
    if (data?.data) {
      setPerformanceData(data.data);
    }
  };

  const getAnalyticsData = async (campaignId) => {
    const response = await fetch(
      `${API_BASE_URL}/v1/user/getSubmittedContact/${campaignId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          session: channel,
        },
      }
    );
    const data = await response.json();
    console.log(data.contacts);
    if (data?.contacts) {
      setUsers(data.contacts);

      setData(data.contacts);
    }
    console.log(
      "contactUs",
      contactUsData.map((ele) => ele.contactInfo)
    );
  };

  const postAnalyticData = async (body) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/v1/analytics/clickCount/create`,
        body
      );
      console.log(response.data);
    } catch (error) {
      console.log("Error posting analytic data", error);
    }
  };
  return {
    getperformamceAnalyticsData,
    getAnalyticsData,
    postAnalyticData,
    performancedata,
    data,
    users,
  };
}
