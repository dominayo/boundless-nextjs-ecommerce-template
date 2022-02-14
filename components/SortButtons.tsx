import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {TQuery, TSortOrder} from '../@types/common';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSortAmountDown, faSortAmountDownAlt} from '@fortawesome/free-solid-svg-icons';

const sortFields = [
	{id: 1, title: 'Default', order: false, alias: 'default'},
	{id: 2, title: 'By title', order: true, alias: 'title'},
	{id: 3, title: 'By price', order: true, alias: 'price'},
];

export default function SortButtons({params, onSort, className}: {params: TQuery, onSort: (query: TQuery) => void, className?: string}) {
	const activeField = getActiveSortField(params.sort);
	const [activeId, setActiveId] = useState<number>(activeField.id);
	const [order, setOrder] = useState<TSortOrder>(activeField.order);

	useEffect(() => {
		const {id, order} = getActiveSortField(params.sort);
		setActiveId(id);
		setOrder(order);
	}, [params]);

	const onSortClick = (e: React.MouseEvent, id: number) => {
		e.preventDefault();

		const newOrder = activeId === id ? getOppositeOrder(order) : TSortOrder.asc;
		setOrder(newOrder);
		setActiveId(id);

		const newAlias = sortFields.find(el => el.id === id)!.alias;
		const newSortQuery = `${newOrder}${newAlias === 'default' ? '' : newAlias}`;
		const newParams = {...params};

		if (newSortQuery) {
			Object.assign(newParams, {sort: newSortQuery});
		} else {
			delete newParams.sort;
		}
		delete newParams.page;

		onSort(newParams);
	};

	return (
		<div className={clsx('sort-buttons', className)}>
			<label className='small me-2'>Sort by:</label>
			<ul className='sort-buttons__list list-unstyled'>
				{sortFields.map(field => {
					const isActive = activeId === field.id;
					return (
						<li key={field.id} className={clsx('sort-buttons__element', isActive && 'active')}>
							{isActive && !field.order
								? <>{field.title}</>
								: <a
									href='#'
									rel='nofollow'
									className='sort-buttons__link'
									onClick={(e) => onSortClick(e, field.id)}
								>
									{field.title}
									{field.order && isActive &&
										<FontAwesomeIcon
											className='ms-1'
											icon={order === TSortOrder.asc ? faSortAmountDownAlt : faSortAmountDown}
										/>}
								</a>}
						</li>
					);
				})}
			</ul>
		</div>
	);
}

const getActiveSortField = (sort: string) => {
	const sortQuery = (sort || '').split(',')[0]; //gets only the first sort field from query
	const isDesc = sortQuery.startsWith('-');

	const order = isDesc ? TSortOrder.desc : TSortOrder.asc;
	const sortAlias = isDesc ? sortQuery.replace('-', '') : sortQuery;
	const activeId = (sortFields.find(el => el.alias === sortAlias) || sortFields.find(el => el.alias === 'default'))!.id;

	return {
		id: activeId,
		order,
	};
};

const getOppositeOrder = (order: TSortOrder) => {
	return order === TSortOrder.asc ? TSortOrder.desc : TSortOrder.asc;
};