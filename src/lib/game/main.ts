import { PMTiles } from "pmtiles";
import { VectorTile } from "@mapbox/vector-tile";
import Protobuf from "pbf";

const p = new PMTiles("/netherlands.pmtiles");

async function inspect() {
    // 1. Header — tile type, zoom range, bounds
    const header = await p.getHeader();
    console.log("=== HEADER ===");
    console.log(header);

    // 2. Metadata — vector_layers schema
    const meta = await p.getMetadata();
    console.log("\n=== METADATA ===");
    console.log(JSON.stringify(meta, null, 2));

    // 3. TileJSON
    const tileJson = await p.getTileJson("https://api.protomaps.com/tiles/v4");
    console.log("\n=== TILEJSON ===");
    console.log(JSON.stringify(tileJson, null, 2));

    // 4. Fetch a single tile — Amsterdam city center at z14
    // Tile coords for Amsterdam: z=14, x=8383, y=5382
    const result = await p.getZxy(14, 8383, 5382);
    if (!result) {
        console.log("\nTile not found in archive");
        return;
    }

    console.log("\n=== RAW TILE ===");
    console.log("Byte length:", result.data.byteLength);

    // 5. Decode the MVT protobuf
    const tile = new VectorTile(new Protobuf(result.data));

    console.log("\n=== TILE LAYERS ===");
    const layerNames = Object.keys(tile.layers);
    console.log("Layers present:", layerNames);

    // 6. Inspect each layer
    for (const name of layerNames) {
        const layer = tile.layers[name];
        console.log(`\n  [${name}] — ${layer.length} features`);

        // Print first 3 features of each layer
        const preview = Math.min(3, layer.length);
        for (let i = 0; i < preview; i++) {
            const feature = layer.feature(i);
            console.log(`    feature ${i}:`, {
                type: feature.type, // 1=Point, 2=LineString, 3=Polygon
                properties: feature.properties,
            });
        }
    }
}

inspect().catch(console.error);