import React, { useContext } from "react";
import { NextLinkFromReactRouter } from "..";
import { MenuContext } from "../../widgets/Menu/context";
import { Flex } from "../Box";
import AnimatedIconComponent from "../Svg/AnimatedIconComponent";
import { StyledBottomNavItem, StyledBottomNavText } from "./styles";
import { BottomNavItemProps } from "./types";

const BottomNavItem: React.FC<React.PropsWithChildren<BottomNavItemProps>> = ({
  label,
  icon,
  fillIcon,
  href,
  showItemsOnMobile = false,
  isActive = false,
  disabled = false,
  ...props
}) => {
  const { linkComponent } = useContext(MenuContext);
  const bottomNavItemContent = (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" height="100%">
      {icon && (
        <AnimatedIconComponent
          icon={icon}
          fillIcon={fillIcon}
          height="22px"
          width="21px"
          color={isActive ? "secondary" : "textSubtle"}
          isActive={isActive}
        />
      )}
      <StyledBottomNavText
        color={isActive ? "text" : "textSubtle"}
        fontWeight={isActive ? "600" : "400"}
        fontSize="10px"
      >
        {label}
      </StyledBottomNavText>
    </Flex>
  );

  return showItemsOnMobile ? (
    <StyledBottomNavItem style={{ opacity: disabled ? 0.5 : 1 }} type="button" {...props}>
      {bottomNavItemContent}
    </StyledBottomNavItem>
  ) : (
    <NextLinkFromReactRouter to={href}>
      <StyledBottomNavItem style={{ opacity: disabled ? 0.5 : 1 }} as={linkComponent} {...props}>
        {bottomNavItemContent}
      </StyledBottomNavItem>
    </NextLinkFromReactRouter>
  );
};

export default BottomNavItem;
