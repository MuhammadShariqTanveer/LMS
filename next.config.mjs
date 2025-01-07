/** @type {import('next').NextConfig} */
const nextConfig = {
    images : {
        remotePatterns : [
            {
                hostname : "plus.unsplash.com",
            }
        ]
    }
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     experimental: {
//       appDir: true, // Ensure app directory is enabled
//     },
//     reactStrictMode: true, // Optional: Enforces best practices
//   };
  
//   export default nextConfig;
  
