import { useState } from 'react';

function useInputWallSurface() {
    const [inputWallSurface, setWallSurface] = useState();

    const handleInputWallSurface = (event) => {
        const inputValue = event.target.value;

        if (inputValue !== '') {
            const parsedValue = parseFloat(inputValue);

            if (!isNaN(parsedValue)) {
                setWallSurface(parsedValue);
            }
        }
    };

    return { inputWallSurface, handleInputWallSurface };
}

export default useInputWallSurface;
