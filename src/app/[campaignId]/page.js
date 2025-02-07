// src/app/campaign/[campaignId]/page.js
import { notFound } from "next/navigation";
import { fetchCampaignData } from "../utils";
import Preview from "@/components/Preview/Preview";
import Head from "next/head";


export const revalidate = 10;
// Your page component fetches its data directly. Note that the component is async.
export default async function CampaignPage({ params }) {
  const { campaignId } = params;

  //   Fetch your campaign data; this can be an API call or database query.
  const { campaignData, layouts } = await fetchCampaignData(campaignId);
  console.log(campaignData);

  console.log(layouts);

  if (!campaignData) {
    // If no data is found, you can trigger a 404 page.
    notFound();
  }

  return (
    <>
      <Head>
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
    
      </Head>
      <main>
        <Preview campaignId={campaignId} layouts={layouts} />
      </main>
    </>
  );
}
