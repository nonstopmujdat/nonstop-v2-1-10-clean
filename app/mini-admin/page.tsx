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
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Mini Admin - Team Dashboard</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <p className="text-yellow-800">
            Supabase admin configuration is not set up. Please configure your environment variables.
          </p>
        </div>
      </div>
    );
  }

  try {
    const supabase = await getSupabaseAdmin();

    const { data, error } = await supabase
      .from('team_dashboard')
      .select('*')
      .order('team_id', { ascending: true });

    if (error) {
      return (
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Mini Admin - Team Dashboard</h1>
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-800">Error loading data: {error.message}</p>
          </div>
        </div>
      );
    }

    const rows: TeamDashboardRow[] = data || [];

    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Mini Admin - Team Dashboard</h1>

        <div className="mb-4">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>

        {rows.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <p className="text-gray-600">No team data available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Team ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Team Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Games</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Points</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Rebounds</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Assists</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Turnovers</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Steals</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Blocks</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Fouls</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Eff FG%</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">TS%</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.team_id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{row.team_id}</td>
                    <td className="border border-gray-300 px-4 py-2">{row.team_name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{row.games}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{row.points}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{row.rebounds}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{row.assists}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{row.turnovers}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{row.steals}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{row.blocks}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{row.fouls}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
                      {row.efg_pct ? `${(row.efg_pct * 100).toFixed(1)}%` : '-'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-right">
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
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Mini Admin - Team Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-800">Error: {errorMessage}</p>
        </div>
      </div>
    );
  }
}
