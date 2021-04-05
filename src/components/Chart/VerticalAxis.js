import React from "react";
import { extent } from "d3-array";
import styled from "styled-components";
import currencyFormatter from "currency-formatter";

import Flex from "../Flex";
import { PROPTYPES } from "../../constants";
import { color, fontSize, fontWeight } from "../../styles/constants";

const StyledVerticalAxis = styled(Flex).attrs(props => ({
	alignItems: props.align === "right" ? "flex-end" : "flex-start",
}))`
  background-color: transparent;
  align-items: ${props => props.alignItems};
  flex: 0 0 3em;
  max-width: 3em;
  padding: 0.5em 0;
  z-index: 10;
`;

const Tick = styled(Flex)`
  color: ${color.coinchartsGray};
  font-size: ${fontSize.small};
  font-weight: ${fontWeight.medium};
  text-align: center;
`;

const VerticalAxis = ({ data, align, currency }) => {

	const formatPrice = price => currencyFormatter.format(price, { code: currency, precision: 0 });
	const [ minPrice, maxPrice ] = extent(data, d => d.price);

	return (
		<StyledVerticalAxis data-testid="VerticalAxis" column justify="space-between" align={align}>
			{maxPrice && <Tick>{formatPrice(maxPrice)}</Tick>}
			{minPrice && <Tick>{formatPrice(minPrice)}</Tick>}
		</StyledVerticalAxis>
	);
};

VerticalAxis.propTypes = {
	data: PROPTYPES.PRICE_DATA.isRequired,
	align: PROPTYPES.ALIGNMENT.isRequired,
	currency: PROPTYPES.CURRENCY.isRequired,
};

export default VerticalAxis;
