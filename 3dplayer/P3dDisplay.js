
//import './three.js/three.js'
//import { GLTFLoader } from 'https://www.npmjs.com/package/three-gltf-loader';
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dDisplay 
{


  ///////////////////////////////////////////////////////////////////////
  constructor( windowWidth, windowHeight, renderer ) 
  {
    console.log("---->DISPLAY CONSTRUCTOR");

    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.renderer = renderer;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, windowWidth/windowHeight, 0.1, 1000 );

    this.cube = null;
    this.customCube = null;
    this.loadedModel = null;

    this.frameCounter = 0;

    this.buildStructures();    

  }


  ///////////////////////////////////////////////////////////////////////
  // NOTE: run() MUST BE CALLED EXTERNALLY TO START THE ANIMATION
  run() 
  {
    requestAnimationFrame( this.run.bind(this) );

    this.frameCounter++;

    if( this.cube != null )
    {
      this.cube.rotation.x += 0.05;
      this.cube.rotation.y += 0.05;
    } //*/

    if( this.loadedModel != null )
    {
      this.loadedModel.rotation.y = Math.cos( this.frameCounter * 0.03 ) * 0.08;
      this.loadedModel.rotation.x = Math.sin( this.frameCounter * 0.03) * 0.08 - 0.15;
      //this.loadedModel.rotation.x += 0.01;
      
    }  
    
    this.renderer.render( this.scene, this.camera );

  };


  ///////////////////////////////////////////////////////////////////////
  buildStructures()
  {
    // CAMERA
    this.camera.position.z = 5.5;

    // MODEL
    const width = 4.0;
    const height = 2.0;
    const depth = 3.0;
    
    // INSTANTIATE A LOADER
    const gltfLoader = new GLTFLoader();
    const url = '3dplayer/model/chassis.glb';
    gltfLoader.load(url, (gltf) => {
      this.loadedModel = gltf.scene;
      this.loadedModel.position.z = -2;
      this.scene.add( this.loadedModel );
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

    // TEST CUBE  
    //var geometry = new THREE.BoxGeometry( -80, -40, -40 );
    var geometry = new THREE.BoxGeometry( -70, -70, -70 );

    // CUSTOM SHADER
    const material = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader(),
      fragmentShader: this.fragmentShader()
    }); //*/
    
    
    //const material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
    //const material = new THREE.MeshBasicMaterial( { color: 0x101030 } );
    //const material = new THREE.MeshPhongMaterial();
    //const material = new THREE.MeshStandardMaterial();
    //material.flatShading = true; //*/
    
    
    this.cube = new THREE.Mesh( geometry, material );
    this.scene.add( this.cube ); //*/

    // SPOTLIGHT
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-0, 30, 60);
    spotLight.castShadow = true;
    spotLight.intensity = 0.6;
    this.scene.add( spotLight );

  }

  ///////////////////////////////////////////////////////////////////////
  vertexShader() 
  {
    return `
      void main() 
      {
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition;
      }
        `
  }

  ///////////////////////////////////////////////////////////////////////
  fragmentShader() 
  {
    return `
      float rand(vec2 co)
      {
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }
      
      void main() {
        float colorValue = gl_PointCoord.y/100.0+0.2 + rand(gl_PointCoord.xy)*0.02;
        gl_FragColor = vec4( colorValue, colorValue, colorValue+0.05, 1.0);
      }
        `
  }  
  
}
