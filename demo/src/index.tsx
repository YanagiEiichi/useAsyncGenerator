import React from 'react';
import ReactDOM from 'react-dom';

import useAsyncGenerator from 'use-async-generator';

const getGeoLocation = () => {
  return new Promise<Position>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

const Loading = () => {
  return <div>Loading...</div>;
}

const ErrorDisplay = ({ error }: { error: Error }) => {
  return <div style={{ color: 'red' }}>{error.message}</div>;
}

const ResultDisplay = ({ data }: { data: any }) => {
  return <pre>{data}</pre>;
}

const Demo = () => {
  let content = useAsyncGenerator(async function* () {
    yield <Loading />;
    try {
      let geo = await getGeoLocation();
      let { latitude, longitude } = geo.coords;
      let json = JSON.stringify({ latitude, longitude }, null, 2);
      yield <ResultDisplay data={json} />;
    } catch (error) {
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

let root = document.createElement('react-root');
document.body.appendChild(root);
ReactDOM.render(<Demo />, root);
