import { getGdayPunchStaticUrl } from "./utils";

export function normaliseProductData(product) {
  if (!product) {
    return { pdf: null };
  }

  return {
    id: product.id,
    user: product.user,
    pdf: getGdayPunchStaticUrl(product.pdf_live),
    title: product.title,
    cover: getGdayPunchStaticUrl(product.image),
    description: product.description,
    age_rating: product.age_rating,
    orientation: product.orientation,
    sku: product.sku,
    release_date: product.release_date,
    pages: product.page_count,
    product_type: product.product_type,
    active_price: product.active_price,
    stripe_prices: product.stripe_prices,
  };
}
