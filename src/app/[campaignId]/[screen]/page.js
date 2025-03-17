import RootLayout from "@/app/layout";
import { fetchCampaignData } from "@/app/utils";
import Preview from "@/components/Preview/Preview";
import React from "react";

export default async function page({ params }) {
  const { campaignId, screen } = params;
  
  console.log("line 9",campaignId, screen);

  const { campaignData, layouts, longId, profileData } = await fetchCampaignData(campaignId);
  console.log("Campaign data", campaignData, profileData);
  console.log("Profile data", profileData);
  
  
  if (!campaignData) {
    // If no data is found, you can trigger a 404 page.
    notFound();
  } 
  return (
    <>
     {/* <RootLayout campaignData={campaignData}> */}
     <head>
        <title>{campaignData.title}</title>
        <meta name="description" content={campaignData.description} />
        <meta property="og:title" content={campaignData.title} />
        <meta property="og:description" content={campaignData.description} />
        <meta property="og:image" content={campaignData.image} />
        <meta name="appstore:bundle_id" content="com.xircular.xplorecampaign"/>
        <meta name="appstore:store_id" content="com.xircular.xplorecampaign"/>
        <link rel="icon" href={campaignData.image}/>
        <meta
          name="apple-itunes-app"
          content="app-clip-bundle-id=com.xircular.XplorePromote.Clip, app-clip-display=card"
        />
        
        <link
          rel="canonical"
          href="https://appclip.apple.com/id?p=com.xircular.XplorePromote.Clip"
        />
      </head>
      <Preview campaignId={campaignId} layouts={layouts}  campaignData={campaignData} longId={longId}/>

     {/* </RootLayout> */}
    </>
  );
}
