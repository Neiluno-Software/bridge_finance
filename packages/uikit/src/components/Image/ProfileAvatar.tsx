import React from "react";
import { styled } from "styled-components";
import BackgroundImage from "./BackgroundImage";
import { BackgroundImageProps } from "./types";
import { EmptyImage } from "../EmptyImage";

const StyledProfileAvatar = styled(BackgroundImage)`
  border-radius: 50%;
`;

const ProfileAvatar: React.FC<React.PropsWithChildren<BackgroundImageProps>> = (props) => (
  <StyledProfileAvatar loadingPlaceholder={<EmptyImage />} {...props} />
);

export default ProfileAvatar;
