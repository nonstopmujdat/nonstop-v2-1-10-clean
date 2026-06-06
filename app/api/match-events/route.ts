import { NextResponse } from 'next/server';
import { getUserId, hasSupabaseAdminEnv, insertOne, jsonError } from '@/lib/apiHelpers';

// Operator UI sometimes sends old short codes. Supabase should receive the stable event names.
const EVENT_TYPE_MAP: Record<string, string> = {
  '2PM': '2PA_MADE',
  '2PA': '2PA_MISS',
  '2PA_MADE': '2PA_MADE',
  '2PA_MISS': '2PA_MISS',
  '3PM': '3PA_MADE',
  '3PA': '3PA_MISS',
  '3PA_MADE': '3PA_MADE',
  '3PA_MISS': '3PA_MISS',
  'FTM': 'FTA_MADE',
  'FTA': 'FTA_MISS',
  'FTA_MADE': 'FTA_MADE',
  'FTA_MISS': 'FTA_MISS',
  'PF': 'FOUL',
  'FOUL': 'FOUL',
  'FD': 'FOUL_DRAWN',
  'FOUL_DRAWN': 'FOUL_DRAWN',
  'BY': 'BLK_AGAINST',
  'BLOCKED': 'BLK_AGAINST',
  'BLK_AGAINST': 'BLK_AGAINST',
  'BLK': 'BLK',
  'AST': 'AST',
  'OREB': 'OREB',
  'DREB': 'DREB',
  'STL': 'STL',
  'TOV': 'TOV',
  'TIMEOUT': 'TIMEOUT',
  'SUBSTITUTION': 'SUBSTITUTION',
  'CHARGE_DRAWN': 'CHARGE_DRAWN'
};

function normalizeEventType(value: unknown) {
  const raw = String(value || '').trim().toUpperCase();
  return EVENT_TYPE_MAP[raw] || '';
}

function asInteger(value: unknown, fallback?: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawEventType = body.event_type || body.type;
    const eventType = normalizeEventType(rawEventType);

    if (!eventType) {
      return jsonError(`unsupported event_type: ${rawEventType || '(empty)'}`, 400, { received: rawEventType });
    }

    const quarter = asInteger(body.quarter, 1);
    const matchId = asInteger(body.match_id);
    const teamId = asInteger(body.team_id);
    const playerId = asInteger(body.player_id);
    const relatedPlayerId = asInteger(body.related_player_id);

    const notesObject = typeof body.notes === 'string'
      ? body.notes
      : JSON.stringify({ raw_event_type: rawEventType, normalized_event_type: eventType, ...body });

    const payload: Record<string, any> = {
      client_event_id: body.client_event_id || body.event_id,
      match_id: matchId,
      team_id: teamId,
      player_id: playerId,
      related_player_id: relatedPlayerId,
      quarter,
      game_clock: body.game_clock || null,
      event_type: eventType,
      event_tags: body.event_tags || null,
      linked_basket_id: body.linked_basket_id || null,
      operator_side: body.operator_side || 'HOME_OPERATOR',
      sync_source: body.sync_source || 'WEB',
      client_created_at: body.client_created_at || body.created_local_at || new Date().toISOString(),
      created_by: getUserId(req),
      notes: notesObject
    };

    if (!payload.match_id || !payload.team_id || !payload.quarter) {
      return jsonError('match_id, team_id and quarter are required', 400, payload);
    }

    if (!hasSupabaseAdminEnv()) {
      return NextResponse.json({ ok: true, mode: 'demo-no-db', message: 'match event accepted', data: payload });
    }

    const data = await insertOne('match_events', payload);
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return jsonError('match event insert failed', 500, err.message || err);
  }
}
