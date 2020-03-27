



//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
export default class P3dShaders
{

  ///////////////////////////////////////////////////////////////////////
  roomVertexShader() 
  // -----> THIS SHOULD BE MOVED TO A NEW CLASS
  {
    //---------------------------------------------------------------------
    /* DIFFUSE SHADER
      varying vec3 normal;
      varying vec3 vertex_to_light_vector;
 
      void main()
      {
          // Transforming The Vertex
          gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
 
          // Transforming The Normal To ModelView-Space
          normal = gl_NormalMatrix * gl_Normal;
 
          // Transforming The Vertex Position To ModelView-Space
          vec4 vertex_in_modelview_space = gl_ModelViewMatrx * gl_Vertex;
 
          // Calculating The Vector From The Vertex Position To The Light Position
          vertex_to_light_vector = vec3(gl_LightSource[0].position Â– vertex_in_modelview_space);
      }
    //*/
    //-------------------------------------------------------------------------
    /* ORIGINAL
      void main()
      {
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition;
      }
    //*/
    //-------------------------------------------------------------------------

    return `
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }

      `
  }

  ///////////////////////////////////////////////////////////////////////
  roomFragmentShader() 
  // -----> THIS SHOULD BE MOVED TO A NEW CLASS
  {   
      //----------------------------------------------------------------------------
      //float colorValue = gl_PointCoord.y/100.0+0.2;
      //gl_FragColor = vec4( colorValue, colorValue, colorValue+0.05, 1.0);
      //float colorValue = gl_PointCoord.y/100.0+0.2 + rand(gl_PointCoord.xy)*0.02;
      //----------------------------------------------------------------------------
      /* ORIGINAL GRADIENT
        float colorValue = gl_PointCoord.y/100.0;
        colorValue = clamp( colorValue, 0.0, 1.0 );
        gl_FragColor = vec4( colorValue, colorValue, colorValue, 1.0);
      //*/
      //----------------------------------------------------------------------------
      /* SOLID COLOR
              gl_FragColor = vec4( 0.0, 0.0, 0.1, 1.0);
              //*/
      //----------------------------------------------------------------------------
      /* DIFFUSE SHADER
        varying vec3 normal;
        varying vec3 vertex_to_light_vector;
 
        void main()
        {
            // Defining The Material Colors
            const vec4 AmbientColor = vec4(0.1, 0.0, 0.0, 1.0);
            const vec4 DiffuseColor = vec4(1.0, 0.0, 0.0, 1.0);
 
            // Scaling The Input Vector To Length 1
            vec3 normalized_normal = normalize(normal);
            vec3 normalized_vertex_to_light_vector = normalize(vertex_to_light_vector);
 
            // Calculating The Diffuse Term And Clamping It To [0;1]
            float DiffuseTerm = clamp(dot(normal, vertex_to_light_vector), 0.0, 1.0);
 
            // Calculating The Final Color
            gl_FragColor = AmbientColor + DiffuseColor * DiffuseTerm;
        }
              //*/
      //----------------------------------------------------------------------------
    return `
      uniform vec3 colorA; 
      uniform vec3 colorB; 
      varying vec3 vUv;

      float rand(vec2 co){
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

      void main() {
        gl_FragColor = vec4(mix(colorA, colorB, vUv.y + rand(vUv.xy)*7.0 ), 1.0);
      }        `
  }  



}




