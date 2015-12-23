    var mapa1 = {       // przykladowe parametry mapy 1 // mozemy tworzyc wiecej map

        rozmiar: 24,    // wielkosc "klockow" mapy
        gracz: {       // pozycja poczatkowa gracza
            x: 12,
            y: 13,
            kolor: '#00CC00'
        },

    };
	

    var Silnik = function () {

        this.klawisz = {
            left: false,
            right: false,
            up: false
        };

        this.gracz = {

            lok: {
                x: 0,
                y: 0
            },          
        };

        window.onkeydown = this.klawdol.bind(this);
        window.onkeyup = this.klawpusc.bind(this);
    };

    Silnik.prototype.klawdol = function (kl) {          //klawisz wcisniety

        var _this = this;

        switch (kl.keyCode) {
            case 37:
                _this.klawisz.left = true;
                break;
            case 38:
                _this.klawisz.up = true;
                break;
            case 39:
                _this.klawisz.right = true;
                break;
        }
    };

    Silnik.prototype.klawpusc = function (kl) {     //klawisz puszczony

        var _this = this;

        switch (kl.keyCode) {
            case 37:
                _this.klawisz.left = false;
                break;
            case 38:
                _this.klawisz.up = false;
                break;
            case 39:
                _this.klawisz.right = false;
                break;
        }
    };

    Silnik.prototype.laduj = function (mapa) {
 
        this.biezaca = mapa;

        this.rozmiar = mapa.rozmiar || 16;

        this.biezaca.szer = 0;
        this.biezaca.wys = 0;
    
        this.gracz.lok.x = mapa.gracz.x * this.rozmiar || 0;
        this.gracz.lok.y = mapa.gracz.y * this.rozmiar || 0;
        this.gracz.kolor = mapa.gracz.kolor || '#000';

        return true;
    };

    Silnik.prototype.odswiez = function () {
 
        if (this.klawisz.left) {

                this.gracz.lok.x -- ;
        }

        if (this.klawisz.right) {

                this.gracz.lok.x ++ ;
        }
        if (this.klawisz.up) {

            this.gracz.lok.y --;       // tu bedzie skok
        }


    };

    Silnik.prototype.rysuj = function (kont) {      // to tylko przykladowy gracz, do zmiany na sprity

        kont.fillStyle = this.gracz.kolor;
        kont.beginPath();
        kont.arc(
            this.gracz.lok.x + this.rozmiar / 2,
            this.gracz.lok.y + this.rozmiar / 2,
            this.rozmiar / 2 - 1,
            0,
            6.28318
        );

        kont.fill();
    };

    window.requestAnimFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
          return window.setTimeout(callback, 1000 / 60);
      };

    var okno = document.getElementById('okno'),
        kontekst = okno.getContext('2d');

    okno.width = 600;
    okno.height = 400;

    var gra = new Silnik();
    gra.laduj(mapa1);

    var PetlaGlowna = function () {

        kontekst.fillStyle = '#111';
        kontekst.fillRect(0, 0, okno.width, okno.height);

        gra.odswiez();
        gra.rysuj(kontekst);

        window.requestAnimFrame(PetlaGlowna);
    };

    PetlaGlowna();