import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { formatDate } from "@/utils/formatDate";

type Params = { uid: string };

export default async function Page({ params }: { params: Params }) {
  const client = createClient();
  const page = await client
    .getByUID("blog_post", params.uid)
    .catch(() => notFound());


    const formattedDate = formatDate(page.data.date);

  return (
    <Bounded as={"article"}>
      <div className="rounded-2xl border-2 border-slate-800 bg-slate-900 px-4 py-10 md:px-8 md:py-20">
        <Heading as="h1">{page.data.title}</Heading>
        <div className="flex md:gap-4 gap-2 text-violet-400 flex-wrap">
          {page.tags.map((tag) => (
            <span key={tag} className="md:text-xl text-sm font-bold">{tag}</span>
          ))}
        </div>
        <p className="md:mt-8 mt-4 border-b border-slate-600 md:text-xl text-sm font-medium text-slate-300">{formattedDate}</p>
        <div className="md:mt-8 mt-4 border-4 border-slate-300">
          <SliceZone slices={page.data.slices} components={components} />
        </div>
      </div>
    </Bounded>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const client = createClient();
  const page = await client
    .getByUID("blog_post", params.uid)
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("blog_post");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
