import React from "react";
import { EmptyImageProps } from "./types";
import { Box } from "../Box";
import { Image } from "../Image";

const EmptyImage: React.FC<React.PropsWithChildren<EmptyImageProps>> = ({ size = 128 }) => {
  return (
    <Box width={size} height={size * 1.197} position="relative">
      <Image width={size} height={size} src="https://assets-flack.netlify.app/web/flack-spinner.png" alt="spinner" />
    </Box>
  );
};

export default EmptyImage;
