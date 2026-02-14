import { BreadcrumbHeader } from "./BreadcrumbHeader";

export function TitlePage({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <div className="mb-2 hidden lg:block">
        <BreadcrumbHeader items={[{ label: title }]} />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}