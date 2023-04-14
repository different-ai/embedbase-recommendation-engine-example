import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'


export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.push('/posts/understanding-machine-learning-embeddings')
  }, [router])
  return (
    <>
      <Head>
        <title>Embedbase recommendation engine</title>
        <meta name="description" content="Embedbase recommendation engine" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  )
}
