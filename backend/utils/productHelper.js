/**
 * Helper to compute dynamic sale fields on product objects:
 * - isOnSale: Boolean
 * - activePrice: Number (salePrice if active, otherwise price)
 * - discountPercent: Number (e.g. 20 for 20% off)
 */
export const formatProduct = (productDoc) => {
  if (!productDoc) return null;

  // Handle Mongoose document or plain JS object
  const product = typeof productDoc.toObject === "function" ? productDoc.toObject() : { ...productDoc };

  const now = new Date();
  const price = Number(product.price || 0);
  const salePrice = product.salePrice != null && product.salePrice !== "" ? Number(product.salePrice) : null;

  let isOnSale = false;
  if (salePrice != null && !isNaN(salePrice) && salePrice < price && salePrice > 0) {
    const afterStart = !product.saleStartDate || now >= new Date(product.saleStartDate);
    const beforeEnd = !product.saleEndDate || now <= new Date(product.saleEndDate);
    if (afterStart && beforeEnd) {
      isOnSale = true;
    }
  }

  const activePrice = isOnSale ? salePrice : price;
  const discountPercent = isOnSale && price > 0 ? Math.round(((price - salePrice) / price) * 100) : 0;

  return {
    ...product,
    isOnSale,
    activePrice,
    discountPercent,
    averageRating: Number((product.averageRating || 0).toFixed(1)),
    numReviews: Number(product.numReviews || 0),
    colors: Array.isArray(product.colors) ? product.colors : [],
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    variants: Array.isArray(product.variants) ? product.variants : [],
  };
};

export const formatProducts = (products) => {
  if (!Array.isArray(products)) return [];
  return products.map(formatProduct);
};
