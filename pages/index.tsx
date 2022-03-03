import {IProduct} from 'boundless-api-client';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import ProductsList from '../components/ProductsList';
import MainLayout from '../layouts/Main';
import {apiClient} from '../lib/api';
import {makeAllMenus} from '../lib/menu';
import VerticalMenu from '../components/VerticalMenu';
import {IMenuItem} from '../@types/components';
import ProductsSlider from '../components/ProductsSlider';
import SwiperSlider from '../components/SwiperSlider';

export default function IndexPage({products, mainMenu, footerMenu}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<MainLayout mainMenu={mainMenu} footerMenu={footerMenu}>
			<div className='container'>
				<div className='row'>
					<nav className='col-md-3 col-sm-4'>
						{mainMenu && <VerticalMenu menuList={mainMenu} />}
					</nav>
					<div className='col-md-9 col-sm-8'>
						<h1 className='page-heading page-heading_h1  page-heading_m-h1'>Boundless store</h1>
						<ProductsList products={products} query={{}}/>
					</div>
				</div>
				<ProductsSlider products={products.slice(0, 5)} />
				<MainPageSlider />
			</div>
		</MainLayout>
	);
}

export const getServerSideProps: GetServerSideProps<IIndexPageProps> = async () => {
	const categoryTree = await apiClient.catalog.getCategoryTree({menu: 'category'});
	const {products} = await apiClient.catalog.getProducts({collection: ['main-page'], sort: 'in_collection'});

	const menus = makeAllMenus({categoryTree});

	return {
		props: {
			products,
			...menus
		}
	};
};

interface IIndexPageProps {
	products: IProduct[];
	mainMenu: IMenuItem[];
	footerMenu: IMenuItem[];
}

function MainPageSlider() {
	const slides = [
		{
			'img': 'https://i4431-static.my-sellios.ru/media/tpl-images/24/df/6703cb392146512eeb43899ff8cf.jpeg',
			'link': '',
			'caption': 'Три вещи нельзя скрыть: солнце, луну и истину.',
			'captionPosition': 'center',
			'useFilling': true,
			'fillingColor': '#000000',
			'fillingOpacity': 0.40
		},
		{
			'img': 'https://i4431-static.my-sellios.ru/media/tpl-images/a0/af/669bf3da0205acffd5f31d093e38.jpeg',
			'link': '',
			'caption': null,
			'captionPosition': null,
			'useFilling': false,
			'fillingColor': '#000000',
			'fillingOpacity': 0.4
		},
		{
			'img': 'https://i4431-static.my-sellios.ru/media/tpl-images/26/f0/7e3a35271c7bc381dfac2814cbe7.jpg',
			'link': '',
			'caption': 'Some text',
			'captionPosition': 'top',
			'useFilling': false,
			'fillingColor': '#000000',
			'fillingOpacity': 0.4
		}
	];

	return (
		<SwiperSlider
			showPrevNext
			roundCorners
			pagination='progressbar'
			size={'medium'}
			slides={slides}
		/>
	);
}