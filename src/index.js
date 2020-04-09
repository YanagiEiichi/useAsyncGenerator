import { useState, useEffect } from 'react';

function useAsyncGenerator(aGen, deps) {
    if (typeof aGen !== 'function') throw new Error('`aGen` can only be accept an async generator function');
    var tuple = useState();
    useEffect(function () {
        var died = false;
        var errorHandler = function (error) {
            if (console && typeof console.error === 'function') console.error(error);
        };
        // Start the async task.
        var it;
        try {
            it = aGen();
        } catch (error) {
            // Any generator function or async function never throw on call directly,
            // so it may not be an expect type, catch defensively the exception.
            errorHandler(error);
            return;
        }
        // The for-await main loop
        var loop = function (result) {
            // Abort, if component cleand up.
            if (died) return;
            // Abort, if iterator done （return in the generator function).
            if (result && result.done) return;
            // Now, result.done is a false or any js false value, update react component state with value.
            if (result) tuple[1](result.value);
            // Call it.next()
            var maybeThenable;
            try {
                maybeThenable = it.next();
            } catch (error) {
                // The async iterator never throw on it.next() call directly,
                // so it may not be async iterator, catch defensively the exception.
                errorHandler(error);
                return;
            }
            // Next
            if (maybeThenable && typeof maybeThenable.then === 'function') {
                maybeThenable.then(loop, errorHandler);
            } else {
                loop(maybeThenable);
            }
        };
        loop();
        return function () {
            died = true;
        };
    }, deps);
    return tuple[0];
}

export default useAsyncGenerator;
