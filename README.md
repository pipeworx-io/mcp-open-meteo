# mcp-open-meteo

Open-Meteo MCP — weather forecast + historical reanalysis + sister APIs

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1339+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `forecast` | "What\'s the weather in [city]" / "weather forecast for [location]" / "will it rain tomorrow", "rain chance / probability this week" / "temperature in [place] this week" / "wind / precipitation / humidity forecast" — global weather forecast up to 16 days ahead, hourly or daily, at any lat/lng. Returns temperature, precipitation, wind, humidity, cloud cover, weather codes by default; pass hourly/daily arg for custom variables. Free, keyless, no signup (Open-Meteo / ECMWF + national weather services). Pair with geocode to convert "Paris" → lat/lng first. |
| `historical` | "What was the weather on [date]" / "historical weather for [location]" / "temperature in [city] last summer" / "rainfall during [period]" / "past weather data" — ERA5 reanalysis covering 1940-present at any global lat/lng. Returns hourly or daily temperature, precipitation, wind, humidity etc. for any date range. Use for climate analysis, retrospective event weather, or training data. |
| `geocode` | "What are the coordinates of [city]" / "lat lng for [place]" / "find [town] location" — resolve a place name (city, village, region) to lat/lng so the other Open-Meteo tools can use them. Free, keyless, multilingual; returns up to 100 matches ranked by population. Use before forecast / historical / air_quality / marine / flood when you only have a place name. |
| `air_quality` | "Air quality / AQI in [city]" / "is the air safe to breathe in [location]" / "pollution levels for [place]" / "smoke / smog / wildfire-smoke forecast" / "pollen forecast" — global air quality and pollen forecast at any lat/lng. Returns PM2.5, PM10, ozone (O3), NO2, SO2, CO, dust, and pollen (alder/birch/grass/mugwort/olive/ragweed) up to 5 days ahead, plus European AQI / US AQI. Free, keyless. |
| `marine` | "Wave / swell / surf forecast for [beach]" / "sea conditions in [bay]" / "wave height at [coordinates]" / "is it safe to sail" — global marine weather forecast (wave height, wave period, wave direction, wind waves, swell waves) at any ocean lat/lng. Free, keyless. Use for surf reports, sailing prep, fishing conditions, coastal planning. |
| `flood` | "Flood risk for [river]" / "river discharge forecast" / "will [river] flood" / "water levels at [location]" — daily river discharge forecast from the GloFAS global flood model. Returns predicted m³/s discharge up to 30 days ahead for any river-bearing lat/lng worldwide. Use for flood risk assessment, agriculture planning, hydrology research. |

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

Or connect to the full Pipeworx gateway for access to all 1339+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
