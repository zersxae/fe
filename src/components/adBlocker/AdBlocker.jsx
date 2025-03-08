import React, { useEffect } from 'react';
import { FiltersEngine, Request } from '@ghostery/adblocker';
import { fetch } from 'cross-fetch';

const AdBlocker = () => {
    useEffect(() => {
        const initializeAdBlocker = async () => {
            try {
                // Temel filtreleri yükle
                const engine = await FiltersEngine.fromPrebuiltAdsOnly();

                // Özel kuralları ekle
                const customRules = [
                    // Video player reklamları
                    '*$domain=vidsrc.me',
                    '*$domain=vidsrc.stream',
                    '*$domain=vidplay.site',
                    '*$domain=adskeeper.com',
                    '*$domain=propellerads.com',
                    '*$domain=popcash.net',
                    
                    // Reklam ağları
                    '*$domain=doubleclick.net',
                    '*$domain=google-analytics.com',
                    '*$domain=googleadservices.com',
                    '*$domain=googlesyndication.com',
                    
                    // CSS kuralları
                    '##.ad',
                    '##.ads',
                    '##.advertisement',
                    '##div[class*="ad-"]',
                    '##div[class*="ads-"]',
                    '##.video-ads',
                    '##.ima-ads-container',
                    '##iframe[src*="ads"]'
                ];

                engine.updateFromArray(customRules);

                // DOM değişikliklerini izle
                const observer = new MutationObserver(() => {
                    cleanAds(engine);
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                // İlk temizliği yap
                cleanAds(engine);

                // Network isteklerini engelle
                const originalFetch = window.fetch;
                window.fetch = async (...args) => {
                    const [resource] = args;
                    const request = Request.fromRawDetails({
                        url: resource,
                        type: 'script',
                    });

                    if (engine.match(request)) {
                        return new Response('', { status: 200 });
                    }

                    return originalFetch(...args);
                };

                // XHR isteklerini engelle
                const originalOpen = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function(...args) {
                    const [, url] = args;
                    const request = Request.fromRawDetails({
                        url,
                        type: 'script',
                    });

                    if (engine.match(request)) {
                        return;
                    }

                    return originalOpen.apply(this, args);
                };
            } catch (error) {
                console.error('AdBlocker initialization failed:', error);
            }
        };

        // Reklam elementlerini temizle
        const cleanAds = (engine) => {
            const elements = document.querySelectorAll([
                '.ad', '.ads', '.advertisement',
                'div[class*="ad-"]', 'div[class*="ads-"]',
                '.video-ads', '.ima-ads-container',
                'iframe[src*="ads"]'
            ].join(','));

            elements.forEach(element => {
                element.remove();
            });
        };

        initializeAdBlocker();
    }, []);

    return null;
};

export default AdBlocker; 