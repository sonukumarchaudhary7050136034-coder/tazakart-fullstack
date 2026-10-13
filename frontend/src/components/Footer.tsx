const linkCols = [
  { title: "Useful Links", links: ["Blog", "Privacy", "Terms", "FAQs", "Security", "Contact"] },
  { title: "Partner", links: ["Franchise", "Seller", "Warehouse", "Deliver"] },
  { title: "Categories", links: ["Bath & Body", "Beauty", "Health & Pharma", "Atta, Rice & Dal"] },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white" style={{ borderColor: "var(--color-line)" }}>
      <div className="container-x py-10 grid grid-cols-2 md:grid-cols-3 gap-8">
        {linkCols.map((col) => (
          <div key={col.title}>
            <h4 className="font-bold mb-3 text-sm">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l} className="text-sm" style={{ color: "var(--color-muted)" }}>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-x py-4 text-xs border-t" style={{ borderColor: "var(--color-line)", color: "var(--color-muted)" }}>
        © {new Date().getFullYear()} TazaKart. All rights reserved.
      </div>
    </footer>
  );
}
