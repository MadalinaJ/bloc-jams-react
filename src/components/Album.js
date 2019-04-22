import React, { Component } from 'react';
import albumData from './../data/albums';

class Album extends Component {
  constructor(props) {
    super(props)

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
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
      } else if (this.state.isPlaying !== true && this.state.currentSong === song && this.state.hoveredSong === index) {
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
                <span className="ion-play"></span>
                <span className="ion-pause"></span>
                </button>
              </td>

               <td>  {this.displayIcon(song, index)}</td>
                <td className="song-title">{song.title}</td>
                <td className="song-duration">{song.duration}</td>
              </tr>
            )
          }
          </tbody>
        </table>
      </section>
    )
  }
}

export default Album;
