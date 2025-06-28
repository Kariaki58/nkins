import ThankYouPage from "./thank-you";
import { Suspense } from "react";


export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ThankYouPage />
        </Suspense>
    )
}