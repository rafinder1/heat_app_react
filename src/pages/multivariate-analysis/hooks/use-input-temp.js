import { useState } from 'react';

function useInputTemp() {
    const [inputTemp, setInputTemp] = useState();

    const handleInputTemp = (event) => {
        const inputValue = event.target.value;

        if (inputValue !== '') {
            const parsedValue = parseFloat(inputValue);

            if (!isNaN(parsedValue)) {
                setInputTemp(parsedValue);
            }
        }
    };

    return { inputTemp, handleInputTemp };
}

export default useInputTemp;
