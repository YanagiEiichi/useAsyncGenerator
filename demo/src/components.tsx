import React from 'react';

export const getGeoLocation = () => {
    return new Promise<Position>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 3000,
            maximumAge: 5000
        });
    });
}

export const Loading = () => {
    return <div>Loading...</div>;
}

export const ErrorDisplay = ({ error }: { error: Error }) => {
    return <div style={{ color: 'red' }}>{error.message}</div>;
}

export const ResultDisplay = ({ geo }: { geo: Position }) => {
    let { latitude, longitude } = geo.coords;
    let json = JSON.stringify({ latitude, longitude }, null, 2);
    return <pre>{json}</pre>;
}