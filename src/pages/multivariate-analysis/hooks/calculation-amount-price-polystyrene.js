import { useState } from 'react';
function useCalculateAmountPrice() {
    const [amountPrice, setAmountPrice] = useState(null);
    const handleCalculateAmountPrice = async (mvc, inputWallSurface) => {
        const requestData = {
            mvc: mvc,
            inputWallSurface: inputWallSurface
        };
        const response = await fetch('http://127.0.0.1:8000/api/calculate_amount_polys_price', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })

        if (response.ok) {
            const amountPricePolystyrene = await response.json();
            setAmountPrice(amountPricePolystyrene)

        } else {
            // Handle error response
            const result = "Handle error response"
            setAmountPrice(result)
        }
    }
    return { amountPrice, handleCalculateAmountPrice };

}

export default useCalculateAmountPrice;