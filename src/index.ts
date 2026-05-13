interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Open-Meteo MCP — weather forecast + historical reanalysis + sister APIs
 *
 * Auth: none (non-commercial fair-use only).
 * Docs: https://open-meteo.com/en/docs
 */


const FORECAST = 'https://api.open-meteo.com/v1/forecast';
const HISTORICAL = 'https://archive-api.open-meteo.com/v1/archive';
const GEO = 'https://geocoding-api.open-meteo.com/v1/search';
const AIR = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const MARINE = 'https://marine-api.open-meteo.com/v1/marine';
const FLOOD = 'https://flood-api.open-meteo.com/v1/flood';

const DEFAULT_HOURLY = 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,cloud_cover,weather_code';
const DEFAULT_DAILY = 'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,weather_code';

const tools: McpToolExport['tools'] = [
  {
    name: 'forecast',
    description: 'Weather forecast up to 16 days, hourly or daily.',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: { type: 'number' },
        longitude: { type: 'number' },
        hourly: { type: 'string', description: 'Comma-separated hourly variables. Default sensible set.' },
        daily: { type: 'string', description: 'Comma-separated daily variables. Default sensible set.' },
        forecast_days: { type: 'number', description: '1-16 (default 7)' },
        past_days: { type: 'number', description: '0-92 (default 0)' },
        timezone: { type: 'string', description: 'IANA timezone or "auto"' },
        temperature_unit: { type: 'string', description: 'celsius (default) | fahrenheit' },
        wind_speed_unit: { type: 'string', description: 'kmh | ms | mph | kn' },
      },
      required: ['latitude', 'longitude'],
    },
  },
  {
    name: 'historical',
    description: 'ERA5 reanalysis 1940-present. Date range required.',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: { type: 'number' },
        longitude: { type: 'number' },
        start_date: { type: 'string', description: 'YYYY-MM-DD' },
        end_date: { type: 'string', description: 'YYYY-MM-DD' },
        hourly: { type: 'string' },
        daily: { type: 'string' },
        timezone: { type: 'string' },
      },
      required: ['latitude', 'longitude', 'start_date', 'end_date'],
    },
  },
  {
    name: 'geocode',
    description: 'Resolve a place name to coordinates.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Place name (any language)' },
        count: { type: 'number', description: 'Max results, 1-100 (default 10)' },
        language: { type: 'string', description: 'ISO-639 lang for returned names (default en)' },
      },
      required: ['name'],
    },
  },
  {
    name: 'air_quality',
    description: 'PM2.5, PM10, O3, NO2, SO2, CO, dust, pollen.',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: { type: 'number' },
        longitude: { type: 'number' },
        hourly: { type: 'string', description: 'Comma-separated variables. Default pm2_5,pm10,o3,no2,european_aqi' },
        forecast_days: { type: 'number', description: '1-5 (default 5)' },
      },
      required: ['latitude', 'longitude'],
    },
  },
  {
    name: 'marine',
    description: 'Wave height + period + direction (forecast).',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: { type: 'number' },
        longitude: { type: 'number' },
        hourly: { type: 'string', description: 'Default wave_height,wave_period,wind_wave_height' },
        forecast_days: { type: 'number' },
      },
      required: ['latitude', 'longitude'],
    },
  },
  {
    name: 'flood',
    description: 'Daily river discharge forecast (GloFAS model).',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: { type: 'number' },
        longitude: { type: 'number' },
        daily: { type: 'string', description: 'Default river_discharge' },
        forecast_days: { type: 'number' },
      },
      required: ['latitude', 'longitude'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'forecast':
      return forecast(args);
    case 'historical':
      return historical(args);
    case 'geocode':
      return geocode(args);
    case 'air_quality':
      return airQuality(args);
    case 'marine':
      return marine(args);
    case 'flood':
      return flood(args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function forecast(args: Record<string, unknown>) {
  const params = baseLatLon(args);
  params.set('hourly', (args.hourly as string) ?? DEFAULT_HOURLY);
  params.set('daily', (args.daily as string) ?? DEFAULT_DAILY);
  if (args.forecast_days !== undefined) params.set('forecast_days', String(args.forecast_days));
  if (args.past_days !== undefined) params.set('past_days', String(args.past_days));
  if (args.timezone) params.set('timezone', String(args.timezone));
  if (args.temperature_unit) params.set('temperature_unit', String(args.temperature_unit));
  if (args.wind_speed_unit) params.set('wind_speed_unit', String(args.wind_speed_unit));
  return meteoGet(FORECAST, params);
}

async function historical(args: Record<string, unknown>) {
  const params = baseLatLon(args);
  params.set('start_date', reqStr(args, 'start_date', '"2020-01-01"'));
  params.set('end_date', reqStr(args, 'end_date', '"2020-12-31"'));
  params.set('hourly', (args.hourly as string) ?? DEFAULT_HOURLY);
  params.set('daily', (args.daily as string) ?? DEFAULT_DAILY);
  if (args.timezone) params.set('timezone', String(args.timezone));
  return meteoGet(HISTORICAL, params);
}

async function geocode(args: Record<string, unknown>) {
  const params = new URLSearchParams({
    name: reqStr(args, 'name', '"Tokyo"'),
    count: String(Math.min(100, Math.max(1, (args.count as number) ?? 10))),
    language: String(args.language ?? 'en'),
    format: 'json',
  });
  return meteoGet(GEO, params);
}

async function airQuality(args: Record<string, unknown>) {
  const params = baseLatLon(args);
  params.set('hourly', (args.hourly as string) ?? 'pm2_5,pm10,ozone,nitrogen_dioxide,european_aqi');
  if (args.forecast_days !== undefined) params.set('forecast_days', String(args.forecast_days));
  return meteoGet(AIR, params);
}

async function marine(args: Record<string, unknown>) {
  const params = baseLatLon(args);
  params.set('hourly', (args.hourly as string) ?? 'wave_height,wave_period,wind_wave_height,wind_wave_period');
  if (args.forecast_days !== undefined) params.set('forecast_days', String(args.forecast_days));
  return meteoGet(MARINE, params);
}

async function flood(args: Record<string, unknown>) {
  const params = baseLatLon(args);
  params.set('daily', (args.daily as string) ?? 'river_discharge');
  if (args.forecast_days !== undefined) params.set('forecast_days', String(args.forecast_days));
  return meteoGet(FLOOD, params);
}

function baseLatLon(args: Record<string, unknown>): URLSearchParams {
  return new URLSearchParams({
    latitude: String(reqNum(args, 'latitude', '35.6895')),
    longitude: String(reqNum(args, 'longitude', '139.6917')),
  });
}

async function meteoGet(url: string, params: URLSearchParams) {
  const res = await fetch(`${url}?${params}`, { headers: { Accept: 'application/json' } });
  if (res.status === 429) throw new Error('Open-Meteo: rate-limit (HTTP 429)');
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Open-Meteo error: ${res.status} ${t.slice(0, 300)}`);
  }
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}
function reqNum(args: Record<string, unknown>, key: string, example: string): number {
  const v = args[key];
  if (typeof v !== 'number' || !Number.isFinite(v)) {
    throw new Error(`Required argument "${key}" must be a number. Example: ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
