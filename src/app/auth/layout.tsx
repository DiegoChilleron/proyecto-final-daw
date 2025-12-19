import './auth.css';

export default function ShopLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <main className="auth__container">
      <div className="auth__wrapper">
        {children}
      </div>
    </main>
  );
}