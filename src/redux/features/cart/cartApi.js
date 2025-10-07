import { apiSlice } from "@/redux/api/apiSlice";
import Cookies from "js-cookie";
import { cartCreated } from "./cartSlice";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // create cart
    createCart: builder.mutation({
      query: ({ token, initialCartInfo }) => ({
        url: `${apiUrl}/api/carts`,
        method: "POST",
        body: initialCartInfo,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log({ result });
          dispatch(cartCreated({ cart: result.data }));
        } catch (err) {
          // do nothing
        }
      },
    }),
    // add to cart item
    addToCart: builder.mutation({
      query: ({ token, data }) => ({
        url: `${apiUrl}/api/line_items`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    // get current user cart
    getUserCart: builder.query({
      query: ({ token }) => ({
        url: `${apiUrl}/api/carts`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(cartCreated({ cart: result.data }));
        } catch (err) {
          // do nothing
        }
      },
    }),
  }),
});

export const {
  useCreateCartMutation,
  useAddToCartMutation,
  useGetUserCartQuery,
} = authApi;
