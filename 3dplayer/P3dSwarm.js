


//---------------------------------------------------------------------------------
import { random } from './P3dUtility.js'
//---------------------------------------------------------------------------------



const MAX_OBJECTS = 15;



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dSwarm
{

  ///////////////////////////////////////////////////////////////////////
  constructor( scene ) 
  {
    this.scene = scene;
    
    this.sphere = null;
    
    this.objectArray = [];
    this.sizeArray = [];
    this.objectEnabled = [];
    
    this.xSpeed = [];
    this.ySpeed = [];
    this.zSpeed = [];
    
    this.windTargetX = 0.0;
    this.windAmountX = 0.0;
    this.windTargetY = 0.0;
    this.windAmountY = 0.0;
    this.windActive = false;

    this.currentSize = 0.0;
    this.enabled = false;
    
    this.frameCounter = 0;

    this.disable();    
    this.load();
  }
  
  
  ////////////////////////////////////////////////////////////////////////
  load()
  {
    // ADD SPHERE
    //var sphereGeometry = new THREE.SphereGeometry( 0.3, 32, 32 );
    const objectSize = 0.32;
    const circularSegments = 22;
    const coneSegments = 60;
    var sphereGeometry = new THREE.SphereGeometry( objectSize, circularSegments, circularSegments );
    var boxGeometry = new THREE.BoxGeometry( objectSize*1.5, objectSize*1.5, objectSize*1.5 );
    var coneGeometry = new THREE.ConeGeometry( objectSize*0.9, objectSize*1.5, coneSegments );
    //TetrahedronGeometry  ConeGeometry  CylinderGeometry  IcosahedronGeometry  OctahedronGeometry  TextGeometry
    // TorusGeometry    TorusKnotGeometry
    var sphereMaterial2 = new THREE.MeshStandardMaterial( {color: 0x747A70} );
    //var sphereMaterial2 = new THREE.MeshStandardMaterial( {color: 0x22242A} );
    //var sphereMaterial1 = new THREE.MeshStandardMaterial( {color: 0x777070} );
    var sphereMaterial1 = new THREE.MeshStandardMaterial( {color: 0x817060} );
    sphereMaterial1.metalness = 0.7;
    sphereMaterial1.roughness = 0.45;
    sphereMaterial2.metalness = 0.4;
    sphereMaterial2.roughness = 0.45;
    
    for( let i=0; i<MAX_OBJECTS; i++ )
    {
      switch( random(3) )
      {
        case 0: this.objectArray[i] = new THREE.Mesh( sphereGeometry, sphereMaterial1 ); break;
        case 1: this.objectArray[i] = new THREE.Mesh( boxGeometry, sphereMaterial1 ); break;
        case 2: this.objectArray[i] = new THREE.Mesh( coneGeometry, sphereMaterial1 ); break;
      }
      
      this.sizeArray[i] = 0.0; // <--------------
      //this.sizeArray[i] = 1.0; // DEBUG
      this.objectArray[i].castShadow = true;
      this.objectArray[i].position.y = random(40)*0.1 - 1.6;
      this.objectArray[i].position.x = random(40)*0.16 - 1.5;
      this.objectArray[i].position.z = -2.7;
      this.objectArray[i].rotation.x = random(360)*3.14/2.0
      this.objectArray[i].rotation.y = random(360)*3.14/2.0
      //this.objectArray[i].scale.y = random(4)*0.2+1.0;
      //this.objectArray[i].scale.x = random(4)*0.2+1.0;
      //this.objectArray[i].scale.x = 0.5;
      //this.objectArray[i].scale.z = 0.5;
      this.scene.add( this.objectArray[i] );
      this.xSpeed[i] = random(20) * 0.00002 + 0.0037;
      this.objectArray[i].visible = false;
    } //*/
    
  }
  
  
  
  ////////////////////////////////////////////////////////////////////////
  render()
  {
    this.frameCounter++;
    /*if( this.enabled == true )
    {
      /*if( this.currentSize < 1.0 )
        this.currentSize += 0.001;
      if( this.currentSize > 1.0 )
        this.currentSize = 1.0; 
    }
    else
    {
      if( this.currentSize > 0.0 )
        this.currentSize -= 0.02;
      if( this.currentSize < 0.0 )
        this.currentSize = 0.0;
    }//*/
  
    /*if( frameCounter%180 == 0 )
    {
      this.windActive = true;
    }//*/
  
  
    for( let i=0; i<MAX_OBJECTS; i++ )
    {
      if( this.objectEnabled[i] == false )
      {
        if( this.sizeArray[i] > 0.0 )
          this.sizeArray[i] -= 0.04;
        if( this.sizeArray[i] < 0.0 )
          this.sizeArray[i] = 0.0;
        //this.sizeArray[i] = 1.0; // DEBUG
      }
      this.objectArray[i].rotation.z += 0.02;
      this.objectArray[i].rotation.y += this.xSpeed[i];
      //this.objectArray[i].rotation.z += (i+1)*0.003;
      //this.objectArray[i].position.x += 0.005;
      this.objectArray[i].position.x += this.xSpeed[i] + this.windAmountX;
      this.objectArray[i].position.y += this.windAmountY;
      
      this.objectArray[i].scale.x = 1.0 * this.sizeArray[i];
      this.objectArray[i].scale.y = 1.0 * this.sizeArray[i];
      this.objectArray[i].scale.z = 1.0 * this.sizeArray[i];

      
      const SCREEN_EDGE = 6.0;
      if( this.objectArray[i].position.x > SCREEN_EDGE )
      {
        this.objectArray[i].position.x = -SCREEN_EDGE;
        if( this.enabled )
        {
          this.objectEnabled[i] = true;
          this.sizeArray[i] = 1.0;
          this.objectArray[i].visible = true;
        }
        let foundNearbyObject = false;
        let placementAttempts = 0;
        do
        {
          placementAttempts++;
          if( placementAttempts > 5 )
          {
            this.objectArray[i].position.x = random(40)*0.16 - 1.5;
            foundNearbyObject = true;
            this.sizeArray[i] = 0.0;
            this.objectArray[i].visible = false;
            this.objectEnabled[i] = false;
            break;
          }
            
          this.objectArray[i].position.y = random(40)*0.095 - 1.7;
          const PROXIMITY_LIMIT = 1.20;
          foundNearbyObject = false;
          for( let j=0; j<MAX_OBJECTS; j++ )
          {
            if( i != j )  
            {
              if( Math.abs( this.objectArray[j].position.x - this.objectArray[i].position.x ) < PROXIMITY_LIMIT  &&
                  Math.abs( this.objectArray[j].position.y - this.objectArray[i].position.y ) < PROXIMITY_LIMIT  )
              {
                foundNearbyObject = true;
                break; // FOR LOOP
              }
            }
          }

        }
        while( foundNearbyObject == true );
        //this.sizeArray[i] = random(50) * 0.02 + 0.2;
  
      }
      //if( this.sphere.position.y > 6.0 )
      //  this.sphere.position.y = -6.1;
    }
      
    //*/
  }


  ////////////////////////////////////////////////////////////////////////////
  enable()
  {
    this.enabled = true;
  }

  ////////////////////////////////////////////////////////////////////////////
  disable()
  {
    this.enabled = false;
    for( let i=0; i<MAX_OBJECTS; i++ )
    {
      this.objectEnabled[i] = false;
    }
  }

  
}



