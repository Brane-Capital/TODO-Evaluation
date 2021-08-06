import React, { useState } from 'react';
import styled from "styled-components";
import { KeyCode } from "../utils/constants";

const Tab = styled.button`
	padding: 5px 10px 5px 10px;
	cursor: pointer;
	opacity: 0.6;
	z-index: 12;
	background: white;
	color: blue;
	&:focus {
		outline: none;
	}

	input {
		width: 100px;
	}
`;

const ButtonGroup = styled.div`
	display: flex;
	padding: 10px 10px 0px 10px;

	.add-new-tab {
		padding: 3px 10px 0px 10px;
		cursor: pointer;
		margin-bottom: 4px;
		font-size: 20px;
	}

	.add-new-tab:focus {
		outline: none;
	}
	
	.add-new-tab:hover {
		border: 0.1px solid #e6e6e6;
		border-bottom: none;
		padding-bottom: 5px;
	}
`;

const TabItemDiv = styled.div`
	padding: 3px 10px 0px 10px;
	display: flex;
	justify-content: space-between;
	button.destroy {
		font-size: 20px;
		margin-bottom: 4px;
		cursor: pointer;
	}

	${({ active }) =>
		active &&
		`
		border-bottom: 0.1px solid white;
		border-left: 0.1px solid #e6e6e6;
		border-right: 0.1px solid #e6e6e6;
		border-top: 0.1px solid #e6e6e6;
		border-radius: 5px;
	`}

	&:hover {
		border: 0.1px solid #e6e6e6;
		border-bottom: none;
	}
`;


const TabGroup = ({ onDestroy, tabs, selectedTabID, handleChange, handleTabAdd, handleTabRename }) => {
	const [tabName, setTabName] = useState('');
	const [editModeFor, setEditModeFor] = useState(null);

	const handleOnDoubleClick = (name, id) => {
		if (id != 0) {
			setEditModeFor(id);
			setTabName(name);
		}
	}

	const handleOnBlur = (id) => {
		setEditModeFor(null);

		if (tabName != '') {
			handleTabRename(id, tabName);
		}
	}

	const handleTabUpdate = (e, id) => {
		if (selectedTabID !== id) {
			setEditModeFor(null);
			handleChange(id);
		}
	}

	const handleOnKeyDown = (event, id) => {
		if (event.white === KeyCode.Escape || event.which === KeyCode.Enter) {
			handleOnBlur(id);
		}
	};

	const handleCreateNewTab = () => {
		setEditModeFor(null);
		setTabName('');
		handleTabAdd();
	}
	
	return (
		<React.Fragment>
			<ButtonGroup>
				{tabs.map(({ name, id }) => {
					return <TabItemDiv key={id} active={selectedTabID === id}>
						<Tab key={id} onClick={(e) => handleTabUpdate(e, id)} onDoubleClick={(e) => handleOnDoubleClick(name, id)}>
							{editModeFor === id
								? <input
									type="text"
									value={tabName}
									onBlur={() => handleOnBlur(id)}
									onKeyDown={(e) => handleOnKeyDown(e, id)}
									onFocus={(e) => e.preventDefault()}
									onChange={(e) => setTabName(e.currentTarget.value)}
								></input>
								: name
							}
						</Tab>
						{(name !== 'All' && selectedTabID === id) ? <button className="destroy" onClick={() => onDestroy(id)}>x</button> : null }
					</TabItemDiv>
				})}
				<button className="add-new-tab" onClick={() => handleCreateNewTab()}>+</button>
			</ButtonGroup>
		</React.Fragment>
	);
};

export default TabGroup;