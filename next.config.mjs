/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["pungmul-s3-bucket.s3.ap-northeast-2.amazonaws.com", "https://pungmul-s3-bucket.s3.ap-northeast-2.amazonaws.com"],
        minimumCacheTTL: 60 * 60 * 1000
    },
};

export default nextConfig;
