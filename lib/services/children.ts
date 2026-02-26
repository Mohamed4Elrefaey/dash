export interface ChildPayload {
  name: string
  nationalId: string
  dateOfBirth: string
  gender: "girl" | "boy"
  motherNationalId: string
  governorate: string
  city: string
  healthUnit: string
}

export interface Child {
  id: string | number
  name: string
  nationalId: string
  dateOfBirth: string
  gender?: string
  motherNationalId?: string
  governorate: string
  city?: string
  healthUnit?: string
  age?: string
  [key: string]: unknown
}

export interface VaccinationScheduleItem {
  id: string | number
  vaccineName: string
  dueDate: string
  actualDate?: string
  status: string
  [key: string]: unknown
}

let mockChildren: Child[] = [
  {
    id: "1",
    name: "محمد مصطفى نبيل قاسم",
    nationalId: "20304050806953220",
    dateOfBirth: "٤ ديسمبر٢٠٢٥",
    gender: "boy",
    motherNationalId: "٢٠٢٥٢٠٢٥٢٠٢٥٢٠٢",
    governorate: "القاهرة",
    city: "مصر الجديدة",
    healthUnit: "مصر الجديدة النزهة",
    age: "٢ شهر",
  },
  {
    id: "2",
    name: "أحمد على محمد",
    nationalId: "20304050806953221",
    dateOfBirth: "١٠ يناير ٢٠٢٥",
    gender: "boy",
    motherNationalId: "٢٠٢٥٢٠٢٥٢٠٢٥٢٠٣",
    governorate: "الجيزة",
    city: "الدقي",
    healthUnit: "وحدة الدقي الصحية",
    age: "١ شهر",
  },
]

const mockSchedule: VaccinationScheduleItem[] = [
  { id: "cv1", vaccineName: "شلل الأطفال", dueDate: "٤ ديسمبر٢٠٢٥", actualDate: "٤ ديسمبر٢٠٢٥", status: "متأخر" },
  { id: "cv2", vaccineName: "الحصبة", dueDate: "٤ ديسمبر٢٠٢٥", actualDate: "٤ ديسمبر٢٠٢٥", status: "تم" },
  { id: "cv3", vaccineName: "الإنفلونزا", dueDate: "٤ ديسمبر٢٠٢٥", actualDate: "٤ ديسمبر٢٠٢٥", status: "قادم" },
]

export const childrenService = {
  getAll: () => Promise.resolve(mockChildren),
  create: (data: ChildPayload) => {
    const newChild: Child = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    }
    mockChildren = [newChild, ...mockChildren]
    return Promise.resolve(newChild)
  },
  getMyChildren: () => Promise.resolve(mockChildren),
  getVaccinationSchedule: (id: string | number) => Promise.resolve(mockSchedule),
}
