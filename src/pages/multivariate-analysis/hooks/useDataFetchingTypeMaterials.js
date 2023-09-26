import { useState, useEffect } from 'react';

function useDataFetchingTypeMaterials() {
    const [typeMaterial, setTypeMaterial] = useState([]);

    const fetchData = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/type_layers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const jsonData = await response.json();
        setTypeMaterial(jsonData.type_layers);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return typeMaterial;
}

export default useDataFetchingTypeMaterials;
