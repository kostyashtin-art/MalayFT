import { jsPDF } from 'jspdf';

export type TemplatePdfData = {
  modelName: string;
  projectNumber: string;
  clientName: string;
  foundation: string;
  modules: string;
  total: number;
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

const W = 1654;
const H = 2339;
const A4_W = 210;
const A4_H = 297;
const BG_WHITE = '#F7F6F3';
const BG_BLACK = '#111111';
const CARD = '#FFFFFF';
const SOFT = '#EFEFEB';
const BLACK = '#111111';
const MUTED = '#707070';
const ORANGE = '#F47A20';

const money = (n: number) => new Intl.NumberFormat('ru-RU').format(Math.round(n));

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Не удалось загрузить изображение: ${url}`));
    img.src = url;
  });
}

function cover(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function setFont(ctx: CanvasRenderingContext2D, size: number, weight = 400, color = BLACK) {
  ctx.font = `${weight} ${size}px Arial, Helvetica, sans-serif`;
  ctx.fillStyle = color;
}

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, weight = 400, color = BLACK, maxWidth?: number, lineHeight = 1.25) {
  setFont(ctx, size, weight, color);
  ctx.textBaseline = 'top';
  const words = String(text ?? '').split(/\s+/);
  if (!maxWidth) {
    ctx.fillText(String(text ?? ''), x, y);
    return;
  }
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) line = next;
    else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  const lh = size * lineHeight;
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
}

function drawContained(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const ratio = Math.min(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * ratio;
  const dh = img.naturalHeight * ratio;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function pageCanvas(background: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Не удалось создать canvas для КП');
  ctx.drawImage(background, 0, 0, W, H);
  return { canvas, ctx };
}

function renderPage1(bg: HTMLImageElement, d: TemplatePdfData) {
  const {canvas, ctx} = pageCanvas(bg);
  const blackBg = BG_BLACK;
  // Variable areas only. All other pixels remain the original template.
  cover(ctx, 80, 345, 625, 92, blackBg);
  cover(ctx, 80, 445, 770, 64, blackBg);
  cover(ctx, 80, 545, 720, 205, blackBg);
  cover(ctx, 612, 435, 340, 68, blackBg);
  cover(ctx, 612, 645, 390, 80, blackBg);
  cover(ctx, 612, 830, 430, 80, blackBg);
  cover(ctx, 612, 1045, 180, 75, blackBg);
  cover(ctx, 80, 1140, 760, 175, blackBg);

  drawText(ctx, d.modelName.toUpperCase(), 88, 355, 52, 300, '#F2F2F2');
  const subtitle = d.custom ? 'Адаптация под пожелания заказчика' : 'Готовая комплектация DP MODULE';
  drawText(ctx, subtitle, 88, 455, 25, 700, '#F2F2F2', 730);
  const description = d.custom
    ? `Индивидуальный проект ${d.modelName} по согласованным параметрам. Планировка и комплектация формируются под решение заказчика.`
    : `Готовый проект ${d.modelName} DP MODULE. Планировка, габариты и базовая комплектация соответствуют выбранной модели.`;
  drawText(ctx, description, 88, 555, 22, 400, '#CFCFCF', 690, 1.35);

  drawText(ctx, d.clientName || '—', 622, 452, 24, 700, '#F2F2F2', 330);
  drawText(ctx, d.projectNumber || '—', 622, 655, 24, 700, '#F2F2F2', 350);
  drawText(ctx, d.foundation || '—', 622, 840, 24, 700, '#F2F2F2', 400);
  drawText(ctx, d.modules || '—', 622, 1055, 24, 700, '#F2F2F2');

  drawText(ctx, d.custom ? 'СТОИМОСТЬ ПРОЕКТА' : 'СТОИМОСТЬ ДОМА', 88, 1155, 18, 700, ORANGE);
  drawText(ctx, money(d.total), 88, 1192, 52, 800, '#F2F2F2');
  drawText(ctx, 'без учёта отдельных расходов на доставку, фундамент и монтаж', 88, 1275, 15, 400, '#BEBEBE', 720);
  return canvas;
}

function renderPage2(bg: HTMLImageElement, d: TemplatePdfData) {
  const {canvas, ctx} = pageCanvas(bg);
  cover(ctx, 85, 383, 1480, 92, BG_WHITE);
  const p = `Комплектация сформирована на базе проекта «${d.modelName}» DP MODULE. Основные элементы конструкции, отделки, остекления и электрики выполняются на производстве.`;
  drawText(ctx, p, 88, 393, 19, 400, MUTED, 1450, 1.35);
  return canvas;
}

function renderPage3(bg: HTMLImageElement, d: TemplatePdfData, plan?: HTMLImageElement) {
  const {canvas, ctx} = pageCanvas(bg);
  cover(ctx, 80, 290, 1450, 82, BG_WHITE);
  cover(ctx, 80, 385, 1480, 95, BG_WHITE);
  if (plan) {
    // Replace only the variable plan area inside the template frame.
    cover(ctx, 125, 585, 1368, 540, CARD);
    drawContained(ctx, plan, 132, 598, 1350, 515);
  }
  cover(ctx, 95, 1670, 420, 130, SOFT);
  cover(ctx, 560, 1670, 420, 130, SOFT);
  cover(ctx, 1025, 1670, 420, 130, SOFT);
  const title = d.custom ? `Проект ${d.modelName}` : `Планировка проекта ${d.modelName}`;
  const desc = `По проекту ${d.projectNumber || '—'} зафиксированы планировка, габариты и параметры, используемые при изготовлении.`;
  drawText(ctx, title, 88, 300, 45, 300, BLACK, 1450);
  drawText(ctx, desc, 88, 395, 19, 400, MUTED, 1450, 1.4);
  drawText(ctx, 'ПЛОЩАДЬ', 120, 1690, 16, 700, ORANGE);
  drawText(ctx, `${d.area || '—'} м²`, 120, 1728, 27, 800, BLACK);
  drawText(ctx, 'ГАБАРИТ', 585, 1690, 16, 700, ORANGE);
  drawText(ctx, d.dimensions || '—', 585, 1728, 24, 800, BLACK, 360);
  drawText(ctx, 'ВЫСОТА', 1050, 1690, 16, 700, ORANGE);
  drawText(ctx, d.height || '—', 1050, 1728, 27, 800, BLACK);
  return canvas;
}

function renderPage4(bg: HTMLImageElement, d: TemplatePdfData, plan?: HTMLImageElement) {
  const {canvas, ctx} = pageCanvas(bg);
  cover(ctx, 80, 285, 1480, 92, BG_WHITE);
  cover(ctx, 80, 385, 1490, 105, BG_WHITE);
  const title = d.foundation === 'Существующий' ? 'Готовый фундамент заказчика используется' : `Фундамент: ${d.foundation || 'не выбран'}`;
  const desc = d.foundation === 'Существующий'
    ? 'Схема посадки показывает размещение проекта на существующем основании; технические параметры усиления определяются отдельно по расчёту КР.'
    : 'Фундамент выбран в конфигураторе. Технические параметры основания фиксируются после проверки проекта.';
  drawText(ctx, title, 88, 300, 43, 300, BLACK, 1450);
  drawText(ctx, desc, 88, 395, 18, 400, MUTED, 1450, 1.4);
  if (plan) {
    cover(ctx, 105, 575, 1420, 600, CARD);
    drawContained(ctx, plan, 120, 595, 1390, 560);
    cover(ctx, 990, 610, 490, 300, CARD);
    drawContained(ctx, plan, 1010, 630, 450, 255);
  }
  cover(ctx, 85, 1242, 1480, 125, BLACK);
  drawText(ctx, 'ПЕРЕД МОНТАЖОМ', 115, 1267, 16, 700, ORANGE);
  const note = d.foundation === 'Существующий'
    ? 'Параметры существующего основания и локального усиления определяются по проекту и расчёту КР.'
    : `Подготовка основания: ${d.foundation || 'требует согласования'}. Параметры - по проекту и расчёту КР.`;
  drawText(ctx, note, 115, 1302, 17, 400, '#F2F2F2', 1370, 1.25);
  return canvas;
}

function renderPage5(bg: HTMLImageElement, d: TemplatePdfData) {
  const {canvas, ctx} = pageCanvas(bg);
  cover(ctx, 80, 290, 1480, 90, BG_WHITE);
  cover(ctx, 80, 385, 1500, 95, BG_WHITE);
  cover(ctx, 92, 518, 660, 180, CARD);
  cover(ctx, 795, 518, 660, 180, CARD);
  cover(ctx, 85, 750, 1480, 175, BLACK);
  cover(ctx, 80, 970, 1480, 280, BG_WHITE);
  cover(ctx, 80, 1185, 1480, 165, SOFT);

  drawText(ctx, 'Понятный бюджет проекта', 88, 300, 42, 300, BLACK, 1450);
  const p = `Стоимость сформирована для проекта ${d.modelName}. Доставка, фундамент и монтаж вынесены отдельно.`;
  drawText(ctx, p, 88, 395, 18, 400, MUTED, 1450, 1.4);

  drawText(ctx, 'БАЗОВАЯ КОМПЛЕКТАЦИЯ', 118, 545, 18, 700, ORANGE);
  drawText(ctx, d.dimensions ? `габарит ${d.dimensions}` : 'по выбранной модели', 118, 590, 16, 400, MUTED, 590);
  drawText(ctx, money(d.base), 118, 625, 34, 800, BLACK);

  drawText(ctx, 'ДОПОЛНИТЕЛЬНЫЕ ОПЦИИ', 820, 545, 18, 700, ORANGE);
  drawText(ctx, 'выбранные в конфигураторе', 820, 590, 16, 400, MUTED, 590);
  drawText(ctx, money(d.optionsTotal), 820, 625, 34, 800, BLACK);

  drawText(ctx, 'ИТОГО ЗА ПРОЕКТ', 120, 790, 18, 700, ORANGE);
  drawText(ctx, money(d.total), 120, 830, 48, 800, '#F2F2F2');
  drawText(ctx, 'без логистики, монтажа и отдельных работ по основанию', 600, 848, 15, 400, '#BEBEBE', 840);

  const rows = [
    ['ФУНДАМЕНТ', d.foundation || 'Не выбран'],
    ['ПЛОЩАДЬ', `${d.area || '—'} м²`],
    ['ГОРОД ДОСТАВКИ', d.deliveryCity || 'Не указан'],
  ];
  rows.forEach((r, i) => {
    const y = 1000 + i * 92;
    ctx.strokeStyle = '#D7D7D2'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(88, y - 12); ctx.lineTo(1515, y - 12); ctx.stroke();
    drawText(ctx, r[0], 90, y + 10, 15, 400, MUTED);
    drawText(ctx, r[1], 850, y + 7, 18, 700, BLACK, 620);
  });

  drawText(ctx, 'ВАЖНО', 115, 1215, 16, 700, ORANGE);
  const note = d.custom
    ? 'Индивидуальные параметры, фундамент и нестандартные работы фиксируются после технического подтверждения.'
    : 'Состав комплектации и отдельные расходы фиксируются в договоре после согласования проекта.';
  drawText(ctx, note, 115, 1250, 16, 400, BLACK, 1360, 1.35);
  return canvas;
}

export async function renderTemplatePages(d: TemplatePdfData): Promise<string[]> {
  const base = import.meta.env.BASE_URL || './';
  const bgUrls = Array.from({length:5},(_,i)=>`${base}assets/cp-template/page-${i+1}.png`);
  const backgrounds = await Promise.all(bgUrls.map(loadImage));
  let plan: HTMLImageElement | undefined;
  if (d.planUrl) { try { plan = await loadImage(d.planUrl); } catch { plan = undefined; } }
  const pages = [
    renderPage1(backgrounds[0], d),
    renderPage2(backgrounds[1], d),
    renderPage3(backgrounds[2], d, plan),
    renderPage4(backgrounds[3], d, plan),
    renderPage5(backgrounds[4], d),
  ];
  return pages.map(canvas=>canvas.toDataURL('image/jpeg',0.95));
}

export async function generateTemplatePdf(d: TemplatePdfData, download = true) {
  const pageDataUrls = await renderTemplatePages(d);
  const pdf = new jsPDF({orientation:'portrait', unit:'mm', format:'a4', compress:true});
  pageDataUrls.forEach((dataUrl, idx)=>{
    if (idx > 0) pdf.addPage('a4','portrait');
    pdf.addImage(dataUrl, 'JPEG', 0, 0, A4_W, A4_H, undefined, 'FAST');
  });

  const safe = d.modelName.replace(/[\\/:*?"<>|]+/g,'-').replace(/\s+/g,'_');
  const suffix = d.clientName ? `_${d.clientName.replace(/\s+/g,'_')}` : '';
  if (download) pdf.save(`КП_DP_MODULE_${safe}${suffix}.pdf`);
  return pdf;
}
