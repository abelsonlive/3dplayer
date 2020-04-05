// P3dTransport.js
//
// SIMULATES CD PLAYER LOGIC, SOUNDS, AND PLAYBACK USING SOUND PLAYER CLASS (P3dSound).
//
////////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import P3dController from './P3dController.js'
import { TransportMode, ButtonEvent } from './P3dController.js'
import P3dSoundPlayer from './P3dSound.js'
import P3dMusicPlayer from './P3dMusic.js'
import { logger } from './P3dLog.js'
///-----------------------------------------------------------------------------------



export const SoundFilenames = {
    CLICK_DOWN: '3dplayer/sounds/clickDown.wav',
    TRAY_OPEN: '3dplayer/sounds/cdOpen1.wav',
    TRAY_CLOSE: '3dplayer/sounds/cdClose1.wav',
    CD_SPINUP1: '3dplayer/sounds/cdSpinup1.wav',
    CD_SPINUP2: '3dplayer/sounds/cdSpinup2.wav',
    CD_SPINUP3: '3dplayer/sounds/cdSpinup3.wav',
    CD_SPINUP4: '3dplayer/sounds/cdSpinup4.wav',
    CD_SPINDOWN: '3dplayer/sounds/cdSpindown1.wav',
    CD_SEEK1: '3dplayer/sounds/cdSeek1.wav',
    CD_SEEK2: '3dplayer/sounds/cdSeek2.wav',
    CD_SEEK3: '3dplayer/sounds/cdSeek3.wav',
    CD_SEEK4: '3dplayer/sounds/cdSeek4.wav'
} //*/

//    TRAY_CLOSE: '3dplayer/sounds/cdClose1.wav',

const MAX_AUDIO_SETTING_VALUE = 9;
const MIDDLE_AUDIO_SETTING_VALUE = 5;



export const TransportEvent = {
  PLAY: 'TransportPlay',
  PAUSE: 'TransportPause',
  STOP: 'TransportStop', 
  CLOSE_TRAY: 'TransportClose',
  OPEN_TRAY: 'TransportOpen',
  START_TRAY_OPEN: 'TransportStartTrayOpen',
  TRAY_OPENED: 'TransportOpened', 
  SPINUP: 'TransportSpinUp',
  SPINDOWN: 'TransportSpinDown',
  STANDBY: 'Standby', 
  SHUTDOWN: 'TransportPowerDown',
  STARTUP: 'TransportPowerUp', 
  SEEK: 'TransportSeek'
}





