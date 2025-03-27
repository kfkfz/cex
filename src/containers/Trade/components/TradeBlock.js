import React from 'react';
import classnames from 'classnames';
import { CloseOutlined } from '@ant-design/icons';
import { Coin, EditWrapper } from 'components';
import { connect } from 'react-redux';
import withConfig from 'components/ConfigProvider/withConfig';
import { bindActionCreators } from 'redux';
import { toggleTool } from 'actions/toolsAction';

const TradeBlock = ({
	children,
	action,
	stringId,
	title,
	titleValues,
	overflowY = false,
	setRef,
	alignChildY = false,
	className = '',
	pairData = {},
	pair,
	isLoggedIn,
	icons: ICONS,
	tool,
	toggleTool,
	titleClassName = '',
}) => {
	const pairs = pair ? pair.split('-').map((curr) => curr.toUpperCase()) : [];
	const { icon_id } = pairData;

	return (
		<div
			className={classnames(
				'trade_block-wrapper',
				'd-flex',
				'flex-column',
				className,
				'apply_rtl'
			)}
		>
			<div
				className={classnames(
					'trade_block-title',
					'drag-handle',
					titleClassName
				)}
			>
				<div className="d-flex justify-content-between">
					<div className="d-flex">
						{pairs.length ? <Coin iconId={icon_id} type="CS4" /> : null}
						<div className="trade_block-title-items px-1">
							{titleValues ? (
								<div className="d-flex">
									<EditWrapper stringId={stringId}>{title}</EditWrapper>
									<React.Fragment>{titleValues}</React.Fragment>
								</div>
							) : (
								<EditWrapper stringId={stringId}>{title}</EditWrapper>
							)}
						</div>
					</div>
					{!!tool && (
						<div
							className="trade_block-title-currency pointer"
							onClick={() => toggleTool(tool)}
						>
							<CloseOutlined />
						</div>
					)}
				</div>
				{action}
			</div>
			<div
				ref={setRef}
				className={classnames(
					'trade_block-content',
					isLoggedIn ? 'd-flex' : '',
					{
						'overflow-y': overflowY,
						'flex-column': alignChildY,
					}
				)}
			>
				{children}
			</div>
		</div>
	);
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
	toggleTool: bindActionCreators(toggleTool, dispatch),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withConfig(TradeBlock));
