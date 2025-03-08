// Reklam URL'lerini içeren liste
const adDomains = [
    'doubleclick.net',
    'google-analytics.com',
    'googleadservices.com',
    'googlesyndication.com',
    'adnxs.com',
    'facebook.com',
    'scorecardresearch.com',
    'advertising.com',
    'yandex.ru',
    'moatads.com',
    // Vidsrc.xyz reklamları için
    'vidsrc.stream',
    'vidplay.site',
    'vidsrc.me',
    'adskeeper.com',
    'propellerads.com',
    'popcash.net'
];

// Reklam içeren elementleri seçen CSS seçicileri
const adSelectors = [
    '[class*="ad-"]',
    '[class*="ads-"]',
    '[class*="adsense"]',
    '[id*="google_ads"]',
    '[id*="banner"]',
    'iframe[src*="ads"]',
    'iframe[src*="doubleclick"]',
    '.advertisement',
    '#overlay-ads',
    '.video-ads',
    '.ima-ads-container',
    '.GoogleActiveViewElement',
    '[id*="player-ads"]',
    '[class*="player-ads"]'
];

// Reklam engelleyici fonksiyonu
export const initAdBlocker = () => {
    // MutationObserver için callback
    const callback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                removeAds();
            }
        }
    };

    // DOM değişikliklerini izleyen observer
    const observer = new MutationObserver(callback);
    observer.observe(document.body, { childList: true, subtree: true });

    // Sayfa yüklendiğinde ilk temizlik
    removeAds();

    // Network isteklerini engelle
    blockAdRequests();
};

// Reklam elementlerini kaldır
const removeAds = () => {
    // CSS seçicileri ile eşleşen elementleri bul ve kaldır
    adSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.remove();
        });
    });

    // iframe'leri kontrol et
    document.querySelectorAll('iframe').forEach(iframe => {
        const src = iframe.src.toLowerCase();
        if (adDomains.some(domain => src.includes(domain))) {
            iframe.remove();
        }
    });
};

// Reklam isteklerini engelle
const blockAdRequests = () => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const [resource, config] = args;
        
        // Reklam domainlerini kontrol et
        if (adDomains.some(domain => resource.includes(domain))) {
            return new Response('', {
                status: 200,
                statusText: 'OK'
            });
        }

        return originalFetch(resource, config);
    };

    // XHR isteklerini engelle
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(...args) {
        const [method, url] = args;
        
        if (adDomains.some(domain => url.includes(domain))) {
            return;
        }
        
        return originalOpen.apply(this, args);
    };
}; 