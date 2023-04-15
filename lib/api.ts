import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

// Get the absolute path to the posts directory
const postsDirectory = join(process.cwd(), '_posts')


export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '')
  // Get the absolute path to the markdown file
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  // Read the markdown file as a string
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  // Use gray-matter to parse the post metadata section
  const { data, content } = matter(fileContents)

  type Items = {
    [key: string]: string
  }

  const items: Items = {}

  // Store each field in the items object
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })

  return items
}

