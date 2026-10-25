// Analytic solid noise and derivatives: seamless across UV islands, no new maps.
// The position excludes instance translation, so the moving cap carries its own patina.
#ifdef weatheredMetalFlag
varying vec3 v_weatherPosition;
uniform vec4 u_weather; // rust coverage, relief, minimum roughness, source part

float tlcHash(vec3 p) {
    p=fract(p*0.1031);
    p+=dot(p,p.yzx+33.33);
    return fract((p.x+p.y)*p.z);
}
// value, d/dx, d/dy, d/dz
vec4 tlcNoise(vec3 p) {
    vec3 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f),du=6.0*f*(1.0-f);
    float a=tlcHash(i),b=tlcHash(i+vec3(1,0,0)),c=tlcHash(i+vec3(0,1,0)),d=tlcHash(i+vec3(1,1,0));
    float e=tlcHash(i+vec3(0,0,1)),f1=tlcHash(i+vec3(1,0,1)),g=tlcHash(i+vec3(0,1,1)),h=tlcHash(i+vec3(1,1,1));
    float k0=a,k1=b-a,k2=c-a,k3=e-a,k4=a-b-c+d,k5=a-c-e+g,k6=a-b-e+f1,k7=-a+b+c-d+e-f1-g+h;
    float value=k0+k1*u.x+k2*u.y+k3*u.z+k4*u.x*u.y+k5*u.y*u.z+k6*u.z*u.x+k7*u.x*u.y*u.z;
    vec3 gradient=vec3(k1+k4*u.y+k6*u.z+k7*u.y*u.z,k2+k4*u.x+k5*u.z+k7*u.x*u.z,k3+k5*u.y+k6*u.x+k7*u.x*u.y)*du;
    return vec4(value,gradient);
}
float tlcDetailFilter(float frequency, float footprint) {
    return 1.0-smoothstep(0.32,1.2,frequency*footprint);
}
struct TlcSurface {
    vec3 color;
    vec3 gradient;
    float rust;
    float roughness;
    float metallic;
};
TlcSurface tlcWeather(vec3 position,vec3 original,float sourceMetal,float sourceRoughness) {
    if(u_weather.w>2.5){
        vec4 n=tlcNoise(position*37.0);
        // Small feathered contact patch under the fixed machine. No extra pass or render target.
        vec2 outside=max(abs(position.xz-vec2(-.005,.02))-vec2(.33,.28),vec2(0));
        float contact=1.0-smoothstep(0.0,.16,length(outside));
        vec3 color=original*mix(.78,1.12,n.x)*(1.0-contact*.44);
        return TlcSurface(color,n.yzw*.018,0.0,.86,sourceMetal);
    }
    float brightness=dot(original,vec3(.2126,.7152,.0722));
    float redRatio=original.r/(original.g+.003);
    float warmRatio=original.g/(original.b+.003);
    // Read the authored color/metalness maps first: enamel is not rust, brass is not dirt.
    float paint=smoothstep(3.0,6.0,redRatio)*(1.0-smoothstep(1.8,2.6,warmRatio));
    if(u_weather.w>1.5)paint=max(paint,smoothstep(2.0,3.2,redRatio)*smoothstep(.025,.10,original.r));
    float oxide=smoothstep(2.0,4.2,redRatio)*smoothstep(1.5,2.8,warmRatio)*(1.0-paint);
    float display=0.0;
    if(u_weather.w<.5){
        display=(1.0-smoothstep(.0004,.002,abs(position.z-.11292)))
            *(1.0-smoothstep(.146,.154,abs(position.x+.003)))
            *smoothstep(.400,.405,position.y)*(1.0-smoothstep(.582,.588,position.y));
    }
    vec3 p=position+vec3(2.73,5.17,1.39);
    float footprint=max(length(dFdx(position)),length(dFdy(position)));
    vec4 patina=tlcNoise(p*31.0);
    vec4 grain=tlcNoise(p*340.0);
    float grainFilter=tlcDetailFilter(340.0,footprint);
    float added=u_weather.x*smoothstep(.58,.81,patina.x)*(1.0-paint)*(.25+.75*oxide);
    float rust=clamp(oxide*.72+added,0.0,.9)*(1.0-display);
    vec3 substrate=original;
#ifdef panelSurfaceFlag
    substrate=tlcControlColor(original);
#endif
    // Preserve authored wear; add old rubbed-through enamel and ingrained grime, not a rust blanket.
    vec3 oxideColor=mix(vec3(.048,.017,.007),vec3(.14,.047,.016),patina.x);
    vec3 color=mix(substrate,oxideColor,added*.32);
    color*=mix(.91,1.035,patina.x);
    float wear=clamp(u_weather.y,0.0,1.5);
    float grime=(1.0-smoothstep(.23,.49,patina.x))*wear*.24;
    color*=1.0-grime;
    // Irregular islands break up the coating. No repeated straight scratches across the whole body.
    float chipped=smoothstep(.57,.77,patina.x)*smoothstep(.43,.69,grain.x)*wear;
    float chipFilter=tlcDetailFilter(340.0,footprint);
    float enamelChip=chipped*paint*chipFilter;
    vec3 oldSteel=vec3(.095,.083,.069)*mix(.68,1.2,grain.x);
    color=mix(color,oldSteel,enamelChip*.82);
    vec4 abrasion=tlcNoise(p*vec3(760.0,48.0,260.0));
    float scratchFilter=tlcDetailFilter(760.0,footprint);
    float scratches=smoothstep(.74,.86,abrasion.x)*smoothstep(.35,.65,patina.x)*scratchFilter*wear;
    color=mix(color,mix(oldSteel,substrate*.64,.25),scratches*.36);
    float rough=clamp(max(sourceRoughness*.64,u_weather.z)+(grain.x-.5)*.07*grainFilter,.24,.82);
    rough=mix(rough,max(rough,.76),rust);
    rough=mix(rough,clamp(sourceRoughness*.72,.33,.58),paint);
    rough=mix(rough,.67,clamp(grime+enamelChip*.8+scratches*.35,0.0,1.0));
    float metal=mix(sourceMetal*(1.0-rust*.94),.025,paint);
    metal=mix(metal,.58,enamelChip*.8);
    vec3 gradient=grain.yzw*(.32+wear*.035)*grainFilter*(.4+.6*rust);
    gradient+=abrasion.yzw*vec3(.025,.002,.01)*scratchFilter*wear;
#ifndef TLC_FAST_WEATHER
    float microFilter=tlcDetailFilter(1250.0,footprint);
    if(microFilter>0.0)gradient+=tlcNoise(p*vec3(1250.0,170.0,750.0)).yzw*.055*microFilter;
#endif
    float glass=display;
#ifdef panelSurfaceFlag
    if(u_controlData.x>1.5&&u_controlData.x<2.5)glass=max(glass,tlcControlMask(original));
#endif
    gradient*=1.0-glass;
    rough=mix(rough,.22,glass);metal=mix(metal,0.0,glass);rust*=1.0-glass;
    color=mix(color,substrate,display);
    return TlcSurface(max(color,vec3(.0003)),gradient,rust,rough,clamp(metal,0.0,1.0));
}
#endif

// A restrained filmic shoulder keeps metal highlights from clipping to flat white.
vec3 tlcToneMap(vec3 value) {
    vec3 x=max(value*TLC_EXPOSURE,vec3(0.0));
    return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.0,1.0);
}
