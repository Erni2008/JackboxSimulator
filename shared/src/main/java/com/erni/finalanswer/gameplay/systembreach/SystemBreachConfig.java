package com.erni.finalanswer.gameplay.systembreach;

import java.util.*;

/** Immutable server-selected balancing. Milliseconds, AP and integer percentages; no rendering dependencies. */
public final class SystemBreachConfig {
    public enum Parameter {
        GAME_MS(240000,1000,300000), INITIALIZATION_MS(20000,1,60000), RESULTS_MS(10000,1,60000),
        INITIAL_AP(0,0,10000), MAX_AP(1000000,10000,1000000), INITIAL_INTEGRITY(100,1,100), INITIAL_INFECTION(0,0,100),
        DECRYPTION_REWARD(10,1,100), CIRCUIT_REWARD(15,1,100), SIGNAL_REWARD(10,1,100), ANALYSIS_REWARD(15,1,100), PORT_REWARD(10,1,100), QUIZ_REWARD(10,1,100),
        MIN_ACTION_WINDOW_MS(1500,250,5000), SIGNAL_JITTER_MS(1000,0,3000), CHALLENGE_MS(20000,3000,60000), CHALLENGE_GAP_MS(500,1,10000), ATTACK_COST(15,1,10000), ATTACK_COOLDOWN_MS(15000,1,120000),
        ATTACK_GUESS_MS(10000,1000,30000), FAILED_ATTACK_PENALTY(5,0,1000), ATTACK_STEAL(20,1,10000), TARGET_IMMUNITY_MS(5000,1,60000), PRESSURE_WINDOW_MS(60000,10000,120000), PRESSURE_STEP_MS(3000,0,10000), PRESSURE_MAX_IMMUNITY_MS(15000,1,60000),
        RECOVERY_MS(20000,3000,60000), RECOVERY_PENALTY(5,0,1000), RECOVERY_RETRIES(3,1,10), RECOVERY_INTEGRITY(100,1,100), RECOVERY_INFECTION(0,0,100),
        FIREWALL_2_COST(30,1,10000), FIREWALL_3_COST(60,1,10000), FIREWALL_COST_STEP(5,0,1000), FIREWALL_LOSS_REDUCTION_PERCENT(25,0,40), FIREWALL_COOLDOWN_STEP_MS(2000,0,20000),
        TROJAN_COST(20,1,10000), DATA_LEAK_COST(20,1,10000), OVERLOAD_COST(25,1,10000), BREAKER_COST(15,1,10000), TRACE_COST(10,1,10000),
        SPECIAL_COOLDOWN_MS(15000,1,120000), TROJAN_MS(4000,1,10000), BREAKER_MS(10000,1,30000), TRACE_MS(10000,1,30000), DATA_LEAK_AMOUNT(15,1,10000),
        ATTACK_DAMAGE(25,0,100), ATTACK_INFECTION(20,0,100), RECOVERY_FAILURE_DAMAGE(10,0,100),
        SIGNAL_DELAY_MS(2000,500,5000), SIGNAL_WINDOW_MS(900,150,2000), SIGNAL_TOLERANCE_MS(150,0,300),
        COOLING_START(80,60,100), COOLING_TARGET(40,20,50), COOLING_PASSIVE_PER_SECOND(3,1,10), COOLING_CONTROL_PER_SECOND(14,10,30), COOLING_STABLE_MS(1000,250,3000),
        REQUESTS_PER_SECOND(6,1,20), EVENT_LIMIT(32,8,64);
        public final int defaultValue,min,max;
        Parameter(int value,int min,int max){defaultValue=value;this.min=min;this.max=max;}
    }
    private final EnumMap<Parameter,Integer> values=new EnumMap<>(Parameter.class);
    public SystemBreachConfig(){this(Map.of());}
    public SystemBreachConfig(Map<Parameter,Integer> overrides){
        for(Parameter p:Parameter.values()){int value=overrides.getOrDefault(p,p.defaultValue);if(value<p.min||value>p.max)throw new IllegalArgumentException("Invalid "+p);values.put(p,value);}
        if(get(Parameter.PRESSURE_MAX_IMMUNITY_MS)<get(Parameter.TARGET_IMMUNITY_MS))throw new IllegalArgumentException("Protection cap is below base immunity");
        if(get(Parameter.INITIAL_AP)>get(Parameter.MAX_AP))throw new IllegalArgumentException("Initial balance exceeds cap");
        long coolingNeeded=(long)Math.ceil((get(Parameter.COOLING_START)-get(Parameter.COOLING_TARGET))*1000.0/(3*get(Parameter.COOLING_CONTROL_PER_SECOND)-get(Parameter.COOLING_PASSIVE_PER_SECOND)))+get(Parameter.COOLING_STABLE_MS);
        if(get(Parameter.RECOVERY_MS)<coolingNeeded)throw new IllegalArgumentException("Cooling recovery window cannot be solved");
        if(get(Parameter.CHALLENGE_MS)<=get(Parameter.SIGNAL_DELAY_MS)+get(Parameter.SIGNAL_JITTER_MS)+get(Parameter.SIGNAL_WINDOW_MS)+get(Parameter.SIGNAL_TOLERANCE_MS))throw new IllegalArgumentException("Signal window exceeds challenge lifetime");
    }
    public static SystemBreachConfig configured(){
        Map<Parameter,Integer> overrides=new EnumMap<>(Parameter.class);
        for(Parameter p:Parameter.values()){
            String value=System.getProperty("systembreach."+p.name().toLowerCase(Locale.ROOT),System.getenv("SYSTEM_BREACH_"+p.name()));
            if(value!=null)try{overrides.put(p,Integer.parseInt(value));}catch(NumberFormatException error){throw new IllegalArgumentException("Invalid SYSTEM BREACH configuration: "+p,error);}
        }
        return new SystemBreachConfig(overrides);
    }
    public Map<String,Integer> profile(){Map<String,Integer> profile=new LinkedHashMap<>();values.forEach((key,value)->profile.put(key.name(),value));return Map.copyOf(profile);}
    public int get(Parameter parameter){return values.get(parameter);}
    public SystemBreachConfig with(Parameter parameter,int value){var copy=new EnumMap<>(values);copy.put(parameter,value);return new SystemBreachConfig(copy);}
    public int reward(ChallengeType type){return get(switch(type){case PASSWORD_DECRYPTION->Parameter.DECRYPTION_REWARD;case CIRCUIT_BYPASS->Parameter.CIRCUIT_REWARD;case SIGNAL_INTERCEPTION->Parameter.SIGNAL_REWARD;case DATA_ANALYSIS->Parameter.ANALYSIS_REWARD;case PORT_DETECTION->Parameter.PORT_REWARD;case QUICK_QUESTION->Parameter.QUIZ_REWARD;});}
    public int cost(SpecialAttackType type){return get(switch(type){case TROJAN->Parameter.TROJAN_COST;case DATA_LEAK->Parameter.DATA_LEAK_COST;case SYSTEM_OVERLOAD->Parameter.OVERLOAD_COST;case FIREWALL_BREAKER->Parameter.BREAKER_COST;case TRACE_ATTACK->Parameter.TRACE_COST;});}
}
