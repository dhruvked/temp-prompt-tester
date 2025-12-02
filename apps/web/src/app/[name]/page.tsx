// apps/web/src/app/[name]/page.tsx
import VideoComponent from "@/components/VideoComponent";
import { use } from "react";

type PageProps = {
  params: Promise<{ name: string }>;
};

export default function Home({ params }: PageProps) {
  const { name } = use(params);

  return (
    <div>
      <VideoComponent name={name} />
    </div>
  );
}
