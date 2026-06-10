import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { getSupabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

function n(v: FormDataEntryValue | null) { const x = Number(v || 0); return x || null; }
function s(v: FormDataEntryValue | null) { return String(v || '').trim(); }

async function addCity(fd: FormData) {
  'use server'; if (!hasSupabaseAdminConfig()) return;
  const name = s(fd.get('name')); if (!name) return;
  await getSupabaseAdmin().from('cities').insert({ name });
  revalidatePath('/mini-admin/master-data');
}
async function addSeason(fd: FormData) {
  'use server'; if (!hasSupabaseAdminConfig()) return;
  const name = s(fd.get('name')); if (!name) return;
  await getSupabaseAdmin().from('seasons').insert({ name });
  revalidatePath('/mini-admin/master-data');
}
async function addCategory(fd: FormData) {
  'use server'; if (!hasSupabaseAdminConfig()) return;
  const name = s(fd.get('name')); if (!name) return;
  await getSupabaseAdmin().from('categories').insert({ name });
  revalidatePath('/mini-admin/master-data');
}
async function addClub(fd: FormData) {
  'use server'; if (!hasSupabaseAdminConfig()) return;
  const name = s(fd.get('name')); if (!name) return;
  await getSupabaseAdmin().from('clubs').insert({ name, city_id: n(fd.get('city_id')), is_active: true });
  revalidatePath('/mini-admin/master-data');
}
async function addTeam(fd: FormData) {
  'use server'; if (!hasSupabaseAdminConfig()) return;
  const name = s(fd.get('name')); if (!name) return;
  await getSupabaseAdmin().from('teams').insert({
    name, club_id: n(fd.get('club_id')), city_id: n(fd.get('city_id')),
    season_id: n(fd.get('season_id')), category_id: n(fd.get('category_id')),
    gender: s(fd.get('gender')) || null, league_level: s(fd.get('league_level')) || null, is_active: true
  });
  revalidatePath('/mini-admin/master-data');
}
async function addPlayer(fd: FormData) {
  'use server'; if (!hasSupabaseAdminConfig()) return;
  const first_name = s(fd.get('first_name')), last_name = s(fd.get('last_name'));
  if (!first_name && !last_name) return;
  await getSupabaseAdmin().from('players').insert({
    first_name, last_name, jersey_number: n(fd.get('jersey_number')),
    birth_date: s(fd.get('birth_date')) || null, team_id: n(fd.get('team_id')),
    city_id: n(fd.get('city_id')), season_id: n(fd.get('season_id')),
    category_id: n(fd.get('category_id')), gender: s(fd.get('gender')) || null, is_active: true
  });
  revalidatePath('/mini-admin/master-data');
}

function opts(rows: any[]) { return rows.map(r => <option key={r.id} value={r.id}>{r.name || r.id}</option>); }

export default async function MasterDataPage() {
  let cities:any[]=[], seasons:any[]=[], categories:any[]=[], clubs:any[]=[], teams:any[]=[], players:any[]=[]; let err='';
  if (hasSupabaseAdminConfig()) {
    const sb = getSupabaseAdmin();
    const [a,b,c,d,e,f] = await Promise.all([
      sb.from('cities').select('*').order('id',{ascending:false}),
      sb.from('seasons').select('*').order('id',{ascending:false}),
      sb.from('categories').select('*').order('id',{ascending:false}),
      sb.from('clubs').select('*').order('id',{ascending:false}),
      sb.from('teams').select('*').order('id',{ascending:false}),
      sb.from('players').select('*').order('id',{ascending:false}).limit(30)
    ]);
    cities=a.data||[]; seasons=b.data||[]; categories=c.data||[]; clubs=d.data||[]; teams=e.data||[]; players=f.data||[];
    err=a.error?.message||b.error?.message||c.error?.message||d.error?.message||e.error?.message||f.error?.message||'';
  }
  return <main className="dashboard">
    <div className="topbar"><b>🗂️ Veri Yönetimi</b><div><Link href="/mini-admin">Mini Admin</Link></div></div>
    <section className="card"><h1>Master Data Manager</h1><p>Kulüp, takım, oyuncu, şehir, sezon ve kategori ekleme ekranı. ID otomatik verilir.</p>{err ? <p><b>Supabase hata:</b> {err}</p> : null}</section>

    <section className="card" style={{marginTop:18}}><h2>Şehir Ekle</h2><form action={addCity} style={{display:'grid',gap:10}}><input name="name" placeholder="Bursa" required/><button>Şehir Kaydet</button></form></section>
    <section className="card" style={{marginTop:18}}><h2>Sezon Ekle</h2><form action={addSeason} style={{display:'grid',gap:10}}><input name="name" placeholder="2026-2027" required/><button>Sezon Kaydet</button></form></section>
    <section className="card" style={{marginTop:18}}><h2>Kategori Ekle</h2><form action={addCategory} style={{display:'grid',gap:10}}><input name="name" placeholder="U14" required/><button>Kategori Kaydet</button></form></section>

    <section className="card" style={{marginTop:18}}><h2>Kulüp Ekle</h2><form action={addClub} style={{display:'grid',gap:10}}><input name="name" placeholder="FİNAL SPOR" required/><select name="city_id"><option value="">Şehir seç</option>{opts(cities)}</select><button>Kulüp Kaydet</button></form></section>

    <section className="card" style={{marginTop:18}}><h2>Takım Ekle</h2><p>Takım adı örnek: FİNAL SPOR. U14/Erkek/A grubu ayrı seçilir.</p><form action={addTeam} style={{display:'grid',gap:10}}>
      <input name="name" placeholder="Takım adı" required/>
      <select name="club_id"><option value="">Kulüp seç</option>{opts(clubs)}</select>
      <select name="city_id"><option value="">Şehir seç</option>{opts(cities)}</select>
      <select name="season_id"><option value="">Sezon seç</option>{opts(seasons)}</select>
      <select name="category_id"><option value="">Kategori seç</option>{opts(categories)}</select>
      <select name="gender"><option value="">Cinsiyet</option><option value="ERKEK">Erkek</option><option value="KIZ">Kız</option></select>
      <select name="league_level"><option value="">Grup</option><option value="A">A Grubu</option><option value="B">B Grubu</option></select>
      <button>Takım Kaydet</button>
    </form></section>

    <section className="card" style={{marginTop:18}}><h2>Oyuncu Ekle</h2><form action={addPlayer} style={{display:'grid',gap:10}}>
      <input name="first_name" placeholder="Ad" required/><input name="last_name" placeholder="Soyad" required/>
      <input name="jersey_number" type="number" placeholder="Forma no"/><input name="birth_date" type="date"/>
      <select name="team_id"><option value="">Takım seç</option>{opts(teams)}</select>
      <select name="city_id"><option value="">Şehir seç</option>{opts(cities)}</select>
      <select name="season_id"><option value="">Sezon seç</option>{opts(seasons)}</select>
      <select name="category_id"><option value="">Kategori seç</option>{opts(categories)}</select>
      <select name="gender"><option value="">Cinsiyet</option><option value="ERKEK">Erkek</option><option value="KIZ">Kız</option></select>
      <button>Oyuncu Kaydet</button>
    </form></section>

    <section className="card" style={{marginTop:18, overflowX:'auto'}}><h2>Son Kayıtlar</h2><table><thead><tr><th>Tablo</th><th>ID</th><th>Ad</th></tr></thead><tbody>
      {clubs.slice(0,5).map(r=><tr key={'c'+r.id}><td>Kulüp</td><td>{r.id}</td><td>{r.name}</td></tr>)}
      {teams.slice(0,5).map(r=><tr key={'t'+r.id}><td>Takım</td><td>{r.id}</td><td>{r.name}</td></tr>)}
      {players.slice(0,5).map(r=><tr key={'p'+r.id}><td>Oyuncu</td><td>{r.id}</td><td>{[r.first_name,r.last_name].filter(Boolean).join(' ')}</td></tr>)}
    </tbody></table></section>
  </main>;
}
