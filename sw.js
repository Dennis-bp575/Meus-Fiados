const CACHE_NAME = 'meus-fiados-v1';
// Lista de arquivos que o app precisa para abrir sem internet
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. Evento de Instalação: Salva os arquivos essenciais no cache do celular
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Armazenando arquivos no cache...');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Evento de Ativação: Limpa caches antigos se você atualizar o app no futuro
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Service Worker: Limpando cache antigo...', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. Evento Fetch: Intercepta as requisições. Se estiver sem internet, puxa do cache!
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // Retorna o arquivo do cache se encontrar, senão busca na rede normal
      return cachedResponse || fetch(e.request);
    })
  );
});
