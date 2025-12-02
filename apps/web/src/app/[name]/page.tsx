// apps/web/src/app/[name]/page.tsx
import VideoComponent from "@/components/VideoComponent";

type PageProps = { params: { name: string } };

export default function Home({ params }: PageProps) {
  const { name } = params;

  return (
    <div>
      <VideoComponent name={name} />
    </div>
  );
}
