import type {Catalog, Family, Project, Complex, Option} from './types';

export const families:Family[]=[
{id:'scandi',name:'Скандинавия',type:'house',from:625000,cover:'./assets/family-scandi.png',description:'Стильная и уютная серия с естественными материалами, панорамными окнами и свободной планировкой.'},
{id:'modern',name:'Модерн',type:'house',from:1380000,cover:'./assets/family-modern.png',description:'Современная серия с панорамным остеклением, функциональными планировками и широким выбором решений.'},
{id:'norway',name:'Норвегия',type:'house',from:1660000,cover:'./assets/family-norway.png',description:'Тёплые дома для круглогодичного проживания с увеличенным пространством и панорамным остеклением.'},
{id:'canada',name:'Канада',type:'house',from:855000,cover:'./assets/family-canada.png',description:'Светлая серия с комбинированной покраской, панорамными окнами и гибкими планировками.'},
{id:'belgium',name:'Бельгия',type:'house',from:1605000,cover:'./assets/family-belgium.png',description:'Необычный дизайн, много естественного света и комфортные планировки.'},
{id:'double',name:'Дабл',type:'house',from:5740000,cover:'./assets/family-double.png',description:'Двухуровневый дом с террасами, панорамными окнами и лестницей между этажами.'},
{id:'optima',name:'Оптима',type:'house',from:1435000,cover:'./assets/family-optima.png',description:'Компактные размеры и эффективные планировочные решения.'},
{id:'nord-bjorn',name:'Nord Бьёрн',type:'bath',from:935000,cover:'./assets/family-bjorn.png',description:'Скандинавская баня с панорамным остеклением и зоной отдыха.'},
{id:'nord-barn',name:'Nord Барн',type:'bath',from:695000,cover:'./assets/family-barn.png',description:'Практичная баня с эргономичной планировкой.'},
{id:'nord-scandi',name:'Nord Сканди',type:'bath',from:1425000,cover:'./assets/family-nord-scandi.png',description:'Парная, зона отдыха, кухня, санузел и терраса.'},
{id:'nord-belgium',name:'Nord Бельгия',type:'bath',from:1015000,cover:'./assets/family-nord-belgium.png',description:'Современная баня с продуманной планировкой.'},
{id:'nord-modern',name:'Nord Модерн',type:'bath',from:1005000,cover:'./assets/family-nord-modern.png',description:'Парная, зона отдыха и душевая с современным остеклением.'},
{id:'nord-mini',name:'Nord Мини',type:'bath',from:670000,cover:'./assets/family-nord-mini.png',description:'Компактная баня для небольшого участка.'},
{id:'nord-wood',name:'Nord Wood',type:'bath',from:1170000,cover:'./assets/family-nord-wood.png',description:'Панорамный фасад и зона отдыха с террасой.'},
{id:'light',name:'Лайт',type:'bath',from:209000,cover:'./assets/family-light.png',description:'Самая компактная и доступная банная серия.'}
];

