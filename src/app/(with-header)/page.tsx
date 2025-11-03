import { Metadata } from "next";
import { SliceComponentProps, SliceZone } from "@prismicio/react";
import { Content } from "@prismicio/client";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

// Optional: enable ISR (tweak the seconds as you like)
// export const revalidate = 60;

type TextAndImageBundleSlice = {
  id: string;
  slice_type: "text_and_image_bundle";
  slices: Content.TextAndImageSlice[];
};

export default async function Page() {
  const client = createClient();
  const homeDoc = await client.getSingle("homepage");

  const slices = bundleTextAndImageSlices(homeDoc.data.slices);

  return (
    <SliceZone
      slices={slices}
      components={{
        ...components,
        text_and_image_bundle: ({
          slice,
        }: SliceComponentProps<TextAndImageBundleSlice>) => (
          <div>
            <SliceZone slices={slice.slices} components={components} />
          </div>
        ),
      }}
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const homeDoc = await client.getSingle("homepage");

  return {
    title: homeDoc.data.meta_title ?? "Kickflip Skateboards",
    description:
      homeDoc.data.meta_description ??
      "Custom boards built for your streets — design your perfect setup.",
  };
}

function bundleTextAndImageSlices(
  slices: Content.HomepageDocumentDataSlicesSlice[]
) {
  const res: Array<
    Content.HomepageDocumentDataSlicesSlice | TextAndImageBundleSlice
  > = [];

  for (const slice of slices) {
    if (slice.slice_type !== "text_and_image") {
      res.push(slice);
      continue;
    }

    const last = res.at(-1);
    if (last?.slice_type === "text_and_image_bundle") {
      last.slices.push(slice);
    } else {
      res.push({
        id: `${slice.id}-bundle`,
        slice_type: "text_and_image_bundle",
        slices: [slice],
      });
    }
  }
  return res;
}
