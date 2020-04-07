import { DependencyList, useState, useEffect } from 'react';

/**
 * Accept an async generator, that may yield for state update.
 * @param aGen An async generator.
 * @param deps If present, effect will only activate if the values in the list change.
 */
function useAsyncGenerator<T>(
    aGen: () => AsyncGenerator<T, void, void>,
    deps: DependencyList
) {
    let [value, updateValue] = useState<T>();
    useEffect(() => {
        let died = false;
        void (async () => {
            for await (let i of aGen()) {
                // Break the async loop if component has cleaned up.
                if (died) return;
                updateValue(i);
            }
        })();
        return () => void (died = true);
    }, deps);
    return value;
}

export default useAsyncGenerator;