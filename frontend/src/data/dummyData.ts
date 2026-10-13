export interface Product {
  id: string;
  name: string;
  unit: string;
  price: number;
  mrp: number;
  image: string;
  categorySlug: string;
  subCategorySlug: string;
  stock: number;
  deliveryTime: string;
}

export interface SubCategory {
  slug: string;
  name: string;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  subCategories: SubCategory[];
}

export const categories: Category[] = [
  {
    slug: "dairy-bread-eggs",
    name: "Dairy, Bread & Eggs",
    icon: "🥛",
    subCategories: [
      { slug: "milk", name: "Milk" },
      { slug: "bread-pav", name: "Bread & Pav" },
      { slug: "eggs", name: "Eggs" },
      { slug: "flakes-cereals", name: "Flakes & Kids Cereals" },
      { slug: "muesli-granola", name: "Muesli & Granola" },
      { slug: "oats", name: "Oats" },
    ],
  },
  {
    slug: "paan-corner",
    name: "Paan Corner",
    icon: "🍃",
    subCategories: [
      { slug: "paan", name: "Paan" },
      { slug: "mouth-freshener", name: "Mouth Freshener" },
    ],
  },
  {
    slug: "fruits-vegetables",
    name: "Fruits & Vegetables",
    icon: "🥦",
    subCategories: [
      { slug: "fresh-fruits", name: "Fresh Fruits" },
      { slug: "fresh-vegetables", name: "Fresh Vegetables" },
    ],
  },
  {
    slug: "cold-drinks-juices",
    name: "Cold Drinks & Juices",
    icon: "🥤",
    subCategories: [
      { slug: "soft-drinks", name: "Soft Drinks" },
      { slug: "juices", name: "Juices" },
    ],
  },
  {
    slug: "snacks-munchies",
    name: "Snacks & Munchies",
    icon: "🍿",
    subCategories: [
      { slug: "chips", name: "Chips & Crisps" },
      { slug: "namkeen", name: "Namkeen" },
    ],
  },
  {
    slug: "breakfast-instant-food",
    name: "Breakfast & Instant Food",
    icon: "🍳",
    subCategories: [
      { slug: "noodles", name: "Noodles" },
      { slug: "ready-to-eat", name: "Ready to Eat" },
    ],
  },
  {
    slug: "sweet-tooth",
    name: "Sweet Tooth",
    icon: "🍫",
    subCategories: [
      { slug: "chocolates", name: "Chocolates" },
      { slug: "ice-cream", name: "Ice Cream" },
    ],
  },
  {
    slug: "bakery-biscuits",
    name: "Bakery & Biscuits",
    icon: "🍪",
    subCategories: [
      { slug: "biscuits", name: "Biscuits" },
      { slug: "cakes", name: "Cakes & Rolls" },
    ],
  },
  {
    slug: "tea-coffee-milk-drinks",
    name: "Tea, Coffee & Milk Drinks",
    icon: "☕",
    subCategories: [
      { slug: "tea", name: "Tea" },
      { slug: "coffee", name: "Coffee" },
    ],
  },
  {
    slug: "atta-rice-dal",
    name: "Atta, Rice & Dal",
    icon: "🌾",
    subCategories: [
      { slug: "atta", name: "Atta & Flours" },
      { slug: "rice", name: "Rice" },
      { slug: "dal", name: "Dal & Pulses" },
    ],
  },
  {
    slug: "masala-oil",
    name: "Masala, Oil & More",
    icon: "🧂",
    subCategories: [
      { slug: "masala", name: "Masala & Spices" },
      { slug: "oil", name: "Edible Oil & Ghee" },
    ],
  },
  {
    slug: "personal-care",
    name: "Personal Care",
    icon: "🧴",
    subCategories: [
      { slug: "skin-care", name: "Skin Care" },
      { slug: "hair-care", name: "Hair Care" },
    ],
  },
];

