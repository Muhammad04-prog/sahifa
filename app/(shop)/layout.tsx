import Navbar from "@/components/navbar";
import CartDrawer from "@/components/cart-drawer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <div className="flex-1">{children}</div>
      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Sahifa. All rights reserved.</p>
      </footer>
    </>
  );
}
