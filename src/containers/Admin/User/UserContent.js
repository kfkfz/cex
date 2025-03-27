import React, { Component } from 'react';
import { Link } from 'react-router';
import { ReactSVG } from 'react-svg';
import { Tabs, Button, Breadcrumb, message, Modal } from 'antd';

import {
	// Balance,
	// Logins,
	// Audits,
	// Verification,
	// Otp,
	UserBalance,
	// Activate,
	TradeHistory,
	// UploadIds,
	Transactions,
	ActiveOrders,
} from '../';
// import UserData from './UserData';
import BankData from './BankData';
import AboutData from './AboutData';
import Referrals from './Referrals';
import VerifyEmailConfirmation from './VerifyEmailConfirmation';
import ActivationConfirmation from './ActivationConfirmation';
import { isSupport, isKYC } from '../../../utils/token';
import { STATIC_ICONS } from 'config/icons';
import {
	deactivateOtp,
	flagUser,
	activateUser,
	verifyUser,
	recoverUser,
	deleteUser,
	requestTiers,
} from './actions';
import UserMetaForm from './UserMetaForm';
import PaymentMethods from './PaymentMethods';
import DeletionConfirmation from './DeleteConfirmation';

// import Flagger from '../Flaguser';
// import Notes from './Notes';

const TabPane = Tabs.TabPane;
const { Item } = Breadcrumb;

class UserContent extends Component {
	state = {
		showVerifyEmailModal: false,
		showRecoverModal: false,
		showDeleteModal: false,
		userTiers: {},
	};

	componentDidMount() {
		this.getTiers();
	}

	getTiers = () => {
		requestTiers()
			.then((userTiers = {}) => {
				this.setState({ userTiers });
			})
			.catch((err) => {
				console.error(err);
			});
	};

	disableOTP = () => {
		const { userInformation = {}, refreshData } = this.props;
		const postValues = {
			user_id: parseInt(userInformation.id, 10),
		};
		Modal.confirm({
			title: <div className="modal-confirm-title">Disable 2FA</div>,
			width: '450px',
			maskStyle: { background: 'rgba(0, 0, 0, 0.7)' },
			content: (
				<div>
					<div>
						Disabling 2FA on this account may leave this account vulnerable.
					</div>
					<div className="mt-3">
						Are you sure want to disable 2FA for this account?
					</div>
				</div>
			),
			onOk() {
				deactivateOtp(postValues)
					.then((res) => {
						refreshData({ otp_enabled: false });
					})
					.catch((err) => {
						const _error =
							err.data && err.data.message ? err.data.message : err.message;
						message.error(_error);
					});
			},
		});
	};

	flagUser = (value) => {
		const { userInformation = {}, refreshData } = this.props;
		const postValues = {
			user_id: parseInt(userInformation.id, 10),
			flagged: value,
		};
		Modal.confirm({
			title: (
				<div>
					{value ? (
						<div className="modal-confirm-title">Flag user</div>
					) : (
						<div className="modal-confirm-title">Unflag user</div>
					)}
				</div>
			),
			width: '450px',
			maskStyle: { background: 'rgba(0, 0, 0, 0.7)' },
			content: (
				<div>
					{value
						? 'Are you sure want to flag this user?'
						: 'Are you sure want to unflag this user?'}
				</div>
			),
			onOk() {
				flagUser(postValues)
					.then((res) => {
						refreshData(postValues);
					})
					.catch((err) => {
						const _error =
							err.data && err.data.message ? err.data.message : err.message;
						message.error(_error);
					});
			},
		});
	};

	freezeAccount = (value) => {
		const { userInformation = {}, refreshData } = this.props;
		const postValues = {
			user_id: parseInt(userInformation.id, 10),
			activated: value,
		};
		Modal.confirm({
			title: (
				<div>
					{!value ? (
						<div className="modal-confirm-title">Freeze account</div>
					) : (
						<div className="modal-confirm-title">Unfreeze account</div>
					)}
				</div>
			),
			width: '450px',
			maskStyle: { background: 'rgba(0, 0, 0, 0.7)' },
			content: (
				<div>
					{!value ? (
						<div>
							Freezing this account will make this account inaccessible
							<div className="mt-3">
								Are you sure want to freeze this account?
							</div>
						</div>
					) : (
						<div className="mt-3">
							Are you sure want to unfreeze this account?
						</div>
					)}
				</div>
			),
			onOk() {
				activateUser(postValues)
					.then((res) => {
						refreshData(postValues);
					})
					.catch((err) => {
						const _error =
							err.data && err.data.message ? err.data.message : err.message;
						message.error(_error);
					});
			},
		});
	};