//==============================================================================
function random(max) 
{
    const min = 0;
    max = Math.floor(max-1);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dTransport {


  ///////////////////////////////////////////////////////////////////////
  constructor( appController, filenameList ) 
  {
    logger("---->TRANSPORT CLASS CONSTRUCTOR: ", filenameList );
    
    this.appController = appController;
    
    this.soundPlayer = new P3dSoundPlayer();
    this.soundPlayer.loadSound( SoundFilenames.CLICK_DOWN );
    this.soundPlayer.loadSound( SoundFilenames.TRAY_OPEN );
    this.soundPlayer.loadSound( SoundFilenames.TRAY_CLOSE );
    this.soundPlayer.loadSound( SoundFilenames.CD_SPINUP1 );
    this.soundPlayer.loadSound( SoundFilenames.CD_SPINUP2 );
    this.soundPlayer.loadSound( SoundFilenames.CD_SPINUP3 );
    this.soundPlayer.loadSound( SoundFilenames.CD_SPINUP4 );
    this.soundPlayer.loadSound( SoundFilenames.CD_SPINDOWN );
    this.soundPlayer.loadSound( SoundFilenames.CD_SEEK1 );
    this.soundPlayer.loadSound( SoundFilenames.CD_SEEK2 );
    this.soundPlayer.loadSound( SoundFilenames.CD_SEEK3 );
    this.soundPlayer.loadSound( SoundFilenames.CD_SEEK4 );

    this.eventQueue = [];
    this.nextEventTimeSec = performance.now();

    // PRE-DECODE FIRST MUSIC TRACK
    this.musicPlayer = new P3dMusicPlayer( this );
    this.musicPlayer.decodeMusic( filenameList[1] );  // <-------------
    //this.musicPlayer.downloadMusic( filenameList[1] );  // <-- DEBUG
    
    // PRE-DOWNLOAD THE OTHER MUSIC TRACKS
    if( filenameList.length > 1 )
    {
      for( let i=2; i<filenameList.length; i++ )
       this.musicPlayer.downloadMusic( filenameList[i] );
    }
    
    this.filenameList = filenameList;
    this.trackNumber = 1; // FIRST TRACK IS ONE (NOT ZERO)
    this.trackPlaying = false;
    
    this.treble = MIDDLE_AUDIO_SETTING_VALUE;
    this.bass = MIDDLE_AUDIO_SETTING_VALUE;
    this.volume = MAX_AUDIO_SETTING_VALUE;
    
    this.status = TransportMode.TRAY_OPEN;
  }
  
  
  /*
export const TransportMode = {
  TRAY_OPEN:'TrayOpen',
  TRAY_OPENING:'TrayOpening',
  TRAY_CLOSING:'TrayClosing',
  PLAYING:'Playing',
  STARTING_PLAY:'StartingPlay',
  PAUSED:'Paused',
  STOPPED:'Stopped',
  STANDBY:'Standby'
}
  //*/


  ///////////////////////////////////////////////////////////////////////
  stopCdSounds()
  {
    this.soundPlayer.stopSound( SoundFilenames.SEEK ); 
    this.soundPlayer.stopSound( SoundFilenames.SPINUP ); 
  }


  
  ///////////////////////////////////////////////////////////////////////
  processButtonEvent( buttonEvent )
  {
    logger( "------>BUTTON PRESS: ", buttonEvent );
  
    // BUTTON CLICK SOUND EFFECT
    if( buttonEvent != ButtonEvent.BUTTON_UP  &&  buttonEvent != ButtonEvent.BUTTON_UP )
      this.soundPlayer.playSound( SoundFilenames.CLICK_DOWN ); 

    if( this.status == TransportMode.STANDBY )
    {
      if( buttonEvent == ButtonEvent.BUTTON_DOWN_STANDBY )
      {
        this.eventQueue.push( TransportEvent.STARTUP ); //*/
        this.eventQueue.push( TransportEvent.STOP ); //*/
        this.scheduleNextEvent();
      }
      
    }
    else
    {
      // BUTON FUNCTIONS...
      switch( buttonEvent )
      {
        case ButtonEvent.BUTTON_DOWN_PLAY:
              if( this.status == TransportMode.TRAY_OPEN || 
                  this.status == TransportMode.PAUSED || 
                  this.status == TransportMode.STOPPED )
              {
                if( this.status == TransportMode.TRAY_OPEN )
                  this.eventQueue.push( TransportEvent.CLOSE_TRAY ); //*/
                if( this.status != TransportMode.PAUSED )
                  this.eventQueue.push( TransportEvent.SPINUP ); //*/
                this.eventQueue.push( TransportEvent.PLAY ); //*/
                this.scheduleNextEvent();
              } //*/
              break;
        case ButtonEvent.BUTTON_DOWN_PAUSE:
              if( this.status == TransportMode.PLAYING )
              {
                this.eventQueue.push( TransportEvent.PAUSE ); //*/
                this.scheduleNextEvent();
              }
              break;
        case ButtonEvent.BUTTON_DOWN_PREV:
              if( this.status == TransportMode.PLAYING || 
                  this.status == TransportMode.PAUSED || 
                  this.status == TransportMode.SEEK || 
                  this.status == TransportMode.STOPPED )
              {
                if( this.trackNumber > 1 )
                {
                  this.soundPlayer.playSound( SoundFilenames.CD_SEEK );
                  this.trackNumber--;
                  this.trackPlaying = false;
                  this.musicPlayer.rewindMusic();    
                  
                  //this.eventQueue.push( TransportEvent.PAUSE ); //*/
                  this.eventQueue = [];
                  this.eventQueue.push( TransportEvent.SEEK ); //*/
                  this.eventQueue.push( TransportEvent.PLAY ); //*/
                  this.scheduleNextEvent();
                  this.musicPlayer.decodeMusic( this.filenameList[ this.trackNumber ] );    
                  //this.status = TransportMode.PLAYING;
                }
                //this.previousTrack();
              }
              break;
        case ButtonEvent.BUTTON_DOWN_NEXT:
              if( this.status == TransportMode.PLAYING || 
                  this.status == TransportMode.PAUSED || 
                  this.status == TransportMode.SEEK || 
                  this.status == TransportMode.STOPPED )
              {
                if( this.trackNumber < this.filenameList.length-1 )
                {
                  this.soundPlayer.playSound( SoundFilenames.CD_SEEK );
                  this.trackNumber++;
                  this.trackPlaying = false;
                  this.musicPlayer.rewindMusic();    
                  
                  //this.eventQueue.push( TransportEvent.PAUSE ); //*/
                  this.eventQueue = [];
                  this.eventQueue.push( TransportEvent.SEEK ); //*/
                  this.eventQueue.push( TransportEvent.PLAY ); //*/
                  this.scheduleNextEvent();
                  this.musicPlayer.decodeMusic( this.filenameList[ this.trackNumber ] );    
                  //this.status = TransportMode.PLAYING;
                }
                //this.nextTrack();
              }
              break;
        case ButtonEvent.BUTTON_DOWN_FAST_FORWARD:
              break;
        case ButtonEvent.BUTTON_DOWN_REWIND:
              break;
        case ButtonEvent.BUTTON_DOWN_STOP:
              if( this.status == TransportMode.TRAY_OPEN )
                this.eventQueue.push( TransportEvent.CLOSE_TRAY ); //*/
              this.eventQueue.push( TransportEvent.STOP ); //*/
              this.scheduleNextEvent();
              break;
        case ButtonEvent.BUTTON_DOWN_STANDBY:
              if( this.status == TransportMode.TRAY_OPEN )
                this.eventQueue.push( TransportEvent.CLOSE_TRAY ); //*/
              this.eventQueue.push( TransportEvent.SHUTDOWN ); //*/
              this.eventQueue.push( TransportEvent.STANDBY ); //*/
              this.scheduleNextEvent();
              break;
        case ButtonEvent.BUTTON_DOWN_OPEN:
              if( this.status == TransportMode.TRAY_OPEN )
              { // CLOSE TRAY
                this.eventQueue.push( TransportEvent.CLOSE_TRAY ); //*/
                this.eventQueue.push( TransportEvent.STOP ); //*/
              }
              else
              {
                if( this.status == TransportMode.PLAYING  ||  
                    this.status == TransportMode.PAUSED  ||  
                    this.status == TransportMode.STOPPED  ||  
                    this.status == TransportMode.STARTING_PLAY )  
                {
                  // OPEN TRAY
                  this.eventQueue.push( TransportEvent.START_OPEN_TRAY ); //*/
                  this.eventQueue.push( TransportEvent.OPEN_TRAY ); //*/
                  this.eventQueue.push( TransportEvent.TRAY_OPENED );
                }
              }
              this.scheduleNextEvent();
              break;
        case ButtonEvent.BUTTON_UP:
              break;
        case ButtonEvent.NONE:
              break;

              //   ~    -     ~    -     ~    -     ~    -     ~    -     ~    -     ~    -    

        case ButtonEvent.BUTTON_DOWN_BASS_DOWN:
              this.bass -= 1;
              if( this.bass < 0 )
                this.bass = 0;
              this.musicPlayer.setBass( this.bass - MIDDLE_AUDIO_SETTING_VALUE );
              break;
        case ButtonEvent.BUTTON_DOWN_BASS_UP:
              this.bass += 1;
              if( this.bass > MAX_AUDIO_SETTING_VALUE )
                this.bass = MAX_AUDIO_SETTING_VALUE;
              this.musicPlayer.setBass( this.bass - MIDDLE_AUDIO_SETTING_VALUE );
              break;
        case ButtonEvent.BUTTON_DOWN_TREBLE_DOWN:
              this.treble -= 1;
              if( this.treble < 0 )
                this.treble = 0;
              this.musicPlayer.setTreble( this.treble - MIDDLE_AUDIO_SETTING_VALUE );
              break;
        case ButtonEvent.BUTTON_DOWN_TREBLE_UP:
              this.treble += 1;
              if( this.treble > MAX_AUDIO_SETTING_VALUE )
                this.treble = MAX_AUDIO_SETTING_VALUE;
              this.musicPlayer.setTreble( this.treble - MIDDLE_AUDIO_SETTING_VALUE );
              break;
        case ButtonEvent.BUTTON_DOWN_VOL_DOWN:
              this.volume -= 1;
              if( this.volume < 0 )
                this.volume = 0;
              this.musicPlayer.setVolume( (this.volume + 1) / 10.0 );
              break;
        case ButtonEvent.BUTTON_DOWN_VOL_UP:
              this.volume += 1;
              if( this.volume > MAX_AUDIO_SETTING_VALUE )
                this.volume = MAX_AUDIO_SETTING_VALUE;
              this.musicPlayer.setVolume( (this.volume + 1) / 10.0 );
              break;
      } // SWITCH
    }
   
  }
  
  
  //////////////////////////////////////////////////////////////////////////////////
  scheduleNextEvent( delaySec = 0.0 )
  {
    this.nextEventTimeSec = performance.now() + delaySec;
    if( delaySec > 0.0 )
      setTimeout( this.processEventQueue.bind(this), (delaySec * 1000) + 2 ); // <-- MILLISECONDS
    else
      this.processEventQueue();
  }
  
  
  /////////////////////////////////////////////////////////////////////////
  processEventQueue()
  {
    if( this.eventQueue.length > 0   &&  performance.now() >= this.nextEventTimeSec )
    {
      let event = this.eventQueue.shift();
      switch( event )
      {
        case TransportEvent.CLOSE_TRAY:
          this.appController.closeTray();
          this.status = TransportMode.TRAY_CLOSING;
          this.soundPlayer.playSound( SoundFilenames.TRAY_CLOSE );  // <------------
          this.scheduleNextEvent( 3 );
          break; //*/
          
        case TransportEvent.START_OPEN_TRAY:
          logger( "START OPEN TRAY!!!!!!!!!!!!!!!!!!!!!!" );
          this.stop();
          //this.status = TransportMode.TRAY_OPENING;
          this.soundPlayer.playSound( SoundFilenames.TRAY_OPEN ); 
          this.scheduleNextEvent( 0.65 );
          break; //*/

        case TransportEvent.OPEN_TRAY:
          this.appController.openTray();
          this.status = TransportMode.TRAY_OPENING;
          this.scheduleNextEvent( 1 );
          break; //*/

        case TransportEvent.TRAY_OPENED:
          this.status = TransportMode.TRAY_OPEN;
          break;

        case TransportEvent.SPINUP:
          switch( random(4) )
          {
            case 0: this.soundPlayer.playSound( SoundFilenames.CD_SPINUP1 ); break;
            case 1: this.soundPlayer.playSound( SoundFilenames.CD_SPINUP2 ); break;
            case 2: this.soundPlayer.playSound( SoundFilenames.CD_SPINUP3 ); break;
            case 3: this.soundPlayer.playSound( SoundFilenames.CD_SPINUP4 ); break;
          } //*/
          //this.soundPlayer.playSound( SoundFilenames.CD_SPINUP1 );
          
          this.status = TransportMode.STARTING_PLAY;
          this.scheduleNextEvent( 2 );
          break;
          
        case TransportEvent.SEEK:
          switch( random(4) )
          {
            case 0: this.soundPlayer.playSound( SoundFilenames.CD_SEEK1 ); break;
            case 1: this.soundPlayer.playSound( SoundFilenames.CD_SEEK2 ); break;
            case 2: this.soundPlayer.playSound( SoundFilenames.CD_SEEK3 ); break;
            case 3: this.soundPlayer.playSound( SoundFilenames.CD_SEEK4 ); break;
          } //*/
          //this.soundPlayer.playSound( SoundFilenames.CD_SEEK1 );
          this.scheduleNextEvent( 0.65 );
          this.status = TransportMode.SEEK;
          break;
          
        /*case TransportEvent.PLAY_NEXT:
          this.soundPlayer.playSound( SoundFilenames.CD_SEEK );
          this.status = TransportMode.SEEK;
          this.scheduleNextEvent( 1 );
          break;
          
        case TransportEvent.PLAY_PREVIOUS:
          this.soundPlayer.playSound( SoundFilenames.CD_SEEK );
          this.status = TransportMode.SEEK;
          this.scheduleNextEvent( 1 );
          break; //*/
          
        case TransportEvent.PLAY:
          if( this.trackPlaying == false )
          {
            this.trackPlaying = true;
            this.musicPlayer.playMusic( this.filenameList[ this.trackNumber ] );    
            this.status = TransportMode.PLAYING;
          } //*/
          break;

        case TransportEvent.STOP:
          this.stop();
          this.scheduleNextEvent();
          break;

        case TransportEvent.SHUTDOWN:
          this.stop();
          this.status = TransportMode.SHUTDOWN;
          this.scheduleNextEvent(1);
          break;

        case TransportEvent.STARTUP:
          this.soundPlayer.playSound( SoundFilenames.CD_SPINUP1 );
          this.status = TransportMode.STARTUP;
          this.scheduleNextEvent(4);
          break;

        case TransportEvent.STANDBY:
          this.stop();
          this.status = TransportMode.STANDBY;
          break;

        case TransportEvent.PAUSE:
          if( this.trackPlaying == true )
          {
            this.trackPlaying = false;
            this.musicPlayer.pauseMusic();    
            //this.musicPlayer.stopMusic( MUSIC_FILENAME );    
            this.status = TransportMode.PAUSED;
          } //*/
          break;
      }
      
    }
    
  }
  

  // ~     -      ~     -      ~     -      ~     -      ~     -      ~     -      
  
  
  ///////////////////////////////////////////////////////////////////////////
  // PRIVATE FUNCTION
  nextTrack()
  {
    if( this.trackNumber < this.filenameList.length-1 )
    {
      this.trackNumber++;
      this.trackPlaying = true;
      this.musicPlayer.rewindMusic();    
      this.musicPlayer.playMusic( this.filenameList[ this.trackNumber ] );    
      this.status = TransportMode.PLAYING;
    }
  }
  
  
  ///////////////////////////////////////////////////////////////////////////
  // PRIVATE FUNCTION
  previousTrack()
  {
    if( this.trackNumber > 1 )
    {
      this.trackNumber--;
      this.trackPlaying = true;
      this.musicPlayer.rewindMusic();    
      this.musicPlayer.playMusic( this.filenameList[ this.trackNumber ] );    
      this.status = TransportMode.PLAYING;
    }
  }
  
  
  ////////////////////////////////////////////////////////////////////////////
  // PRIVATE FUNCTION
  stop()
  {
    this.trackPlaying = false;
    this.musicPlayer.rewindMusic();    
    this.trackNumber = 1;
    if( this.status != TransportMode.STOPPED  &&  this.status != TransportMode.SHUTDOWN)
      this.soundPlayer.playSound( SoundFilenames.CD_SPINDOWN );
    this.status = TransportMode.STOPPED;
  }
  
  
  // ~     -      ~     -      ~     -      ~     -      ~     -      ~     -      
  
  
  //////////////////////////////////////////////////////////////////////////
  // CALLED BY MUSIC PLAYER
  musicEndedCallback()
  {
    logger( "----->TRANSPORT: SONG ENDED CALLBACK" );
    if( this.trackNumber < this.filenameList.length-1 )
      this.nextTrack();
    else
      this.stop();

  }
  
  
  // ~     -      ~     -      ~     -      ~     -      ~     -      ~     -      
  
  
  
  /////////////////////////////////////////////////////////////////////////
  getPlaybackTime()
  {
    return this.musicPlayer.getMusicTime();
  }
  

  /////////////////////////////////////////////////////////////////////////
  getTrackNumber()
  {
    return this.trackNumber;
  }
  
  
  //////////////////////////////////////////////////////////////////////////
  getNumberOfTracks()
  {
    return this.filenameList.length - 1; // <-- MINUS ONE BECAUSE THE FIRST TRACK IS AT ARRAY POSITION ONE INSTEAD OF ZERO
  }
  

  //////////////////////////////////////////////////////////////////////////
  getStatus()
  {
    return this.status;
  }


  ////////////////////////////////////////////////////////////////////////////
  getVolume()
  {
    return this.volume;
  }
  
  ////////////////////////////////////////////////////////////////////////////
  getTreble()
  {
    return this.treble;
  }
  
  ////////////////////////////////////////////////////////////////////////////
  getBass()
  {
    return this.bass;
  }

  
  
  
}
