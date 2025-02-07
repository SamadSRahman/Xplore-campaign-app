// src/app/campaign/[campaignId]/page.js
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
  const { campaignId } = params;

  // Fetch your campaign data; this can be an API call or database query.
  const campaignData = await fetchCampaignData(campaignId);

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
  const dummyCampaigns = {
    1: {
      title: "Campaign One",
      description: "This is the first campaign.",
      content: "Details about Campaign One…",
      image:
        "https://res.cloudinary.com/dljvlt6tu/image/upload/v1737481020/dc0397a8f7a787db306f72e3e3065a54_1_fgzs2o.png",
    },
    2: {
      title: "Campaign Two",
      description: "This is the second campaign.",
      content: "Details about Campaign Two…",
      image:
        "https://res.cloudinary.com/dljvlt6tu/image/upload/v1728362745/OnePlus7T1.jpg",
    },
  };
  return dummyCampaigns[campaignId] || null;
}
