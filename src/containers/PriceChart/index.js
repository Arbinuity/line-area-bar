import React from "react";
import { connect } from "react-redux";

import Chart from "../../components/Chart";
import { PriceSelectors } from "../../store/price";
import { SettingsSelectors } from "../../store/settings";
import { CRYPTOCURRENCY_LIST, DEFAULT_PROPS, PROPTYPES } from "../../constants";

const PriceChart = (props) => {

	const { data, isLoading, priceData, selectedCryptocurrency, selectedCurrency, selectedDuration } = props;

	const cryptocurrency = CRYPTOCURRENCY_LIST.filter(e => e.key === selectedCryptocurrency)[0];

	const color = cryptocurrency && {
		stroke: cryptocurrency.strokeColor,
		fill: cryptocurrency.fillColor,
	};

	console.log('LOAD:::', color, isLoading, selectedCurrency, selectedDuration)
	// data={priceData}
	// {...props}
	return (
		<Chart
			durationType={selectedDuration}
			currency={selectedCurrency}
			isLoading={isLoading}
			// data={priceData}
			data={data}
			color={color}
		/>
	);
};

const mapStateToProps = (state) => {

	const isLoading = PriceSelectors.getPriceLoadingStatus(state);
	const priceData = PriceSelectors.getSelectedPriceHistory(state);
	const selectedCurrency = SettingsSelectors.getSelectedCurrency(state);
	const selectedDuration = SettingsSelectors.getSelectedDuration(state);
	const selectedCryptocurrency = SettingsSelectors.getSelectedCryptocurrency(state);

	console.log(priceData)

	return {
		isLoading,
		priceData,
		selectedCurrency,
		selectedDuration,
		selectedCryptocurrency,
	};
}

PriceChart.propTypes = {
	isLoading: PROPTYPES.PRICE_STATUS.loading,
	priceData: PROPTYPES.PRICE_DATA,
	selectedCryptocurrency: PROPTYPES.CRYPTOCURRENCY,
	selectedCurrency: PROPTYPES.CURRENCY,
	selectedDuration: PROPTYPES.DURATION,
};

PriceChart.defaultProps = {
	isLoading: DEFAULT_PROPS.PRICE_STATUS.loading,
	priceData: DEFAULT_PROPS.PRICE_DATA,
	selectedCryptocurrency: DEFAULT_PROPS.CRYPTOCURRENCY,
	selectedCurrency: DEFAULT_PROPS.CURRENCY,
	selectedDuration: DEFAULT_PROPS.DURATION,
};

// Use named export for tests
export { PriceChart as UnconnectedPriceChart, mapStateToProps };

export default connect(mapStateToProps)(PriceChart);
