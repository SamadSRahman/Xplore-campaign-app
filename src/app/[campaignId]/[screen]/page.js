import { fetchCampaignData } from '@/app/utils';
import Preview from '@/components/Preview/Preview'
import Head from 'next/head';
import React from 'react'

export default async function page({params}) {
  const { campaignId, screen } =   params;
  console.log(campaignId, screen);
   const {campaignData, layouts} = await fetchCampaignData(campaignId);
    console.log(campaignData);
    
      console.log(layouts);
      
    if (!campaignData) {
      // If no data is found, you can trigger a 404 page.
      notFound();
    }
  return (
    <>
         <head>
        <title>{campaignData.title}</title>
        <meta name="description" content={campaignData.description} />
        <meta property="og:title" content={campaignData.title} />
        <meta property="og:description" content={campaignData.description} />
        <meta property="og:image" content={campaignData.image} />
        <meta
             name="apple-itunes-app"
             content="app-clip-bundle-id=com.xircular.XplorePromote.Clip, app-clip-display=card"
           />
           <meta name="appstore:bundle_id" content="com.xircular.xplorecampaign" />
           <meta name="appstore:store_id" content="com.xircular.xplorecampaign" />
           <link
             rel="canonical"
             href="https://appclip.apple.com/id?p=com.xircular.XplorePromote.Clip"
           />
      </head>
        <Preview campaignId={campaignId} layouts={layouts} campaignData={campaignData}  />
    </>
  )
}
