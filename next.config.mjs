/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '/**', // Allows all subpaths under 'res.cloudinary.com'
        },
      ],
    },
  };
  
  export default nextConfig;
  