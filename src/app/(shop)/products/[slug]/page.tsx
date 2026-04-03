import { getProductBySlug, getFeaturedProducts } from '@/app/actions/products'
import { notFound } from 'next/navigation'
import { ProductDetails } from '@/components/shop/product-details'
import { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Sản phẩm không tìm thấy | POTTERY.',
    }
  }

  return {
    title: `${product.title} | POTTERY. Gốm sứ Nghệ thuật`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image_url],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  const featuredProducts = await getFeaturedProducts(4)

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] pb-24 pt-32">
      <ProductDetails product={product} relatedProducts={featuredProducts} />
    </main>
  )
}
