(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            root.Settle = factory();
            return root.Settle;
        });
    } else {
        // Browser globals
        root.Settle = factory();
    }
}(this, function () {
    'use strict';
    var exports = {};
    var _timeout;

    import btnCss from '../assets/css/button.css';
    import qrCss from '../assets/css/qr.css';
    import launchIcon from '../assets/images/launch_icon.png';
    import settleLogo from '../assets/images/settle-logo-black.png';
    import settleLogoAlternate from '../assets/images/settle-logo-white.png';

    exports.redirect_to = function (url) {
        location.href = url;
    };

    exports.kill_redirect = function () {
        if (typeof _timeout === "number") {
            _timeout = clearTimeout(_timeout);
        }
    };

    exports.platformHasNativeSupport = function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod|Android|Dalvik/);
    };

    var SETTLE_SHORTLINK_ENDPOINT = 'http://settle.eu/',
        SETTLE_SHORTLINK_DEFAULT_PREFIX = 's',
        SETTLE_SHORTLINK_RE = /^[a-z]$/,
        LAUNCH_ICON = 'data:image/png;base64,' + launchIcon,
        SETTLE_LOGO = 'data:image/png;base64,' + settleLogo,
        SETTLE_LOGO_ALTERNATE = 'data:image/png;base64,' + settleLogoAlternate,
        SETTLE_LOCALE_MAP = {
	        nb: 'Åpne Settle',
            no: 'Åpne Settle',
            en: 'Open Settle'
        },
        SETTLE_DOWNLOAD_IOS = 'https://itunes.apple.com/us/app/settle/id1440051902?mt=8',
        SETTLE_DOWNLOAD_ANDROID = 'https://play.google.com/store/apps/details?id=eu.settle.app',

        getPrefix = function () {
            var parser,
                match,
                i;

            for (i = 0; i < document.scripts.length; i++) {
                match = document.scripts[i].src && document.scripts[i].src.match(/^(.*)settle\.acceptance(.[\.\d]*)?(\.min)?\.js(\?.*)?$/);
                if (match && match[1]) {
                    parser = document.createElement('a');
                    parser.href = match[1];
                    return parser.href;
                }
            }
            return '/';
        },

        scan = function (shortlinkUrl) {
            var config = window.settleConfig || {
                env: 'settle',
                baseUrl: 'get.settle.eu',
                apn: 'eu.settle.app',
                ibi: 'eu.settle.app',
                isi: '1440051902'
            };

            var url = [
                'https://',
                config.baseUrl,
                '?apn=' + config.apn,
                '&ibi=' + config.ibi,
                '&isi=' + config.isi,
                '&ius=eu.settle.app.firebaselink',
                '&link=' +
                encodeURIComponent('https://' + config.env + '://qr/' + shortlinkUrl),
            ].join('');

            exports.redirect_to(url);
        },

        loadCSS = function (cssId, content) {
            if (!document.getElementById(cssId)) {
                var headTag = document.getElementsByTagName('head'),
                    cssTag = document.createElement('style');

                if (!headTag) {
                    headTag = [document.createElement('head')];
                    document.body.appendChild(headTag[0]);
                }

                cssTag.id = cssId;
                cssTag.innerHTML = content;
                headTag[0].appendChild(cssTag);
            }
        },

        createSettleButton = function (SettleDiv, prefix, alternate, shortlink_url) {
	    var userLanguage = window.navigator.languages ? window.navigator.languages[0] : (window.navigator.language || window.navigator.userLanguage),
                language = userLanguage && userLanguage.split('-')[0],
                labelKey = SettleDiv.getAttribute('data-settle-lang'),
                greeting = SETTLE_LOCALE_MAP[labelKey] || SETTLE_LOCALE_MAP[language] || SETTLE_LOCALE_MAP.en,
                span,
                SettlePayImg,
                SettleButton,
                SettleButtonWrap,
                wrapper;


            loadCSS('shortlinkcss', btnCss);

            wrapper = document.createElement('div');
            wrapper.className = 'settle-wrapper';

            SettleButtonWrap = document.createElement('span');
            SettleButtonWrap.className = 'settle-btnwrap';

            span = document.createElement('span');
            span.className = 'settle-label';
            span.innerHTML = greeting;

            SettlePayImg = document.createElement('img');
            SettlePayImg.src = LAUNCH_ICON;

            SettleButton = document.createElement('button');
            SettleButton.type = 'button';
            SettleButton.className = 'paywithsettle' + (alternate ? ' settle-alternate' : '');
            SettleButton.onclick = function () {
                scan(shortlink_url);
            };

            SettleButton.appendChild(SettleButtonWrap);
            SettleButtonWrap.appendChild(span);
            SettleButtonWrap.appendChild(SettlePayImg);

            wrapper.appendChild(SettleButton);
            SettleDiv.appendChild(wrapper);
        },

        createQRcode = function (SettleDiv, prefix, alternate, shortlink_url) {
            var Android,
                iOS,
                logo,
                nav,
                qrCode,
                logoWrap,
                wrapper;

            loadCSS('qrcss', qrCss);

            wrapper = document.createElement('div');
            wrapper.className = 'settle-wrapper' + (alternate ? ' settle-alternate' : '');

            qrCode = document.createElement('div');
            qrCode.className = 'settle-qr-image';

            // Create QR code
            new QRCode(qrCode, {
                text: shortlink_url,
                width: 180,
                height: 180,
                correctLevel: QRCode.CorrectLevel.L
            });

            // Create the bottom navigation
            nav = document.createElement('div');
            nav.setAttribute('class', 'settle-nav');

            logoWrap = document.createElement('a');
            logoWrap.href = 'https://settle.eu/';
            logoWrap.target = '_blank';

            // Create logo and download links
            logo = document.createElement('img');
            logo.setAttribute('src', prefix + SETTLE_LOGO);
            logo.setAttribute('class', 'settle-logo');

            iOS = document.createElement('a');
            iOS.setAttribute('href', SETTLE_DOWNLOAD_IOS);
            iOS.setAttribute('class', 'settle-link settle-ios');
            iOS.setAttribute('target', '_blank');
            iOS.setAttribute('title', 'Download Settle from App Store');
            iOS.innerHTML = 'iOS';

            Android = document.createElement('a');
            Android.setAttribute('href', SETTLE_DOWNLOAD_ANDROID);
            Android.setAttribute('class', 'settle-link settle-android');
            Android.setAttribute('target', '_blank');
            Android.setAttribute('title', 'Download Settle from Google Play');
            Android.innerHTML = 'Android';

            logoWrap.appendChild(logo);
            nav.appendChild(logoWrap);
            nav.appendChild(iOS);
            nav.appendChild(Android);

            if (!alternate) {
                logo.src = SETTLE_LOGO;
            } else {
                logo.src = SETTLE_LOGO_ALTERNATE;
                iOS.setAttribute('class', 'settle-link settle-ios-w');
                Android.setAttribute('class', 'settle-link settle-android-w');
            }

            wrapper.appendChild(qrCode);
            wrapper.appendChild(nav);
            SettleDiv.appendChild(wrapper);
        };

    exports.displayQRorButton = function () {
        var SettleDivs = document.getElementsByClassName('settle-acceptance'),
            native = exports.platformHasNativeSupport(),
            SettleDiv,
            alternate,
            id,
            static_prefix = getPrefix(),
            shortlink_prefix,
            shortlink_url,
            i;

        for (i = 0; i < SettleDivs.length; i++) {
            SettleDiv = SettleDivs[i];
            id = SettleDiv.getAttribute('data-shortlink-id');
            if (id && id.trim()) {
                shortlink_prefix = SettleDiv.getAttribute('data-shortlink-prefix') || '';
                if (!SETTLE_SHORTLINK_RE.exec(shortlink_prefix)) {
                    shortlink_prefix = SETTLE_SHORTLINK_DEFAULT_PREFIX;
                }
                id = id.trim() + '/' + (SettleDiv.getAttribute('data-shortlink-argstring') || '');
                alternate = SettleDiv.getAttribute('data-alternate') === 'true';
                shortlink_url = SETTLE_SHORTLINK_ENDPOINT + shortlink_prefix + '/' + id;

                if (native) {
                    createSettleButton(SettleDiv, static_prefix, alternate, shortlink_url);
                } else {
                    createQRcode(SettleDiv, static_prefix, alternate, shortlink_url);
                }
            }
        }
    };

    return exports;
}));

