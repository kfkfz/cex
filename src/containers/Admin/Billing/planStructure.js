import React from 'react';
import _get from 'lodash/get';
import { CheckOutlined } from '@ant-design/icons';

const PlanStructure = ({
	exchange,
	planData,
	type,
	isMonthly,
	planType,
	showConfigIcon = false,
	handleConfigPlan,
	handleSelect,
	priceData,
	selectedType,
	setSelectedType,
	className,
	onHandleSelectedType,
	cloudPlanDetails,
}) => {
	let currentPlan = planData[type];

	return (
		<div
			className={
				!cloudPlanDetails
					? `${className} plan-container`
					: 'cloud-plan-container cloud-container'
			}
			onClick={() => !cloudPlanDetails && onHandleSelectedType(type)}
		>
			<div className="plan-container-wrapper">
				<div className={`popular-header-${type}`}>
					{type === 'crypto' ? 'MOST POPULAR' : ''}
				</div>
				<div className="header-wrapper">
					<div className={`header-container-${type}`}></div>
					<div
						style={{ backgroundImage: `url(${currentPlan?.background})` }}
						className="header-container"
					>
						<h2 className="type-center">{currentPlan?.title}</h2>
						<h6 className="text-center">{currentPlan.description}</h6>
					</div>
				</div>
				<div className="info-link-content">
					<a
						href="https://www.hollaex.com/pricing"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn more
					</a>
				</div>
				<div className="amount-wrapper">
					<div className={`amount-container`}>
						{type === 'fiat' ? (
							<div>
								<p className="dollor-size">Apply</p>
							</div>
						) : isMonthly ? (
							<div>
								<p className="dollor-size">
									${_get(priceData[type], 'month.price')}
								</p>
								<p>per month</p>
							</div>
						) : (
							<div>
								<p className="dollor-size">
									${_get(priceData[type], 'year.price')}
								</p>
								<p>per year</p>
							</div>
						)}
					</div>
					{!cloudPlanDetails && (
						<div className="radio-container">
							{selectedType === type ? (
								<div>
									<CheckOutlined className={'selected-plan'} />
									<div className="selected-status">SELECTED</div>
								</div>
							) : (
								<div>
									<div className="de-select-status"></div>
									<div className="de-select-status-txt">Select</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PlanStructure;
