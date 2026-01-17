import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function getProductById(id) {
    if (!id) return null;
    try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.warn(`Product with ID ${id} not found`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}
