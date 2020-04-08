import { DependencyList } from 'react';

/**
 * Accept an async generator, that may yield for state update.
 * @param aGen An async generator.
 * @param deps Effect will only activate if the values in the list change.
 */
declare function useAsyncGenerator<T>(
    aGen: () => AsyncGenerator<T, void, void>,
    deps: DependencyList
): T | undefined

export default useAsyncGenerator;