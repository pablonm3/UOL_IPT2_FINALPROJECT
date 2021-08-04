function Player(){

    //variable for the p5 sound object
    var sound = null;
    var defaultSong = 'assets/stomper_reggae_bit.mp3'//new File([], 'assets/stomper_reggae_bit.mp3');
    var songs = [defaultSong]
    var currentSong = 0
    this.playing = false;


    this.load_song = function(index, callback){
        var song = songs[index]
        sound = loadSound(song, callback);
        currentSong = index
        sound.onended(()=>{
            //when some finishes move to next one in the list
            if(this.playing){
                this.next()
            }
        })
    }
    this.load_song(0)

    this.play = function(){
        this.playing = true;
		sound.play();
    }
    
    this.pause = function(){
        this.playing = false;
        sound.pause();
    }

    this.next = function(){
        this.pause()
        new_song = (currentSong+1) % (songs.length)
        this.load_song(new_song, ()=>{
            this.play()
        })
    }

    this.back = function(){
        this.pause()
        new_song = currentSong-1
        if(new_song < 0){
            new_song = songs.length -1
        }
        this.load_song(new_song, ()=>{
            this.play()
        })
    }

    this.isPlaying = function(){
        return sound.isPlaying()
    }

    this.current_song = function(){
        var song = songs[currentSong]
        if(typeof song == "string"){
            return song
        }
        return song.name
    }

    this.upload = function(file){
        songs.push(file)
    }
    this.next = this.next.bind(this)
    this.back = this.back.bind(this)
    this.pause = this.pause.bind(this)
    this.play = this.play.bind(this)
    this.load_song = this.load_song.bind(this)

}
