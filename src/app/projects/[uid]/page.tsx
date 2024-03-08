import { Metadata } from "next";
import { notFound } from "next/navigation";

import { createClient } from "@/prismicio";

import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { PrismicLink, SliceZone } from "@prismicio/react";
import { formatDate } from "@/utils/formatDate";
import { components } from "@/slices";
import { MdArrowOutward } from "react-icons/md";

export default async function Page({ params }: { params: Params }) {
  const client = createClient();
  const page = await client
    .getByUID("project", params.uid)
    .catch(() => notFound());

    const formattedDate = formatDate(page.data.date);
  return (
    <Bounded as="article">
      <div className="rounded-2xl border-2 border-slate-800 bg-slate-900 px-4 py-10 md:px-8 md:py-20">
        <Heading as="h1">{page.data.title}</Heading>
        <div className="flex gap-4 text-violet-400">
          {page.tags.map((tag, index) => (
            <span key={index} className="text-xl font-bold">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between mt-8 border-b border-slate-600">
          <p className="text-xl font-medium text-slate-300">
            {formattedDate}
          </p>
          <div className="flex gap-2 text-slate-300">
            <div className="flex items-center  hover:text-violet-300 hover:cursor-pointer">
              <PrismicLink field={page.data.github_link}>GitHub</PrismicLink>
              <MdArrowOutward/>
            </div>
            <div className="flex items-center hover:text-violet-300 hover:cursor-pointer">
              <PrismicLink field={page.data.live_link}>Live Site</PrismicLink>
              <MdArrowOutward/>
            </div>
          </div>
        </div>
        <div className="prose prose-lg prose-invert mt-12 w-full max-w-none md:mt-20">
          <SliceZone slices={page.data.slices} components={components} />
        </div>
      </div>
    </Bounded>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const client = createClient();
  const page = await client
    .getByUID("project", params.uid)
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("project");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
