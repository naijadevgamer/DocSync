// lib/metadata.ts

import type { Metadata } from "next";

const APP_NAME = "DocSync";
const APP_DESCRIPTION =
  "A healthcare patient management system for appointment scheduling, patient records, and healthcare administration.";

type MetadataProps = {
  title: string;
  description?: string;
  noIndex?: boolean;
};

export function createMetadata({
  title,
  description = APP_DESCRIPTION,
  noIndex = false,
}: MetadataProps): Metadata {
  return {
    title: `${title}`,
    description,

    applicationName: APP_NAME,

    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },

    openGraph: {
      title: `${title} | ${APP_NAME}`,
      description,
      siteName: APP_NAME,
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: `${title} | ${APP_NAME}`,
      description,
    },
  };
}
