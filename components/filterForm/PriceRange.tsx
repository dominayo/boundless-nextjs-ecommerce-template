import {IFilterFieldProps} from '../FilterForm';
import {ChangeEvent} from 'react';
import {Range as RangeComponent, createSliderWithTooltip} from 'rc-slider';
import 'rc-slider/assets/index.css';
import useFormatCurrency from '../../hooks/useFormatCurrency';
import {useAppSelector} from '../../hooks/redux';

const Range = createSliderWithTooltip(RangeComponent);

export default function PriceRangeField({field, onChange, values, idsPrefix}: IFilterFieldProps) {
	const currencySymbol = useAppSelector((state) => state.app.localeSettings?.money.symbol);
	const {formatCurrency} = useFormatCurrency();

	const onInput = (e: ChangeEvent<HTMLInputElement>) => onChange({[e.target.name]: e.target.value});
	const minValue = field.range?.min ? parseFloat(field.range.min) : 0;
	const maxValue = field.range?.max ? parseFloat(field.range?.max) : 0;

	const onRangeChange = ([min, max]: number[]) => {
		onChange({
			'price_min': min !== minValue ? min : '',
			'price_max': max !== maxValue ? max : ''
		});
	};

	return (
		<>
			<label className='form-label'>Price ({currencySymbol || ''})</label>
			<Range
				allowCross={false}
				className='range-slider mb-2'
				max={maxValue}
				min={minValue}
				onChange={onRangeChange}
				step={0.01}
				tipFormatter={formatCurrency}
				value={[values.price_min || minValue, values.price_max || maxValue]}
			/>
			<div className={'row'}>
				<div className={'col mb-3 d-flex gap-2 justify-content-center'}>
					<label htmlFor={`${idsPrefix}filter_price_min`} className='text-muted'><small>From</small></label>
					<input type='number'
						className='form-control form-control-sm'
						id={`${idsPrefix}filter_price_min`}
						min={minValue}
						placeholder={String(minValue || '')}
						name={'price_min'}
						step={0.01}
						onChange={onInput}
						value={values.price_min}
					/>
				</div>
				<div className={'col mb-3 d-flex gap-2 justify-content-center'}>
					<label htmlFor={`${idsPrefix}filter_price_max`} className='text-muted'><small>To</small></label>
					<input type='number'
						className='form-control form-control-sm'
						id={`${idsPrefix}filter_price_max`}
						max={maxValue}
						placeholder={String(maxValue || '')}
						name={'price_max'}
						step={0.01}
						onChange={onInput}
						value={values.price_max}
					/>
				</div>
			</div>
		</>
	);
}