import { Title } from "@/components";
import { initialData } from "@/seed/initialData";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductsInCart } from "./ui/ProductsInCart";
import { OrderSummary } from "./ui/OrderSummary";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

export default function CartPage() {

  // redirect('/empty');


  return (
    <div className="page-container">
      <div className="page-container__inner">
        <Title title='Carrito' />
        <div className="page-container__grid">

          {/* Carrito */}
          <div className="page-section">
            <span className="page-section__title">Agregar más items</span>
            <Link href="/" className="page-section__link">Continúa comprando</Link>


            {/* Items */}
            <ProductsInCart />
          </div>

          {/* Resumen de orden */}

          <div className="card card--fit">
            <h2 className="card__title">Resumen de orden</h2>
            <div className="order-summary">
              <OrderSummary />
            </div>

            <div className="card__footer">
              <Link href="/checkout/address" className="flex btn-primary justify-center">Checkout</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 