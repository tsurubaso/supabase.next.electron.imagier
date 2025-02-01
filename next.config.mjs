/** @type {import('next').NextConfig} */
const nextConfig = {/*
    
    async headers() {
      return [
        {
          source: '/(.*)', // Apply these headers to all routes
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none'"
            }
          ]
        }
      ];
    }
      */
  };
  
  export default nextConfig;
  