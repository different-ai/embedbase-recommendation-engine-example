import { createClient } from "embedbase-js";

// Let's create an Embedbase client with our API key
const embedbase = createClient("https://api.embedbase.xyz", process.env.EMBEDBASE_API_KEY);

export default async function search (req, res) {
    const query = req.body.query;
    if (!query) {
        res.status(400).json({ error: "Missing query" });
        return;
    }

    const datasetId = "recsys";
    let results = await embedbase.dataset(datasetId).search(query, {
        // We want to get the first 4 results
        limit: 4,
    });
    res.status(200).json(results);
}

/*
curl -X POST -H "Content-Type: application/json" -d '{"query": "I like Apples but not Bananas!"}' http://localhost:3000/api/search 2>/dev/null | jq '.[0].data'
*/