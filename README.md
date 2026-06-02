# mcp-open-meteo

Open-Meteo MCP — weather forecast + historical reanalysis + sister APIs

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `forecast` | Weather forecast up to 16 days, hourly or daily. |
| `historical` | ERA5 reanalysis 1940-present. Date range required. |
| `geocode` | Resolve a place name to coordinates. |
| `air_quality` | PM2.5, PM10, O3, NO2, SO2, CO, dust, pollen. |
| `marine` | Wave height + period + direction (forecast). |
| `flood` | Daily river discharge forecast (GloFAS model). |

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

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

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