export const projects:Project[]=[
['scandi-16','scandi','Скандинавия 16',16,625000,'4,0 × 4,0 × 2,7',14],['scandi-24','scandi','Скандинавия 24',24,825000,'6,0 × 4,0 × 2,7',15],['scandi-30','scandi','Скандинавия 30',30,1235000,'6,0 × 5,0 × 2,7',16],['scandi-40','scandi','Скандинавия 40',40,1590000,'8,0 × 5,0 × 2,7',17],['scandi-40-2','scandi','Скандинавия 40-2',42,1620000,'7,0 × 6,0 × 2,7',18],['scandi-40-3','scandi','Скандинавия 40-3',40,1640000,'7,0 × 6,0 × 2,7',19],['scandi-42-5','scandi','Скандинавия 42.5',42.5,1730000,'8,5 × 5,0 × 2,7',20],['scandi-60','scandi','Скандинавия 60',60,2135000,'8,5 × 7,0 × 2,7',21],
['modern-30','modern','Модерн 30',30,1380000,'6,0 × 5,0 × 2,7',27],['modern-30-2','modern','Модерн 30-2',30,1550000,'6,0 × 5,0 × 2,7',28],['modern-40','modern','Модерн 40',40,1630000,'8,0 × 5,0 × 2,7',29],['modern-40-2','modern','Модерн 40-2',40,1685000,'8,0 × 5,0 × 2,7',30],['modern-42-5','modern','Модерн 42.5',42.5,1975000,'8,5 × 5,0 × 2,7',31],['modern-60','modern','Модерн 60',60,2340000,'8,5 × 7,0 × 2,7',32],['modern-80','modern','Модерн 80',80,3090000,'10,0 × 8,0 × 2,7',33],['modern-80-2','modern','Модерн 80-2',80,3345000,'10,0 × 8,0 × 2,7',34],['modern-105','modern','Модерн 105',105,4410000,'14,0 × 7,5 × 2,7',35],['modern-135','modern','Модерн 135',135,4950000,'12,0 × 11,3 × 3,5',36],['modern-250','modern','Модерн 250',250,6860000,'15,5 × 16,0 × 3,5',37],['modern-250-2','modern','Модерн 250-2',250,7000000,'15,5 × 16,0 × 3,5',38],['modern-250-3','modern','Модерн 250-3',250,7160000,'15,5 × 16,0 × 3,5',39],['modern-300','modern','Модерн 300',300,8980000,'18,5 × 16,0 × 3,5',40],
['norway-40','norway','Норвегия 40',40,1660000,'7,0 × 6,0 × 3,1',47],['norway-40-2','norway','Норвегия 40-2',40,1725000,'7,0 × 6,0 × 3,1',48],['norway-40-3','norway','Норвегия 40-3',40,1870000,'7,0 × 6,0 × 3,1',49],['norway-60','norway','Норвегия 60',60,2190000,'8,5 × 7,0 × 3,1',50],
['canada-24','canada','Канада 24',24,855000,'6,0 × 4,0 × 2,7',56],['canada-30','canada','Канада 30',30,1305000,'6,0 × 5,0 × 2,7',57],['canada-40-2','canada','Канада 40-2',42,1680000,'7,0 × 6,0 × 2,7',58],['canada-60','canada','Канада 60',60,2120000,'8,5 × 7,0 × 2,7',59],
['belgium-40','belgium','Бельгия 40',40,1700000,'8,8 × 5,0 × 2,7',66],['belgium-40-2','belgium','Бельгия 40-2',40,1630000,'8,8 × 5,0 × 2,7',67],['belgium-40-3','belgium','Бельгия 40-3',40,1605000,'8,8 × 5,0 × 2,7',68],
['double-160','double','Дабл 160',160,5740000,'9,0 × 9,0 × 5,8',75],['double-160-2','double','Дабл 160-2',160,5740000,'9,0 × 9,0 × 5,8',76],['double-160-3','double','Дабл 160-3',160,5740000,'9,0 × 9,0 × 5,8',77],
['optima-30','optima','Оптима 30',30,1435000,'6,0 × 5,0 × 2,7',83],['optima-50','optima','Оптима 50',50,2245000,'7,5 × 7,0 × 2,7',84],
['bjorn-1','nord-bjorn','Nord Бьёрн 1',15,975000,'6,0 × 2,5 × 2,7',91],['bjorn-2','nord-bjorn','Nord Бьёрн 2',15,1000000,'6,0 × 2,5 × 2,7',92],['bjorn-3','nord-bjorn','Nord Бьёрн 3',15,935000,'6,0 × 2,5 × 2,7',93],['bjorn-4','nord-bjorn','Nord Бьёрн 4',15,985000,'6,0 × 2,5 × 2,7',94],
['barn-1','nord-barn','Nord Барн 1',15,995000,'6,0 × 2,5 × 2,7',99],['barn-2','nord-barn','Nord Барн 2',15,1045000,'6,0 × 2,5 × 2,7',100],['barn-3','nord-barn','Nord Барн 3',15,695000,'3,0 × 2,5 × 2,7',101],['barn-4','nord-barn','Nord Барн 4',15,785000,'4,0 × 2,5 × 2,7',102],
['nscandi-1','nord-scandi','Nord Сканди 1',30,1425000,'6,0 × 5,0 × 2,7',107],['nscandi-2','nord-scandi','Nord Сканди 2',40,1680000,'6,5 × 6,0 × 2,7',108],['nscandi-3','nord-scandi','Nord Сканди 3',45,1803000,'7,5 × 6,0 × 2,7',109],
['nbelgium-1','nord-belgium','Nord Бельгия 1',17,1015000,'6,8 × 2,5 × 2,7',115],['nbelgium-2','nord-belgium','Nord Бельгия 2',17,1035000,'6,8 × 2,5 × 2,7',116],
['nmodern-1','nord-modern','Nord Модерн 1',15,1025000,'6,0 × 2,5 × 2,7',120],['nmodern-2','nord-modern','Nord Модерн 2',15,1005000,'6,0 × 2,5 × 2,7',121],
['nmini','nord-mini','Nord Мини',7.5,670000,'3,0 × 2,5 × 2,7',127],['nwood','nord-wood','Nord Wood',15,1170000,'6,0 × 4,0 × 2,7',133],['light-1','light','Лайт Сота 1',4,209000,'1,5 × 2,5 × 2,7',139],['light-2','light','Лайт Сота 2',7,305000,'3,0 × 2,5 × 2,7',140]
].map(x=>({id:x[0] as string,family:x[1] as string,name:x[2] as string,area:x[3] as number,price:x[4] as number,dimensions:x[5] as string,page:x[6] as number}));

