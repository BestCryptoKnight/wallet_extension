// by: Olesa tanya 	<https://github.com/olesatanya>
// 28/6/2022

import React, { StrictMode } from 'react';
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./popup/assets/css/index.scss"
import Routes from "./popup/Routes";
import {slice} from './popup/useStore'

const store = configureStore({reducer: slice.reducer});

ReactDOM.render(
	<StrictMode>
		<Provider store={store}>
			<Routes/>
		</Provider>
        <ToastContainer />
	</StrictMode>,
	document.getElementById("root")
);
