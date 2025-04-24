/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Allows production builds to complete even if ESLint errors are present.
        ignoreDuringBuilds: true,
      },    
};

export default nextConfig;
