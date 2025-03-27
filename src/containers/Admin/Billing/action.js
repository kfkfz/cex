import querystring from 'query-string';
import { requestDashAuthenticated } from 'utils';

const toQueryString = (values) => {
	return querystring.stringify(values);
};

export const getExchangeBilling = (params) => {
	return requestDashAuthenticated(`/invoice?${toQueryString(params)}`);
};

export const setExchangePlan = (bodyData) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(bodyData),
	};

	return new Promise(async (resolve, reject) => {
		try {
			const res = await requestDashAuthenticated('/exchange/plan', options);
			resolve(res);
		} catch (error) {
			reject(error);
		}
	});
};

export const getNewExchangeBilling = (exchangeId = '') => {
	return requestDashAuthenticated(`/exchange/pay?exchange_id=${exchangeId}`);
};

export const getPrice = () => {
	return requestDashAuthenticated(`/exchange/pricing`);
};

export const requestStoreInvoice = (id, data) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(data),
	};
	return new Promise(async (resolve, reject) => {
		try {
			const url = `/invoice?invoice_id=${id}`;
			const res = await requestDashAuthenticated(url, options);
			resolve(res);
		} catch (error) {
			reject(error);
		}
	});
};

export const postContact = (body) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(body),
	};

	return new Promise(async (resolve, reject) => {
		try {
			const res = await requestDashAuthenticated('/support', options);
			resolve(res);
		} catch (error) {
			reject(error);
		}
	});
};

export const getPluginActivateDetails = (query) => {
	return requestDashAuthenticated(`/plugin/activate?name=${query}`, {});
};
