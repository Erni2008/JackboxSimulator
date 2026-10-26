export type QualityPreference='AUTO'|'LOW'|'MEDIUM'|'HIGH';
export interface Preferences {sound:boolean;quality:QualityPreference}
const key='finalanswer.lastcommand.preferences.v1';
export function readPreferences():Preferences {
  const defaults:Preferences={sound:true,quality:'AUTO'};
  try{const value=JSON.parse(localStorage.getItem(key)||'null');if(value&&typeof value==='object'){
    if(typeof value.sound==='boolean')defaults.sound=value.sound;
    if(['AUTO','LOW','MEDIUM','HIGH'].includes(value.quality))defaults.quality=value.quality;
  }}catch{/* Private browsing/corrupt settings must not prevent play. */}
  return defaults;
}
export function savePreferences(value:Preferences){try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Session still works without persistent storage. */}}
