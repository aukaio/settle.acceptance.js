settle.acceptance.js
==================

A standalone JavaScript library that helps you display QR-codes or "Pay with Settle" buttons correctly depending on browser platform.
On a phone a button will be shown, that when pressed opens the Settle app and makes a call to Settle.
If the phone does not have Settle installed the user will be redirected to GooglePlay or AppStore.

Building the library
--------------------
You need `npm` from [node.js](http://nodejs.org/) to build this library.
```
npm install
npm run build
```

Deploying the library
---------------------
After building the code deploy the content of `dist` folder. Pick either settle.acceptance.js or the minified settle.acceptance.min.js and the assets folder as is.


Example and customization
------------------------
[press here](https://aukaio.github.io/settle.acceptance.js/)
You can open this link in on your phone to see how it changes from QR
code to button (or fake your user agent and view on your laptop). Shows examples of customization with alternate look and language variants.


Try the example
-------------
Start a local example server `npm run example` and open [http://localhost:7080/index.html](http://localhost:7080/example.html) in your browser.

Test suit
-------

```
npm test
```
