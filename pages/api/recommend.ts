import { createClient } from "embedbase-js";

// Let's create an Embedbase client with our API key
const embedbase = createClient("https://api.embedbase.xyz", process.env.EMBEDBASE_API_KEY);

export default async function recommend (req, res) {
	const query = req.body.query;
	if (!query) {
		res.status(400).json({ error: "Missing query" });
		return;
	}

	const datasetId = "recsys";
	// in this case even if we call the function search, 
	// we actually get recommendations
	let results = await embedbase.dataset(datasetId).search(query, {
		// We want to get the first 4 results
		limit: 4,
	});
	res.status(200).json(results);
}