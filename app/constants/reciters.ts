export interface ReciterItem {
  id: number;
  name: string;
  arabicName: string;
  style: 'Murattal' | 'Mujawwad' | 'Muallim';
  country?: string;
}

export const RECITERS_CATALOG: ReciterItem[] = [
  { id: 7, name: 'Mishary Rashid Alafasy', arabicName: 'مشاري راشد العفاسي', style: 'Murattal', country: 'Kuwait' },
  { id: 6, name: 'Mahmoud Khalil Al-Husary', arabicName: 'محمود خليل الحصري', style: 'Murattal', country: 'Mesir' },
  { id: 12, name: 'Mahmoud Khalil Al-Husary (Mujawwad)', arabicName: 'محمود خليل الحصري (مجود)', style: 'Mujawwad', country: 'Mesir' },
  { id: 2, name: 'Abdul Basit Abdul Samad', arabicName: 'عبد الباسط عبد الصمد', style: 'Murattal', country: 'Mesir' },
  { id: 1, name: 'Abdul Basit Abdul Samad (Mujawwad)', arabicName: 'عبد الباسط عبد الصمد (مجود)', style: 'Mujawwad', country: 'Mesir' },
  { id: 8, name: 'Mohamed Siddiq Al-Minshawi', arabicName: 'محمد صديق المنشاوي', style: 'Murattal', country: 'Mesir' },
  { id: 9, name: 'Mohamed Siddiq Al-Minshawi (Mujawwad)', arabicName: 'محمد صديق المنشاوي (مجود)', style: 'Mujawwad', country: 'Mesir' },
  { id: 3, name: 'Saad Al-Ghamdi', arabicName: 'سعد الغامدي', style: 'Murattal', country: 'Arab Saudi' },
  { id: 4, name: 'Abu Bakr Ash-Shatri', arabicName: 'أبو بكر الشاطري', style: 'Murattal', country: 'Arab Saudi' },
  { id: 5, name: 'Hani Ar-Rifai', arabicName: 'هاني الرفاعي', style: 'Murattal', country: 'Arab Saudi' },
  { id: 10, name: 'Saud Ash-Shuraim', arabicName: 'سعود الشريم', style: 'Murattal', country: 'Arab Saudi' },
  { id: 11, name: 'Abdul Rahman Al-Sudais', arabicName: 'عبد الرحمن السديس', style: 'Murattal', country: 'Arab Saudi' },
  { id: 13, name: 'Maher Al-Muaiqly', arabicName: 'ماهر المعيقلي', style: 'Murattal', country: 'Arab Saudi' },
  { id: 14, name: 'Yasser Ad-Dussary', arabicName: 'ياسر الدوسري', style: 'Murattal', country: 'Arab Saudi' },
  { id: 15, name: 'Ali Jaber', arabicName: 'علي جابر', style: 'Murattal', country: 'Arab Saudi' },
];
