import { useState, useEffect } from 'react';

const useDataFetching = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {

        const response = await fetch('http://127.0.0.1:8000/api/materials', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const jsonData = await response.json();
        setData(jsonData.materials);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return data;
};

export default useDataFetching;