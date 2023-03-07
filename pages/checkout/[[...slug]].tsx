import {useCart} from '../../hooks/cart';
import {startCheckout, StarterWrapper, resetCheckoutState} from 'boundless-checkout-react';
import {useRouter} from 'next/router';
import {apiClient} from '../../lib/api';
import {TCartInited} from '../../redux/reducers/cart';
import Loader from '../../components/Loader';
import logoImg from '../../assets/logo.svg';
import Head from 'next/head';
import {useCallback, useEffect, useRef} from 'react';
import {createGetStr} from 'boundless-api-client/utils';

export default function CheckoutPage() {
	const {id: cartId, cartInited} = useCart();
	const router = useRouter();
	const checkoutStarter = useRef<StarterWrapper>();

	const checkoutRef = useCallback((node: HTMLDivElement) => {
		if (node && cartInited === TCartInited.yes && cartId) {
			checkoutStarter.current = startCheckout(node, {
				api: apiClient,
				cartId,
				onHide: (element: string, error?: string) => {
					resetCheckoutState();
					if (element === 'backToCart') {
						const query: {error?: string} = {};
						if (error) {
							query.error = error;
						}

						router.push(`/cart?${createGetStr(query)}`);
					} else if (element === 'logo') {
						router.push('/');
					} else {
						console.log('unknown element: ', element);
					}
				},
				onThankYouPage: (data) => {
					resetCheckoutState();
					window.location.assign(`/thank-you/${data.orderId}`);
				},
				basename: '/checkout',
				logoSrc: logoImg.src,
			});
		}
	}, [cartInited, cartId]);//eslint-disable-line
	useEffect(() => {
		return () => {
			if (checkoutStarter.current) {
				checkoutStarter.current.destroy();
			}
		};
	}, []);

	if (cartInited !== TCartInited.yes) {
		return <Loader />;
	}

	return (
		<>
			<Head>
				<meta name='robots' content='noindex' />
			</Head>
			<div>
				<div ref={checkoutRef}></div>
			</div>
		</>
	);
}