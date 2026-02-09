/**
 * Fetches daily mandi (AGMARKNET) price data from data.gov.in.
 * Schema: State, District, Market, Commodity, Variety, Arrival_Date, Min_Price, Max_Price, Modal_Price (per quintal).
 * Optional: return price per kg (Modal_Price / 100).
 */

const DEFAULT_BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d583-465a-a3a6-9f566f4a0f2a'

function get (key, obj) {
  if (obj == null) return undefined
  const lower = key.toLowerCase().replace(/_/g, '')
  const exact = obj[key] ?? obj[key.toLowerCase()]
  if (exact !== undefined) return exact
  for (const k of Object.keys(obj)) {
    if (k.toLowerCase().replace(/_/g, '') === lower) return obj[k]
  }
  return undefined
}

function toNum (v) {
  if (v == null || v === '') return null
  const n = Number(String(v).replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

/**
 * Normalize a raw record to standard schema (State, District, Market, Commodity, Variety, Arrival_Date, Min_Price, Max_Price, Modal_Price).
 */
function normalizeRecord (raw) {
  const state = get('state', raw) ?? get('State', raw) ?? ''
  const district = get('district', raw) ?? get('District', raw) ?? ''
  const market = get('market', raw) ?? get('Market', raw) ?? ''
  const commodity = get('commodity', raw) ?? get('Commodity', raw) ?? ''
  const variety = get('variety', raw) ?? get('Variety', raw) ?? ''
  const arrivalDate = get('arrival_date', raw) ?? get('Arrival_Date', raw) ?? get('arrivaldate', raw) ?? ''
  const minPrice = toNum(get('min_price', raw) ?? get('Min_Price', raw) ?? get('minprice', raw))
  const maxPrice = toNum(get('max_price', raw) ?? get('Max_Price', raw) ?? get('maxprice', raw))
  const modalPrice = toNum(get('modal_price', raw) ?? get('Modal_Price', raw) ?? get('modalprice', raw))

  return {
    State: String(state).trim(),
    District: String(district).trim(),
    Market: String(market).trim(),
    Commodity: String(commodity).trim(),
    Variety: String(variety).trim(),
    Arrival_Date: String(arrivalDate).trim(),
    Min_Price: minPrice,
    Max_Price: maxPrice,
    Modal_Price: modalPrice,
    modal_price_per_kg: modalPrice != null ? Math.round((modalPrice / 100) * 100) / 100 : null
  }
}

/**
 * Fetch mandi prices from the external API.
 * @param {object} options
 * @param {string} [options.state] - Filter by state name
 * @param {string} [options.district] - Filter by district
 * @param {string} [options.commodity] - Filter by commodity
 * @param {number} [options.limit=100] - Max records
 * @param {number} [options.offset=0] - Offset for pagination
 * @param {boolean} [options.pricePerKg=true] - Include modal_price_per_kg in each record
 */
export async function fetchMandiPrices (options = {}) {
  const apiKey = process.env.MANDI_API_KEY?.trim()
  if (!apiKey) {
    return {
      records: [],
      count: 0,
      source: 'AGMARKNET / data.gov.in',
      unit: 'Quintal (100 kg)',
      message: 'MANDI_API_KEY is not configured. Add it to backend .env to load live mandi data from data.gov.in.'
    }
  }

  const baseUrl = (process.env.MANDI_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '')
  const limit = Math.min(Number(options.limit) || 100, 500)
  const offset = Math.max(0, Number(options.offset) || 0)
  const pricePerKg = options.pricePerKg !== false

  const params = new URLSearchParams()
  params.set('api-key', apiKey)
  params.set('format', 'json')
  params.set('limit', String(limit))
  params.set('offset', String(offset))

  // Some data.gov.in APIs support filter params
  if (options.state?.trim()) params.set('filters[state]', options.state.trim())
  if (options.district?.trim()) params.set('filters[district]', options.district.trim())
  if (options.commodity?.trim()) params.set('filters[commodity]', options.commodity.trim())

  const url = `${baseUrl}?${params.toString()}`
  let res
  let data
  try {
    res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    const text = await res.text()

    // data.gov.in often returns HTML error pages instead of JSON on auth failure
    if (text.trim().startsWith('<')) {
      return {
        records: [],
        count: 0,
        source: 'AGMARKNET',
        unit: 'Quintal (100 kg)',
        message: 'Invalid MANDI_API_KEY. The API returned an HTML error page. efficient Please update the key in backend/.env.'
      }
    }

    if (!res.ok) {
      throw new Error(`Mandi API error: ${res.status} ${res.statusText}. ${text.slice(0, 200)}`)
    }
    
    try {
      data = JSON.parse(text)
    } catch (e) {
      throw new Error(`Failed to parse Mandi API response: ${text.slice(0, 100)}...`)
    }

    // Check for API-specific error structure (sometimes 200 OK but contains error message)
    if (data.message && !data.records) {
       throw new Error(`Mandi API Error: ${data.message}`)
    }

  } catch (err) {
    console.error('Mandi API Fetch Error:', err.message)
    if (err.message?.includes('Invalid MANDI_API_KEY')) {
        return {
            records: [],
            count: 0,
            source: 'AGMARKNET',
            unit: 'Quintal (100 kg)',
            message: err.message
        }
    }
    if (err.message?.startsWith('Mandi API error:')) throw err
    throw new Error(`Failed to fetch mandi data: ${err.message || 'network or parse error'}. Check MANDI_API_KEY and MANDI_API_BASE_URL.`)
  }

  const rawRecords = Array.isArray(data?.records) ? data.records : Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
  let normalized = rawRecords.map((r) => normalizeRecord(r))

  // Client-side filter if API doesn't support filters (case-insensitive)
  const state = options.state?.trim()?.toLowerCase()
  const district = options.district?.trim()?.toLowerCase()
  const commodity = options.commodity?.trim()?.toLowerCase()
  if (state || district || commodity) {
    normalized = normalized.filter((r) => {
      if (state && r.State.toLowerCase() !== state) return false
      if (district && !r.District.toLowerCase().includes(district)) return false
      if (commodity && !r.Commodity.toLowerCase().includes(commodity)) return false
      return true
    })
  }

  if (!pricePerKg) {
    normalized = normalized.map(({ modal_price_per_kg, ...rest }) => rest)
  }

  return {
    records: normalized,
    count: normalized.length,
    source: 'AGMARKNET / data.gov.in',
    unit: 'Quintal (100 kg)',
    price_per_kg_note: pricePerKg ? 'Modal_Price per kg = Modal_Price / 100' : null
  }
}
