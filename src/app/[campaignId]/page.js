import { notFound, redirect } from "next/navigation";
import { fetchCampaignData } from "../utils";
import ClientRedirect from "../../components/ClientRedirect";
import { headers } from "next/headers";
import Head from "next/head";

// Metadata generation
export async function generateMetadata({ params }) {
  const { campaignId } = params;
  const { campaignData } = await fetchCampaignData(campaignId);

  if (!campaignData) return {};

  return {
    title: campaignData.title,
    description: campaignData.description,
    openGraph: {
      title: campaignData.title,
      description: campaignData.description,
      images: [{ url: campaignData.image }],
    },
    icons: {
      icon: campaignData.image,
    },
    appleItunesApp: {
      "app-clip-bundle-id": "com.xircular.XplorePromote.Clip",
      "app-clip-display": "card",
    },
  };
}

// Page component
export default async function CampaignPage({ params }) {
  const { campaignId } = params;

  // Fetch campaign data with error handling
  let campaignData, layouts, longId;
  try {
    const result = await fetchCampaignData(campaignId);
    console.log("results",result)
    campaignData = result.campaignData;
    layouts = result.layouts;
    longId = result.longId
  } catch (error) {
    console.error("Failed to fetch campaign data:", error);
    notFound();
  }

  // Handle missing campaign data
  if (!campaignData) {
    notFound();
  }
console.log("line 53", layouts);

  // Check if the user is on an iOS device and if they're NOT using Chrome (i.e., not "CriOS")
  const headersList = headers();
  const userAgent = headersList.get("user-agent") || "";
  const isiOS = /iPhone|iPad|iPod/.test(userAgent);
  const isChrome = /CriOS/.test(userAgent);

  // If on iOS and not using Chrome, perform the App Clip redirect.
  // if (isiOS && !isChrome) {
  //   redirect(
  //     `https://appclip.apple.com/id?p=com.xircular.XplorePromote.Clip&shortId=${campaignId}`
  //   );
  // }

  // Determine the redirect path based on layouts for client-side redirection
  console.log("line 69", layouts, Array.isArray(layouts) ? "It's an array" : "Not an array");
  let initialLayout = null;
  let redirectPath = null;
  
  if (Array.isArray(layouts)) {
    // If layouts is an array, check for splash_screen or initial screen
    const splashScreenLayout = layouts.find(layout => layout.name === "splash_screen");
    initialLayout = layouts.find(layout => layout.isInitial === true);
    
    if (splashScreenLayout) {
      redirectPath = `/${campaignId}/splash_screen`;
    } else if (initialLayout) {
      redirectPath = `/${campaignId}/${initialLayout.name}`;
    } else if (layouts.length > 0) {
      // If no special layouts found but array has items, use the first one
      redirectPath = `/${campaignId}/${layouts[0].name}`;
    } else {
      // Empty array, default to profile
      redirectPath = `/${campaignId}/profile`;
    }
  } else if (layouts && typeof layouts === "object") {
    // If layouts is a direct JSON object (not an array), redirect to profile
    // This handles the case where layouts is a single layout object
    console.log("Layout is an object, redirecting to profile");
    redirectPath = `/${campaignId}/profile`;
  } else {
    // Default case if layouts is undefined, null, or another type
    redirectPath = `/${campaignId}/profile`;
  }
  

  // Render the page with a client-side redirect component if needed.
  // return <ClientRedirect redirectPath={redirectPath} />;
  return <>
    <head >
    <meta
          name="apple-itunes-app"
          content="app-clip-bundle-id=com.xircular.XplorePromote.Clip, app-clip-display=card"
        />
        
        <link
          rel="canonical"
          href="https://appclip.apple.com/id?p=com.xircular.XplorePromote.Clip"
        />
    </head>
    <ClientRedirect redirectPath={redirectPath}/>
  </>
}
