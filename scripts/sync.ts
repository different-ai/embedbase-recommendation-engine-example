import glob from "glob";
import fs from "fs";
import { createClient, BatchAddDocument } from 'embedbase-js'
import { splitText } from 'embedbase-js/dist/main/split';
import { getPostBySlug } from "../lib/api";

try {
    require("dotenv").config({ path: ".env.local" });
} catch (e) {
    console.log("No .env file found" + e);
}
// you can find the api key at https://app.embedbase.xyz
const apiKey = process.env.EMBEDBASE_API_KEY;
// this is using the hosted instance
const url = 'https://api.embedbase.xyz'
const embedbase = createClient(url, apiKey)

const sync = async () => {
    // read all files under pages/* with .md extension
    // for each file, read the content
    const pathToPost = (path: string) => {
        const post = getPostBySlug(path.split("/").slice(-1)[0], [
            'title',
            'date',
            'slug',
            'excerpt',
            'content'
        ])
        return {
            data: post.content,
            metadata: {
                path: post.slug,
                title: post.title,
                date: post.date,
                excerpt: post.excerpt,
            }
        }
    };
    const documents = glob.sync("_posts/**/*.md").map(pathToPost);
    const chunks = []
    documents.map((document) =>
        splitText(document.data, {}, async ({ chunk, start, end }) => chunks.push({
            data: chunk,
            metadata: document.metadata,
        }))
    )
    const datasetId = `recsys`

    console.log(`Syncing to ${datasetId} ${chunks.length} documents`);

    const batchSize = 100;
    // add to embedbase by batches of size 100
    return Promise.all(
        chunks.reduce((acc: BatchAddDocument[][], chunk, i) => {
            if (i % batchSize === 0) {
                acc.push(chunks.slice(i, i + batchSize));
            }
            return acc;
        }, []).map((chunk) => embedbase.dataset(datasetId).batchAdd(chunk))
    )
        .then((e) => e.flat())
        .then((e) => console.log(`Synced ${e.length} documents to ${datasetId}`, e))
        .catch(console.error);
}

sync();