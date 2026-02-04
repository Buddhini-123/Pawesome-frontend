
import {host} from "../services/api"

const normalizeImage = (image?: string) => {
  if (!image) return '/placeholder.png';

  // Already absolute URL
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  // Storage relative path
  if (image.startsWith('/storage')) {
    return `${host}${image}`;
  }

  // Fallback
  return image;
};

export const normalizeCartItem = (item: any) => {
  const product = item.product ?? {};

  const rawImage =
    product.image ||
    product.primary_image?.url ||
    product.primary_image?.path ||
    product.gallery?.[0];

  return {
    id: String(item.id),
    quantity: item.quantity ?? 1,
    weight: item.weight || product.weight,
    total_weight: item.total_weight,
    dimensions: item.dimensions || product.dimensions,
    subtotal: item.subtotal,

    product: {
      id: String(product.id ?? item.id),
      name: product.name ?? 'Unknown Product',
      price: Number(product.price ?? 0),

      image: normalizeImage(rawImage),

      brand:
        typeof product.brand === 'string'
          ? product.brand
          : product.brand?.name ?? null,

      weight: product.weight,
      dimensions: product.dimensions,
    },
  };
};
