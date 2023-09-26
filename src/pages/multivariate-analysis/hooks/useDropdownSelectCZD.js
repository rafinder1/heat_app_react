import { useState } from 'react';

function useDropdownSelect() {
    const [selectedTemp, setSelectedZone] = useState(null);

    const handleDropdownSelect = (eventKey) => {
        const selectedTemperature = parseInt(eventKey.split(': ')[1]);
        setSelectedZone(selectedTemperature);
    };

    return { selectedTemp, handleDropdownSelect };
}

export default useDropdownSelect;