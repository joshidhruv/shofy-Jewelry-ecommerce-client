import { compact, filter, flatten, map, uniqBy } from "lodash";
import React from "react";

const ProductVariants = ({
  productData,
  selectedVariant,
  selectedOptionsType,
  setSelectedOptionsType,
}) => {
  const ProductVariants = flatten(
    map(productData?.variants, (variant) =>
      map(variant?.variant_options, (variantOption) => {
        return {
          types: variantOption.option_type,
          values: {
            ...variantOption.option_value,
            image:
              variantOption.option_type?.name === "Color" ||
              variantOption.option_type?.name === "color"
                ? variant.product_images?.[0]
                : "",
            variant_id: variantOption?.variant?.id,
            variant_ids: flatten(
              compact(
                map(productData?.variants, (variant) => {
                  const foundVariantValues = filter(variant?.variant_options, [
                    "option_value.id",
                    variantOption?.option_value?.id,
                  ]);
                  return foundVariantValues?.length ? variant?.id : false;
                })
              )
            ),
          },
        };
      })
    )
  );

  const variantOptionTypesName = uniqBy(
    map(ProductVariants, (variant) => variant?.types),
    "id"
  );

  const variantOptionTypesValue = uniqBy(
    map(ProductVariants, (variant) => variant?.values),
    "id"
  );

  const firstOptionType = variantOptionTypesName[0];

  const onSelectedOptionValue = (optionValue, optionType) => {
    setSelectedOptionsType((prevSelected) => {
      const updatedSelected = [
        ...prevSelected.filter((p) => p.types.id !== optionType.id),
        { types: optionType, values: optionValue },
      ];

      if (optionType.id !== firstOptionType.id) return updatedSelected;

      const matchingVariants = productData?.variants?.find((variant) =>
        variant.variant_options.some(
          (vo) =>
            vo.option_type.id === optionType.id &&
            vo.option_value.id === optionValue.id
        )
      );

      if (!matchingVariants) return updatedSelected;

      const selectedVariantsOption = [
        { types: optionType, values: optionValue },
      ];
      matchingVariants.variant_options.forEach((vo) => {
        const voType = vo.option_type;
        const voValue = vo.option_value;
        if (voType.id === optionType.id) return;
        const alreadyAdded = selectedVariantsOption.some(
          (svo) => svo.types.id === voType.id
        );
        if (!alreadyAdded) {
          selectedVariantsOption.push({
            types: voType,
            values: voValue,
          });
        }
      });

      return selectedVariantsOption;
    });
  };
  console.log({
    ProductVariants,
    variantOptionTypesName,
    variantOptionTypesValue,
    firstOptionType,
    selectedVariant,
    selectedOptionsType,
  });
  return <div>ProductVariants</div>;
};

export default ProductVariants;
