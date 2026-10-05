import { jsPDF } from 'jspdf';

export type TemplatePdfData = {
  modelName: string;
  projectNumber: string;
  clientName: string;
  foundation: string;
  modules: string;
  total: number; // house/project price excluding delivery, foundation and montage
  fullTotal?: number; // optional full budget including separate expenses
  base: number;
  optionsTotal: number;
  delivery: number;
  montage: number;
  foundationCost: number;
  deliveryCity: string;
  area: string;
  dimensions: string;
  height: string;
  planUrl?: string;
  custom: boolean;
};

// The supplied DP MODULE КП is the visual master. We retain its background, grid, logo,
// footer and page numbering, and replace only variable content. PDF output is true A4.
const W = 1654;
const H = 2339;
const A4_W = 210;
const A4_H = 297;
const PAPER = '#F7F6F3';
const BLACK = '#111111';
const WHITE = '#F2F2F2';
const MUTED = '#707070';
const ORANGE = '#F47A20';
const CARD = '#FFFFFF';
const SOFT = '#EFEFEB';

const money = (n: number) => new Intl.NumberFormat('ru-RU').format(Math.round(n));

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Не удалось загрузить изображение: ${url}`));
    img.src = url;
  });
}

function canvasFor(bg: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Не удалось создать canvas для КП');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bg, 0, 0, W, H);
  return {canvas, ctx};
}

function fill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function setFont(ctx: CanvasRenderingContext2D, size: number, weight = 400, color = BLACK) {
  ctx.font = `${weight} ${size}px Arial, Helvetica, sans-serif`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';
}

function wrap(ctx: CanvasRenderingContext2D, value: string, maxWidth: number) {
  const words = String(value ?? '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [''];
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (!line || ctx.measureText(next).width <= maxWidth) line = next;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function text(ctx: CanvasRenderingContext2D, value: string, x: number, y: number, size: number, weight = 400, color = BLACK, maxWidth?: number, lineHeight = 1.28) {
  setFont(ctx, size, weight, color);
  if (!maxWidth) {
    ctx.fillText(String(value ?? ''), x, y);
    return;
  }
  const lines = wrap(ctx, value, maxWidth);
  const lh = size * lineHeight;
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * lh));
}

function contained(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, padding = 0) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const ratio = Math.min((w - padding * 2) / iw, (h - padding * 2) / ih);
  const dw = iw * ratio;
  const dh = ih * ratio;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function roundedCard(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r = 18, color = CARD, stroke = '#D7D6D1') {
  ctx.fillStyle = color;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
  ctx.stroke();
}

function description(d: TemplatePdfData) {
  return d.custom
    ? `Индивидуальный проект ${d.modelName} по согласованным параметрам. Планировка и комплектация формируются под решение заказчика.`
    : `Готовый проект ${d.modelName} DP MODULE. Планировка, габариты и базовая комплектация соответствуют выбранной модели.`;
}

function foundationTitle(d: TemplatePdfData) {
  if (d.foundation === 'Существующий') return 'Готовый фундамент заказчика используется';
  if (!d.foundation || d.foundation === 'Не выбран') return 'Фундамент определяется по проекту';
  return `Фундамент: ${d.foundation}`;
}

function foundationDesc(d: TemplatePdfData) {
  if (d.foundation === 'Существующий') return 'Схема посадки показывает размещение выбранного проекта на существующем основании. Технические параметры усиления определяются по проекту и расчёту КР.';
  return `В конфигураторе выбран вариант «${d.foundation || 'не выбран'}». Технические параметры основания фиксируются после проверки проекта.`;
}

function page1(bg: HTMLImageElement, d: TemplatePdfData) {
  const {canvas, ctx} = canvasFor(bg);

  // Exact variable zones based on the original template's 1654×2339 canvas.
  fill(ctx, 125, 720, 820, 90, BLACK);      // model name
  fill(ctx, 125, 885, 845, 70, BLACK);      // subtitle
  fill(ctx, 125, 935, 760, 190, BLACK);     // description
  fill(ctx, 995, 720, 300, 70, BLACK);      // client
  fill(ctx, 995, 1045, 350, 75, BLACK);     // project number
  fill(ctx, 995, 1360, 430, 75, BLACK);     // foundation value
  fill(ctx, 995, 1690, 250, 70, BLACK);     // modules value
  fill(ctx, 125, 1830, 800, 300, BLACK);    // price block

  text(ctx, d.modelName.toUpperCase(), 142, 730, 50, 300, WHITE, 790, 1.1);
  text(ctx, d.custom ? 'Адаптация под пожелания заказчика' : 'Готовая комплектация DP MODULE', 142, 902, 22, 700, WHITE, 800, 1.15);
  text(ctx, description(d), 142, 945, 21, 400, '#CFCFCF', 735, 1.32);

  text(ctx, d.clientName || '—', 1010, 742, 24, 700, WHITE, 300);
  text(ctx, d.projectNumber || '—', 1010, 1062, 24, 700, WHITE, 335);
  text(ctx, d.foundation || '—', 1010, 1376, 22, 700, WHITE, 405);
  text(ctx, d.modules || '—', 1010, 1708, 24, 700, WHITE, 220);

  text(ctx, d.custom ? 'СТОИМОСТЬ ПРОЕКТА' : 'СТОИМОСТЬ ДОМА', 142, 1848, 18, 700, ORANGE);
  text(ctx, money(d.total), 142, 1902, 52, 800, WHITE, 670);
  text(ctx, 'без учёта отдельных расходов на доставку, фундамент и монтаж', 142, 2023, 15, 400, '#BEBEBE', 735, 1.25);
  return canvas;
}

function page2(bg: HTMLImageElement, d: TemplatePdfData) {
  const {canvas, ctx} = canvasFor(bg);
  fill(ctx, 125, 610, 1450, 125, PAPER);
  const p = `Комплектация сформирована на базе проекта «${d.modelName}» DP MODULE и адаптирована под согласованное решение заказчика. Основные элементы конструкции, отделки, остекления и электрики выполняются на производстве.`;
  text(ctx, p, 142, 625, 19, 400, MUTED, 1430, 1.35);
  return canvas;
}

function page3(bg: HTMLImageElement, d: TemplatePdfData, plan?: HTMLImageElement) {
  const {canvas, ctx} = canvasFor(bg);
  fill(ctx, 120, 450, 1440, 275, PAPER);       // title + description
  fill(ctx, 125, 900, 1415, 890, CARD);       // current plan image only
  fill(ctx, 145, 2035, 1425, 165, PAPER);     // three metric cards

  text(ctx, 'ПЛАНИРОВКА', 142, 455, 18, 700, ORANGE);
  text(ctx, `Планировка проекта ${d.modelName}`, 142, 515, 43, 300, BLACK, 1400, 1.12);
  text(ctx, `По проекту ${d.projectNumber || '—'} зафиксированы планировка, габариты и параметры, используемые при изготовлении.`, 142, 635, 19, 400, MUTED, 1410, 1.35);

  if (plan) contained(ctx, plan, 160, 925, 1345, 835, 8);
  else text(ctx, 'Планировка индивидуального проекта', 300, 1280, 26, 600, MUTED, 950, 1.2);

  const xs = [145, 610, 1075];
  const labels = ['ПЛОЩАДЬ', 'ГАБАРИТ', 'ВЫСОТА'];
  const values = [d.area ? `${d.area} м²` : '—', d.dimensions || '—', d.height || '—'];
  xs.forEach((x, i) => {
    roundedCard(ctx, x, 2045, 430, 140, 18, SOFT, SOFT);
    text(ctx, labels[i], x + 30, 2072, 15, 700, ORANGE);
    text(ctx, values[i], x + 30, 2110, i === 1 ? 23 : 27, 800, BLACK, 370, 1.15);
  });
  return canvas;
}

function page4(bg: HTMLImageElement, d: TemplatePdfData, plan?: HTMLImageElement) {
  const {canvas, ctx} = canvasFor(bg);
  fill(ctx, 120, 465, 1450, 270, PAPER);       // title + description
  fill(ctx, 140, 900, 900, 940, PAPER);       // main diagram interior
  fill(ctx, 1030, 965, 430, 360, CARD);       // specific Canada inset
  fill(ctx, 120, 2080, 1400, 125, BLACK);     // bottom note text

  text(ctx, 'ПОСАДКА НА ФУНДАМЕНТ', 142, 455, 18, 700, ORANGE);
  text(ctx, foundationTitle(d), 142, 515, 42, 300, BLACK, 1410, 1.12);
  text(ctx, foundationDesc(d), 142, 635, 18, 400, MUTED, 1410, 1.35);

  if (plan) contained(ctx, plan, 160, 935, 860, 825, 8);
  else text(ctx, 'План проекта', 365, 1300, 26, 600, MUTED, 500, 1.2);

  roundedCard(ctx, 1040, 980, 410, 320, 18, CARD, '#D7D6D1');
  text(ctx, 'ФУНДАМЕНТ', 1070, 1010, 15, 700, ORANGE);
  text(ctx, d.foundation || 'Не выбран', 1070, 1050, 20, 700, BLACK, 320, 1.18);
  text(ctx, 'ПЛОЩАДЬ', 1070, 1145, 15, 700, ORANGE);
  text(ctx, d.area ? `${d.area} м²` : '—', 1070, 1185, 20, 700, BLACK);
  text(ctx, 'МОДУЛЕЙ', 1070, 1240, 15, 700, ORANGE);
  text(ctx, d.modules || '—', 1070, 1280, 20, 700, BLACK);

  text(ctx, 'ПЕРЕД МОНТАЖОМ', 150, 2100, 16, 700, ORANGE);
  const note = d.foundation === 'Существующий'
    ? 'Параметры существующего основания и локального усиления определяются по проекту и расчёту КР.'
    : `Подготовка основания: ${d.foundation || 'требует согласования'}. Параметры — по проекту и расчёту КР.`;
  text(ctx, note, 150, 2140, 16, 400, WHITE, 1330, 1.25);
  return canvas;
}

function page5(bg: HTMLImageElement, d: TemplatePdfData) {
  const {canvas, ctx} = canvasFor(bg);
  fill(ctx, 120, 445, 1450, 290, PAPER);        // title + description
  fill(ctx, 150, 845, 1380, 220, CARD);        // top cards content
  fill(ctx, 120, 1315, 1410, 165, BLACK);      // total bar text
  fill(ctx, 140, 1640, 1390, 350, PAPER);      // budget rows
  fill(ctx, 155, 1945, 1390, 165, SOFT);      // important box text

  text(ctx, 'СТОИМОСТЬ', 142, 455, 18, 700, ORANGE);
  text(ctx, `Понятный бюджет проекта ${d.modelName}`, 142, 515, 42, 300, BLACK, 1410, 1.12);
  text(ctx, `Стоимость сформирована для проекта ${d.modelName}. Доставка, фундамент и монтаж вынесены отдельно.`, 142, 635, 18, 400, MUTED, 1410, 1.35);

  text(ctx, 'БАЗОВАЯ КОМПЛЕКТАЦИЯ', 180, 875, 16, 700, ORANGE);
  text(ctx, d.dimensions ? `габарит ${d.dimensions}` : 'по выбранной модели', 180, 918, 15, 400, MUTED, 600, 1.15);
  text(ctx, money(d.base), 180, 960, 34, 800, BLACK);

  text(ctx, 'ДОПОЛНИТЕЛЬНЫЕ ОПЦИИ', 920, 875, 16, 700, ORANGE);
  text(ctx, 'выбранные в конфигураторе', 920, 918, 15, 400, MUTED, 600, 1.15);
  text(ctx, money(d.optionsTotal), 920, 960, 34, 800, BLACK);

  text(ctx, 'ИТОГО ЗА ПРОЕКТ', 150, 1350, 18, 700, ORANGE);
  text(ctx, money(d.total), 150, 1390, 48, 800, WHITE, 520);
  text(ctx, 'без логистики, монтажа и отдельных работ по основанию', 720, 1405, 15, 400, '#BEBEBE', 710, 1.25);

  const rows: Array<[string,string]> = [
    ['ФУНДАМЕНТ', d.foundation || 'Не выбран'],
    ['ПЛОЩАДЬ', d.area ? `${d.area} м²` : '—'],
    ['ДОСТАВКА', d.deliveryCity ? `${d.deliveryCity}${d.delivery ? ` · ${money(d.delivery)} ₽` : ''}` : (d.delivery ? `${money(d.delivery)} ₽` : 'Не указана')],
    ['МОНТАЖ', d.montage ? `${money(d.montage)} ₽` : 'По расчёту'],
  ];
  rows.forEach(([label, value], i) => {
    const y = 1670 + i * 78;
    ctx.strokeStyle = '#D7D6D1'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(145, y - 14); ctx.lineTo(1515, y - 14); ctx.stroke();
    text(ctx, label, 150, y + 8, 14, 400, MUTED);
    text(ctx, value, 760, y + 4, 17, 700, BLACK, 730, 1.15);
  });

  text(ctx, 'ВАЖНО', 180, 1972, 16, 700, ORANGE);
  const note = d.custom
    ? 'Индивидуальные параметры, фундамент и нестандартные работы фиксируются после технического подтверждения.'
    : 'Состав комплектации и отдельные расходы фиксируются в договоре после согласования проекта.';
  text(ctx, note, 180, 2012, 15, 400, BLACK, 1340, 1.3);
  return canvas;
}

export async function renderTemplatePages(d: TemplatePdfData): Promise<string[]> {
  const base = import.meta.env.BASE_URL || './';
  const urls = Array.from({length: 5}, (_, i) => `${base}assets/cp-template/page-${i + 1}.png`);
  const backgrounds = await Promise.all(urls.map(loadImage));

  let plan: HTMLImageElement | undefined;
  if (d.planUrl) {
    try { plan = await loadImage(d.planUrl); } catch { plan = undefined; }
  }

  return [
    page1(backgrounds[0], d),
    page2(backgrounds[1], d),
    page3(backgrounds[2], d, plan),
    page4(backgrounds[3], d, plan),
    page5(backgrounds[4], d),
  ].map((canvas) => canvas.toDataURL('image/png'));
}

export async function generateTemplatePdf(d: TemplatePdfData, download = true) {
  const pageDataUrls = await renderTemplatePages(d);
  const pdf = new jsPDF({orientation: 'portrait', unit: 'mm', format: 'a4', compress: true});
  pageDataUrls.forEach((dataUrl, idx) => {
    if (idx > 0) pdf.addPage('a4', 'portrait');
    pdf.addImage(dataUrl, 'PNG', 0, 0, A4_W, A4_H, undefined, 'FAST');
  });
  const safeModel = d.modelName.replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '_');
  const safeClient = (d.clientName || '').replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '_');
  const suffix = safeClient ? `_${safeClient}` : '';
  if (download) pdf.save(`КП_DP_MODULE_${safeModel}${suffix}.pdf`);
  return pdf;
}