	verifyUserEmail = () => {
		const { userInformation = {}, refreshData } = this.props;
		const postValues = {
			user_id: parseInt(userInformation.id, 10),
		};

		verifyUser(postValues)
			.then((res) => {
				refreshData({ ...postValues, email_verified: true });
				this.setState({ showVerifyEmailModal: false });
			})
			.catch((err) => {
				const _error =
					err.data && err.data.message ? err.data.message : err.message;
				message.error(_error);
			});
	};

	handleRecoverUser = () => {
		const { userInformation = {}, refreshData } = this.props;
		const postValues = {
			user_id: parseInt(userInformation.id, 10),
		};

		recoverUser(postValues)
			.then((res) => {
				refreshData({ ...postValues, activated: true });
				this.setState({ showRecoverModal: false });
			})
			.catch((err) => {
				const _error =
					err.data && err.data.message ? err.data.message : err.message;
				message.error(_error);
			});
	};

	handleDeleteUser = () => {
		const { userInformation = {}, refreshData } = this.props;
		const postValues = {
			user_id: parseInt(userInformation.id, 10),
		};

		deleteUser(postValues)
			.then((res) => {
				refreshData({ ...postValues, activated: false });
			})
			.catch((err) => {
				const _error =
					err.data && err.data.message ? err.data.message : err.message;
				message.error(_error);
			});
		this.setState({ showDeleteModal: false });
	};

	openVerifyEmailModal = () => {
		this.setState({
			showVerifyEmailModal: true,
		});
	};

	openRecoverUserModel = () => {
		this.setState({
			showRecoverModal: true,
		});
	};

	openDeleteUserModel = () => {
		this.setState({
			showDeleteModal: true,
		});
	};

	renderTabBar = (props, DefaultTabBar) => {
		if (this.props.isConfigure) return <div></div>;
		return <DefaultTabBar {...props} />;
	};

