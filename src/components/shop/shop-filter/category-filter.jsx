import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
// internal
import ErrorMsg from "@/components/common/error-msg";
import {
  useGetAllCategoryQuery,
  useGetShowCategoryQuery,
} from "@/redux/features/categoryApi";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import ShopCategoryLoader from "@/components/loader/shop/shop-category-loader";

const CategoryFilter = ({ setCurrPage, shop_right = false }) => {
  const { data: categories, isLoading, isError } = useGetAllCategoryQuery();
  const router = useRouter();
  const dispatch = useDispatch();

  // handle category route
  const handleCategoryRoute = (title) => {
    setCurrPage(1);
    router.push(
      `/${shop_right ? "shop-right-sidebar" : "shop"}?category=${title
        .toLowerCase()
        .replace("&", "")
        .split(" ")
        .join("-")}`
    );
    dispatch(handleFilterSidebarClose());
  };
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <ShopCategoryLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && categories?.result?.length === 0) {
    content = <ErrorMsg msg="No Category found!" />;
  }
  if (!isLoading && !isError && categories?.length > 0) {
    const category_items = categories
      .map((item) => {
        // calculate total products from all taxons
        const total_products = item.taxons?.reduce(
          (sum, taxon) => sum + (taxon.total_products || 0),
          0
        );

        return { ...item, total_products };
      })
      // filter out categories with 0 products
      .filter((item) => item.total_products > 0);

    content = category_items.map((item) => (
      <li key={item.id}>
        <a
          onClick={() => handleCategoryRoute(item.parent)}
          style={{ cursor: "pointer" }}
          className={
            router.query.category ===
            item.name.toLowerCase().replace("&", "").split(" ").join("-")
              ? "active"
              : ""
          }
        >
          {item?.display_name} <span>{item.total_products}</span>
        </a>
      </li>
    ));
  }

  return (
    <>
      <div className="tp-shop-widget mb-50">
        <h3 className="tp-shop-widget-title">Categories</h3>
        <div className="tp-shop-widget-content">
          <div className="tp-shop-widget-categories">
            <ul>{content}</ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryFilter;
