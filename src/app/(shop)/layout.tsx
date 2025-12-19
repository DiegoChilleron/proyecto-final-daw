import { TopMenu, Sidebar, Footer } from "@/components";
import './shop.css';

export default function ShopLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <main className="shop-layout">
      <TopMenu />
      <Sidebar />
      <div className="shop-layout__content">
        {children}
      </div>
      <Footer />
    </main>
  );
}