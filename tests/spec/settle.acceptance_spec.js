(function () {
    'use strict';

    describe('settle.acceptance.js', function () {
        var origAgent = navigator.userAgent,
            newNavigator = Object.create(window.navigator),
            origNavigator,
            setAgentAs = function (name) {
                if (typeof window.phantom !== 'undefined') {
                    newNavigator.userAgent = name;
                    origNavigator = window.navigator;
                    window.navigator = newNavigator;
                } else {
                    navigator.__defineGetter__('userAgent', function(){
                        return name;
                    });
                }
            },
            setNavigatorLanguageAs = function (name) {
                navigator.__defineGetter__('language', function () {
                    return name;
                });
            },
            prependNavigatorLanguagesAs = function (name) {
                navigator.__defineGetter__('languages', function () {
                    return [name];
                });
            };

        beforeEach(function () {
            navigator.__defineGetter__('languages', function () {
                return null;
            });
            spyOn(Settle, 'redirect_to');
        });

        afterEach(function () {
            Settle.kill_redirect();
            $('.test').empty();

            if (navigator.userAgent !== origAgent) {
                if (typeof window.phantom !== "undefined") {
                    window.navigator = origNavigator;
                } else {
                    navigator.__defineGetter__('userAgent', function(){
                        return origAgent;
                    });
                }
            }
        });

        it('provides an Settle.displayQRorButton function', function () {
            expect(typeof Settle).toBe('object');
            expect(typeof Settle.displayQRorButton).toBe('function');
        });

        it('creates a QR code from an id', function () {
            Settle.displayQRorButton();

            var img = $('#a img[alt="http://settle.eu/s/moo/"]');
            expect(img.length).toBe(1);
        });

        it('creates a QR code from an id and an argstring', function () {
            Settle.displayQRorButton();

            var img = $('#b img[alt="http://settle.eu/s/moo/far"]');
            expect(img.length).toBe(1);
        });

        it('creates a QR button from an id', function () {
            setAgentAs("iPad");

            Settle.displayQRorButton();

            var img = $('#a img[alt="http://settle.eu/s/moo/"]'),
                button = $('#a button.paywithsettle');

            expect(img.length).toBe(0);
            expect(button.length).toBe(1);

            button.click();
            expect(Settle.redirect_to).toHaveBeenCalledWith('https://get.settle.eu?apn=eu.settle.app&ibi=eu.settle.app&isi=1440051902&link=https%3A%2F%2Fsettle%3A%2F%2Fqr%2Fhttp%3A%2F%2Fsettle.eu%2Fs%2Fmoo%2F');
        });

        it('creates a QR button from an id and an argstring', function () {
            setAgentAs("iPad");

            Settle.displayQRorButton();

            var img = $('#b img[alt="http://settle.eu/s/moo/"]'),
                button = $('#b button.paywithsettle');
            expect(img.length).toBe(0);
            expect(button.length).toBe(1);

            button.click();
            expect(Settle.redirect_to).toHaveBeenCalledWith('https://get.settle.eu?apn=eu.settle.app&ibi=eu.settle.app&isi=1440051902&link=https%3A%2F%2Fsettle%3A%2F%2Fqr%2Fhttp%3A%2F%2Fsettle.eu%2Fs%2Fmoo%2Ffar');
        });

        it('creates a custom shortlink', function () {
            setAgentAs("iPad");

            Settle.displayQRorButton();

            var img = $('#c img[alt="http://settle.eu/s/foo/"]'),
                button = $('#c button.paywithsettle');
            expect(img.length).toBe(0);
            expect(button.length).toBe(1);

            button.click();
            expect(Settle.redirect_to).toHaveBeenCalledWith('https://get.settle.eu?apn=eu.settle.app&ibi=eu.settle.app&isi=1440051902&link=https%3A%2F%2Fsettle%3A%2F%2Fqr%2Fhttp%3A%2F%2Fsettle.eu%2Fq%2Ffoo%2F');
        });

        it('creates a QR button with language as nb-NO', function () {
            setAgentAs("iPad");
	    setNavigatorLanguageAs("nb-NO");
            Settle.displayQRorButton();
            var label = $('button.paywithsettle .settle-label:first').text();
	    expect(label).toBe("Åpne Settle");
        });

        it('creates a QR button with language as en-US', function () {
            setAgentAs("iPad");
	    setNavigatorLanguageAs("en-US");
            Settle.displayQRorButton();
            var label = $('button.paywithsettle .settle-label:first').text();
	    expect(label).toBe("Open Settle");
        });

        it('creates a QR button with language as no-NO', function () {
            setAgentAs("iPad");
	    setNavigatorLanguageAs("no-NO");
            Settle.displayQRorButton();
            var label = $('button.paywithsettle .settle-label:first').text();
	    expect(label).toBe("Åpne Settle");
        });

        it('creates a QR button with language as se-SE', function () {
            setAgentAs("iPad");
	    setNavigatorLanguageAs("se-SE");
            Settle.displayQRorButton();
            var label = $('button.paywithsettle .settle-label:first').text();
	    expect(label).toBe("Open Settle");
        });

	it('creates a QR button with prefered language as nb', function () {
            setAgentAs("iPad");
	    prependNavigatorLanguagesAs("nb");
            Settle.displayQRorButton();
            var label = $('button.paywithsettle .settle-label:first').text();
	    expect(label).toBe("Åpne Settle");
        });

	it('creates a QR button with prefered language as nb-NO', function () {
            setAgentAs("iPad");
	    prependNavigatorLanguagesAs("nb-NO");
	     setNavigatorLanguageAs("en-US");
            Settle.displayQRorButton();
            var label = $('button.paywithsettle .settle-label:first').text();
	    expect(label).toBe("Åpne Settle");
        });

    });

})();
