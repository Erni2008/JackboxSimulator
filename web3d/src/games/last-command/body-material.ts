import * as T from 'three';
/** Runtime calibration of the supplied atlas; source textures and UVs stay intact. */
export function calibrateBody(material:T.MeshStandardMaterial){
 material.roughness=1;material.metalness=.88;
 material.normalScale?.setScalar(.32);
 if(material instanceof T.MeshPhysicalMaterial){material.clearcoat=.12;material.clearcoatRoughness=.42;}
 material.onBeforeCompile=shader=>{
  // The original base map contains saturated orange highlights. Suppress those
  // baked highlights while retaining dark seals, red cables and neutral plates.
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
    float lcRed = max(diffuseColor.r, 0.001);
    float lcCopperRatio = diffuseColor.g / lcRed;
    float lcCopper = smoothstep(0.025, 0.075, lcCopperRatio)
      * (1.0 - smoothstep(0.76, 0.94, lcCopperRatio))
      * smoothstep(0.003, 0.045, diffuseColor.r - diffuseColor.b);
    float lcLuma = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
    vec3 lcAgedAlloy = vec3(lcLuma) * vec3(0.48, 0.61, 0.64);
    diffuseColor.rgb = mix(diffuseColor.rgb, lcAgedAlloy, lcCopper * 0.94);
  `).replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
    roughnessFactor = clamp(roughnessFactor * 0.65 + 0.24, 0.48, 0.82);
    roughnessFactor = max(roughnessFactor, mix(0.48, 0.66, lcCopper));
  `).replace('#include <metalnessmap_fragment>',`#include <metalnessmap_fragment>
    metalnessFactor = mix(metalnessFactor, 0.28, lcCopper * 0.65);
  `).replace('#include <lights_physical_fragment>',`#include <lights_physical_fragment>
    #ifdef USE_CLEARCOAT
      material.clearcoat *= lcCopper;
    #endif
  `);
 };
 material.customProgramCacheKey=()=>'lc-body-coated-steel-v3';
}
