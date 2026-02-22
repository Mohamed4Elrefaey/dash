export interface Child {
  id: string
  name: string
  nationalId: string
  birthDate: string
  governorate: string
  age: string
  residence: string
  healthUnit: string
  father: {
    name: string
    nationalId: string
    birthDate: string
    age: string
    residence: string
    status: string
  }
  mother: {
    name: string
    nationalId: string
    birthDate: string
    age: string
    residence: string
    status: string
  }
}

export interface Vaccination {
  id: string
  name: string
  targetAge: string
  doses: string
  coveragePercent: number
  type: "إلزامي" | "اختياري"
}

export interface ChildVaccination {
  id: string
  vaccineName: string
  dueDate: string
  actualDate: string
  status: "تم" | "متأخر" | "قادم"
}

export interface Activity {
  id: string
  category: string
  action: string
  description: string
  time: string
}

export interface Alert {
  id: string
  title: string
  description: string
  time: string
}

export const mockChildren: Child[] = Array.from({ length: 15 }, (_, i) => ({
  id: `child-${i + 1}`,
  name: "محمد مصطفى نبيل قاسم",
  nationalId: "20304050806953220",
  birthDate: "٤ ديسمبر٢٠٢٥",
  governorate: "القاهرة",
  age: "٢ شهر",
  residence: "مصر الجديدة النزهة",
  healthUnit: "مصر الجديدة النزهة",
  father: {
    name: "مصطفى قاسم نبيل",
    nationalId: "٢٠٢٥٢٠٢٥٢٠٢٥٢٠٢",
    birthDate: "٤ ديسمبر١٩٩٧",
    age: "٢٩ سنة",
    residence: "مصر الجديدة النزهة",
    status: "متزوج",
  },
  mother: {
    name: "ميرنا على مصطفى",
    nationalId: "٢٠٢٥٢٠٢٥٢٠٢٥٢٠٢",
    birthDate: "٤ ديسمبر١٩٩٩",
    age: "٢٧ سنة",
    residence: "مصر الجديدة النزهة",
    status: "متزوجة",
  },
}))

export const mockVaccinations: Vaccination[] = [
  { id: "v1", name: "شلل الأطفال", targetAge: "شهرين", doses: "٤ جرعات", coveragePercent: 95, type: "إلزامي" },
  { id: "v2", name: "الحصبة", targetAge: "٩ أشهر", doses: "جرعة واحدة", coveragePercent: 91, type: "إلزامي" },
  { id: "v3", name: "الإنفلونزا", targetAge: "٦ أشهر", doses: "سنوي", coveragePercent: 68, type: "اختياري" },
  { id: "v4", name: "الدرن (BCG)", targetAge: "عند الولادة", doses: "جرعة واحدة", coveragePercent: 95, type: "إلزامي" },
  { id: "v5", name: "الالتهاب الكبدي B", targetAge: "عند الولادة", doses: "٣ جرعات", coveragePercent: 91, type: "إلزامي" },
  { id: "v6", name: "الثلاثي البكتيري (DTP)", targetAge: "شهرين", doses: "٣ جرعات", coveragePercent: 94, type: "إلزامي" },
  { id: "v7", name: "الدرن (BCG)", targetAge: "عند الولادة", doses: "جرعة واحدة", coveragePercent: 94, type: "إلزامي" },
  { id: "v8", name: "الرباعي البكتيري", targetAge: "شهرين", doses: "٣ جرعات", coveragePercent: 94, type: "إلزامي" },
  { id: "v9", name: "الخماسي البكتيري", targetAge: "شهرين", doses: "٣ جرعات", coveragePercent: 92, type: "إلزامي" },
  { id: "v10", name: "الالتهاب الرئوي (PCV)", targetAge: "شهرين", doses: "٣ جرعات", coveragePercent: 91, type: "إلزامي" },
  { id: "v11", name: "الروتا", targetAge: "شهرين", doses: "جرعتان", coveragePercent: 74, type: "اختياري" },
  { id: "v12", name: "الحصبة الثلاثية (MMR)", targetAge: "١٢ شهر", doses: "جرعتان", coveragePercent: 74, type: "إلزامي" },
  { id: "v13", name: "لإنفلونزا الموسمية", targetAge: "٦ أشهر", doses: "سنوي", coveragePercent: 68, type: "اختياري" },
  { id: "v14", name: "الجديري المائي", targetAge: "١٢ شهر", doses: "جرعتان", coveragePercent: 68, type: "اختياري" },
]

