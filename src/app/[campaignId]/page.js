// src/app/campaign/[campaignId]/page.js
import axios from "axios";
import { notFound } from "next/navigation";

// This function is used to define which dynamic routes should be pre-rendered.
export async function generateStaticParams() {
  // Replace with your API call or data fetching logic.
  const campaigns = await fetchCampaignList();
  return campaigns.map((campaign) => ({
    campaignId: campaign.id,
  }));
}

// Your page component fetches its data directly. Note that the component is async.
export default async function CampaignPage({ params }) {
  const  { campaignId } = await params;

  // Fetch your campaign data; this can be an API call or database query.
  const campaignData = await fetchCampaignData(campaignId);

  if (!campaignData) {
    // If no data is found, you can trigger a 404 page.
    notFound();
  }

  return (
    <>
      <head>
      <link rel="icon" href={campaignData.image} sizes="256x256" type="image/x-icon"></link>
        <title>{campaignData.title}</title>
        <meta name="description" content={campaignData.description} />
        <meta property="og:title" content={campaignData.title} />
        <meta property="og:description" content={campaignData.description} />
        <meta property="og:image" content={campaignData.image} />
      
        {/* Add additional meta tags as needed */}
      </head>
      <main>
        <h1>{campaignData.title}</h1>
        <p>{campaignData.content}</p>
      </main>
    </>
  );
}

// Dummy functions to illustrate data fetching; replace these with your actual logic.
async function fetchCampaignList() {
  // For example, an API call to fetch a list of campaigns.
  return [
    { id: "1" },
    { id: "2" },
    // ... other campaigns
  ];
}

async function fetchCampaignData(campaignId) {
  // Replace this with your actual API call.

    try {
        const response = await axios.get(`https://xplr.live/api/v1/viewLayout/${campaignId}`);
        console.log('response:', response.data.campaign.initialLayout.campaign);
        const campaign = response.data.campaign.initialLayout.campaign
        const metaData = {
            title: campaign.name,
            description: campaign.description,
            image: campaign.images[0].url,
        }
        return metaData;
    } catch (error) {
        console.error(error)
    }

}
