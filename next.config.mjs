/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["pungmul-s3-bucket.s3.ap-northeast-2.amazonaws.com", "https://pungmul-s3-bucket.s3.ap-northeast-2.amazonaws.com"]
    },
    async headers() {
        return [
            {
                source: "/_next/static(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=86400, immutable", // 1년 동안 캐싱
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
