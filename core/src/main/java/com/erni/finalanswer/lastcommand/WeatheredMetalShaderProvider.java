package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.graphics.g3d.shaders.BaseShader;
import net.mgsx.gltf.scene3d.shaders.*;

/** Small, checked hooks into gdx-gltf 2.3 PBR, preserving its lighting and map semantics. */
final class WeatheredMetalShaderProvider extends PBRShaderProvider {
    WeatheredMetalShaderProvider(LastCommandSurfaceStyle style) { super(config(style)); }
    private static PBRShaderConfig config(LastCommandSurfaceStyle style) {
        PBRShaderConfig config=createDefaultConfig();config.numDirectionalLights=3;
        config.prefix="#define TLC_EXPOSURE "+Float.toString(style.exposure)+"\n";
        config.vertexShader=replace(config.vertexShader,"varying vec3 v_position;","varying vec3 v_position;\n#ifdef weatheredMetalFlag\nvarying vec3 v_weatherPosition;\n#endif");
        config.vertexShader=replace(config.vertexShader,"v_position = vec3(pos.xyz) / pos.w;",
            "v_position = vec3(pos.xyz) / pos.w;\n#ifdef weatheredMetalFlag\nv_weatherPosition = (u_worldTrans * vec4(a_position, 0.0)).xyz;\n#endif");
        String weather=Gdx.files.internal("shaders/last_command/weathering.glsl").readString("UTF-8");
        config.fragmentShader=replace(config.fragmentShader,"#ifdef unlitFlag\n\nvoid main()",weather+"\n#ifdef unlitFlag\n\nvoid main()");
        config.fragmentShader=replace(config.fragmentShader,"    perceptualRoughness = clamp(perceptualRoughness, c_MinRoughness, 1.0);",
            "#ifdef weatheredMetalFlag\nTlcSurface weather = tlcWeather(v_weatherPosition, getBaseColor().rgb);\nmetallic *= 1.0 - weather.rust * .98;\nperceptualRoughness = max(perceptualRoughness, weather.roughness);\n#endif\n    perceptualRoughness = clamp(perceptualRoughness, c_MinRoughness, 1.0);");
        config.fragmentShader=replace(config.fragmentShader,"float alphaRoughness = perceptualRoughness * perceptualRoughness;\n\n    vec4 baseColor = getBaseColor();",
            "float alphaRoughness = perceptualRoughness * perceptualRoughness;\n\n    vec4 baseColor = getBaseColor();\n#ifdef weatheredMetalFlag\nbaseColor.rgb = weather.color;\n#endif");
        config.fragmentShader=replace(config.fragmentShader,"    vec3 dielectricSpecularF0 = min(f0 * specularColorFactor, vec3(1.0));",
            "#ifdef weatheredMetalFlag\nspecularColorFactor = mix(specularColorFactor, vec3(1.0), weather.rust);\n#endif\n    vec3 dielectricSpecularF0 = min(f0 * specularColorFactor, vec3(1.0));");
        config.fragmentShader=replace(config.fragmentShader,"vec3 n = getNormal();",
            "vec3 n = getNormal();\n#ifdef weatheredMetalFlag\nn = normalize(n - (weather.gradient - n * dot(n, weather.gradient)) * u_weather.y);\n#endif");
        config.fragmentShader=replace(config.fragmentShader,"    // final frag color\n#ifdef GAMMA_CORRECTION",
            "    color = tlcToneMap(color);\n    // final frag color\n#ifdef GAMMA_CORRECTION",2);
        return config;
    }
    private static String replace(String source,String anchor,String replacement){return replace(source,anchor,replacement,1);}
    private static String replace(String source,String anchor,String replacement,int expected){
        int count=0,offset=0;while((offset=source.indexOf(anchor,offset))>=0){count++;offset+=anchor.length();}
        if(count!=expected)throw new IllegalStateException("PBR hook changed: expected "+expected+", found "+count+" for "+anchor);
        return source.replace(anchor,replacement);
    }
    @Override public String createPrefixBase(Renderable renderable,PBRShaderConfig config){
        return super.createPrefixBase(renderable,config)+(renderable.material.has(WeatheredMetalAttribute.TYPE)?"#define weatheredMetalFlag\n":"");
    }
    @Override protected PBRShader createShader(Renderable renderable,PBRShaderConfig config,String prefix){
        return new PBRShader(renderable,config,prefix){
            {register(new Uniform("u_weather"),new LocalSetter(){
                @Override public void set(BaseShader shader,int input,Renderable renderable,Attributes combined){
                    WeatheredMetalAttribute value=renderable.material.get(WeatheredMetalAttribute.class,WeatheredMetalAttribute.TYPE);
                    if(value!=null)shader.set(input,value.coverage,value.relief,value.roughness,value.part);
                }
            });}
        };
    }
}
