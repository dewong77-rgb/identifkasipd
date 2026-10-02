export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-tight text-navy">{title}</h1>
          <div className="gold-rule mt-2" />
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export const Card = ({ children, className = '', as: Tag = 'section', ...rest }) => (
  <Tag {...rest} className={`rounded-lg border border-line bg-white p-4 ${className}`}>
    {children}
  </Tag>
);
