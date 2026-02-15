/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack: (config) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    },
    typescript: { ignoreBuildErrors: true },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'crazymeme-bucket.s3.ap-southeast-1.amazonaws.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'gateway.pinata.cloud',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'img.crazy.meme',
                hostname: 'ipfs.io',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'crazymeme-bucket-1.s3.ap-southeast-1.amazonaws.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'pbs.twimg.com',
                port: '',
                pathname: '/profile_images/**',
            },
        ],
    },
    async rewrites() {
        return process.env.NEXT_PUBLIC_ENV === 'test'
            ? [
                  {
                      source: '/api/v1/:path*',
                      destination: 'http://54.219.20.133:8081/api/v1/:path*',
                  },
                  {
                      source: '/api/v2/:path*',
                      destination: 'http://54.219.20.133:28080/:path*',
                  },
              ]
            : [
                  {
                      source: '/api/v1/:path*',
                      destination: 'http://go-802797711.ap-southeast-1.elb.amazonaws.com/api/v1/:path*',
                  },
                  {
                      source: '/api/v2/:path*',
                      destination: 'http://crazyairdrop-1243801681.ap-southeast-1.elb.amazonaws.com/:path*',
                  },
              ];
    },
};

export default nextConfig;
