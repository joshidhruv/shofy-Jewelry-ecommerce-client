import { apiSlice } from "../api/apiSlice";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const categoryApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (data) => ({
        url: "https://shofy-backend.vercel.app/api/category/add",
        method: "POST",
        body: data,
      }),
    }),
    getAllCategory: builder.query({
      query: () => `${apiUrl}/api/taxonomies`,
    }),
    getShowCategory: builder.query({
      query: () => `https://shofy-backend.vercel.app/api/category/show`,
    }),
    getProductTypeCategory: builder.query({
      query: (type) =>
        `https://shofy-backend.vercel.app/api/category/show/${type}`,
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useGetProductTypeCategoryQuery,
  useGetShowCategoryQuery,
  useGetAllCategoryQuery,
} = categoryApi;
