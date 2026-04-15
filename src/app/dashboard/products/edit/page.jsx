import NewProduct from "../../new/helper-new-product";
import { Suspense } from "react";

export default function EditProductPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewProduct />
        </Suspense>
    );
}
