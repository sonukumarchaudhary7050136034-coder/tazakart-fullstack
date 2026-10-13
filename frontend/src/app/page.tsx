import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryGrid from "@/components/CategoryGrid";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container-x py-8">
          <h1 className="text-xl font-bold mb-1">Shop by category</h1>
          <p className="text-sm mb-5" style={{ color: "var(--color-muted)" }}>
            Groceries and daily essentials, delivered to your door
          </p>
          <CategoryGrid />
        </div>
      </main>
      <Footer />
    </>
  );
}
