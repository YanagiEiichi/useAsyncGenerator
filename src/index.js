import { useState, useEffect } from 'react';

function useAsyncGenerator(aGen, deps) {
    // Type assertion.
    if (typeof aGen !== 'function') throw new Error('`aGen` can only be accept an async generator function');

    // Create a state tuple to store the yielded state value.
    var tuple = useState();

    // Put all logic in useEffect hook and set correct deps,
    // call only once async generator for same deps.
    useEffect(function () {
        var died = false;

        // Define an error handler.
        // QUESTION: how to handle async errors better?
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

        // The for-await main loop.
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
                // Compatible with non-async generator or other generator-like.
                // TODO: defend stack overflow cases such as `aGen` is () => { next: () => void };
                loop(maybeThenable);
            }
        };
        // Start main loop.
        loop();

        // Marked as died if component cleaned up.
        return function () {
            died = true;
        };
    }, deps);

    // Return the current state value.
    // NOTE: it's inevitably undefined for the first time, because useEffect hook is async.
    return tuple[0];
}

export default useAsyncGenerator;