	render() {
		const {
			coins,
			constants,
			userInformation,
			userImages,
			// clearData,
			refreshData,
			refreshAllData,
			onChangeUserDataSuccess,
			isConfigure,
			showConfigure,
			kycPluginName,
			requestUserData,
			referral_history_config,
		} = this.props;

		const {
			showVerifyEmailModal,
			showRecoverModal,
			showDeleteModal,
			userTiers,
		} = this.state;

		const {
			id,
			// activated,
			// otp_enabled,
			// flagged,
			verification_level,
			is_admin,
			is_support,
			is_supervisor,
			is_kyc,
			is_tech,
		} = userInformation;
		const isSupportUser = isSupport();
		// const pairs = Object.keys(coins) || [];
		const verificationInitialValues = {};
		const roleInitialValues = {};
		if (verification_level) {
			verificationInitialValues.verification_level = verification_level;
		}
		if (is_admin) {
			roleInitialValues.role = 'admin';
		} else if (is_support) {
			roleInitialValues.role = 'support';
		} else if (is_supervisor) {
			roleInitialValues.role = 'supervisor';
		} else if (is_kyc) {
			roleInitialValues.role = 'kyc';
		} else if (is_tech) {
			roleInitialValues.role = 'tech';
		} else {
			roleInitialValues.role = 'user';
		}

		return (
			<div className="app_container-content admin-user-content">
				<Breadcrumb>
					<Item>
						<Link to="/admin">Home</Link>
					</Item>
					<Item>
						<Link to="/admin/user">Users</Link>
					</Item>
					<Item
						onClick={() => {
							if (isConfigure) {
								showConfigure();
							}
						}}
					>
						<Link>User profile</Link>
					</Item>
					{isConfigure ? (
						<Item>
							<Link>Configure Meta</Link>
						</Item>
					) : null}
				</Breadcrumb>
				{!isConfigure ? (
					<div className="d-flex justify-content-between">
						<div className="d-flex align-items-center user-details">
							<ReactSVG
								src={STATIC_ICONS.USER_DETAILS_ICON}
								className="user-icon"
							/>
							<div>User Id: {userInformation.id}</div>
							<div className="user-seperator"></div>
							<div>{userInformation.email}</div>
						</div>
						<div className="d-flex">
							<Button
								size="medium"
								type="primary"
								style={{ marginRight: 5 }}
								onClick={refreshAllData}
								className="green-btn"
							>
								Refresh
							</Button>
						</div>
					</div>
				) : null}
				<Tabs
					// tabBarExtraContent={<Button className="mr-3" onClick={clearData}>Back</Button>}
					renderTabBar={this.renderTabBar}
				>
					<TabPane tab="About" key="about">
						<div>
							<AboutData
								user_id={userInformation.id}
								userData={userInformation}
								userImages={userImages}
								userTiers={userTiers}
								constants={constants}
								refreshData={refreshData}
								onChangeSuccess={onChangeUserDataSuccess}
								disableOTP={this.disableOTP}
								flagUser={this.flagUser}
								freezeAccount={this.freezeAccount}
								verifyEmail={this.openVerifyEmailModal}
								recoverUser={this.openRecoverUserModel}
								deleteUser={this.openDeleteUserModel}
								kycPluginName={kycPluginName}
								requestUserData={requestUserData}
								refreshAllData={refreshAllData}
							/>
						</div>
					</TabPane>
					{/* <TabPane tab="Data" key="data">
						<div>
							<UserData
								initialValues={userInformation}
								onChangeSuccess={onChangeUserDataSuccess}
							/>
						</div>
					</TabPane> */}
					<TabPane tab="Bank" key="bank">
						<div>
							<BankData
								initialValues={userInformation}
								onChangeSuccess={onChangeUserDataSuccess}
								refreshData={refreshData}
							/>
						</div>
					</TabPane>
					<TabPane tab="Payment Methods" key="payment_methods">
						<div>
							<PaymentMethods user={userInformation} />
						</div>
					</TabPane>
					{!isSupportUser && !isKYC() && (
						<TabPane tab="Balance" key="balance">
							<UserBalance coins={coins} userData={userInformation} />
						</TabPane>
					)}
					{
						<TabPane tab="Orders" key="orders">
							<ActiveOrders userId={userInformation.id} />
						</TabPane>
					}
					{
						<TabPane tab="Trade history" key="trade">
							<TradeHistory userId={userInformation.id} />
						</TabPane>
					}
					{/* {isAdmin() && (
						<TabPane tab="Funding" key="deposit">
							<Balance user_id={id} pairs={pairs} />
						</TabPane>
					)} */}
					{
						<TabPane tab="Deposits" key="deposits">
							{/*<Deposits*/}
							{/*initialData={{*/}
							{/*user_id: id*/}
							{/*}}*/}
							{/*queryParams={{*/}
							{/*status: false*/}
							{/*}}*/}
							{/*hideUserColumn={true}*/}
							{/*/>*/}
							<Transactions
								initialData={{
									user_id: id,
								}}
								queryParams={{
									type: 'deposit',
								}}
								hideUserColumn={true}
								showFilters={true}
							/>
						</TabPane>
					}
					{
						<TabPane tab="Withdrawal" key="withdrawals">
							<Transactions
								initialData={{
									user_id: id,
								}}
								queryParams={{
									type: 'withdrawal',
								}}
								hideUserColumn={true}
								showFilters={true}
							/>
						</TabPane>
					}
					{
						<TabPane tab="Referrals" key="referrals">
							<Referrals
								userInformation={userInformation}
								referral_history_config={referral_history_config}
							/>
						</TabPane>
					}
					{
						<TabPane tab="Meta" key="meta">
							<UserMetaForm
								constants={constants}
								userData={userInformation}
								handleConfigure={showConfigure}
								isConfigure={isConfigure}
							/>
						</TabPane>
					}
				</Tabs>
				<VerifyEmailConfirmation
					visible={showVerifyEmailModal}
					onCancel={() => this.setState({ showVerifyEmailModal: false })}
					onConfirm={this.verifyUserEmail}
					userData={userInformation}
				/>
				<ActivationConfirmation
					visible={showRecoverModal}
					onCancel={() => this.setState({ showRecoverModal: false })}
					onConfirm={this.handleRecoverUser}
					userData={userInformation}
				/>
				<DeletionConfirmation
					visible={showDeleteModal}
					onCancel={() => this.setState({ showDeleteModal: false })}
					onConfirm={this.handleDeleteUser}
					userData={userInformation}
				/>
			</div>
		);
	}
}

export default UserContent;
