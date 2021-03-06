import React from "react";
import Raven from "raven-js";
import ReactGA from "react-ga";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import MainView from "./views/MainView";
import * as serviceWorker from "./serviceWorker";
import configureStore from "./store/configureStore";
import ErrorBoundary from "./components/ErrorBoundary";

import ltcData from "./data/ltc";
import btcData from "./data/btc";
import "./styles/normalize.css";
import "./styles/base.css";

if (process.env.NODE_ENV === "production" && process.env.REACT_APP_RAVEN_PUBLIC_DSN) {
	Raven.config(process.env.REACT_APP_RAVEN_PUBLIC_DSN, {
		release: process.env.REACT_APP_VERSION,
	}).install();
}

if (process.env.NODE_ENV === "production" && process.env.REACT_APP_GA_TRACKING_ID) {
	ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
	ReactGA.ga("set", "anonymizeIp", true);
	ReactGA.pageview(window.location.pathname + window.location.search);
}

ReactDOM.render(
	<ErrorBoundary>
		<Provider store={configureStore().store}>
			<MainView data={[btcData, ltcData]} />
		</Provider>
	</ErrorBoundary>,
	document.getElementById("root"),
);

serviceWorker.register();
