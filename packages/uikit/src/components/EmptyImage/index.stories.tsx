import React from "react";
import EmptyImage from "./EmptyImage";

export default {
  title: "Components/EmptyImage",
  component: EmptyImage,
  argTypes: {},
};

export const Default: React.FC<React.PropsWithChildren> = () => {
  return <EmptyImage size={50} />;
};
