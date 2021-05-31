/**
 *
 * @param {string} endPoint
 * @param {function} callBack
 * @param {string} queryContent
 * @param {Object} variables
 * @param operationName
 */

export async function sendRequest(
	endPoint,
	callBack,
	queryContent,
	variables,
	operationName,
) {
	const header = { cache: 'default', mode: 'cors' };
	const requestData = {};
	requestData.method = 'GET';
	requestData.headers = header;
	requestData.credentials = 'same-origin';
	const getData = {
		query: queryContent,
		variables: JSON.stringify(variables),
		operationName: operationName || 'SimiPbQuery',
	};
	let requestEndPoint = endPoint;
	let dataGetString = Object.keys(getData).map(function (key) {
		return encodeURIComponent(key) + '=' + encodeURIComponent(getData[key]);
	});
	dataGetString = dataGetString.join('&');
	if (dataGetString) {
		if (requestEndPoint.includes('?')) {
			requestEndPoint += '&' + dataGetString;
		} else {
			requestEndPoint += '?' + dataGetString;
		}
	}

	const _request = new Request(requestEndPoint, requestData);
	let result = null;

	fetch(_request)
		.then(function (response) {
			if (response.ok) {
				return response.json();
			}
		})
		.then(function (data) {
			if (data) {
				if (Array.isArray(data) && data.length === 1 && data[0])
					result = data[0];
				else result = data;
				if (result && typeof result === 'object') result.endPoint = endPoint;
			} else result = { errors: [{ code: 0, message: 'Network response was not ok', endpoint: endPoint }] };
			if (callBack) callBack(result);
		})
		.catch((error) => {
			console.warn(error);
		});
}
