/* eslint-disable class-methods-use-this */
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import MediaQuery from "react-responsive";
import React, { useState, useEffect } from "react";

import Flex from "../../components/Flex";
import Footer from "../../components/Footer";
import { POLL_FREQUENCY } from "../../constants";
import { PriceActions } from "../../store/price";
import PriceChart from "../../containers/PriceChart";
import PriceTable from "../../containers/PriceTable";
import DocumentHead from "../../containers/DocumentHead";
import DurationTabs from "../../containers/DurationTabs";
import PriceTableCompact from "../../containers/PriceTableCompact";
import CryptocurrencyTabs from "../../containers/CryptocurrencyTabs";
import { border, boxShadow, color, font, fontSize, fontWeight, height, width } from "../../styles/constants";

const Dashboard = styled(Flex)`
  background-color: ${color.white};
  min-height: ${height.dashboard};
  width: 100vw;
  z-index: 10;
`;

const DashboardDesktop = styled(Dashboard)`
  background-color: ${color.white};
  border-radius: ${border.borderRadius};
  box-shadow: ${boxShadow.default};
  max-width: ${width.desktopMax};
  min-width: ${width.desktopMin};
  width: 90vw;
`;

const HeaderText = styled(Flex)`
  color: ${color.coincharts};
  font-size: ${fontSize.large};
  font-weight: ${fontWeight.medium};
`;

const StyledBody = styled.div`
  margin: 0 20px 20px 20px;
`;

const StyledHeader = styled(Flex)`
  border-bottom: 1px solid #dae1e9;
  height: 55px;
  padding: 0 20px;
`;

const StyledMainView = styled(Flex)`
  font-family: ${font.fontFamily};
  margin: auto;
`;

const MainView = (props) => {

	const { data, requestPriceData } = props;

	// let pollingId = null;
	// let initialTimeout = null;

	// const startPriceDataPolling = () => {
	// 	pollingId = setInterval(() => {
	// 		requestPriceData();
	// 	}, POLL_FREQUENCY);
	// }

	// const clearPriceDataPolling = () => {
	// 	clearTimeout(initialTimeout);
	// 	clearInterval(pollingId);
	// }

	// useEffect(() => {
	// 	initialTimeout = setTimeout(() => {
	// 		requestPriceData();
	// 		startPriceDataPolling();
	// 	}, 100);

	// 	return () => {
	// 		clearPriceDataPolling();
	// 	}
	// }, []);

	const renderMobile = () => (
		<Dashboard column>
			{/*
			<StyledHeader justify="space-between">
				<HeaderText center>Coincharts</HeaderText>
				<DurationTabs />
			</StyledHeader>
			*/}
			<StyledBody>
				{/*
				<PriceTableCompact />
				<PriceChart 
					horizontalAxisTickCount={4} 
					hideRightVerticalAxis 
					disableCursor 
					hideTopBorder 
					data={data}
				/>
				*/}
				<PriceChart 
					horizontalAxisTickCount={4} 
					hideRightVerticalAxis 
					disableCursor 
					hideTopBorder 
				/>
			</StyledBody>
		</Dashboard>
	);

	const renderDesktop = () => (
		<DashboardDesktop column>
			{/*
			<StyledHeader justify="space-between">
				<CryptocurrencyTabs />
				<DurationTabs />
			</StyledHeader>
			*/}
			<StyledBody>
				{/*
				<PriceTable />
				*/}
				<PriceChart data={data} />
			</StyledBody>
		</DashboardDesktop>
	);

	return (
		<StyledMainView center column>
			<DocumentHead />
			<MediaQuery maxWidth={width.desktopMin}>
				{matches => (matches ? renderMobile() : renderDesktop())}
			</MediaQuery>
			<Footer />
		</StyledMainView>
	);
}

const mapDispatchToProps = dispatch => ({
	requestPriceData: () => {
		dispatch(PriceActions.request());
	},
});

MainView.propTypes = {
	requestPriceData: PropTypes.func.isRequired,
};

// Use named export for tests
export { MainView as UnconnectedMainView, mapDispatchToProps };

// export default connect(null, mapDispatchToProps)(MainView);
export default MainView;
