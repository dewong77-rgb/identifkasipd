import { Spinner } from './Icon.jsx';

const V = {
  primary: 'bg-navy text-white hover:bg-navy-dark disabled:bg-slate-300 disabled:text-slate-500',
  secondary: 'bg-white text-navy border border-navy hover:bg-navy-50 disabled:text-slate-400 disabled:border-slate-300',
  ghost: 'bg-transparent text-navy hover:bg-navy-50 disabled:text-slate-400',
  gold: 'bg-gold text-ink hover:brightness-95 disabled:bg-slate-300 disabled:text-slate-500',
};

export default function Button({ variant = 'primary', loading = false, className = '', children, type = 'button', ...rest }) {
  return (
    <button
      type={type}
      {...rest}
      disabled={rest.disabled || loading}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${V[variant]} ${className}`}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
