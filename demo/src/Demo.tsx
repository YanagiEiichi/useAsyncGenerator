import React from 'react';
import { Loading, getGeoLocation, ResultDisplay, ErrorDisplay } from './components';
import useAsyncGenerator from 'use-async-generator';

const Demo = () => {
    let content = useAsyncGenerator(async function* () {
        // First, data has not been loaded yet, render a Loading component here.
        yield <Loading />;
        // Thereupon, start an async task to load data.
        try {
            let geo = await getGeoLocation();
            // Now, data has been loaded, render a ResultDisplay component here.
            yield <ResultDisplay geo={geo} />;
        } catch (error) {
            // Any async data loader may occur errors (such as NetWorkError, and Timeout),
            // catch the error and render a ErrorDisplay component here.
            yield <ErrorDisplay error={error} />;
        }
    }, []);

    return (
        <div>
            <header>Try to get asynchronously geolocation.</header>
            <hr />
            <main>
                {content}
            </main>
        </div>
    );
};

export default Demo;
