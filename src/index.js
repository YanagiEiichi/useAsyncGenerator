import { useState, useEffect } from 'react';

function useAsyncGenerator(aGen, deps) {
    var tuple = useState();
    useEffect(function () {
        var died = false;
        var iterator = aGen();
        var errorHandler = function (error) {
            if (console && typeof console.error === 'function') console.error(error);
        };
        var loop = function (result) {
            if (died) return;
            if (result && result.done) return;
            if (result) tuple[1](result.value);
            try {
                var maybeThenable = iterator.next();
                if (maybeThenable && typeof maybeThenable.then === 'function') {
                    maybeThenable.then(loop, errorHandler);
                } else {
                    loop(maybeThenable);
                }
            } catch (error) {
                errorHandler(error);
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
