import { extent } from "d3-array";
import PropTypes from "prop-types";
import isEqual from "lodash.isequal";
import { select } from "d3-selection";
import { easeCubicOut } from "d3-ease";
import styled from "styled-components";
import { scaleLinear, scaleTime } from "d3-scale";
import { interpolatePath } from "d3-interpolate-path";
import { area as d3Area, line as d3Line } from "d3-shape";
import React, { useState, useEffect, useRef } from "react";

import "d3-transition";

import { PROPTYPES } from "../../constants";

export const GRAPH_PADDING_BOTTOM = 15; // spacing between lowest datum & border
export const GRAPH_PADDING_TOP = 15; // spacing between highest datum & border

const TRANSITION = { duration: 500, ease: easeCubicOut };

const StyledGraph = styled.svg`
  height: 100%;
  width: 100%;

  .area {
    pointer-events: none;
    stroke: none;
  }

  .line {
    fill: none;
    pointer-events: none;
    stroke-width: 2;
  }
`;

const Graph = (props) => {

	const { color, width, height } = props;

	const svgRef = useRef();
	const prevPropsRef = useRef({});

	const [ scaledData, setScaleData ] = useState([]);
	const [ skipTransition, setSkipTransition ] = useState(false);
	const [ previousColor, setPreviousColor ] = useState(undefined);
	const [ previousScaledData, setPreviousScaledData ] = useState([]);
	
	const scaleData = (data, height, width) => {
		const scalePriceToY = scaleLinear()
			.range([height - GRAPH_PADDING_BOTTOM, GRAPH_PADDING_TOP])
			.domain(extent(data, d => d.price));

		const scaleTimeToX = scaleTime()
			.range([0, width])
			.domain(extent(data, d => new Date(d.time)));

		return data.map(({ price, time }) => ({
			price: scalePriceToY(price),
			time: scaleTimeToX(new Date(time)),
		}));
	}

	useEffect(() => {
		// Check if props have been updated.
		if (!isEqual(props, prevPropsRef.current)) {

			const { data: nextData, height: nextHeight, width: nextWidth } = props;
			// const { color: previousColor } = prevPropsRef.current;
			const { color: previousColor } = props;
console.log(previousColor)	
			// Don't update if next set of data is not ready
			if (!nextData.length) return

			const prevScaledData = prevPropsRef.current.prevScaledData || [];
			const nextScaledData = scaleData(nextData, nextHeight, nextWidth);
			const previousScaledData =
				prevScaledData.length > 0 ? prevScaledData: nextScaledData.map(({ time }) => ({ price: nextHeight, time }));

			console.log('COLOR:::', color);
			setPreviousColor(color);
			console.log('NEXT SCALED DATA:::', nextScaledData);
			setScaleData(nextScaledData);
			console.log('SET SKIP TRANSITION:::', width !== nextWidth);
			setSkipTransition(width !== nextWidth);
			console.log('SET PREVIOUS SCALED DATA', previousScaledData);
			setPreviousScaledData(previousScaledData);

			console.log('LOOOL')
			// component did update.
			const graph = select(svgRef.current);
			const transitionDuration = skipTransition ? 0 : TRANSITION.duration;

			const area = d3Area()
				.x(d => d.time)
				.y0(height)
				.y1(d => d.price);

			const line = d3Line()
				.x(d => d.time)
				.y(d => d.price);

			console.log('AAAAAAA')
			const previousAreaGraph = area(previousScaledData);
			console.log('AREA GRAPH:::', previousAreaGraph);
			const previousLineGraph = line(previousScaledData);
			const areaGraph = area(scaledData);
			const lineGraph = line(scaledData);

			graph.selectAll("path").remove();

			console.log('P::', previousColor, graph)
			
			graph
				.append("path")
				.attr("class", "area")
				.attr("d", previousAreaGraph)
				.style("fill", previousColor.fill)
				.transition()
				.duration(transitionDuration)
				.ease(TRANSITION.ease)
				.attrTween("d", interpolatePath.bind(null, previousAreaGraph, areaGraph))
				.style("fill", color.fill);

			graph
				.append("path")
				.attr("class", "line")
				.attr("d", previousLineGraph)
				.style("stroke", previousColor.stroke)
				.transition()
				.duration(transitionDuration)
				.ease(TRANSITION.ease)
				.attrTween("d", interpolatePath.bind(null, previousLineGraph, lineGraph))
				.style("stroke", color.stroke);

		}
		// Set props as prevProps.
		prevPropsRef.current = props;
	}, [props]);

	return (
		<StyledGraph data-testid="Graph">
			<g ref={svgRef} />
		</StyledGraph>
	);
}

Graph.propTypes = {
	color: PROPTYPES.COLOR.isRequired,
	data: PROPTYPES.PRICE_DATA.isRequired,
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};

export default Graph;
