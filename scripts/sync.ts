import glob from "glob";
import { createClient, BatchAddDocument } from 'embedbase-js'
import { splitText } from 'embedbase-js/dist/main/split';
import { getPostBySlug } from "../lib/api";

try {
    // load the .env.local file to get the api key
    require("dotenv").config({ path: ".env.local" });
} catch (e) {
    console.log("No .env file found" + e);
}
// you can find the api key at https://app.embedbase.xyz
const apiKey = process.env.EMBEDBASE_API_KEY;
// this is using the hosted instance
const url = 'https://api.embedbase.xyz'
const embedbase = createClient(url, apiKey)

const batch = async (myList: any[], fn: (chunk: any[]) => Promise<any>) => {
    const batchSize = 100;
    // add to embedbase by batches of size 100
    return Promise.all(
        myList.reduce((acc: BatchAddDocument[][], chunk, i) => {
            if (i % batchSize === 0) {
                acc.push(myList.slice(i, i + batchSize));
            }
            return acc;
            // here we are using the batchAdd method to send the documents to embedbase
        }, []).map(fn)
    )
}

const sync = async () => {
    const pathToPost = (path: string) => {
        // We will use the function we created in the previous step
        // to parse the post content and metadata
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
    // read all files under _posts/* with .md extension
    const documents = glob.sync("_posts/**/*.md").map(pathToPost);

    // using chunks is useful to send batches of documents to embedbase
    // this is useful when you send a lot of data
    const chunks = []
    documents.map((document) =>
        splitText(document.data, {}, async ({ chunk, start, end }) => chunks.push({
            data: chunk,
            metadata: document.metadata,
        }))
    )
    const datasetId = `recsys`

    console.log(`Syncing to ${datasetId} ${chunks.length} documents`);

    // add to embedbase by batches of size 100
    return batch(chunks, (chunk) => embedbase.dataset(datasetId).batchAdd(chunk))
        .then((e) => e.flat())
        .then((e) => console.log(`Synced ${e.length} documents to ${datasetId}`, e))
        .catch(console.error);
}

sync();