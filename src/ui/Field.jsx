import { useId } from 'react';
import { digitsOnly } from '@/core/lib/format.js';

const base =
  'block w-full min-h-11 rounded-md border bg-white px-3 py-2 text-base text-ink placeholder:text-slate-400 focus:border-navy';

export function Field({ label, hint, error, required, children, id }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-1 text-muted font-normal">(wajib)</span>}
      </label>
      {hint && <p className="text-sm text-muted">{hint}</p>}
      {children}
      {error && (
        <p role="alert" className="text-sm font-medium text-navy">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ label, hint, error, required, className = '', ...rest }) {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required}>
      <input id={id} {...rest} className={`${base} ${error ? 'border-navy' : 'border-line'} ${className}`} />
    </Field>
  );
}

export function NumInput({ onChange, ...rest }) {
  return <TextInput inputMode="numeric" autoComplete="off" {...rest} onChange={(e) => onChange(digitsOnly(e.target.value))} />;
}

export function DateInput(props) {
  return <TextInput type="date" {...props} />;
}

export function TextArea({ label, hint, error, rows = 4, className = '', ...rest }) {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <textarea id={id} rows={rows} {...rest} className={`${base} ${error ? 'border-navy' : 'border-line'} ${className}`} />
    </Field>
  );
}

export function SelectInput({ label, hint, error, required, options, placeholder = 'Pilih', value, onChange, ...rest }) {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required}>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} {...rest} className={`${base} ${error ? 'border-navy' : 'border-line'}`}>
        <option value="">{placeholder}</option>
        {options.map((o) => {
          const v = typeof o === 'string' ? o : o.value;
          const l = typeof o === 'string' ? o : o.label;
          return (
            <option key={v} value={v}>
              {l}
            </option>
          );
        })}
      </select>
    </Field>
  );
}

// Pilihan dua atau tiga opsi berupa tombol radio besar.
export function ChoiceInput({ label, error, required, options, value, onChange, name }) {
  const id = useId();
  return (
    <fieldset className="space-y-1.5" aria-describedby={error ? `${id}-e` : undefined}>
      <legend className="text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-1 text-muted font-normal">(wajib)</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o}
            className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-4 text-sm font-semibold ${
              value === o ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink hover:bg-navy-50'
            }`}
          >
            <input type="radio" name={name || id} value={o} checked={value === o} onChange={() => onChange(o)} className="sr-only" />
            {o}
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-e`} role="alert" className="text-sm font-medium text-navy">
          {error}
        </p>
      )}
    </fieldset>
  );
}
