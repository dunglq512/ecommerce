'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCollection(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const description = formData.get('description') as string

  // Generate Slug
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const { error } = await supabase
    .from('collections')
    .insert([{
      title,
      slug,
      description,
      image_url: '/images/hero.png' // Default placeholder
    }])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/collections')
  redirect('/admin/collections')
}

export async function deleteCollection(id: number) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/collections')
}
