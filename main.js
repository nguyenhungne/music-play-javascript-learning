const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = ' NGUYENHUNG_PLAYER ';

const player = $('.player');
const heading = $('header h2');
const cdThump = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd')
const playlist = $('.playlist');
const playButton = $('.btn-toggle-play');
const progress = $('#progress');
const prevButton = $('.btn-prev');
const nextButton = $('.btn-next');
const randomButton = $('.btn-random');
const repeatButton = $('.btn-repeat');




const app = {
    
    currentIndex: 0,
    isPlaying: false,
    config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    
    songs: [
        {
            name : '蜜月アン・ドゥ・トロワ',
            single : 'Ainoe',
            path: 'assets/music/y2mate.com - Honeymoon Un Deux Trois 蜜月アンドゥトロワ DATEKEN   AINOE ENGLISH COVER .mp3',
            img : 'assets/img/maxresdefault.jpg',
        },

        {  name : 'anhkmbcve',
        single : 'orei',
        path: 'assets/music/y2mate.com - anh khong muon bat cong voi em.mp3',
        img : 'assets/img/anhkhongmuonbatcongvoiem.jpg' },

        {
            name : 'LIMBO',
            single : 'Keshi',
            path: 'assets/music/y2mate.com - keshi  LIMBO Lyric Video.mp3',
            img : 'assets/img/limbo.png'
        },


        {
            name : 'sorry i like u',
            single : 'Autumn',
            path: 'assets/music/y2mate.com - Im Sorry I Like You feat Rhiannon Autumn.mp3',
            img : 'assets/img/sorryilikeu.jpg'
        }


    ],

    setConfig : function(key,value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
    },

    render : function() {
        const htmls = this.songs.map((song,index) => { 
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index ="${index}" >
                    <div class="thumb" style="background-image: url('${song.img}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.single}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
    })

        playlist.innerHTML = htmls.join('\n');
    },

    defineproperties : function () {
        Object.defineProperty(this,'currentsong',{
            get : function(){
                return this.songs[this.currentIndex];
            }
        })
        
    },

    handleEvent(){
        const cdWidth = cd.offsetWidth;
        const _this = this;
        const isRandomSong = false;
        const isRepeatSong = false;



        const cdThumpAnimate = cdThump.animate([{transform: 'rotate(360deg)'}],{
            duration: 12000,
            iterations: Infinity
        })

        cdThumpAnimate.pause();
        

        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? `${newCdWidth}px` : 0;
            cd.style.opacity = newCdWidth/ cdWidth;

        };

        

       const playSong = playButton.onclick = () => {

          if (_this.isPlaying) {
            audio.pause();
        } 
        else {
            audio.play();
         }

        };

        


        audio.onplay = function() {
            _this.isPlaying = true;
            playButton.classList.add('playing');
            cdThumpAnimate.play();
        }
        
        audio.onpause = function() {
            _this.isPlaying = false;
            playButton.classList.remove('playing');
            cdThumpAnimate.pause();

            
        }

        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100);
                progress.value = progressPercent;  
          

        }   
        }

        progress.oninput = function(e) {
            const seekTime = e.target.value * audio.duration/100;
            audio.currentTime = seekTime;
            
        }



        

        randomButton.onclick = function(e) {
            _this.isRandomSong = !_this.isRandomSong;
            _this.setConfig('isRandom', isRandomSong);
            randomButton.classList.toggle('active', _this.isRandomSong)



        };

        nextButton.onclick = function() {

            if (_this.isRandomSong) {
                _this.randomSong();
                
            } else {
            _this.nextSong();}

            _this.loadCurrentsong();
            audio.play();
            _this.render();
            cdThumpAnimate.cancel();
            scrollToActiveSong();
        }

        prevButton.onclick = function() {
            if (_this.isRandomSong) {
                _this.randomSong();
            }
            else
            {_this.prevSong();}

            _this.loadCurrentsong();
            audio.play();
            _this.render();
            cdThumpAnimate.cancel();
            scrollToActiveSong();
        };

        ;


        audio.onended = function() {
            if (_this.isRepeatSong) {
                audio.play();
            } else {
                nextButton.click();
            }
        };

        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');


            if (songNode
            || e.target.closest('.option')){


        if (songNode){
            _this.currentIndex = Number (songNode.dataset.index);
            _this.loadCurrentsong();
            audio.play();
            _this.render();

        }

        // options làm biếng làm quá ~~

        if (e.target.closest('.option')){

            // rảnh thì code cái này và htmls :>> hihi
        }



            }
        };


        repeatButton.onclick = function(e) {
            _this.isRepeatSong =!_this.isRepeatSong;
            _this.setConfig('isRepeat', isRepeatSong);
            repeatButton.classList.toggle('active', _this.isRepeatSong)};

        
    },


    scrollToActiveSong : function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'center',
            })


        }, 100);


    },


    loadConfig : function() {
        this.isRandomSong = this.config.isRandomSong;
        this.isRepeat = this.config.isRepeat;
    },

    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
    },


    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
    },

    randomSong: function() {
        let randomIndex;
        do {randomIndex = Math.floor(Math.random() * this.songs.length)} while (randomIndex === this.currentIndex)


        this.currentIndex = randomIndex;
        this.loadCurrentsong();
    },    



    loadCurrentsong : function(){

        heading.textContent = this.currentsong.name;
        cdThump.style.backgroundImage = `url(${this.currentsong.img})`;
        audio.src = this.currentsong.path;

        

    },

     


    

    start : function(){

        this.loadConfig();

        this.defineproperties();

        this.handleEvent();

        this.loadCurrentsong();


        this.render();

        randomButton.classList.toggle('active', _this.isRandomSong);
        repeatButton.classList.toggle('active', _this.isRepeat);

    }

    


    }



app.start();





