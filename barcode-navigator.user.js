// ==UserScript==
// @name         Barcode Scan Navigator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Navigate to URLs scanned via barcode input
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    let buffer = '';
    let lastTime = Date.now();
    const scanTimeout = 50; // ms between chars to consider as barcode

    document.addEventListener('keydown', function (e) {
        e.stopPropagation(); 
        e.preventDefault();
        const now = Date.now();
        if (now - lastTime > scanTimeout) buffer = '';
        lastTime = now;
        if (e.key === 'Enter') {
            if (buffer.length > 3) {
                window.location.href = buffer;
            }
            buffer = '';
        } else if (e.key.length === 1) {
            buffer += e.key;
        }
    }, true);
})();
