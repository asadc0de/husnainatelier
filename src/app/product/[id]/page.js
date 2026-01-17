import { getProductById } from '../../../utils/fetchProduct';
import ProductDetails from '../../../components/ProductDetails';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        return {
            title: 'Product Not Found | Husnain Atelier',
        }
    }

    return {
        title: `${product.name} | Husnain Atelier`,
        description: `Buy ${product.name} for ${product.price}.`,
        openGraph: {
            title: product.name,
            description: `Price: ${product.price}`,
            images: [product.image],
            url: `https://husnainatelier.vercel.app/product/${id}`,
            type: 'website',
        },
    };
}

export default function Page() {
    return <ProductDetails />;
}
