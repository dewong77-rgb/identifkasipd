import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import BootGate from '@/app/BootGate.jsx';
import PageHeader from '@/ui/PageHeader.jsx';
import Button from '@/ui/Button.jsx';
import Icon from '@/ui/Icon.jsx';
import ProgressBar from '@/ui/ProgressBar.jsx';
import { useApp } from '@/core/context/AppContext.jsx';
import { useSession } from '@/core/context/SessionContext.jsx';
import { useDukung } from '@/core/hooks/useDukung.js';
import { isB15Hidden } from '@/core/hooks/useB15.js';
import { butirKosong } from '@/core/validate/index.js';
import ProgressSteps from './ProgressSteps.jsx';
import { buildSteps } from './steps/index.js';

function Wizard() {
  const { boot } = useApp();
  const { session, dismissRestored } = useSession();
  const { data } = useDukung(session.target);
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();
  const steps = useMemo(() => buildSteps(boot.instrumen.butir), [boot]);
  const idx = Math.max(0, steps.findIndex((s) => s.id === sp.get('step')));
  const step = steps[idx];
  const { form, target } = session;
  const b15Hidden = isB15Hidden(data, form.status_ringkasan.s2_pd_dapodik);
  const ctx = { form, target, butir: boot.instrumen.butir, b15Hidden, dukung: data };

  const issuesPerStep = steps.map((s) => s.check(ctx));
  const done = Object.fromEntries(steps.map((s, i) => [s.id, issuesPerStep[i].length === 0]));
  const kosong = butirKosong(ctx).length;
  const total = boot.instrumen.butir.length;
  const tampilCek = sp.get('cek') === '1';

  const go = (id) => {
    setSp({ step: id });
    window.scrollTo({ top: 0 });
  };
  const Step = step.Component;

  return (
    <>
      <PageHeader
        title="Wawancara"
        subtitle={step.title}
        actions={
          <Link to="/dukung" className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-sm font-semibold text-navy hover:bg-navy-50">
            <Icon name="chart" size={16} />
            Lihat data dukung
          </Link>
        }
      />

      {session.restored && (
        <div role="status" className="mb-4 flex items-start justify-between gap-3 rounded-md border border-gold bg-gold-50 p-3 text-sm">
          <span className="flex items-start gap-2">
            <Icon name="info" size={18} className="mt-0.5 shrink-0" />
            Isian dipulihkan dari perangkat ini.
          </span>
          <button type="button" onClick={dismissRestored} className="min-h-9 shrink-0 font-semibold text-navy underline">
            Tutup
          </button>
        </div>
      )}

      <div className="mb-4 max-w-sm">
        <ProgressBar value={total - kosong} max={total} label="Butir terisi" right={`${total - kosong} dari ${total}`} tone="gold" />
      </div>

      <ProgressSteps steps={steps} current={step.id} done={done} onGo={go} />

      {tampilCek && issuesPerStep[idx].length > 0 && (
        <div role="alert" className="mb-4 rounded-md border border-navy bg-navy-50 p-3 text-sm">
          <p className="font-bold text-navy">Bagian ini masih perlu dilengkapi:</p>
          <ul className="mt-1 list-disc pl-5">
            {issuesPerStep[idx].map((i, k) => (
              <li key={k}>{i.message}</li>
            ))}
          </ul>
        </div>
      )}

      <Step {...(step.props || {})} />

      <div className="sticky bottom-0 -mx-4 mt-6 flex items-center justify-between gap-3 border-t border-line bg-white px-4 py-3">
        <Button variant="secondary" disabled={idx === 0} onClick={() => go(steps[idx - 1].id)}>
          <Icon name="back" size={16} />
          Kembali
        </Button>
        <span className="text-xs text-muted">
          Langkah {idx + 1} dari {steps.length}
        </span>
        {idx < steps.length - 1 ? (
          <Button onClick={() => go(steps[idx + 1].id)}>
            Lanjut
            <Icon name="next" size={16} />
          </Button>
        ) : (
          <Button variant="gold" onClick={() => nav('/tinjau')}>
            Tinjau dan kirim
            <Icon name="next" size={16} />
          </Button>
        )}
      </div>
      <div className="mt-2 text-right">
        <Link to="/tinjau" className="inline-flex min-h-11 items-center text-sm font-semibold text-navy underline">
          Langsung ke tinjau dan kirim
        </Link>
      </div>
    </>
  );
}

export default function Wawancara() {
  return (
    <BootGate>
      <Wizard />
    </BootGate>
  );
}
