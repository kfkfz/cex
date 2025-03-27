import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Accordion, EditWrapper } from '../../components';
import CurrencySlider from './components/CurrencySlider';
import ProfitLossSection from './ProfitLossSection';
import strings from 'config/localizedStrings';
import { setActiveBalanceHistory } from 'actions/walletActions';

const MobileWallet = ({
	sections,
	balance,
	prices,
	navigate,
	coins,
	searchResult,
	router,
	totalAssets,
	loading,
	BASE_CURRENCY,
	getActiveBalanceHistory,
	setActiveBalanceHistory,
}) => {
	useEffect(() => {
		if (window.location.pathname === '/wallet/history') {
			setActiveBalanceHistory(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const isNotWalletHistory = router?.location?.pathname !== '/wallet/history';
	const isWalletHistory = router?.location?.pathname === '/wallet/history';

	const handleBalanceHistory = (value) => {
		setActiveBalanceHistory(value);
		if (value) {
			router.push('/wallet/history');
		} else {
			router.push('/wallet');
		}
	};

	return (
		<div
			className={classnames(
				'flex-column',
				'd-flex',
				'justify-content-between',
				'f-1',
				'apply_rtl',
				'h-100',
				'w-100'
			)}
		>
			{isNotWalletHistory && totalAssets.length && !loading ? (
				<div className="estimated-balance-wrapper">
					<EditWrapper
						stringId="WALLET_ESTIMATED_TOTAL_BALANCE"
						render={(children) => (
							<div className="balance-wrapper">
								{BASE_CURRENCY && (
									<div>
										<div className="estimated-balance-label">
											{strings['WALLET_ESTIMATED_TOTAL_BALANCE']}
										</div>
										<div className="font-title estimated-balance-amount">
											{totalAssets}
										</div>
									</div>
								)}
							</div>
						)}
					>
						{strings['WALLET_ESTIMATED_TOTAL_BALANCE']}
					</EditWrapper>
				</div>
			) : (
				isNotWalletHistory && (
					<div>
						<div className="mb-2">{strings['WALLET_BALANCE_LOADING']}</div>
						<div className="loading-anime" />
					</div>
				)
			)}
			{isNotWalletHistory && (
				<div className="d-flex f-05">
					<CurrencySlider
						balance={balance}
						prices={prices}
						navigate={navigate}
						coins={coins}
						searchResult={searchResult}
						handleBalanceHistory={handleBalanceHistory}
					/>
				</div>
			)}
			<div className="f-1 wallet-container">
				{getActiveBalanceHistory && isWalletHistory ? (
					<ProfitLossSection handleBalanceHistory={handleBalanceHistory} />
				) : (
					<div>
						<Accordion sections={sections} showActionText={true} />
					</div>
				)}
			</div>
		</div>
	);
};

const mapStateToProps = (store) => ({
	getActiveBalanceHistory: store.wallet.activeBalanceHistory,
});

const mapDispatchToProps = (dispatch) => ({
	setActiveBalanceHistory: bindActionCreators(
		setActiveBalanceHistory,
		dispatch
	),
});

export default connect(mapStateToProps, mapDispatchToProps)(MobileWallet);
