import Link from 'next/link';
import { getSupabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

type TeamDashboardRow = {
  team_id: number;
  team_name: string | null;
  games: number;
  points: number;
  rebounds: number;
  assists: number;
  turnovers: number;
  steals: number;
  blocks: number;
  fouls: number;
  offensive_rebounds: number;
  defensive_rebounds: number;
  fgm: number;
  fga: number;
  tpm: number;
  tpa: number;
  ftm: number;
  fta: number;
  fg_pct: number | null;
  tp_pct: number | null;
  ft_pct: number | null;
  ts_pct: number | null;
  efg_pct: number | null;
};

export default async function MiniAdminTeamDashboardPage() {
  const hasConfig = hasSupabaseAdminConfig();

  if (!hasConfig) {
    return (
      <div className="nn-container">
        <h1 className="nn-title">Takım Analizi</h1>
        <div className="nn-error mt-4">
          <p>Supabase admin konfigürasyonu yapılmamış. Lütfen çevre değişkenlerini ayarlayın.</p>
        </div>
      </div>
    );
  }

  try {
    const supabase = await getSupabaseAdmin();

    const { data, error } = await supabase
      .from('live_team_dashboard')
      .select('*')
      .order('team_id', { ascending: true });

    if (error) {
      return (
        <div className="nn-container">
          <h1 className="nn-title">Takım Analizi</h1>
          <div className="nn-error mt-4">
            <p>Veri yüklenirken hata oluştu: {error.message}</p>
          </div>
        </div>
      );
    }

    const rows: TeamDashboardRow[] = data || [];

    return (
      <div className="nn-container">
        <div className="nn-header-area flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="nn-title">Takım Analizi</h1>
            <span className="nn-subtitle">Terminal // Canlı Veri Yayını</span>
          </div>
          <div>
            <Link href="/mini-admin" className="nn-link" style={{ fontSize: '1rem' }}>
              ← Ana Menüye Dön
            </Link>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="nn-card">
            <p className="text-center">Henüz takım verisi bulunmuyor veya canlı görünümler eksik.</p>
          </div>
        ) : (
          <div className="nn-table-wrapper">
            <table className="nn-table">
              <thead>
                <tr>
                  <th>Takım</th>
                  <th className="text-right">Maç</th>
                  <th className="text-right">Sayı</th>
                  <th className="text-right">Rib</th>
                  <th className="text-right">Asist</th>
                  <th className="text-right">Top K.</th>
                  <th className="text-right">Top Ç.</th>
                  <th className="text-right">Blok</th>
                  <th className="text-right">Faul</th>
                  <th className="text-right">eFG%</th>
                  <th className="text-right">TS%</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.team_id}>
                    <td style={{fontFamily: 'var(--font-body)', fontWeight: 700}}>{row.team_name || `Takım ${row.team_id}`}</td>
                    <td className="text-right">{row.games}</td>
                    <td className="text-right" style={{color: 'var(--nn-cyan)', textShadow: '0 0 5px rgba(0,240,255,0.4)', fontSize: '1.2rem'}}>{row.points}</td>
                    <td className="text-right">{row.rebounds}</td>
                    <td className="text-right">{row.assists}</td>
                    <td className="text-right" style={{color: 'var(--nn-orange)'}}>{row.turnovers}</td>
                    <td className="text-right">{row.steals}</td>
                    <td className="text-right">{row.blocks}</td>
                    <td className="text-right">{row.fouls}</td>
                    <td className="text-right" style={{color: '#94a3b8'}}>
                      {row.efg_pct ? `${(row.efg_pct * 100).toFixed(1)}%` : '-'}
                    </td>
                    <td className="text-right" style={{color: '#94a3b8'}}>
                      {row.ts_pct ? `${(row.ts_pct * 100).toFixed(1)}%` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
    return (
      <div className="nn-container">
        <h1 className="nn-title">Takım Analizi</h1>
        <div className="nn-error mt-4">
          <p>Hata: {errorMessage}</p>
        </div>
      </div>
    );
  }
}
