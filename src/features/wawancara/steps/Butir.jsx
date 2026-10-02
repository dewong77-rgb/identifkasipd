import { useSearchParams } from 'react-router-dom';
import { useSession } from '@/core/context/SessionContext.jsx';
import { useDukung } from '@/core/hooks/useDukung.js';
import { isB15Hidden } from '@/core/hooks/useB15.js';
import { isButir15, kodeButir } from '@/core/lib/instrumen.js';
import QuestionField from '../QuestionField.jsx';
import BahanWawancara from '../BahanWawancara.jsx';

// Satu butir: pertanyaan di kiri, bahan wawancara di kanan (turun ke bawah di layar sempit).
export default function Butir({ butir }) {
  const { session, setJawaban } = useSession();
  const [sp] = useSearchParams();
  const { data } = useDukung(session.target);
  const k = kodeButir(butir);
  const hidden = isButir15(butir) && isB15Hidden(data, session.form.status_ringkasan.s2_pd_dapodik);
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <QuestionField butir={butir} value={session.form.jawaban[k]} onChange={(v) => setJawaban(k, v)} hidden={hidden} focus={sp.get('cek') === '1'} />
      <BahanWawancara butir={butir} dukung={data} />
    </div>
  );
}
