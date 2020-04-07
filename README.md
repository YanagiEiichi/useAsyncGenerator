## useAsyncGenerator

Accept an async generator that may yield for state update.

## DEMO

```jsx
const MyComponent = () => {
  let list = useAsyncGenerator(async function* () {
    yield <Loading />;
    try {
      let data = await ajax('api');
      yield data.map(raw => <MyItem {...props} />);
    } catch (error) {
      yield <ErrorDisplay error={error} />;
    }
  }, []);

  return <ul>{list}</ul>;
};
```
