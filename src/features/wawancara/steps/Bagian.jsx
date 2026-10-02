import { useSearchParams } from 'react-router-dom';
import { useApp } from '@/core/context/AppContext.jsx';
import { useSession } from '@/core/context/SessionContext.jsx';
import { useDukung } from '@/core/hooks/useDukung.js';
import { isB15Hidden } from '@/core/hooks/useB15.js';
import { groupBagian, isButir15, kodeButir } from '@/core/lib/instrumen.js';
import QuestionField from '../QuestionField.jsx';

export default function Bagian({ kode }) {
  const { boot } = useApp();
  const { session, setJawaban } = useSession();
  const [sp] = useSearchParams();
  const { data } = useDukung(session.target);
  const b15Hidden = isB15Hidden(data, session.form.status_ringkasan.s2_pd_dapodik);
  const grup = groupBagian(boot.instrumen.butir).find((g) => g.kode === kode);
  if (!grup) return null;
  const aktif = grup.items.filter((b) => !(isButir15(b) && b15Hidden));
  const terisi = aktif.filter((b) => String(session.form.jawaban[kodeButir(b)] ?? '').trim()).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Terisi {terisi} dari {aktif.length} butir pada bagian ini.
      </p>
      {grup.items.map((b) => {
        const k = kodeButir(b);
        return (
          <QuestionField
            key={k}
            butir={b}
            value={session.form.jawaban[k]}
            onChange={(v) => setJawaban(k, v)}
            hidden={isButir15(b) && b15Hidden}
            focus={sp.get('q') === k}
          />
        );
      })}
    </div>
  );
}
