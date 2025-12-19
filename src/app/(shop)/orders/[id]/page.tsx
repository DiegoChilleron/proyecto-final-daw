import { Title, PayPalButton, OrderStatus, ProductImage } from "@/components";
import { getOrderById } from "@/actions/order/get-order-by-id";
import { redirect } from "next/navigation";
import { currencyFormat } from "@/utils";
import { DeploymentStatusBadge } from "./ui/DeploymentStatusBadge";
import { DeploymentActions } from "./ui/DeploymentActions";


interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrdersByIdPage({ params }: Props) {

  const { id } = await params;

  const { ok, order } = await getOrderById(id);

  if (!ok) { redirect('/orders') };


  const address = order!.orderAddress;

  return (
    <div className="page-container">
      <div className="page-container__inner">
        <Title title={`Orden #${id.split('-').at(-1)}`} />
        <div className="page-container__grid">

          {/* Carrito */}
          <div className="page-section">
            <OrderStatus isPaid={order?.isPaid ?? false} />

            {/* Items */}
            {
              order!.orderItems.map(item => (
                <div key={item.product.slug} className="cart-item cart-item--detailed">
                  <ProductImage
                    src={item.product.productImages[0]?.url}
                    alt={item.product.title}
                    width={100}
                    height={100}
                    className="cart-item__image"
                  />
                  <div className="cart-item__info">
                    <p className="cart-item__title">{item.product.title}</p>
                    <p className="cart-item__price">{currencyFormat(item.price)} x {item.quantity}</p>
                    <p className="cart-item__subtotal">Subtotal: {currencyFormat(item.price * item.quantity)}</p>

                    {/* Estado del despliegue */}
                    <div className="cart-item__deployment">
                      <DeploymentStatusBadge
                        status={item.deploymentStatus}
                        deploymentUrl={item.deploymentUrl}
                      />
                      <DeploymentActions
                        orderItemId={item.id}
                        status={item.deploymentStatus}
                        isPaid={order?.isPaid ?? false}
                      />
                    </div>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Resumen de orden */}
          <div className="card">
            <h2 className="card__title">Dirección de facturación</h2>
            <div className="card__content">
              <p className="page-section__title">{address!.firstName} {address!.lastName}</p>
              <p>{address!.address}</p>
              <p>{address!.address2}</p>
              <p>{address!.postalCode}</p>
              <p>{address!.city}, {address!.countryId}</p>
              <p>{address!.phone}</p>
            </div>

            <div className="card__divider"></div>
            <h2 className="card__title">Resumen de orden</h2>
            <div className="order-summary">

              <span className="order-summary__label">No. Productos</span>
              <span className="order-summary__value">{order?.itemsInOrder === 1 ? '1 artículo' : `${order?.itemsInOrder} artículos`}</span>

              <span className="order-summary__label">Subtotal</span>
              <span className="order-summary__value">{currencyFormat(order!.subTotal)}</span>


              <span className="order-summary__label">Impuestos (21%)</span>
              <span className="order-summary__value">{currencyFormat(order!.tax)}</span>

              <span className="order-summary__total-label">Total:</span>
              <span className="order-summary__total-value">{currencyFormat(order!.total)}</span>

            </div>

            <div className="card__footer">

              {order?.isPaid ? (
                <OrderStatus isPaid={order?.isPaid ?? false} />
              ) : (
                <PayPalButton amount={order!.total} orderId={order!.id} />
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 