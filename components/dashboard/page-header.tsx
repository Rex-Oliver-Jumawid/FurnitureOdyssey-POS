type PageHeaderProps = {
  title: string;
  description: string;
  eyebrow?: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, description, eyebrow = "Sales Operations", children }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="studio-kicker mb-2">{eyebrow}</p>
        <h1 className="text-3xl font-normal tracking-tight text-foreground">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
