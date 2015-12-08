# amsi_poli_platformer

Co jest potrzebne do zbudowania aplikacji
=========================================

Node.js
-------

Node.js to środowisko javascript działające na dowolnym systemie operacyjnym,
w przeciwieństwie do stardowego środowiska przeglądarki internetowej.

Node'a można łatwo pobrać z [tej](https://nodejs.org/en/download/) strony.

Po zainstalowaniu do zmiennej systemowej PATH zostaną dodane komendy 'node' i 'npm'.
* node - służy do uruchamiania skryptów js w konsoli
* npm - menedżer paczek do node'a

Budowanie aplikacji
-------------------

Zanim zbudujemy aplikację musimy pobrać odpowiednie narzędzia. Wystarczy, że po zainstalowaniu
node'a wejdziemy w konsoli na folder z projektem i wpiszemy `npm install`.

Zostanie pobrany Phaser (framework do robienia gier) oraz kilka skryptów działających w środowisku node'a. 
 
Po zainstalowaniu wszystkich zależności mamy dostęp do następujących komend:
* `npm run build` - zbuduje nasz projekt czytając pliki z folderu 'src' i tworząc jeden plik 'build.js'
                    który zawiera złączone wszystkie pliki js.
* `npm run watch` - zbuduje projekt i będzie czekał na zmianę w jakimkolwiek pliku wewnątrz folderu src
                    po której przebuduje na nowo projekt.
* `npm run serve` - zbuduje projekt, będzie nasłuchiwał na zmiany i w ich razie przebuduje aplikacjię,
                    jednocześnie postawi serwer i otworzy przeglądarkę na pliku .html z grą. Przy każdej zmianie
					czyli przebudowie projektu, automatycznie odświeży nam stronę, dzięki czemu błyskawicznie możemy
					zauważyć wprowadzone zmiany.
					
W razie wątpiliwości dlaczego co jak działa, skrypty są zdefiniowane w `package.json` w parametrze `scripts`. Wpisując
`npm install` instalujemy wszystkie skrypty które umożliwiają wykonanie powyższych komend. Odsyłam w razie czego do opsiu
tej funkcjonalności [tutaj](https://docs.npmjs.com/misc/scripts).
					
Po co tyle zachodu?
-------------------

### Serwer 

Gry w opraciu o stack HTML + JS potrzebują postawionego serwera, żeby móc pobierać obrazki, dźwięki i różnego rodzaju
inne assety. W razie czego polecam poczytać wprowadzenie do phasera [tutaj](http://www.phaser.io/tutorials/getting-started).


### Budowanie projektu

Javascript nie wspiera jeszcze natywnie modularności. Ponieważ zawsze wygodniej pisze się aplikację, kiedy jej poszczególne
częsci mamy rozrzucone po różnych plikach (przyjemniej się wtedy również pracuje z gitem) możemy skorzystać z narzędzi
które odczytają nasze pliki javascript i wypuszczą coś w rodzaju 'skompilowanego' pliku który dopiero umieszczamy na stronie.  

Budowanie map
-------------

### Tiled

Tiled jest programem do tworzenia map (plansz, level) z tzw. tilesetów. Jest zewnętrznym narzędziem które może odczytać pliki
graficzne zawierające 'kafelki' z których potem budujemy plansze w grach i mozemy je wyeksportowac do wygodnego formatu (.json, .xml).

Phaser całkiem nieźle współpracuje z tiledem, tymbardziej, że poza samą plaszą możemy umieszczać też na mapie obiekty którym przypisujemy
dowolne metadane które potemw  grze możemy odczytywać. Możemy więc umieszczać tam przeciwników, punkty i opisywać jak się zachowują.

Tiled możemy pobrać [stąd](http://www.mapeditor.org/). Utworzyłem przykłaldową planszę level_test.tmx (której gra jeszcze nie używa).