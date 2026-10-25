#ifdef panelSurfaceFlag
varying vec3 v_controlLocal;
uniform vec4 u_controlColor;
uniform vec4 u_controlData; // kind, current emission, source-mask start, reserved
uniform vec3 u_controlAxis;
uniform mat3 u_controlFrame;

float tlcControlMask(vec3 original) {
    if(u_controlData.x>2.5)return 0.0;
    float geometryMask=smoothstep(u_controlData.z-.003,u_controlData.z+.003,dot(v_controlLocal,u_controlAxis));
    if(u_controlData.x<1.5) {
        // Color is baked into the cap's albedo. Keep neutral chips, exposed metal and dirt.
        float enamel=smoothstep(1.45,2.3,original.r/(max(original.g,original.b)+.006));
        enamel*=smoothstep(.018,.065,original.r);
        return geometryMask*enamel;
    }
    return geometryMask;
}
vec3 tlcControlColor(vec3 original) {
    float mask=tlcControlMask(original);
    vec3 tint=SRGBtoLINEAR(u_controlColor).rgb;
    float tintMaximum=max(max(tint.r,tint.g),max(tint.b,.0001));
    float detail=max(max(original.r,original.g),original.b);
    vec3 painted=(tint/tintMaximum)*detail;
    if(u_controlData.x>1.5) {
        // Unlit frosted glass stays dark; only its lens receives emission below.
        painted*=mix(.28,.75,clamp(u_controlData.y,0.0,1.0));
    }
    return mix(original,painted,mask);
}
vec3 tlcControlEmission(vec3 original) {
    if(u_controlData.x<1.5)return vec3(0.0);
    return SRGBtoLINEAR(u_controlColor).rgb * u_controlData.y * 1.8 * tlcControlMask(original);
}
#endif
