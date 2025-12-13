declare module 'next/dist/lib/metadata/types/metadata-interface.js' {
  import type { Metadata, Viewport } from 'next';
  
  export type ResolvingMetadata = (
    props: {
      params: Promise<{ [key: string]: string | string[] }>;
      searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    }
  ) => Promise<Metadata>;
  
  export type ResolvingViewport = (
    props: {
      params: Promise<{ [key: string]: string | string[] }>;
      searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    }
  ) => Promise<Viewport>;
  
  export {};
}

declare module 'next/server.js' {
  export { NextRequest, NextResponse } from 'next/server';
  export type { NextRequest as NextRequestType, NextResponse as NextResponseType } from 'next/server';
}

declare module 'next/types.js' {
  import type { Metadata, Viewport } from 'next';
  
  export type ResolvingMetadata = (
    props: {
      params: Promise<{ [key: string]: string | string[] }>;
      searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    }
  ) => Promise<Metadata>;
  
  export type ResolvingViewport = (
    props: {
      params: Promise<{ [key: string]: string | string[] }>;
      searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    }
  ) => Promise<Viewport>;
  
  export * from 'next/types';
}