export const complexes:Complex[]=[
{id:'cx-scandi-1',name:'Комплекс «Скандинавия» 1',area:57,price:2005000,dimensions:'9,5 × 6,0 × 2,7',page:146,cover:'./assets/complex-scandi.png'},
{id:'cx-scandi-2',name:'Комплекс «Скандинавия» 2',area:63,price:2295000,dimensions:'10,5 × 6,0 × 2,7',page:147,cover:'./assets/complex-scandi.png'},
{id:'cx-modern',name:'Комплекс «Модерн»',area:0,price:2488000,dimensions:'по проекту',page:150,cover:'./assets/complex-modern.png'}
];

// Only costs explicitly supported by the uploaded commercial proposals / catalog are entered here.
export const options:Option[]=[
{id:'size-up',group:'Габариты',name:'Увеличение размеров: крайние модули 3400 мм, длина всех 7000 мм',price:1160000,calc:'20 м² × 58 000 ₽',source:'КП «Модерн 60»'},
{id:'h3300',group:'Высота',name:'Высота в коньке 3300 мм',price:234000,calc:'фиксировано',source:'КП «Модерн 60»'},
{id:'h3400',group:'Высота',name:'Высота в коньке 3400 мм',price:281000,calc:'фиксировано',source:'КП «Модерн 60»'},
{id:'h3500',group:'Высота',name:'Высота в коньке 3500 мм',price:305000,calc:'фиксировано',source:'КП «Модерн 60»'},
{id:'terrace',group:'Терраса',name:'Увеличение площади террасы',price:22000,calc:'3,6 м² × 6 000 ₽',source:'КП «Модерн 60»'},
{id:'canopy',group:'Терраса',name:'Навес над террасой с подшивом',price:177000,calc:'18,6 м² × 9 500 ₽',source:'КП «Модерн 60»'},
{id:'paint',group:'Интерьер',name:'Покраска стен и потолка внутри дома',price:260000,calc:'65 м² × 4 000 ₽',source:'КП «Модерн 60»'},
{id:'floorheat',group:'Комфорт',name:'Тёплый пол в санузле',price:32000,calc:'1 помещение × 32 000 ₽',source:'КП «Модерн 60»'},
{id:'tile-floor',group:'Отделка',name:'Плитка на полу в санузле',price:56000,calc:'7 м² × 8 000 ₽',source:'КП «Модерн 60»'},
{id:'tile-wall',group:'Отделка',name:'Плитка на стенах санузла',price:50000,calc:'6,25 м² × 8 000 ₽',source:'КП «Модерн 60»'},
{id:'shower',group:'Отделка',name:'Душевой поддон из плитки с трапом без порога',price:36000,calc:'1,5 м² × 24 000 ₽',source:'КП «Модерн 60»'},
{id:'climate-route',group:'Инженерия',name:'Трасса под тепловой насос / кондиционер + кабель + закладная',price:16500,calc:'фиксировано',source:'КП «Модерн 60»'},
{id:'embeds',group:'Инженерия',name:'Закладные для усиления стен под технику и мебель',price:12000,calc:'4 шт. × 3 000 ₽',source:'КП «Модерн 60»'},
{id:'ac',group:'Климат',name:'Royal Thermo Fenix: инверторная сплит-система',price:133000,calc:'фиксировано',source:'КП «Модерн 60»'},
{id:'plumbing',group:'Инженерия',name:'Скрытая разводка сантехники: санузел + кухня',price:118000,calc:'2 помещения × 59 000 ₽',source:'КП «Модерн 60»'},
{id:'stairs',group:'Терраса',name:'Лестница на террасу: 4 ступени по 3 п.м.',price:42000,calc:'12 п.м. × 3 500 ₽',source:'КП «Модерн 60»'},
{id:'railings',group:'Терраса',name:'Перила на половину террасы',price:38500,calc:'7 п.м. × 5 500 ₽',source:'КП «Модерн 60»'}
];

export const catalog:Catalog={families,projects,complexes,options};
