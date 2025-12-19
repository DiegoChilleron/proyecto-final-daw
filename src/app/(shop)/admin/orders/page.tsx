
export const revalidate = 0;

import { getPaginatedOrders } from '@/actions';
import { Title } from '@/components';
import { redirect } from 'next/navigation';

import Link from 'next/link';
import { IoCardOutline } from 'react-icons/io5';

export default async function OrdersPage() {

  const { ok, orders = [] } = await getPaginatedOrders();

  if (!ok) { redirect('/auth/login') };


  return (
    <>
      <Title title="Todos los pedidos" />

      <div className="mb-10">
        <table className="data-table">
          <thead className="data-table__head">
            <tr>
              <th scope="col" className="data-table__th">
                #ID
              </th>
              <th scope="col" className="data-table__th">
                Nombre completo
              </th>
              <th scope="col" className="data-table__th">
                Estado
              </th>
              <th scope="col" className="data-table__th">
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>

            {orders.map(order => (

              <tr key={order.id} className="data-table__row">

                <td className="data-table__cell data-table__cell--medium">{order.id.split('-').at(-1)}</td>
                <td className="data-table__cell">
                  {order.orderAddress?.firstName} {order.orderAddress?.lastName}
                </td>
                <td className="data-table__cell data-table__cell--status">

                  {
                    order.isPaid ? (
                      <>
                        <IoCardOutline className="data-table__status--paid" />
                        <span className='data-table__status-text data-table__status--paid'>Pagada</span>
                      </>
                    ) : (
                      <>
                        <IoCardOutline className="data-table__status--unpaid" />
                        <span className='data-table__status-text data-table__status--unpaid'>No Pagada</span>

                      </>
                    )
                  }

                </td>
                <td className="data-table__cell">
                  <Link href={`/orders/${order.id}`} className="data-table__link">
                    Ver orden
                  </Link>
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </>
  );
}