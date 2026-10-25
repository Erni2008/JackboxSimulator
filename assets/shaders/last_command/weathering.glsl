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
};
TlcSurface tlcWeather(vec3 position,vec3 original) {
    // Rotate the solid field to avoid a grid aligned to the rectangular panels.
    mat3 rotation=mat3(.8,-.36,.48, .6,.48,-.64, 0.0,.8,.6);
    vec3 p=rotation*position+vec3(2.73,5.17,1.39);
    float footprint=max(length(dFdx(position)),length(dFdy(position)));
    vec4 broad=tlcNoise(p*9.0);
    vec4 macro=tlcNoise(p*37.0+broad.x*2.0);
    vec4 flake=tlcNoise(p*186.0+macro.x*1.7);
    vec4 grain=tlcNoise(p*790.0);
    vec4 micro=tlcNoise(p*2370.0);
    float grainFilter=tlcDetailFilter(790.0,footprint);
    float microFilter=tlcDetailFilter(2370.0,footprint);
    float flakeFilter=tlcDetailFilter(186.0,footprint);
    float moisture=tlcNoise((position+vec3(2.73,5.17,1.39))*vec3(105.0,9.0,105.0)).x;
    float paint=0.0;
    if(u_weather.w>1.5 && u_weather.w<2.5) {
        paint=smoothstep(1.7,2.6,original.r/(original.g+0.006))*smoothstep(0.025,0.09,original.r);
    }
    float darkPanel=0.0;
    if(u_weather.w<0.5) {
        float brightness=dot(original,vec3(.2126,.7152,.0722));
        darkPanel=(1.0-smoothstep(.012,.045,brightness))*(1.0-smoothstep(.025,.08,abs(original.r-original.b)));
        // The source front display is one inset plane in the body's shared material.
        float display=(1.0-smoothstep(.0004,.002,abs(position.z-.11292)))
            *(1.0-smoothstep(.146,.154,abs(position.x+.003)))
            *smoothstep(.400,.405,position.y)*(1.0-smoothstep(.582,.588,position.y));
        darkPanel=max(darkPanel,display);
    }
    float coverage=u_weather.x*mix(1.0,.57,paint);
    float field=macro.x*.40+flake.x*.22+broad.x*.27+moisture*.11;
    float rust=smoothstep(.62-coverage*.42,.76-coverage*.42,field);
    rust*=mix(1.0,.008,darkPanel);
    float pits=smoothstep(.58,.84,grain.x)*grainFilter;
    float flakeRim=(1.0-smoothstep(.012,.075,abs(flake.x-.48)))*flakeFilter;
    float sediment=smoothstep(.53,.82,moisture)*.23;
    vec3 oxide=mix(vec3(.042,.012,.005),vec3(.23,.069,.018),smoothstep(.19,.78,flake.x*.65+macro.x*.35));
    oxide*=mix(.68,1.25,grain.x*grainFilter+.5*(1.0-grainFilter));
    oxide*=1.0-pits*.42-flakeRim*.16;
    if(u_weather.w>2.5)oxide*=.14; // the floor frames the machine, rather than competing with it
    // Keep the red control recognizable under chipped, chalky paint.
    vec3 substrate=original*mix(.84,1.04,macro.x);
    substrate=mix(substrate,substrate*vec3(.88,.91,.94),paint);
    vec3 color=mix(substrate,oxide,rust*.88);
    color*=1.0-sediment-pits*.12;
    // Millimeter-scale granular metal beneath larger flakes, with subpixel filtering.
    vec3 gradient=flake.yzw*186.0*.0011*flakeFilter*(.28+rust)
        +grain.yzw*790.0*.00017*grainFilter
        +micro.yzw*2370.0*.000035*microFilter;
    gradient=vec3(dot(rotation[0],gradient),dot(rotation[1],gradient),dot(rotation[2],gradient));
    gradient*=mix(1.0,.20,darkPanel);
    float roughness=clamp(u_weather.z+rust*.12+(grain.x-.5)*.12*grainFilter,0.0,.99);
    return TlcSurface(max(color,vec3(.0003)),gradient,rust,roughness);
}
#endif

// A restrained filmic shoulder keeps metal highlights from clipping to flat white.
vec3 tlcToneMap(vec3 value) {
    vec3 x=max(value*TLC_EXPOSURE,vec3(0.0));
    return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.0,1.0);
}
