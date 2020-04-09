import { useState, useEffect } from 'react';

function useAsyncGenerator(aGen, deps) {
    // Type assertion.
    if (typeof aGen !== 'function') throw new TypeError('`aGen` can only be accept an async generator function');

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
            // Type assertion.
            if (!it || typeof it.next !== 'function') {
                throw TypeError('Result of the `aGen` is not an Iterator');
            }
        } catch (error) {
            // Any generator function or async function never throw on call directly,
            // so it may not be an expect type, catch defensively the exception.
            errorHandler(error);
            return;
        }

        // The for-await main loop.
        var loop = function () {
            try {
                var what = it.next();
                // Check thenable result.
                if (what && typeof what.then === 'function') {
                    what.then(resultHandler, errorHandler);
                } else {
                    // Compatible with non-async generator or other generator-like.
                    resultHandler(what);
                }
            } catch (error) {
                // The async iterator never throw on it.next() call directly,
                // so it may not be async iterator, catch defensively the exception.
                errorHandler(error);
                return;
            }
        };
        var resultHandler = function (result) {
            // Abort, if component cleand up.
            if (died) return;
            // Type assertion.
            if (result instanceof Object) {
                if (result.done) {
                    // Abort, if iterator done (generator function has returned or thrown).
                } else {
                    // A new state value is yielded from generator function, update react component state now.
                    tuple[1](result.value);
                    // Wait next.
                    loop();
                }
            } else {
                // Abort, if result not an object.
                errorHandler(new TypeError('Iterator result type ' + (typeof result) + ' is not an object'));
            }
        }
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
