'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, collections(title), themes(name)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, collections(*), themes(*)')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data
}

export async function getProductById(id: number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, collections(*), themes(*)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product by ID:', error)
    return null
  }

  return data
}

export async function getCollections() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('title', { ascending: true })

  if (error) {
    console.error('Error fetching collections:', error)
    return []
  }

  return data
}

export async function getFeaturedProducts(limit = 4) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      collections (title),
      themes (name)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('❌ Supabase Error:', error)
    return []
  }

  return data
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const original_price = formData.get('original_price') ? parseFloat(formData.get('original_price') as string) : null
  const stock = parseInt(formData.get('stock') as string)
  const collection_id = formData.get('collection_id') ? parseInt(formData.get('collection_id') as string) : null
  const imageFile = formData.get('image') as File

  // 1. Generate Slug
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  let image_url = '/images/hero.png'

  // 2. Upload Image if provided
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('pottery')
      .upload(filePath, imageFile)

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('pottery')
        .getPublicUrl(filePath)
      
      image_url = publicUrl
    }
  }

  // 3. Insert into Database
  const { error } = await supabase
    .from('products')
    .insert([{
      title,
      slug,
      description,
      price,
      original_price,
      stock,
      collection_id,
      image_url
    }])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  revalidatePath('/')
  redirect('/admin/products')
}

export async function updateProduct(id: number, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const original_price = formData.get('original_price') ? parseFloat(formData.get('original_price') as string) : null
  const stock = parseInt(formData.get('stock') as string)
  const collection_id = formData.get('collection_id') ? parseInt(formData.get('collection_id') as string) : null
  const imageFile = formData.get('image') as File
  const currentImageUrl = formData.get('current_image_url') as string

  // 1. Generate Slug
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  let image_url = currentImageUrl

  // 2. Upload NEW Image if provided
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `products/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('pottery')
      .upload(filePath, imageFile)

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('pottery')
        .getPublicUrl(filePath)
      
      image_url = publicUrl
    }
  }

  // 3. Update Database
  console.log('📝 Cập nhật sản phẩm ID:', id)
  console.log('📊 Dữ liệu mới:', { title, price, original_price, stock, collection_id })

  const { error } = await supabase
    .from('products')
    .update({
      title,
      slug,
      description,
      price,
      original_price,
      stock,
      collection_id,
      image_url
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  revalidatePath('/')
  redirect('/admin/products')
}

export async function deleteProduct(id: number) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
}
