import {IProductItem, IProductVariant} from 'boundless-api-client';
import ProductVariantPicker from './VariantPicker';
import ProductPriceAndBuy from './PriceAndBuy';
import {useState} from 'react';
import clsx from 'clsx';

export default function ProductVariantAndBuy({product, onAddedToCart}: IProductVariantAndBuyProps) {
	const [selectedVariant, setSelectedVariant] = useState<null|IProductVariant>();
	const [error, setError] = useState<null|string>();

	const onCaseChange = (value: {}, variant?: IProductVariant) => {
		setSelectedVariant(variant ? variant : null);
		setError(null);
	};

	return (
		<div className={'variant-and-buy'}>
			{product.has_variants && <div className={clsx('variant-and-buy__variants', {'has-error': error})}>
				<ProductVariantPicker extendedVariants={product.extendedVariants!}
															onChange={onCaseChange}
				/>
				{error && <div className={'variant-and-buy__error'}>{error}</div>}
			</div>}
			<ProductPriceAndBuy product={product}
													selectedVariant={selectedVariant}
													setError={setError}
													onAddedToCart={onAddedToCart}
			/>
		</div>
	);
}

interface IProductVariantAndBuyProps {
	product: Pick<IProductItem, 'price' | 'has_variants' | 'in_stock' | 'item_id' | 'extendedVariants'>,
	onAddedToCart?: (itemId: number, qty: number) => void;
}