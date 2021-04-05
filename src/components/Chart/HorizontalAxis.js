import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { extent } from "d3-array";
import { timeFormat } from "d3-time-format";
import styled from "styled-components";

import Flex from "../Flex";
import { DURATION, PROPTYPES } from "../../constants";
import { color, fontSize, fontWeight } from "../../styles/constants";

const StyledHorizontalAxis = styled(Flex).attrs(props => ({
	margin: props.hideRightMargin ? "10px 0 0 20px" : "10px 20px 0 20px",
}))`
  margin: ${props => props.margin};
`;

const Tick = styled.div`
  color: ${color.coinchartsGray};
  font-size: ${fontSize.small};
  font-weight: ${fontWeight.medium};
`;

const HorizontalAxis = (props) => {

	const { data, duration, tickCount, hideRightMargin } = props;

	const formatTime = (timestamp, duration) => {
		switch (duration) {
			case DURATION.ALL.key:
				return timeFormat("%b %Y")(timestamp); // 'Mmm YYYY'
			case DURATION.YEAR.key:
			case DURATION.MONTH.key:
			case DURATION.WEEK.key:
				return timeFormat("%b %_d")(timestamp); // 'Mmm D'
			case DURATION.DAY.key:
			case DURATION.HOUR.key:
			default:
				return timeFormat("%I:%M %p")(timestamp); // 'HH:MM PM/AM'
		}
	}

	const generateTicks = (data, tickCount) => {

		console.log('PAYLOAD:::', data);
		if (data.length < 2 || tickCount < 2) {
			return [];
		}

		const [ minTime, maxTime ] = extent(data, d => (
			new Date(d.time)
		));
		const rangeStep = (maxTime - minTime) / (tickCount - 1);
		const generatedTicks = [];
		for (let i = 0; i < tickCount; i += 1) {
			const time = new Date(minTime).valueOf();
			generatedTicks.push(time + i * rangeStep);
			console.log('TIME:::', time, i, maxTime, minTime, tickCount, rangeStep);
		}

		return generatedTicks;
	}

	const durationTicks = generateTicks(data, tickCount);
	const axisTicks = durationTicks.map(timestamp => ({
		timestamp,
		label: formatTime(timestamp, duration),
	}));

	console.log('TICKS:::', durationTicks, tickCount, axisTicks);

	return (
		<StyledHorizontalAxis data-testid="HorizontalAxis" justify="space-between" hideRightMargin={hideRightMargin}>
			{(axisTicks) && (
				axisTicks.map(({ timestamp, label }) => (
					<Tick key={timestamp}>
						{label}
					</Tick>
				))
			)}
		</StyledHorizontalAxis>
	);
}

HorizontalAxis.propTypes = {
	data: PROPTYPES.PRICE_DATA.isRequired,
	tickCount: PropTypes.number.isRequired,
	duration: PROPTYPES.DURATION.isRequired,
	hideRightMargin: PropTypes.bool.isRequired,
};

export default HorizontalAxis;
