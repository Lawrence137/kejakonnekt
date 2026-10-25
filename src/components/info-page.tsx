import { siteConfig } from "@/config/site";

export function InfoPage({
  title,
  intro,
  legal = false,
  children,
}: {
  title: string;
  intro?: string;
  legal?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
      {intro && <p className="mt-4 text-lg text-muted-foreground">{intro}</p>}
      {legal && (
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: {siteConfig.legalUpdated}
        </p>
      )}
      <div className="mt-8 text-[15px] leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h2]:mb-2 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_li]:mt-1.5 [&_p]:mt-3 [&_strong]:text-foreground [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </div>
    </div>
  );
}