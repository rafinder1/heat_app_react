import { useState } from 'react';

function useInputPower() {
    const [inputPower, setInputPower] = useState(null);

    const handleInputPower = (event) => {
        const inputValue = event.target.value;

        if (inputValue !== '') {
            const parsedValue = parseFloat(inputValue);

            if (!isNaN(parsedValue)) {
                setInputPower(parsedValue);
            }
        }
    };

    return { inputPower, handleInputPower };
}

export default useInputPower;
