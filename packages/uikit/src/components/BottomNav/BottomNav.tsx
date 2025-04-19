import React, { useState, memo } from "react";
import BottomNavItem from "../BottomNavItem";
import StyledBottomNav from "./styles";
import { BottomNavProps } from "./types";

const BottomNav: React.FC<React.PropsWithChildren<BottomNavProps>> = ({
  items = [],
  activeItem = "",
  activeSubItem = "",
  ...props
}) => {
  return (
    <>
      <StyledBottomNav justifyContent="space-around" {...props}>
        {items.map(({ label, href, icon }, index) => {
          return <BottomNavItem href={href} label={label} icon={icon} key={href} showItemsOnMobile={false} />;
        })}
      </StyledBottomNav>
    </>
  );
};

export default memo(BottomNav);
