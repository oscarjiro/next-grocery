import { getFilteredProducts } from './actions'
import ProductCard from './ProductCard'

export default async function ProductGrid({ query, page }: { query: string; page: number }) {
  const { products, error: productsError } = await getFilteredProducts(page, query)
  if (productsError) {
    console.error('Error fetching products:', productsError)
  }

  return (
    <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 w-full gap-4'>
      {products?.length ? (
        products.map(product => <ProductCard key={product.id} product={product} />)
      ) : (
        <p>No products yet :(</p>
      )}
    </section>
  )
}
