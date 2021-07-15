function Player(){

    //variable for the p5 sound object
    var sound = null;
    var defaultSong = 'assets/stomper_reggae_bit.mp3'//new File([], 'assets/stomper_reggae_bit.mp3');
    var songs = [defaultSong]
    var currentSong = 0


    function load_song(index, callback){
        var song = songs[index]
        sound = loadSound(song, callback);
        currentSong = index
    }
    load_song(0)

    this.play = function(){
		sound.loop();
    }
    
    this.pause = function(){
        sound.pause();
    }

    this.next = function(){
        this.pause()
        new_song = (currentSong+1) % (songs.length)
        load_song(new_song, ()=>{
            this.play()
        })
    }

    this.back = function(){
        this.pause()
        new_song = currentSong-1
        if(new_song < 0){
            new_song = songs.length -1
        }
        load_song(new_song, ()=>{
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

}
