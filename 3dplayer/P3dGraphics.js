// P3dGraphics.js
//
// LOADS AND MANIPULATES 3D MODELS AND RENDERING ASSETS
//
/////////////////////////////////////////////////////////////////////////////////////


//-----------------------------------------------------------------------------------
import { GLTFLoader } from "./three/examples/jsm/loaders/GLTFLoader.js";
// ~   -   ~   -   ~   -   ~   -   ~   -   ~   -   
//import { P3dController } from "./P3dController.js";
import { P3dSwarm } from "./P3dSwarm.js";
import { P3dNumericDisplay } from "./P3dNumericDisplay.js";
import { P3dPanelLeds } from "./P3dPanelLeds.js";
import { P3dShaders } from "./P3dShaders.js";
import { logger } from "./P3dLog.js";
import { TransportMode } from "./P3dController.js";
import { converge, random } from "./P3dUtility.js";
//-----------------------------------------------------------------------------------



//=====================================================================================
// UTILITY FUNCTION  -  THIS SHOULD PROBABLY BE MOVED TO CONTROLLER
window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
  
//=====================================================================================
// UTILITY FUNCTION  -  THIS SHOULD PROBABLY BE MOVED TO CONTROLLER
window.mobileAndTabletcheck = function() 
{
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};





//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export class P3dGraphics
{

  /////////////////////////////////////////////////////////////////////////////
  // THIS CAN BE REMOVED WHEN TEXTURE MAPPING IS FULLY WORKING
  /*textureTest()
  {
    const textureGeometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load( '3dplayer/model/test_1024x1024_1a.png' );
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 16;
    // create a Standard material using the texture we just loaded as a color map
    const material = new THREE.MeshStandardMaterial( {
      map: texture,
    } );
    let mesh = new THREE.Mesh( geometry, material );
    mesh.rotation.y = 2.2;
    this.scene.add( mesh );
  } //*/


  ///////////////////////////////////////////////////////////////////////
  constructor( appController, windowWidth, windowHeight, renderer ) 
  {
    logger("---->GRAPHICS CLASS CONSTRUCTOR");

    this.appController = appController;
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.renderer = renderer;

    this.isMobileDevice = window.mobilecheck();
    this.isTabletDevice = window.mobileAndTabletcheck();
    
    this.trayOpen = true;
    
    this.scene = new THREE.Scene();
    // ---> PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
    this.camera = new THREE.PerspectiveCamera( 38, windowWidth/windowHeight, 0.1, 1000 );
    this.cameraFrustum = null;
    
    this.roomCube = null;
    this.roomMaterial = null;
    this.cdMaterial = null;
    this.spotlight = null;
    this.cdObject = null;
    
    this.loadedModel = null;
    this.shaders = new P3dShaders();
    this.roomUniforms = {
        colorB: {type: "vec3", value: new THREE.Color(0x0A0B0A)},
        colorA: {type: "vec3", value: new THREE.Color(0x060607)}
    };
    
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load( '3dplayer/model/test_1024x1024_1b.png' );
    this.cdUniforms = {
        lightPosition: { type: "vec3", value: new THREE.Vector3( 0.0, 0.0, 0.0 ) },
        cdTexture: { type: "t", value: texture }
    };

    /*const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load( '3dplayer/model/test_1024x1024_1a.png' ); //*/

    this.targetRotationX = 0;
    this.targetRotationY = 0;

    this.loadedAnimations = {};
    this.currentClip = null;
    this.currentAction = null;
    this.currentActionCd = null;
    
    this.buttonDown = false;
    this.raycaster = new THREE.Raycaster();

    this.backgroundSpinRate = 0;
    this.frameCounter = 0;
    this.screenEdgePosition = 0;

    this.buildStructures();    
    this.swarm = new P3dSwarm( this.scene );
    this.swarm.setScreenEdgePosition( this.screenEdgePosition );
    
    this.animationMixer = null;
    this.animationMixerCd = null;
    this.clock = new THREE.Clock();

    this.numericDisplay = new P3dNumericDisplay( appController, this.scene );
    this.panelLeds = new P3dPanelLeds( appController, this.scene );
    
    //this.textureTest();
  }


  ///////////////////////////////////////////////////////////////////////
  // NOTE: MUST BE CALLED EXTERNALLY TO START THE ANIMATION
  run() 
  {
    requestAnimationFrame( this.run.bind(this) );

    this.frameCounter++;

    // CD DEBUG!!!!!!!!!!!!!!!!!!!!!!
    if( this.cdObject != null )
    {
      let worldPosition = new THREE.Vector3();
      this.cdObject.getWorldPosition( worldPosition );
      //this.cdObject.rotation.y = Math.sin( this.frameCounter * 0.05 );
      //this.cdObject.rotation.x = Math.sin( this.frameCounter * 0.01 );
    } //*/

    // UPDATE FAKE LIGHT POSITION FOR CD SHADER...
    if( this.loadedModel != null )
    {
      this.cdUniforms.lightPosition.value.x = this.loadedModel.rotation.x*8.0 - 1.5;
      this.cdUniforms.lightPosition.value.y = this.loadedModel.rotation.y*5.0 + 0.8;
      this.cdUniforms.lightPosition.value.z = this.loadedModel.rotation.x*4.0-1.9;
    }

    // UPDATE ANIMATIONS..
    if( this.animationMixer != null )
    {
      var dt = this.clock.getDelta();
      this.animationMixer.update(dt);
      this.animationMixerCd.update(dt);
    }

    // UPDATE LED DISPLAY
    this.numericDisplay.update();
    this.panelLeds.update();

    // UPDATE "SWARM" PARTICLE SYSTEM
    this.swarm.render();

    // ROTATE ROOM CUBE...
    this.backgroundSpinRate += 0.00001; // <------------- ORIGINAL
    if( this.backgroundSpinRate > 0.04 ) 
      this.backgroundSpinRate = 0.04;
    if( this.appController.getStatus() != TransportMode.PLAYING )
    { 
      this.swarm.disable();  // <-----------------------
      this.backgroundSpinRate -= 0.0001;
      if( this.backgroundSpinRate < 0.0002 )
        this.backgroundSpinRate = 0.0002;
    }
    else
    {
      this.swarm.enable();
    }
    if( this.roomCube != null )
    {
      this.roomCube.rotation.x += this.backgroundSpinRate;
      this.roomCube.rotation.y += this.backgroundSpinRate;
    } //*/

    // MODULATE CD PLAYER ORIENTATION...
    const rotationSpeed = 0.03; // NORMAL <-------------------
    //const rotationSpeed = 0.01; // SLOW
    //const rotationSpeed = 0.07; // FAST
    //const rotationSpeed = 0.00; // DISABLED
    if( this.loadedModel != null )
    {
      if( this.trayOpen == true )
        this.targetRotationX = Math.sin( this.frameCounter * rotationSpeed) * 0.08 - 0.01  + 0.25;
      else 
        this.targetRotationX = Math.sin( this.frameCounter * rotationSpeed) * 0.08 + 0.01;
      
      this.targetRotationY = Math.cos( this.frameCounter * rotationSpeed ) * 0.08;

      this.loadedModel.rotation.x = converge( this.loadedModel.rotation.x, this.targetRotationX, 0.005 );
      this.loadedModel.rotation.y = converge( this.loadedModel.rotation.y, this.targetRotationY, 0.005 );
    }  
    
    this.renderer.render( this.scene, this.camera );

  }
  
  
  
  
  //////////////////////////////////////////////////////////////////////////////
  // UNFINISHED, STILL TO BE DETERMINED HOW THIS INTERFACE IS GOING TO WORK
  // NEEDS REFACTORING
  playAnimation( animationName, rate = 1.0 )
  {
    logger( "------> GRAPHICS: PLAY ANIMATION: ", animationName );

    this.animationMixer.stopAllAction();
    this.animationMixerCd.stopAllAction();
    
    this.currentClip = this.loadedAnimations[ animationName ];
    if( this.currentClip )
    {
      this.currentAction = this.animationMixer.clipAction( this.currentClip );
      this.currentAction.clampWhenFinished = true;
      this.currentAction.setLoop( THREE.LoopOnce );
      this.currentAction.timeScale = rate; // OPEN INSTANTLY SO IT LOOKS LIKE IT STARTS OPENED
      this.currentAction.play(); //*/

      this.currentActionCd = this.animationMixerCd.clipAction( this.currentClip );
      this.currentActionCd.clampWhenFinished = true;
      this.currentActionCd.setLoop( THREE.LoopOnce );
      this.currentActionCd.timeScale = rate; // OPEN INSTANTLY SO IT LOOKS LIKE IT STARTS OPENED
      this.currentActionCd.play(); //*/
    }
    
  }

  
  ////////////////////////////////////////////////////////////////////////
  // NEEDS REFACTORING
  openTray( rate = 1.0 )
  {
    this.playAnimation( "TrayOpen", rate );
    this.trayOpen = true;
    if( rate == 1.0 )
      this.cdObject.rotation.y = random( 1000 )/300.0;

  }


  ////////////////////////////////////////////////////////////////////////
  // NEEDS REFACTORING
  closeTray()
  {
    this.trayOpen = false;
    this.animationMixer.stopAllAction();
    this.animationMixerCd.stopAllAction();
    this.currentAction.timeScale = -1;
    this.currentAction.time = this.currentAction.getClip().duration;
    this.currentAction.play();//*/
    this.currentActionCd.timeScale = -1;
    this.currentActionCd.time = this.currentActionCd.getClip().duration;
    this.currentActionCd.play();//*/
  }



  ///////////////////////////////////////////////////////////////////////////
  // THIS WILL NEED TO BE FIXED TO WORK WITH NEW SHADER SYSTEM
  /*setBackgroundColor( color )
  {
    this.uniforms["colorA"] = { type: "vec3", value: new THREE.Color( color ) };
    this.uniforms["colorB"] = { type: "vec3", value: new THREE.Color( color ) };
  } //*/
  


  //////////////////////////////////////////////////////////////////////////////
  debugIndicator( xOffset )
  {
    this.loadedModel.position.x += xOffset;
  }


  ////////////////////////////////////////////////////////////////////////
  modelLoadComplete()
  {
    this.numericDisplay.load();
    this.panelLeds.load();
  }


  ///////////////////////////////////////////////////////////////////////
  // -----> SOME OF THESE OBJECTS SHOULD BE MOVED TO THEIR OWN CLASS
  buildStructures()
  {
    // SET CAMERA POSITION
    const cameraZOffset = 1.9;
    
    this.camera.position.z = 5.5+cameraZOffset;
    if( this.isMobileDevice == true )
    { // ZOOM IN A LOT FOR PHONES
      this.camera.position.z = 4.0+cameraZOffset;
      this.camera.position.y = -0.1;
    }
    else
    { // ZOOM IN A LITTLE FOR TABLETS
      if( this.isTabletDevice == true )
      { 
        this.camera.position.z = 4.5+cameraZOffset; 
        this.camera.position.y = -0.1;
      }
      else
      { // ZOOM IN A LITTLE IF THE SCREEN IS REALLY WIDE
        if( this.windowWidth/this.windowHeight > 3 )
        { 
          this.camera.position.z = 3.9+cameraZOffset;
          this.camera.position.y = 0.0;
        } //*/
      }
    }//*/
    
    // GET CAMERA FRUSTRUM
    this.camera.updateMatrix();
    this.camera.updateMatrixWorld();
    this.cameraFrustum = new THREE.Frustum();
    this.cameraFrustum.setFromProjectionMatrix(
    new THREE.Matrix4().multiplyMatrices( this.camera.projectionMatrix, this.camera.matrixWorldInverse) );  
    this.edgeOfWorld = 0;

    // FIND X EDGE POSITION WHEN Z=0 (USED FOR SWARM/PARTICLE EFFECTS)
    let edgePositionTest = 0;
    while( this.cameraFrustum.containsPoint( new THREE.Vector3( edgePositionTest, 0, 0 ) ) == true ) 
    {
      edgePositionTest++;
    }
    //logger( "------------------ EDGE POSITION:", edgePositionTest, " ------------- " )
    this.screenEdgePosition = edgePositionTest;

    // TEST TEXTURE
    /*const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load( '3dplayer/model/test_1024x1024_1a.png' );
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 16;
    // create a Standard material using the texture we just loaded as a color map
    const textureMaterial = new THREE.MeshStandardMaterial( {
      map: texture,
    } ); //*/
    //let mesh = new THREE.Mesh( geometry, material );

    // INSTANTIATE GLTF LOADER FOR THE PLAYER MODEL
    const gltfLoader = new GLTFLoader();
    const url = "3dplayer/model/saeCdPlayer.glb";

    // NOTE: THIS RESULTS IN A "HTTP Status 0 received" MESSAGE WHEN IT WORKS CORRECTLY
    gltfLoader.load(url, (gltf) => 
    { // GTLF LOADER CALLBACK...
      
      this.loadedModel = gltf.scene;
      
      this.loadedModel.position.z = -2.8; // DEFAULT DESKTOP SIZE
      //this.loadedModel.position.z = -5.5; // DEFAULT DESKTOP SIZE
      
      this.loadedModel.position.y = 0.25;
      this.scene.add( this.loadedModel );
      
      this.modelLoadComplete();
      
      // LOAD ANIMATIONS INTO DICTIONARY INDEXED BY NAME...
      this.animationMixer = new THREE.AnimationMixer( this.scene.getObjectByName( "cdTray" ) );
      this.animationMixerCd = new THREE.AnimationMixer( this.scene.getObjectByName( "cd" ) );
      for( let i=0; i<gltf.animations.length; i++ )
      {
        //logger( "SCANNING ANIMATIONS: ", i, gltf.animations[i].name );
        this.loadedAnimations[gltf.animations[i].name] = gltf.animations[i];
      }
      
      this.loadedModel.traverse( function(child) 
      {
        // SET CD SURFACE AS CUSTOM MATERIAL 
        if( child.material  &&  child.material.name == "cd" )
        {
            child.material = this.cdMaterial; // <-----------------
            //child.material = textureMaterial; 
            //child.geometry.computeFaceNormals();
            //child.geometry.computeVertexNormals();
        }
  
        // TURN ON SHADOWS FOR ALL MESHES      
        if ( child.isMesh ) 
          child.receiveShadow = true;

      }.bind(this) ); //*/
      
      this.cdObject = this.scene.getObjectByName( "cd" );
      
      //this.cdObject.geometry.computeFaceNormals();
      //sphere.geometry.computeVertexNormals();

      // OPEN TRAY INSTANTLY (300X SPEED)
      this.openTray( 300 );
    });

    // ADD BLUR (NOT YET WORKING)
    /*this.composer = new THREE.EffectComposer( this.renderer );
    this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );
    hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
    this.composer.addPass( hblur );
    vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
    // set this shader pass to render to screen so we can see the effects
    vblur.renderToScreen = true;
    this.composer.addPass( vblur ); //*/

    // ENABLE SHADOWS
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // ROOM CUBE  
    let geometry = new THREE.BoxGeometry( -80, -40, -40 );
    //var geometry = new THREE.BoxGeometry( -70, -70, -70 );

    this.roomMaterial =  new THREE.ShaderMaterial({
      uniforms: this.roomUniforms,
      fragmentShader: this.shaders.roomFragmentShader(),
      vertexShader: this.shaders.roomVertexShader(),
    });

    /*this.cdMaterial = new THREE.MeshPhongMaterial(); // DEBUG!!!!!!!!!!!!!!!!!!!!
    this.cdMaterial.shininess  = 100; // DEBUG!!!!!!!!!!!!!!!!!!!! //*/
    this.cdMaterial =  new THREE.ShaderMaterial({
      uniforms: this.cdUniforms,
      fragmentShader: this.shaders.cdFragmentShader(),
      vertexShader: this.shaders.cdVertexShader(),
    });
    this.cdMaterial.transparent = true; //*/

    this.roomCube = new THREE.Mesh( geometry, this.roomMaterial );
    this.roomCube.rotation.x = 200;
    this.roomCube.rotation.y = 120;
    this.scene.add( this.roomCube ); //*/

    // SPOTLIGHT
    this.spotLight = new THREE.SpotLight(0xffffff);
    const spotlightDistance = 1.5; 
    this.spotLight.position.set( -0, 1.2*spotlightDistance, 3.6*spotlightDistance ); //<--------------
    this.spotLight.angle = Math.PI / 3.0;
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 420;
    this.spotLight.shadow.mapSize.height = 420;
    this.spotLight.target.position.z = -3;
    
    // ---> OrthographicCamera( left : Number, right : Number, top : Number, bottom : Number, near : Number, far : Number )
    this.spotLight.shadow.camera = new THREE.OrthographicCamera( -4, 4, 4, -4, 4, 8 ); 

    this.spotLight.intensity = 1.0;
    this.scene.add( this.spotLight );
    this.scene.add( this.spotLight.target );
    
  }




  ////////////////////////////////////////////////////////////////////////
  getIntersectionsAtPixel( mousePosition )
  {
    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera( mousePosition, this.camera );

    // calculate objects intersecting the picking ray
    //var intersects = this.raycaster.intersectObjects( this.scene.children );
    let intersects = this.raycaster.intersectObjects( this.loadedModel.children );

    return intersects;
  }

  
}

