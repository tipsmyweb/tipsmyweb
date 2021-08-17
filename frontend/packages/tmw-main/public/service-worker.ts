/// <reference lib="WebWorker" />

// export empty type because of tsc --isolatedModules flag
export type {};
declare const self: ServiceWorkerGlobalScope;

const cacheName = 'tmw';
const version = 'v0.0.1';

export default function register() {
    self.addEventListener('install', function (event) {
        event.waitUntil(
            caches.open(cacheName + version).then(function (cache) {
                return cache.addAll(['/', '/offline']);
            }),
        );
    });

    self.addEventListener('activate', function (event) {
        event.waitUntil(
            caches.keys().then(function (keys) {
                // Remove caches whose name is no longer valid
                return Promise.all(
                    keys
                        .filter(function (key) {
                            return key.indexOf(version) !== 0;
                        })
                        .map(function (key) {
                            return caches.delete(key);
                        }),
                );
            }),
        );
    });
}
