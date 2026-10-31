import type {PowerLighting} from './power-lighting';
import * as T from 'three';
/** Runtime calibration of the supplied atlas; source textures and UVs stay intact. */
export function calibrateBody(material:T.MeshStandardMaterial,power:PowerLighting){
 material.roughness=1;material.metalness=.88;
 material.normalScale?.setScalar(.32);
 if(material instanceof T.MeshPhysicalMaterial){material.clearcoat=.12;material.clearcoatRoughness=.42;}
 material.onBeforeCompile=shader=>{
  shader.uniforms.lcPowerColor=power.lampColor;shader.uniforms.lcPowerStrength=power.lampPower;
  shader.vertexShader='varying vec3 lcBodyWorld;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nlcBodyWorld=(modelMatrix*vec4(transformed,1.0)).xyz;');
  shader.fragmentShader='varying vec3 lcBodyWorld;uniform vec3 lcPowerColor;uniform float lcPowerStrength;\n'+shader.fragmentShader;
  // The original base map contains saturated orange highlights. Suppress those
  // baked highlights while retaining dark seals, red cables and neutral plates.
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
    float lcRed = max(diffuseColor.r, 0.001);
    float lcCopperRatio = diffuseColor.g / lcRed;
    float lcCopper = smoothstep(0.025, 0.075, lcCopperRatio)
      * (1.0 - smoothstep(0.76, 0.94, lcCopperRatio))
      * smoothstep(0.003, 0.045, diffuseColor.r - diffuseColor.b);
    float lcLuma = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
    float lcTubeArea=(1.0-smoothstep(0.010,0.017,min(abs(lcBodyWorld.x+0.264),abs(lcBodyWorld.x-0.253))))
      *(1.0-smoothstep(0.039,0.050,abs(lcBodyWorld.y-0.493)))
      *smoothstep(0.105,0.130,lcBodyWorld.z)*(1.0-smoothstep(0.180,0.195,lcBodyWorld.z));
    float lcTubeMask=lcTubeArea*mix(0.65,1.0,smoothstep(0.002,0.03,lcLuma));
    vec3 lcAgedAlloy = vec3(lcLuma) * vec3(0.48, 0.61, 0.64);
    diffuseColor.rgb = mix(diffuseColor.rgb, lcAgedAlloy, lcCopper * 0.94);
    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.04,0.025,0.012), lcTubeArea);
  `).replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
    roughnessFactor = clamp(roughnessFactor * 0.65 + 0.24, 0.48, 0.82);
    roughnessFactor = max(roughnessFactor, mix(0.48, 0.66, lcCopper));
    roughnessFactor = mix(roughnessFactor,0.15,lcTubeArea);
  `).replace('#include <metalnessmap_fragment>',`#include <metalnessmap_fragment>
    metalnessFactor = mix(metalnessFactor, 0.28, lcCopper * 0.65);
    metalnessFactor = mix(metalnessFactor,0.0,lcTubeArea);
  `).replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
    totalEmissiveRadiance += lcPowerColor * lcPowerStrength * lcTubeMask;
  `).replace('#include <lights_physical_fragment>',`#include <lights_physical_fragment>
    #ifdef USE_CLEARCOAT
      material.clearcoat *= lcCopper;
    #endif
  `);
 };
 material.customProgramCacheKey=()=>'lc-body-powered-steel-v6';
}
