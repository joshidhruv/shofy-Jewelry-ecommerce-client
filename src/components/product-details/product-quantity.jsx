import React from "react";
import { useDispatch, useSelector } from "react-redux";
// internal
import { Minus, Plus } from "@/svg";
import { decrement, increment } from "@/redux/features/cartSlice";

const ProductQuantity = ({ productQuantity, setProductQuantity }) => {
  const { orderQuantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  // handleIncrease
  const handleIncrease = () => {
    // dispatch(increment());
    setProductQuantity((prev) => prev + 1);
  };
  // handleDecrease
  const handleDecrease = () => {
    setProductQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };
  console.log({ productQuantity, setProductQuantity });
  return (
    <div className="tp-product-details-quantity">
      <div className="tp-product-quantity mb-15 mr-15">
        <span className="tp-cart-minus" onClick={handleDecrease}>
          <Minus />
        </span>
        <input
          className="tp-cart-input"
          type="text"
          readOnly
          value={productQuantity}
        />
        <span className="tp-cart-plus" onClick={handleIncrease}>
          <Plus />
        </span>
      </div>
    </div>
  );
};

export default ProductQuantity;
