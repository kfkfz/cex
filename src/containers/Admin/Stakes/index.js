import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import UserStaking from './UserStaking';
import CeFi from './CeFi';

const TabPane = Tabs.TabPane;

const Stakes = (props) => {
	const [activeTab, setActiveTab] = useState('0');

	const handleTabChange = (key) => {
		setActiveTab(key);
	};

	return (
		<div className="admin-earnings-container w-100">
			<Tabs
				defaultActiveKey="0"
				activeKey={activeTab}
				onChange={handleTabChange}
			>
				<TabPane tab="CeFi" key="0">
					<CeFi
						coins={props.coins}
						features={props.features}
						kit={props.constants}
					/>
				</TabPane>
				<TabPane tab="User Staking" key="1">
					<UserStaking coins={props.coins} />
				</TabPane>
			</Tabs>
		</div>
	);
};

const mapStateToProps = (state) => ({
	features: state.app.constants.features,
	pluginNames: state.app.pluginNames,
	coins: state.app.coins,
	constants: state.app.constants,
});

export default connect(mapStateToProps)(Stakes);
