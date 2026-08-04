# @pipeworx/open-meteo

Open-Meteo MCP — global weather forecasts + historical reanalysis. No auth (non-commercial fair-use only).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `forecast(latitude, longitude, hourly?, daily?, forecast_days?, timezone?)` — up to 16-day forecast
- `historical(latitude, longitude, start_date, end_date, hourly?, daily?)` — ERA5 reanalysis 1940→
- `geocode(name, count?, language?)` — place-name → coordinates
- `air_quality(latitude, longitude, hourly?)` — global PM/O3/NO2 forecast
- `marine(latitude, longitude, hourly?)` — wave height + period
- `flood(latitude, longitude, daily?)` — river discharge forecast (GloFAS)

## Data source

`https://api.open-meteo.com/v1/` and friends — public, no auth. Fair-use limit 10k req/day per IP.

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "open-meteo": {
      "url": "https://gateway.pipeworx.io/open-meteo/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Open Meteo data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
