import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../services/api";
import StandardCategoryPage from "../../common/StandardCategoryPage";

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface Filter {
  title: string;
  type: string;
  options: FilterOption[];
}

const CategoryDetail = () => {
  const { id, slug } = useParams();
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [loading, setLoading] = useState(true);

  const getFilters = async (): Promise<Filter[]> => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        api.get(`/categories`),
        api.get(`/brands`),
      ]);

      const categories = (categoriesRes.data as any).data || [];
      const brands = (brandsRes.data as any).data || [];

      return [
        {
          title: "Category",
          type: "checkbox",
          options: categories.map((cat: any) => ({
            label: cat.name,
            value: cat.id.toString(),
            count: cat.product_count || 0,
          })),
        },
        {
          title: "Brand",
          type: "checkbox",
          options: brands.map((brand: any) => ({
            label: brand.name,
            value: brand.id.toString(),
          })),
        },
        {
          title: "Price Range",
          type: "checkbox",
          options: [
            { label: "Under Rs.500", value: "0-500" },
            { label: "Rs.500 - Rs.1500", value: "500-1500" },
            { label: "Rs.1500 - Rs.3000", value: "1500-3000" },
            { label: "Above Rs.3000", value: "3000+" },
          ],
        },
      ];
    } catch (err) {
      console.error("Failed to load filters", err);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, prodRes, filtersData] = await Promise.all([
          api.get(`/categories/${slug}`),
          api.get(`/products/category/${id}`),
          getFilters(),
        ]);

        setCategory((catRes.data as any).data.category);
        setProducts((prodRes.data as any).data.product || []);
        setFilters(filtersData);
      } catch (err) {
        console.error("Failed to load category details", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, slug]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!category) return <div className="text-center py-20">Category not found</div>;

  return (
    <StandardCategoryPage
      title={category.name}
      description={category.description || "Find the best products for your pet!"}
      products={products}
      filters={filters}
    />
  );
};

export default CategoryDetail;