export const mockChildVaccinations: ChildVaccination[] = [
  { id: "cv1", vaccineName: "شلل الأطفال", dueDate: "٤ ديسمبر٢٠٢٥", actualDate: "٤ ديسمبر٢٠٢٥", status: "متأخر" },
  { id: "cv2", vaccineName: "الحصبة", dueDate: "٤ ديسمبر٢٠٢٥", actualDate: "٤ ديسمبر٢٠٢٥", status: "تم" },
  { id: "cv3", vaccineName: "الإنفلونزا", dueDate: "٤ ديسمبر٢٠٢٥", actualDate: "٤ ديسمبر٢٠٢٥", status: "قادم" },
  { id: "cv4", vaccineName: "الدرن (BCG)", dueDate: "٤ ديسمبر٢٠٢٥", actualDate: "٤ ديسمبر٢٠٢٥", status: "متأخر" },
  { id: "cv5", vaccineName: "الثلاثي البكتيري (DTP)", dueDate: "٤ ديسمبر٢٠٢٥", actualDate: "٤ ديسمبر٢٠٢٥", status: "تم" },
  { id: "cv6", vaccineName: "الخماسي البكتيري", dueDate: "٤ ديسمبر٢٠٢٥", actualDate: "٤ ديسمبر٢٠٢٥", status: "قادم" },
  { id: "cv7", vaccineName: "الالتهاب الرئوي (PCV)", dueDate: "٤ ديسمبر٢٠٢٥", actualDate: "٤ ديسمبر٢٠٢٥", status: "تم" },
  { id: "cv8", vaccineName: "الروتا", dueDate: "٤ ديسمبر٢٠٢٥", actualDate: "٤ ديسمبر٢٠٢٥", status: "متأخر" },
  { id: "cv9", vaccineName: "الحصبة الثلاثية (MMR)", dueDate: "٤ ديسمبر٢٠٢٥", actualDate: "٤ ديسمبر٢٠٢٥", status: "قادم" },
  { id: "cv10", vaccineName: "لإنفلونزا الموسمية", dueDate: "٤ ديسمبر٢٠٢٥", actualDate: "٤ ديسمبر٢٠٢٥", status: "متأخر" },
  { id: "cv11", vaccineName: "الحصبة الثلاثية (MMR)", dueDate: "٤ ديسمبر٢٠٢٥", actualDate: "٤ ديسمبر٢٠٢٥", status: "قادم" },
  { id: "cv12", vaccineName: "لإنفلونزا الموسمية", dueDate: "٤ ديسمبر٢٠٢٥", actualDate: "٤ ديسمبر٢٠٢٥", status: "تم" },
  { id: "cv13", vaccineName: "الجديري المائي", dueDate: "٤ ديسمبر٢٠٢٥", actualDate: "٤ ديسمبر٢٠٢٥", status: "متأخر" },
  { id: "cv14", vaccineName: "الحصبة الثلاثية (MMR)", dueDate: "٤ ديسمبر٢٠٢٥", actualDate: "٤ ديسمبر٢٠٢٥", status: "تم" },
]

export const mockActivities: Activity[] = [
  {
    id: "a1",
    category: "إدارة النظام",
    action: "إضافة عيادة جديدة",
    description: 'تمت إضافة عيادة باسم «عيادة الشفاء» إلى دليل العيادات بنجاح.',
    time: "١ م",
  },
  {
    id: "a2",
    category: "إدارة النظام",
    action: "إضافة طفل جديد",
    description: 'تمت إضافة طفل جديد باسم «محمد أحمد على» إلى قاعدة بيانات النظام بنجاح.',
    time: "١٠ م",
  },
  {
    id: "a3",
    category: "فريق المحتوى",
    action: "إضافة مقال جديد",
    description: 'تم نشر مقال جديد بعنوان «نصائح بسيطة لنوم الطفل الهادئ» ضمن قسم التوعية.',
    time: "١٠ م",
  },
]

export const mockAlerts: Alert[] = [
  {
    id: "al1",
    title: "تطعيمات متأخرة جداً",
    description: "١٢٧ طفل لديهم تطعيمات متأخرة أكثر من ٣٠ يوم",
    time: "منذ ساعتين",
  },
  {
    id: "al2",
    title: "تطعيمات متأخرة جداً",
    description: "١٢٧ طفل لديهم تطعيمات متأخرة أكثر من ٣٠ يوم",
    time: "منذ ساعتين",
  },
  {
    id: "al3",
    title: "تطعيمات متأخرة جداً",
    description: "١٢٧ طفل لديهم تطعيمات متأخرة أكثر من ٣٠ يوم",
    time: "منذ ساعتين",
  },
  {
    id: "al4",
    title: "تطعيمات متأخرة جداً",
    description: "١٢٧ طفل لديهم تطعيمات متأخرة أكثر من ٣٠ يوم",
    time: "منذ ساعتين",
  },
]

export const monthlyVaccinationData = [
  { month: "يناير", count: 1500 },
  { month: "فبراير", count: 2200 },
  { month: "مارس", count: 2800 },
  { month: "أبريل", count: 3200 },
  { month: "مايو", count: 4500 },
  { month: "يونيو", count: 4200 },
  { month: "يوليو", count: 4800 },
  { month: "أغسطس", count: 5200 },
  { month: "سبتمبر", count: 5600 },
  { month: "أكتوبر", count: 5800 },
  { month: "نوفمبر", count: 5400 },
  { month: "ديسمبر", count: 5000 },
]
