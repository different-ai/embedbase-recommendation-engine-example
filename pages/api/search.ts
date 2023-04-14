import { createClient } from "embedbase-js";


const client = createClient("https://api.embedbase.xyz", process.env.EMBEDBASE_API_KEY);
export default async function search (req, res) {
    const query = req.body.query;
    if (!query) {
        res.status(400).json({ error: "Missing query" });
        return;
    }

    console.log("Searching for", query);
    let results = await client.dataset("recsys").search(query, {
        limit: 4,
    });
    console.log("Results", results);
    res.status(200).json(results);
}

