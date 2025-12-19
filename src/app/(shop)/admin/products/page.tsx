
export const revalidate = 0;

import { getPaginatedOrders, getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductImage, Title } from '@/components';
import { redirect } from 'next/navigation';

import Image from 'next/image';
import Link from 'next/link';
import { currencyFormat } from '@/utils/currencyFormat';

interface Props {
  searchParams: Promise<{
    page?: string;
  }>
}

export default async function OrdersPage({ searchParams }: Props) {

  const { page: pageParam } = await searchParams;
  const page = pageParam ? parseInt(pageParam) : 1;
  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ page });


  const { ok, orders = [] } = await getPaginatedOrders();

  if (!ok) { redirect('/auth/login') };


  return (
    <>
      <Title title="Gestión de Productos" />

      <div className="admin-container">

        <Link href="/admin/product/new" className="btn-primary">Nuevo producto</Link>


      </div>




      <section className="mb-10">
        <div className="overflow-x-auto">
        <table className="data-table">
          <thead className="data-table__head">
            <tr>
              <th scope="col" className="data-table__th">
                Imagen
              </th>
              <th scope="col" className="data-table__th">
                Titulo
              </th>
              <th scope="col" className="data-table__th">
                Precio
              </th>
              <th scope="col" className="data-table__th">
                Tipo
              </th>
              <th scope="col" className="data-table__th">
                Características
              </th>
            </tr>
          </thead>
          <tbody>

            {products.map(product => (

              <tr key={product.id} className="data-table__row">

                <td className="data-table__cell data-table__cell--medium">
                  <Link href={`/product/${product.slug}`}>
                    <ProductImage src={product.productImages[0]?.url} width={80} height={80} alt={product.title} className="w-20 h-20 object-cover rounded" />
                  </Link>
                </td>
                <td className="data-table__cell">
                  <Link href={`/admin/product/${product.slug}`} className="data-table__link">{product.title}</Link>
                </td>
                <td className="data-table__cell data-table__cell--bold">

                  {currencyFormat(product.price)}

                </td>
                <td className="data-table__cell">

                  {product.templateType}

                </td>
                <td className="data-table__cell data-table__cell--truncate">

                  {product.features?.slice(0, 3).join(', ')}

                </td>


              </tr>
            ))}

          </tbody>
        </table>  
        </div>
        <Pagination totalPages={totalPages} />
      </section>
    </>
  );
}