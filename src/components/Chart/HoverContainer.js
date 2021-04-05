import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Flex from "../Flex";
import { PROPTYPES } from "../../constants";
import { animation, border, color, fontSize, fontWeight } from "../../styles/constants";

const HOVER_CONTAINER_WIDTH = 200;
export const VERTICAL_OFFSET = -12;

const StyledHoverContainer = styled(Flex).attrs(props => ({
	style: {
		opacity: props.visible ? 1 : 0,
		left: `${props.left - HOVER_CONTAINER_WIDTH / 2}px`,
		top: props.position === "top" ? `${VERTICAL_OFFSET}px` : undefined,
		bottom: props.position === "bottom" ? `${VERTICAL_OFFSET}px` : undefined,
	},
}))`
  position: absolute;
  transition: opacity ${animation.speed};
  width: ${`${HOVER_CONTAINER_WIDTH}px`};
  z-index: 10;
`;

const Label = styled.div.attrs(props => ({
	border: props.invertColor ? "none" : border.border,
	color: props.invertColor ? color.white : color.coinchartsGray,
	background: props.invertColor ? color.coinchartsGray : color.white,
}))`
  background: ${props => props.background};
  border-radius: ${border.radius};
  border: ${props => props.border};
  color: ${props => props.color};
  font-size: ${fontSize.small};
  font-weight: ${fontWeight.medium};
  padding: 1px 6px;
`;

const HoverContainer = ({ position, label, visible, x }) => (
	<StyledHoverContainer data-testid="HoverContainer" justify="center" left={x} position={position} visible={visible}>
		<Label invertColor={position === "top"}>
			{label}
		</Label>
	</StyledHoverContainer>
);

HoverContainer.propTypes = {
	label: PropTypes.string,
	x: PropTypes.number.isRequired,
	visible: PropTypes.bool.isRequired,
	position: PROPTYPES.HOVER_CONTAINER_POSITION.isRequired,
};

HoverContainer.defaultProps = {
	label: "",
};

export default HoverContainer;
