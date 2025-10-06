import { compact, filter, flatten, map, some, uniqBy } from "lodash";
import React from "react";

const ProductVariants = ({
  productData,
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

  return (
    <div
      style={{
        display: "flex",
        rowGap: "24px",
        flexDirection: "column",
      }}
    >
      {variantOptionTypesName?.length > 0 &&
        variantOptionTypesName?.map((product, index) => {
          const optionType = product;
          const optionTypeValues = filter(variantOptionTypesValue, [
            "option_type_id",
            optionType?.id,
          ]);

          return (
            <div key={index}>
              <div>{optionType?.name} :</div>
              <div>
                <div
                  style={{ display: "flex", columnGap: "24px" }}
                  align={"center"}
                >
                  {optionTypeValues?.map((data, index) => {
                    const isSelected = some(selectedOptionsType, [
                      "values.id",
                      data?.id,
                    ]);

                    const isSameTypeAsFirst =
                      optionType.id === firstOptionType.id;
                    let isAvailable = true;

                    if (!isSameTypeAsFirst) {
                      const selectedFirst = selectedOptionsType?.find(
                        (sel) => sel.types.id === firstOptionType.id
                      );

                      if (selectedFirst) {
                        isAvailable = productData.variants.some(
                          (variant) =>
                            variant?.variant_options.some(
                              (vo) =>
                                vo.option_type.id === optionType.id &&
                                vo.option_value.id === data.id
                            ) &&
                            variant?.variant_options.some(
                              (vo) =>
                                vo.option_type.id === selectedFirst.types.id &&
                                vo.option_value.id === selectedFirst.values.id
                            )
                        );
                      }
                    }

                    return (
                      <VariantsOption
                        key={index}
                        data={data}
                        type={
                          optionType?.name.toLowerCase() === "color"
                            ? "Color"
                            : ""
                        }
                        disabled={!isAvailable}
                        selected={isSelected}
                        onSelected={(optionTypeValue) =>
                          onSelectedOptionValue(optionTypeValue, product)
                        }
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

const VariantsOption = ({ type, selected, onSelected, data, disabled }) => {
  const handleClick = () => {
    if (!disabled) {
      onSelected(data);
    }
  };

  return type === "Color" ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "40px",
        width: "40px",
        borderRadius: "50%",
        padding: "2px",

        border: selected ? "2px solid #000000" : "2px solid #e0e0e0",
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={handleClick}
    >
      <div
        style={{
          backgroundColor: data?.value || "#1D4A6E",
          height: "30px",
          width: "30px",
          borderRadius: "50%",
        }}
      />
    </div>
  ) : (
    <div
      style={{
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",

        padding: "8px 16px",
        border: "1px solid #1E1E1E",
        color: "#1E1E1E",

        borderRadius: "4px",
        fontSize: "14px",
        lineHeight: "18px",
      }}
      onClick={handleClick}
    >
      {data?.name}
    </div>
  );
};
export default ProductVariants;
