import axios from 'axios';
import moment from 'moment';
import { PLUGIN_URL } from 'config/constants';
import querystring from 'query-string';

export const ACTION_KEYS = {
	REFERRAL_COUNT_PENDING: 'REFERRAL_COUNT_PENDING',
	REFERRAL_COUNT_FULFILLED: 'REFERRAL_COUNT_FULFILLED',
	REFERRAL_COUNT_REJECTED: 'REFERRAL_COUNT_REJECTED',
};

export function getMe() {
	return {
		type: 'GET_ME',
		payload: axios.get('/user'),
	};
}

export function setMe(user) {
	return {
		type: 'SET_ME',
		payload: user,
	};
}

export const setUserData = (data) => ({
	type: 'SET_USER_DATA',
	payload: data,
});

export function setBalance(balance) {
	return {
		type: 'SET_BALANCE',
		payload: balance,
	};
}

export function processWithdraw(data) {
	return (dispatch) => {
		dispatch({
			type: 'PROCESS_WITHDRAW_PENDING',
		});
		axios
			.post('/withdraw', data)
			.then((res) => {
				dispatch({
					type: 'PROCESS_WITHDRAW_FULFILLED',
					payload: res,
				});
			})
			.catch((err) => {
				dispatch({
					type: 'PROCESS_WITHDRAW_REJECTED',
					payload: err.response,
				});
			});
	};
}

export const updateUser = (values) => {
	const userValues = {};
	if (values.full_name) {
		userValues.full_name = values.full_name;
	}
	userValues.gender = values.gender;
	if (values.dob) {
		userValues.dob = new Date(values.dob);
	}
	userValues.nationality = values.nationality;

	if (values.address) {
		userValues.address = {
			address: values.address,
			city: values.city,
			country: values.country,
			postal_code: values.postal_code,
		};
	}

	if (values.id_number) {
		userValues.id_data = {
			// type: values.nationality === 'IR' ? 'id' : 'passport',
			number: values.id_number,
			issued_date: values.id_issued_date,
			expiration_date: values.id_expiration_date,
		};
	}

	if (values.settings) {
		userValues.settings = values.settings;
	}

	return axios.put(`${PLUGIN_URL}/plugins/kyc/user`, userValues);
};

export const updateUserSettings = (values) => {
	return axios({
		data: values,
		url: '/user/settings',
		method: 'PUT',
	});
};

export const updateDocuments = (values) => {
	const formData = new FormData();

	Object.entries(values).forEach(([key, value]) => {
		formData.append(key, value);
	});

	return axios({
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		data: formData,
		url: `${PLUGIN_URL}/plugins/kyc/user/upload`,
		method: 'POST',
	});
};

export const otpActivate = (values) => axios.post('/user/activate-otp', values);
export const otpRevoke = (values) => axios.post('/user/deactivate-otp', values);
export const resetPassword = (values) =>
	axios.post('/user/change-password', values);
export const otpSetActivated = (active = true) =>
	active
		? {
				type: 'ACTIVATE_OTP',
		  }
		: {
				type: 'REVOKE_OTP',
		  };

export function userIdentity(data) {
	return (dispatch) => {
		dispatch({
			type: 'USER_IDENTITY_PENDING',
		});
		axios
			.put('/user', data)
			.then((res) => {
				dispatch({
					type: 'USER_IDENTITY_FULFILLED',
					payload: res,
				});
			})
			.catch((err) => {
				dispatch({
					type: 'USER_IDENTITY_REJECTED',
					payload: err.response,
				});
			});
	};
}
export function uploadFile(data) {
	const formData = new FormData();
	Object.keys(data).forEach((key) => {
		formData.append(key, data[key]);
	});

	return (dispatch) => {
		dispatch({
			type: 'UPLOAD_FILE_PENDING',
		});
		axios({
			headers: { 'Content-Type': 'multipart/form-data' },
			data: formData,
			url: '/user/verification',
			method: 'POST',
		})
			.then((res) => {
				dispatch({
					type: 'UPLOAD_FILE_FULFILLED',
					payload: res,
				});
			})
			.catch((err) => {
				dispatch({
					type: 'UPLOAD_FILE_REJECTED',
					payload: err.response,
				});
			});
	};
}

export function userDeposits() {
	return {
		type: 'USER_DEPOSITS',
		payload: axios.get('/user/deposits'),
	};
}
export function userWithdrawals() {
	return {
		type: 'USER_WITHDRAWALS',
		payload: axios.get('/user/withdrawals'),
	};
}

export function otpRequest() {
	return (dispatch) => {
		dispatch({ type: 'REQUEST_OTP_PENDING' });
		axios
			.get('/user/request-otp')
			.then((body) => {
				dispatch({
					type: 'REQUEST_OTP_FULFILLED',
					payload: body.data,
				});
			})
			.catch((err) => {
				dispatch({
					type: 'REQUEST_OTP_REJECTED',
					payload: err && err.response && err.response.data,
				});
			});
	};
}
export function deactivateOTP() {
	return {
		type: 'DEACTIVATE_OTP',
		payload: axios.get('/deactivateOTP'),
	};
}