export const products: Product[] = [
  { id: "p1", name: "Fresh Toned Milk", unit: "500 ml", price: 30, mrp: 32, image: "/products/milk-1.svg", categorySlug: "dairy-bread-eggs", subCategorySlug: "milk", stock: 100, deliveryTime: "10 MINS" },
  { id: "p2", name: "Full Cream Milk", unit: "500 ml", price: 36, mrp: 38, image: "/products/milk-2.svg", categorySlug: "dairy-bread-eggs", subCategorySlug: "milk", stock: 80, deliveryTime: "10 MINS" },
  { id: "p3", name: "Lactose Free Milk", unit: "250 ml", price: 26, mrp: 28, image: "/products/milk-3.svg", categorySlug: "dairy-bread-eggs", subCategorySlug: "milk", stock: 45, deliveryTime: "10 MINS" },
  { id: "p4", name: "A2 Cow Milk", unit: "1 ltr", price: 77, mrp: 82, image: "/products/milk-4.svg", categorySlug: "dairy-bread-eggs", subCategorySlug: "milk", stock: 0, deliveryTime: "10 MINS" },
  { id: "p5", name: "Toned Milk Pouch", unit: "500 ml", price: 30, mrp: 30, image: "/products/milk-5.svg", categorySlug: "dairy-bread-eggs", subCategorySlug: "milk", stock: 60, deliveryTime: "10 MINS" },
  { id: "p6", name: "Buffalo Milk", unit: "500 ml", price: 40, mrp: 42, image: "/products/milk-6.svg", categorySlug: "dairy-bread-eggs", subCategorySlug: "milk", stock: 25, deliveryTime: "10 MINS" },
  { id: "p7", name: "Brown Bread", unit: "400 g", price: 45, mrp: 48, image: "/products/bread-1.svg", categorySlug: "dairy-bread-eggs", subCategorySlug: "bread-pav", stock: 30, deliveryTime: "10 MINS" },
  { id: "p8", name: "White Bread", unit: "400 g", price: 40, mrp: 42, image: "/products/bread-2.svg", categorySlug: "dairy-bread-eggs", subCategorySlug: "bread-pav", stock: 30, deliveryTime: "10 MINS" },
  { id: "p9", name: "Pav Buns", unit: "6 pcs", price: 35, mrp: 38, image: "/products/bread-3.svg", categorySlug: "dairy-bread-eggs", subCategorySlug: "bread-pav", stock: 20, deliveryTime: "10 MINS" },
  { id: "p10", name: "White Eggs", unit: "6 pcs", price: 42, mrp: 45, image: "/products/eggs-1.svg", categorySlug: "dairy-bread-eggs", subCategorySlug: "eggs", stock: 50, deliveryTime: "10 MINS" },
  { id: "p11", name: "Brown Eggs", unit: "12 pcs", price: 84, mrp: 90, image: "/products/eggs-2.svg", categorySlug: "dairy-bread-eggs", subCategorySlug: "eggs", stock: 35, deliveryTime: "10 MINS" },
  { id: "p12", name: "Corn Flakes", unit: "475 g", price: 199, mrp: 220, image: "/products/cereal-1.svg", categorySlug: "dairy-bread-eggs", subCategorySlug: "flakes-cereals", stock: 15, deliveryTime: "10 MINS" },
  { id: "p13", name: "Chocolate Flakes", unit: "250 g", price: 149, mrp: 160, image: "/products/cereal-2.svg", categorySlug: "dairy-bread-eggs", subCategorySlug: "flakes-cereals", stock: 18, deliveryTime: "10 MINS" },
  { id: "p14", name: "Fruit Muesli", unit: "400 g", price: 249, mrp: 270, image: "/products/muesli-1.svg", categorySlug: "dairy-bread-eggs", subCategorySlug: "muesli-granola", stock: 12, deliveryTime: "10 MINS" },
  { id: "p15", name: "Rolled Oats", unit: "1 kg", price: 159, mrp: 175, image: "/products/oats-1.svg", categorySlug: "dairy-bread-eggs", subCategorySlug: "oats", stock: 40, deliveryTime: "10 MINS" },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: string, subSlug?: string) {
  return products.filter(
    (p) => p.categorySlug === slug && (!subSlug || p.subCategorySlug === subSlug)
  );
}

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}
