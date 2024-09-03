import IsAndroid from '../Common/IsAndroid';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import ManageDeepLink from './ManageDeepLink';
import RunDeepLink from './RunDeepLink';
import ApplicationSettings from '../Common/Library/ApplicationSettings';
import Logger from '../Log/Logger';
import EsriLibrary from '../ESRI/EsriLibrary';

export default async function LinkDataReceived(clientAPI) {
	let code = getEsriAuthCode(clientAPI);
	if (!ValidationLibrary.evalIsEmpty(code)) {
		Logger.info('LinkDataReceived', 'ESRI code received');
		ApplicationSettings.setString(clientAPI, 'AUTH_CODE', code);
		try {
			await EsriLibrary.FetchESRIAccessToken(clientAPI);
			await EsriLibrary.UpdateBackendESRIAccessToken(clientAPI);
		} catch (error) {
			EsriLibrary.ResetESRIAccessToken(clientAPI);
            await EsriLibrary.onEsriFailed(clientAPI, error);
        }
		return Promise.resolve();
	} else if (isEsriLink(clientAPI)) {
		Logger.error('LinkDataReceived', 'ESRI authorization code is not received');
		await EsriLibrary.onEsriFailed(clientAPI, clientAPI.localizeText('esri_code_is_not_received'));
		return Promise.resolve();
	} else {
		return setTimeout(() => {
			ManageDeepLink.getInstance().init(clientAPI)
				.then(() => {
					return checkCurrentOpenedPage(clientAPI);
				})
				.catch((errorMessage) => {
					if (errorMessage && errorMessage !== 'canceled') {
						return clientAPI.executeAction({
							'Name': '/SAPAssetManager/Actions/DeepLinks/InvalidLinkMessage.action',
							'Properties': {
								'Message': errorMessage.key ? clientAPI.localizeText(errorMessage.key) : errorMessage,
							},
						});
					}
					Logger.error('LinkDataReceived', errorMessage);
					return Promise.resolve();
				});
		}, IsAndroid(clientAPI) ? 3000 : 0); //Waits until the android app initialized
	}
}

function checkCurrentOpenedPage(clientAPI) {
	if (clientAPI.currentPage && clientAPI.currentPage.isModal()) {
		return clientAPI.executeAction({
			'Name': '/SAPAssetManager/Actions/Page/CancelPage.action',
			'Properties': {
				'OnSuccess': '/SAPAssetManager/Rules/DeepLinks/RunDeepLink.js',
			},
		});
	}
	return RunDeepLink(clientAPI);
}

function getEsriAuthCode(clientAPI) {
	let linkData = JSON.parse(clientAPI.getAppEventData());
	let code = '';
	if (isEsriLink(clientAPI)) {
		code = linkData.Parameters.code;
	}
	return code;
}

function isEsriLink(clientAPI) {
	let linkData = JSON.parse(clientAPI.getAppEventData());
	return linkData.URL.startsWith('arcgis');
}

