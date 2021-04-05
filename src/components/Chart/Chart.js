import PropTypes from "prop-types";
import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import styled from "styled-components";
import currencyFormatter from "currency-formatter";
import React, { useState, useEffect, useRef } from "react";

import Flex from "../Flex";
import Cursor from "./Cursor";
import VerticalAxis from "./VerticalAxis";
import { PROPTYPES } from "../../constants";
import HorizontalAxis from "./HorizontalAxis";
import HoverContainer from "./HoverContainer";
import { border } from "../../styles/constants";
import Graph, { GRAPH_PADDING_BOTTOM, GRAPH_PADDING_TOP } from "./Graph";

const DEFAULT_TICK_COUNT = 7;

const StyledChart = styled.div`
  cursor: crosshair;
  height: 100%;
  width: 100%;
  position: relative;

  svg {
    position: absolute;
    left: 0;
    top: 0;
  }
`;

const StyledChartWithVerticalAxis = styled(Flex)`
  border-bottom: ${border.border};
  height: 225px;
`;

const useDidMount = () => {
	const didMountRef = useRef(true);
	useEffect(() => {
		didMountRef.current = false;
	}, []);
	return didMountRef.current;
};

const Chart = (props) => {

	const {
		data,
		color,
		currency,
		durationType,
		disableCursor,
		hideLeftVerticalAxis,
		hideRightVerticalAxis,
		horizontalAxisTickCount,
	} = props;

	console.log('MC:::', data)
	const didMount = useDidMount();

	const chartRef = useRef();

	const [ hoverX, setHoverX ] = useState(-1);
	const [ hoverY, setHoverY ] = useState(-1);
	const [ hovered, setHovered ] = useState(false);
	const [ dimensions, setDimensions ] = useState({
		height: 0, width: 0,
	});
	const [ hoveredValue, setHoveredValue ] = useState({});

	const handleResize = () => {
		const { height, width } = chartRef.current.getBoundingClientRect();
		console.log('ACTIVE:::', height, width)
		setDimensions({
			width: Math.round(width),
			height: Math.round(height),
		});
	};

	useEffect(() => {
		console.log('A', chartRef.current)
		if (didMount) {
			window.addEventListener("resize", handleResize);
			handleResize();
		}

		return () => {
			window.removeEventListener("resize", handleResize);
		}
	}, []);

	// Show hover elements
	const handleMouseEnter = () => setHovered(true);

	// Hide hover elements
	const handleMouseLeave = () => setHovered(false);

	// Update hover position
	const handleMouseMove = (e) => {
		const { data, currency } = props;

		// Find closest data point to the x-coordinates of where the user's mouse is hovering
		const hoverX = e.nativeEvent.clientX - chartRef.current.getBoundingClientRect().left;

		setDimensions((prevDimensions) => {
			const index = Math.round((hoverX / prevDimensions.width) * (data[0].length - 1));
			const hoveredDatapoint = data[0][index] || {};
			const hoveredValue = {
				price: hoveredDatapoint.price && currencyFormatter.format(hoveredDatapoint.price, { code: currency }),
				time: hoveredDatapoint.time && hoveredDatapoint.time.toLocaleString(),
			};

			const scalePriceToY = scaleLinear()
				.range([prevDimensions.height - GRAPH_PADDING_BOTTOM, GRAPH_PADDING_TOP])
				.domain(extent(data[0], d => new Date(d.price)));
			const hoverY = scalePriceToY(hoveredDatapoint.price) || 0;

			setHoverX(hoverX);
			setHoverY(hoverY);
			setHoveredValue(hoveredValue);
			setHovered(Boolean(hoveredDatapoint));

			return prevDimensions;
		});
	}

	console.log('DIM:::', dimensions)

	return (
		<>
			<StyledChartWithVerticalAxis>
				{(!hideLeftVerticalAxis) && (
					<VerticalAxis 
						currency={currency} 
						data={data[0]} 
						align="left" 
					/>
				)}
				<StyledChart
					data-testid="HoverRegion"
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onMouseMove={handleMouseMove}
					ref={chartRef}
				>
					<Graph 
						height={dimensions.height} 
						width={dimensions.width} 
						color={color} 
						data={data[0]}
					/>
					{!disableCursor && (
						<>
							<Cursor height={dimensions.height} visible={hovered} x={hoverX} y={hoverY} />
							<HoverContainer position="top" label={hoveredValue.price} visible={hovered} x={hoverX} />
							<HoverContainer position="bottom" label={hoveredValue.time} visible={hovered} x={hoverX} />
						</>
					)}
				</StyledChart>
				{(!hideRightVerticalAxis) && (
					<VerticalAxis 
						currency={currency} 
						data={data[0]} 
						align="right" 
					/>
				)}
			</StyledChartWithVerticalAxis>
			<HorizontalAxis
				hideRightMargin={hideRightVerticalAxis}
				tickCount={horizontalAxisTickCount}
				duration={durationType}
				data={data[0]}
			/>
		</>
	);
}

Chart.propTypes = {
	disableCursor: PropTypes.bool,
	color: PROPTYPES.COLOR.isRequired,
	isLoading: PropTypes.bool.isRequired,
	hideLeftVerticalAxis: PropTypes.bool,
	hideRightVerticalAxis: PropTypes.bool,
	data: PROPTYPES.PRICE_DATA.isRequired,
	currency: PROPTYPES.CURRENCY.isRequired,
	horizontalAxisTickCount: PropTypes.number,
	durationType: PROPTYPES.DURATION.isRequired,
};

Chart.defaultProps = {
	disableCursor: false,
	hideLeftVerticalAxis: false,
	hideRightVerticalAxis: true,
	horizontalAxisTickCount: DEFAULT_TICK_COUNT,
};

React.memo(function ChartWrapper (props) {
	const { isLoading } = props;
	return (
		<Chart isLoading={!isLoading} />
	);
}) 

export default Chart;
