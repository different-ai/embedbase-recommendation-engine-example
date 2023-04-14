import Markdown from './Markdown';

interface ContentSectionProps {
  title: string
  content: string
}


export default function ContentSection({ title, content }: ContentSectionProps) {

  return (
    <div className="bg-white px-6 py-32 lg:px-8 prose lg:prose-xl">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h1>
        <Markdown>{content}</Markdown>
      </div>
    </div>
  )
}
