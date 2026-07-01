import configPromise from '@payload-config';
import { RootPage } from '@payloadcms/next/views';
import { importMap } from '../../importMap';

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = async ({ params, searchParams }: Args) => {
  const { generatePageMetadata } = await import('@payloadcms/next/views');
  return generatePageMetadata({ config: configPromise, params, searchParams });
};

const Page = async ({ params, searchParams }: Args) => {
  return RootPage({ config: configPromise, importMap, params, searchParams });
};

export default Page;
