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

    // Header Title
    ctx.textAlign = 'center';
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    const headerY = options.ratio === '1:1' ? 140 : 240;
    ctx.fillText(`QS. ${options.surahName.toUpperCase()} : ${options.verseNumber}`, width / 2, headerY);

    // Dynamic Font Auto-Scaling
    const arabicLen = options.arabicText.length;
    let arabicFontSize = 50;
    let arabicLineHeight = 88;

    if (arabicLen > 250) {
      arabicFontSize = 32;
      arabicLineHeight = 58;
    } else if (arabicLen > 140) {
      arabicFontSize = 40;
      arabicLineHeight = 72;
    }

    ctx.fillStyle = textColor;
    ctx.font = `${arabicFontSize}px "Noto Naskh Arabic", "Traditional Arabic", serif`;
    ctx.direction = 'rtl';

    const arabicLines = wrapText(ctx, options.arabicText, width - 240);
    const startArabicY = options.ratio === '1:1'
      ? Math.max(220, 260 - (arabicLines.length > 3 ? (arabicLines.length - 3) * 20 : 0))
      : 480;

    arabicLines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startArabicY + (index * arabicLineHeight));
    });

    // Divider Line
    ctx.direction = 'ltr';
    const dividerY = startArabicY + (arabicLines.length * arabicLineHeight) + 30;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 80, dividerY);
    ctx.lineTo(width / 2 + 80, dividerY);
    ctx.stroke();

    // Translation Dynamic Sizing
    const transLen = options.translationText.length;
    let transFontSize = 30;
    let transLineHeight = 50;

    if (transLen > 300) {
      transFontSize = 20;
      transLineHeight = 36;
    } else if (transLen > 180) {
      transFontSize = 25;
      transLineHeight = 44;
    }

    ctx.fillStyle = subTextColor;
    ctx.font = `italic ${transFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    const translationLines = wrapText(ctx, `"${options.translationText}"`, width - 260);
    const startTransY = dividerY + 55;

    const maxTransLines = options.ratio === '1:1' ? 8 : 12;
    translationLines.slice(0, maxTransLines).forEach((line, index) => {
      ctx.fillText(line, width / 2, startTransY + (index * transLineHeight));
    });

    // Footer Branding
    ctx.fillStyle = subTextColor;
    ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('Digital Al-Qur\'an', width / 2, height - (options.ratio === '1:1' ? 100 : 140));

    resolve(canvas.toDataURL('image/png'));
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = `${currentLine} ${word}`;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth) {
      lines.push(currentLine);
      currentLine = word || '';
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}
