import {ICartItem} from 'boundless-api-client';
import {useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import {calcTotal, calcTotalPrice} from '../../lib/calculator';
import {apiClient} from '../../lib/services/api';
import {addPromise} from '../../redux/reducers/xhr';
import {RootState} from '../../redux/store';
import CartRow from './CartRow';
import debounce from 'lodash/debounce';

export default function CartItems({items}: ICartItemsProps) {
	const dispatch = useAppDispatch();
	const cartId = useAppSelector((state: RootState) => state.cart.cartId);
	const [filteredItems, setFilteredItems] = useState(items);

	const rmItem = (itemId: number) => {
		if (!cartId) return;

		setFilteredItems(prevItems => prevItems.filter(el => el.item_id !== itemId));

		const promise = apiClient.orders.removeFromCart(cartId, [itemId]);

		dispatch(addPromise(promise));
	};

	const totalCount = useMemo(() => calcTotal(filteredItems.map(el => ({
		qty: el.qty,
		price: calcTotalPrice(el.itemPrice.final_price!, el.qty)
	}))), [filteredItems]);

	const submitQty = (itemId: number, newQty: number) => {
		if (!cartId) return;
		const promise = apiClient.orders.setCartItemsQty(cartId, [{
			item_id: itemId,
			qty: newQty
		}]);

		dispatch(addPromise(promise));
	};

	const debouncedSubmitQty = useMemo(() =>
		debounce(
			(itemId: number, qty: number) => submitQty(itemId, qty), 700, {leading: true}
		), []);// eslint-disable-line

	const onQtyChange = (itemId: number, newQty: number) => {
		setFilteredItems(prevFiltered => {
			const out = [...prevFiltered];
			const index = out.findIndex(el => el.item_id === itemId);
			if (index >= 0) {
				out[index].qty = newQty;
			}
			return out;
		});

		debouncedSubmitQty(itemId, newQty);
	};

	useEffect(() => {
		setFilteredItems(items);
	}, [items]);

	return (
		<>
			<div className='cart-items'>
				<div className='row fw-bold d-none d-md-flex mb-2'>
					<div className='col-md-4 text-center'></div>
					<div className='col-md-2 text-center'>Price</div>
					<div className='col-md-2 text-center'>Qty</div>
					<div className='col-md-2 text-center'>Total</div>
					<div className='col-md-2 text-center'></div>
				</div>
				{filteredItems.map(item => (
					<CartRow
						item={item}
						rmItem={() => rmItem(item.item_id)} key={item.item_id}
						onQtyChange={(qty: number) => onQtyChange(item.item_id, qty)}
					/>
				))}
				<div className='row fw-bold mb-2 py-3 '>
					<div className='col-md-6 text-start text-md-end mb-2'>Order Total:</div>
					<div className='col-md-2 text-start text-md-center mb-2'>
						<span className='d-inline d-md-none'><strong>Qty: </strong></span>
						{totalCount.qty}
					</div>
					<div className='col-md-2 text-start text-md-center mb-2'>
						<span className='d-inline d-md-none'><strong>Price: </strong></span>
						{totalCount.price}
					</div>
				</div>
			</div>
			<div className='text-end mt-4 mb-2'>
				<button
					className='btn btn-primary'
				>
					Proceed to checkout
				</button>
			</div>
		</>
	);
}

interface ICartItemsProps {
	items: ICartItem[];
}