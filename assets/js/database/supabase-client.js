/**
 * VideoAdmin - Supabase Client Configuration
 * Connects the web application to the Supabase cloud backend.
 *
 * Key format: "sb_publishable_..." is the new Supabase Publishable Key
 * (replaces the legacy JWT anon key). Fully compatible with @supabase/supabase-js v2.
 */

export const SUPABASE_CONFIG = {
  url: 'https://vycirvbnpqtyargapwnt.supabase.co',
  anonKey: 'sb_publishable_cSn1ylPIdmFPx294lrvqag_sw9m8cG5'
};

let _client = null;

let _status = {
  tested: false,
  connected: false,
  error: null,
  latencyMs: 0
};

/**
 * Returns a singleton Supabase client instance.
 * Loads the SDK once from jsDelivr CDN (ESM bundle).
 * @returns {Promise<import('@supabase/supabase-js').SupabaseClient|null>}
 */
export async function getSupabase() {
  if (_client) return _client;

  try {
    const { createClient } = await import(
      'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'
    );
    _client = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return _client;
  } catch (err) {
    console.error('[Supabase] Failed to load SDK from CDN:', err);
    _status.error = err.message;
    return null;
  }
}

/**
 * Tests connectivity to the Supabase project by calling the REST health endpoint.
 * @returns {Promise<{ connected: boolean, latencyMs: number, error: string|null }>}
 */
export async function testSupabaseConnection() {
  const t0 = performance.now();

  try {
    const client = await getSupabase();
    if (!client) {
      _status = { tested: true, connected: false, error: 'SDK load failed', latencyMs: 0 };
      return _status;
    }

    // Use the Supabase REST endpoint: a HEAD request to the users table is lightweight
    const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/users?limit=1`, {
      method: 'HEAD',
      headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
      }
    });

    const ms = Math.round(performance.now() - t0);

    // 200 = OK, 404 = table not yet created, both mean the project is reachable
    if (response.ok || response.status === 404 || response.status === 406) {
      _status = { tested: true, connected: true, error: null, latencyMs: ms };
    } else {
      _status = {
        tested: true,
        connected: false,
        error: `HTTP ${response.status}`,
        latencyMs: ms
      };
    }
  } catch (err) {
    const ms = Math.round(performance.now() - t0);
    _status = { tested: true, connected: false, error: err.message, latencyMs: ms };
  }

  return _status;
}

export function getConnectionStatus() {
  return { ..._status };
}
