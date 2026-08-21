export type CardTheme = 'alabaster' | 'onyx' | 'emerald';
export type CardRatio = '1:1' | '9:16';

export interface CardOptions {
  arabicText: string;
  translationText: string;
  surahName: string;
  verseNumber: number;
  verseKey: string;
  theme: CardTheme;
  ratio: CardRatio;
}

export function generateAyatCardBlob(options: CardOptions): Promise<string> {
  return new Promise((resolve) => {
    const width = 1080;
    const height = options.ratio === '1:1' ? 1080 : 1920;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve('');
      return;
    }

    let bgColor = '#FAF8F5';
    let textColor = '#111827';
    let subTextColor = '#4B5563';
    let accentColor = '#1B4D3E';
    let borderColor = '#E5E7EB';

    if (options.theme === 'onyx') {
      bgColor = '#0D0F12';
      textColor = '#F9FAFB';
      subTextColor = '#9CA3AF';
      accentColor = '#34D399';
      borderColor = '#1F2937';
    } else if (options.theme === 'emerald') {
      bgColor = '#1B4D3E';
      textColor = '#FFFFFF';
      subTextColor = '#D1FAE5';
      accentColor = '#FBBF24';
      borderColor = '#065F46';
    }

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, width - 120, height - 120);

    ctx.textAlign = 'center';
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(`QS. ${options.surahName.toUpperCase()} : ${options.verseNumber}`, width / 2, options.ratio === '1:1' ? 160 : 260);

    ctx.fillStyle = textColor;
    ctx.font = '52px "Noto Naskh Arabic", "Traditional Arabic", serif';
    ctx.direction = 'rtl';
    
    const arabicLines = wrapText(ctx, options.arabicText, width - 240);
    const startArabicY = options.ratio === '1:1' ? 320 : 540;
    const arabicLineHeight = 90;

    arabicLines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startArabicY + (index * arabicLineHeight));
    });

    ctx.direction = 'ltr';
    const dividerY = startArabicY + (arabicLines.length * arabicLineHeight) + 40;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 80, dividerY);
    ctx.lineTo(width / 2 + 80, dividerY);
    ctx.stroke();

    ctx.fillStyle = subTextColor;
    ctx.font = 'italic 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const translationLines = wrapText(ctx, `"${options.translationText}"`, width - 260);
    const startTransY = dividerY + 70;
    const transLineHeight = 52;

    translationLines.slice(0, 8).forEach((line, index) => {
      ctx.fillText(line, width / 2, startTransY + (index * transLineHeight));
    });

    ctx.fillStyle = subTextColor;
    ctx.font = '22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('Digital Al-Qur\'an', width / 2, height - (options.ratio === '1:1' ? 120 : 160));

    resolve(canvas.toDataURL('image/png'));
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word || '';
    }
  }
  lines.push(currentLine);
  return lines;
}