export const requestTokens = () => {
	return {
		type: 'REQUEST_TOKENS',
		payload: axios.get('/user/tokens'),
	};
};

export const generateToken = (values) => axios.post('/user/token', values);
export const editToken = (values) => axios.put('/user/token', values);
export const tokenGenerated = (token) => ({
	type: 'TOKEN_GENERATED',
	payload: {
		token,
	},
});

export const revokeToken = (token_id, otp_code = '', email_code = '') =>
	axios.delete(`/user/token`, {
		data: { token_id, otp_code, email_code },
	});

export const tokenRevoked = (token) => ({
	type: 'TOKEN_REVOKED',
	payload: {
		token,
	},
});

export const sendEmailCode = async () => {
	return await axios.get('/user/request-email-confirmation');
};

export const setUsername = (values) => axios.post('/user/username', values);
export const setUsernameStore = (username) => ({
	type: 'SET_USERNAME',
	payload: {
		username_set: true,
		username,
	},
});

// export const requestLimits = () => ({
// 	type: 'REQUEST_LIMITS',
// 	payload: axios.get('/limits')
// });

// export const requestFees = () => ({
// 	type: 'REQUEST_FEES',
// 	payload: axios.get('/fees')
// });

export const createAddress = (crypto, network) => ({
	type: 'CREATE_ADDRESS',
	payload: axios.get('/user/create-address', {
		params: {
			crypto,
			...(network ? { network } : {}),
		},
	}),
});

export const cleanCreateAddress = () => ({
	type: 'CLEAN_CREATE_ADDRESS',
});

export const getUserReferrals = (page = 1, limit = 20) => {
	const params = { page, limit };
	const query = querystring.stringify(params);

	return (dispatch) => {
		dispatch({ type: ACTION_KEYS.REFERRAL_COUNT_PENDING, payload: { page } });

		axios
			.get(`/user/affiliation?${query}`)
			.then((res) => {
				dispatch({
					type: ACTION_KEYS.REFERRAL_COUNT_FULFILLED,
					payload: {
						...res.data,
						page,
						isRemaining: res.data.count > page * limit,
					},
				});
			})
			.catch((err) => {
				dispatch({
					type: ACTION_KEYS.REFERRAL_COUNT_REJECTED,
					payload: err.response,
				});
			});
	};
};

export const getUserLogins = ({ limit = 50, page = 1, ...rest }) => {
	return (dispatch) => {
		axios
			.get('/user/logins')
			.then((body) => {
				dispatch({
					type: 'USER_LOGINS_FULFILLED',
					payload: {
						...body.data,
						page,
						isRemaining: body.data.count > page * limit,
					},
				});
				// if (body.data.count > page * limit) {
				// 	dispatch(getUserDeposits({ limit, page: page + 1 }));
				// }
			})
			.catch((err) => {
				dispatch({
					type: 'USER_LOGINS_REJECTED',
					payload: err.response,
				});
			});
	};
};

export const getSessions = ({ page = 1, limit = 20, ...rest }) => {
	const params = { page, limit, status: true };
	const query = querystring.stringify(params);

	return axios.get(`/user/sessions?${query}`);
};

export const downloadSessions = () => {
	const queryData = {
		format: 'csv',
		status: true,
	};

	const query = querystring.stringify(queryData);
	return axios
		.get(`/user/sessions?${query}`)
		.then(({ data }) => {
			const url = window.URL.createObjectURL(new Blob([data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute(
				'download',
				`sessions_${moment().format('YYYY-MM-DD')}.csv`
			);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		})
		.catch((err) => {});
};

export const revokeSession = (session_id) =>
	axios.post('/user/revoke-session', { session_id });

export const downloadLogins = (params = {}) => {
	const queryData = {
		format: 'csv',
	};

	if (params && params.start_date) {
		queryData.start_date = params.start_date;
	}

	if (params && params.end_date) {
		queryData.end_date = params.end_date;
	}

	if (params && params.status) {
		if (params.status === 'failed') {
			queryData.status = false;
		} else if (params.status === 'success') {
			queryData.status = true;
		}
	}

	const query = querystring.stringify(queryData);
	return axios
		.get(`/user/logins?${query}`)
		.then(({ data }) => {
			const url = window.URL.createObjectURL(new Blob([data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute(
				'download',
				`logins_${moment().format('YYYY-MM-DD')}.csv`
			);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		})
		.catch((err) => {});
};

export const getLogins = ({ page = 1, limit = 20, ...params }) => {
	const queryData = { page, limit };

	if (params && params.start_date) {
		queryData.start_date = params.start_date;
	}

	if (params && params.end_date) {
		queryData.end_date = params.end_date;
	}

	if (params && params.status) {
		if (params.status === 'failed') {
			queryData.status = false;
		} else if (params.status === 'success') {
			queryData.status = true;
		}
	}

	const query = querystring.stringify(queryData);

	return axios.get(`/user/logins?${query}`);
};

export const deleteUser = (email_code, otp_code) =>
	axios.delete('/user', {
		data: { otp_code, email_code },
	});
