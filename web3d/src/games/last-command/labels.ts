const labels:Record<string,string>={UP:'ВВЕРХ',MIDDLE:'СРЕДНЕЕ',DOWN:'ВНИЗ',CAT:'КОШКА',OWL:'СОВА',WOLF:'ВОЛК',DEER:'ОЛЕНЬ',SUN:'СОЛНЦЕ',MOON:'ЛУНА',STAR:'ЗВЕЗДА',KEY:'КЛЮЧ',RED:'КРАСНЫЙ',GREEN:'ЗЕЛЁНЫЙ',BLUE:'СИНИЙ',YELLOW:'ЖЁЛТЫЙ'};
export function translateGameText(text:string){return text.replace(/\b(UP|MIDDLE|DOWN|CAT|OWL|WOLF|DEER|SUN|MOON|STAR|KEY|RED|GREEN|BLUE|YELLOW)\b/g,x=>labels[x]);}
