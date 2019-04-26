import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
    super(props)

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      isPlaying: false
    };
    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }
  play() {
     this.audioElement.play();
     this.setState({ isPlaying: true });
   }

   pause() {
       this.audioElement.pause();
       this.setState({ isPlaying: false });
     }

     componentDidMount() {
       this.eventListeners = {
         timeupdate: e => {
           this.setState({ currentTime: this.audioElement.currentTime });
         },
         durationchange: e => {
           this.setState({ duration: this.audioElement.duration });
         }
       };
       this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
       this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
     }

     componentWillUnmount() {
     this.audioElement.src = null;
     this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
     this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
   }

   handleTimeChange(e) {
      const newTime = this.audioElement.duration * e.target.value;
      this.audioElement.currentTime = newTime;
      this.setState({ currentTime: newTime });
    }

    formatTime(timeInSeconds) {
    const minutes = (Math.floor(timeInSeconds / 60));
    const seconds = (Math.floor(timeInSeconds % 60));

    if(seconds < 10){
      return (minutes + ":0" + seconds);
    }
    if (timeInSeconds){
      if(minutes > 60){
        return ( minutes + ":" + seconds);
      } else{
          return (minutes + ":" + seconds)
      }
    } else{
        return "-:--";
    }
 }

     handleVolumeChange(e){
         const newVolume = e.target.value;
         this.audioElement.volume = newVolume;
        this.setState({ currentVolume: newVolume});

       }


     setSong(song) {
       this.audioElement.src = song.audioSrc;
       this.setState({ currentSong: song });
     }

     handleSongClick(song) {
     const isSameSong = this.state.currentSong === song;
     if (this.state.isPlaying && isSameSong) {
       this.pause();
     } else {
       if (!isSameSong) { this.setSong(song); }
       this.play();
     }
   }

   handlePrevClick() {
     const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const newIndex = Math.max(0, currentIndex - 1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play();
   }

   handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = currentIndex + 1

    if (newIndex < this.state.album.songs.length) {
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play(newSong);
    } else {
      this.play(this.state.currentSong);
    }
  }

   hoverOn(index) {
   this.setState({ hoveredSong: index });
 }

 hoverOff() {
   this.setState({ hoveredSong: false });
 }

 displayIcon(song, index) {
      if(this.state.isPlaying !== true && this.state.hoveredSong === index ) {
          return <span className="ion-play"></span>
      } else if (this.state.isPlaying === true && this.state.currentSong === song) {
          return <span className="ion-pause"></span>
      } else if (this.state.isPlaying !== true && this.state.currentSong === song && this.state.hoveredSong === false) {
          return <span className="ion-play"></span>
      }
      return index + 1
    }

  render() {
    return (
      <section className="album">
        <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title} />
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id="song-list">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>

          <tbody>
          {
            this.state.album.songs.map(( song, index ) =>
                <tr className="song" key={index} onClick={() => this.handleSongClick(song)}
                onMouseEnter = {() => this.hoverOn(index)}
                onMouseLeave = {() => this.hoverOff()}>

              <td className="song-list-buttons" >
              <button>
              <span className="song-number">{index+1}</span>
                <span className="ion-play"></span>
                <span className="ion-pause"></span>
                </button>
              </td>

               <td>  {this.displayIcon(song, index)}</td>
                <td className="song-title">{song.title}</td>
                <td className="song-duration">{this.formatTime(song.duration)}</td>
              </tr>
            )
          }
          </tbody>
        </table>
            <PlayerBar
                isPlaying={this.state.isPlaying}
                currentSong={this.state.currentSong}
                currentTime={this.audioElement.currentTime}
                duration={this.audioElement.duration}
                handleSongClick={() => this.handleSongClick(this.state.currentSong)}
                handlePrevClick={() => this.handlePrevClick()}
                handleNextClick={() => this.handleNextClick()}
                handleTimeChange={(e) => this.handleTimeChange(e)}
                handleVolumeChange = {(e) => this.handleVolumeChange(e)}
                formatTime ={(e) => this.formatTime(e)}/>
      </section>
    )
  }
}

export default Album;
