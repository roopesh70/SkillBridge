import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    allowedDevOrigins: [
      "https://6000-idx-studio-1744613080978.cluster-ikxjzjhlifcwuroomfkjrx437g.cloudworkstations.dev",
      "https://9000-idx-studio-1744613080978.cluster-ikxjzjhlifcwuroomfkjrx437g.cloudworkstations.dev"
    ]
  }
};

export default nextConfig;
