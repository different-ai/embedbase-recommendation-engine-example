import useSWR, { Fetcher } from "swr";
import BlogSection from "../../components/BlogSection";
import ContentSection from "../../components/ContentSection";
import { ClientSearchData } from "embedbase-js";
import { getPostBySlug } from "../../lib/api";
export default function Index({ post }) {
    const fetcherSearch: Fetcher<ClientSearchData, string> = () => fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: post.content }),
    }).then((res) => res.json());
    const { data: similarities, error: errorSearch } =
        useSWR('/api/search', fetcherSearch);
    console.log("similarities", similarities);
    return (
        <main className='flex flex-col md:flex-row'>
            <div className='flex-1'>
                <ContentSection title={post.title} content={post.content} />
            </div>
            <aside className='md:w-1/3 md:ml-8'>
                <BlogSection posts={similarities
                    // @ts-ignore
                    ?.filter((result) => result.metadata.path !== post.slug)
                    .map((similarity) => ({
                        id: similarity.hash,
                        // @ts-ignore
                        title: similarity.metadata?.title,
                        // @ts-ignore
                        href: similarity.metadata?.path,
                        // @ts-ignore
                        date: similarity.metadata?.date.split('T')[0],
                        // @ts-ignore
                        snippet: similarity.metadata?.excerpt,
                    })) || []} />
            </aside>
        </main>
    )
}


export const getServerSideProps = async (ctx) => {
    const { post: postPath } = ctx.params
    const post = getPostBySlug(postPath, [
        'title',
        'date',
        'slug',
        'excerpt',
        'content'
    ])
    return {
        props: {
            post: post,
        },
    }
}