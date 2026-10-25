package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.graphics.g3d.shaders.BaseShader;
import net.mgsx.gltf.scene3d.shaders.*;

/** Small, checked hooks into gdx-gltf 2.3 PBR, preserving its lighting and map semantics. */
final class WeatheredMetalShaderProvider extends PBRShaderProvider {
    WeatheredMetalShaderProvider(LastCommandSurfaceStyle style) { super(config(style)); }
    private static PBRShaderConfig config(LastCommandSurfaceStyle style) {
        PBRShaderConfig config=createDefaultConfig();config.numDirectionalLights=Boolean.getBoolean("lc.legacyRendering")?3:GraphicsProfile.current().lights;
        config.prefix="#define TLC_EXPOSURE "+Float.toString(style.exposure)+"\n"+(style.legacyLook?"#define TLC_LEGACY_LOOK\n":"")+(Boolean.getBoolean("lc.legacyRendering")?"#define TLC_LEGACY_WEATHER\n":GraphicsProfile.current()==GraphicsProfile.HIGH?"":"#define TLC_FAST_WEATHER\n");
        config.vertexShader=replace(config.vertexShader,"varying vec3 v_position;","varying vec3 v_position;\n#ifdef weatheredMetalFlag\nvarying vec3 v_weatherPosition;\n#endif");
        config.vertexShader=replace(config.vertexShader,"v_position = vec3(pos.xyz) / pos.w;",
            "v_position = vec3(pos.xyz) / pos.w;\n#ifdef weatheredMetalFlag\nv_weatherPosition = (u_worldTrans * vec4(a_position, 0.0)).xyz;\n#endif");
        config.vertexShader=replace(config.vertexShader,"varying vec3 v_position;","varying vec3 v_position;\n#ifdef panelSurfaceFlag\nvarying vec3 v_controlLocal;\nuniform mat3 u_controlFrame;\nuniform vec4 u_controlData;\n#endif");
        config.vertexShader=replace(config.vertexShader,"v_position = vec3(pos.xyz) / pos.w;","v_position = vec3(pos.xyz) / pos.w;\n#ifdef panelSurfaceFlag\nv_controlLocal = a_position;\n#endif");
        config.vertexShader=replace(config.vertexShader,"v_weatherPosition = (u_worldTrans * vec4(a_position, 0.0)).xyz;",
            "v_weatherPosition = (u_worldTrans * vec4(a_position, 0.0)).xyz;\n#ifdef panelSurfaceFlag\nif(u_controlData.x>2.5)v_weatherPosition=u_controlFrame*v_weatherPosition;\n#endif");
        String weather=Gdx.files.internal("shaders/last_command/panel_surface.glsl").readString("UTF-8")+"\n"+
            Gdx.files.internal("shaders/last_command/"+(style.legacyLook?"weathering_legacy.glsl":"weathering.glsl")).readString("UTF-8");
        config.fragmentShader=replace(config.fragmentShader,"#ifdef unlitFlag\n\nvoid main()",weather+"\n#ifdef unlitFlag\n\nvoid main()");
        config.fragmentShader=replace(config.fragmentShader,"    perceptualRoughness = clamp(perceptualRoughness, c_MinRoughness, 1.0);",
            "#ifdef weatheredMetalFlag\nTlcSurface weather = tlcWeather(v_weatherPosition, getBaseColor().rgb"+(style.legacyLook?"":", metallic, perceptualRoughness")+");\n"+(style.legacyLook?"metallic *= 1.0 - weather.rust * .98;":"metallic = weather.metallic;")+"\n#ifdef panelSurfaceFlag\nif(u_controlData.x>1.5)metallic*=1.0-tlcControlMask(getBaseColor().rgb);\n#endif\nperceptualRoughness = "+(style.legacyLook?"max(perceptualRoughness, weather.roughness)":"weather.roughness")+";\n#endif\n    perceptualRoughness = clamp(perceptualRoughness, c_MinRoughness, 1.0);");
        config.fragmentShader=replace(config.fragmentShader,"float alphaRoughness = perceptualRoughness * perceptualRoughness;\n\n    vec4 baseColor = getBaseColor();",
            "float alphaRoughness = perceptualRoughness * perceptualRoughness;\n\n    vec4 baseColor = getBaseColor();\n#ifdef weatheredMetalFlag\nbaseColor.rgb = weather.color;\n#elif defined(panelSurfaceFlag)\nbaseColor.rgb = tlcControlColor(baseColor.rgb);\n#endif");
        config.fragmentShader=replace(config.fragmentShader,"    vec3 dielectricSpecularF0 = min(f0 * specularColorFactor, vec3(1.0));",
            "#ifdef weatheredMetalFlag\nspecularColorFactor = mix(specularColorFactor, vec3(1.0), weather.rust);\n#endif\n    vec3 dielectricSpecularF0 = min(f0 * specularColorFactor, vec3(1.0));");
        config.fragmentShader=replace(config.fragmentShader,"vec3 n = getNormal();",
            "vec3 n = getNormal();\n#ifdef weatheredMetalFlag\nvec3 reliefGradient=weather.gradient;\n#ifdef panelSurfaceFlag\nif(u_controlData.x>2.5)reliefGradient=vec3(dot(u_controlFrame[0],reliefGradient),dot(u_controlFrame[1],reliefGradient),dot(u_controlFrame[2],reliefGradient));\n#endif\nn = normalize(n - (reliefGradient - n * dot(n, reliefGradient)) * u_weather.y);\n#endif");
        config.fragmentShader=replace(config.fragmentShader,"    // final frag color\n#ifdef GAMMA_CORRECTION",
            "#ifdef panelSurfaceFlag\ncolor += tlcControlEmission(getBaseColor().rgb);\n#endif\n    color = tlcToneMap(color);\n    // final frag color\n#ifdef GAMMA_CORRECTION",2);
        if(!style.legacyLook)config.fragmentShader=replace(config.fragmentShader,
            "return step(v_shadowMapUv.z, dot(texture2D(u_shadowTexture, v_shadowMapUv.xy + offset), bitShifts) + u_shadowBias);",
            "vec3 dx=dFdx(v_shadowMapUv),dy=dFdy(v_shadowMapUv);\nfloat determinant=dx.x*dy.y-dx.y*dy.x;\nvec2 slope=vec2(0.0);\nif(abs(determinant)>1e-10)slope=vec2(dx.z*dy.y-dx.y*dy.z,dx.x*dy.z-dx.z*dy.x)/determinant;\nfloat receiverDepth=v_shadowMapUv.z+clamp(dot(slope,offset),-.01,.01);\nreturn step(receiverDepth, dot(texture2D(u_shadowTexture,v_shadowMapUv.xy+offset),bitShifts)+u_shadowBias);");
        return config;
    }
    private static String replace(String source,String anchor,String replacement){return replace(source,anchor,replacement,1);}
    private static String replace(String source,String anchor,String replacement,int expected){
        int count=0,offset=0;while((offset=source.indexOf(anchor,offset))>=0){count++;offset+=anchor.length();}
        if(count!=expected)throw new IllegalStateException("PBR hook changed: expected "+expected+", found "+count+" for "+anchor);
        return source.replace(anchor,replacement);
    }
    @Override public String createPrefixBase(Renderable renderable,PBRShaderConfig config){
        return super.createPrefixBase(renderable,config)+(renderable.material.has(WeatheredMetalAttribute.TYPE)?"#define weatheredMetalFlag\n":"")
            +(renderable.material.has(PanelSurfaceAttribute.TYPE)?"#define panelSurfaceFlag\n":"");
    }
    @Override protected PBRShader createShader(Renderable renderable,PBRShaderConfig config,String prefix){
        return new PBRShader(renderable,config,prefix){
            {register(new Uniform("u_weather"),new LocalSetter(){
                @Override public void set(BaseShader shader,int input,Renderable renderable,Attributes combined){
                    WeatheredMetalAttribute value=renderable.material.get(WeatheredMetalAttribute.class,WeatheredMetalAttribute.TYPE);
                    if(value!=null)shader.set(input,value.coverage,value.relief,value.roughness,value.part);
                }
            });
             register(new Uniform("u_controlColor"),new LocalSetter(){
                @Override public void set(BaseShader shader,int input,Renderable renderable,Attributes combined){
                    PanelSurfaceAttribute value=renderable.material.get(PanelSurfaceAttribute.class,PanelSurfaceAttribute.TYPE);
                    if(value!=null)shader.set(input,value.color);
                }
             });
             register(new Uniform("u_controlData"),new LocalSetter(){
                @Override public void set(BaseShader shader,int input,Renderable renderable,Attributes combined){
                    PanelSurfaceAttribute value=renderable.material.get(PanelSurfaceAttribute.class,PanelSurfaceAttribute.TYPE);
                    if(value!=null)shader.set(input,(float)value.kind,value.emission,value.maskStart,0f);
                }
             });
             register(new Uniform("u_controlFrame"),new LocalSetter(){
                @Override public void set(BaseShader shader,int input,Renderable renderable,Attributes combined){
                    PanelSurfaceAttribute value=renderable.material.get(PanelSurfaceAttribute.class,PanelSurfaceAttribute.TYPE);
                    if(value!=null)shader.set(input,value.patternFrame);
                }
             });
             register(new Uniform("u_controlAxis"),new LocalSetter(){
                @Override public void set(BaseShader shader,int input,Renderable renderable,Attributes combined){
                    PanelSurfaceAttribute value=renderable.material.get(PanelSurfaceAttribute.class,PanelSurfaceAttribute.TYPE);
                    if(value!=null)shader.set(input,value.maskAxis);
                }
             });}
        };
    }
}
