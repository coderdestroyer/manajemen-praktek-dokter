const mongoose = require("mongoose");
const Patient = require("../models/patient"); // sesuaikan path
const MONGO_URI = "mongodb://127.0.0.1:27017/klinik_db"; // ganti jika perlu

const patients = [
  {
    medicalRecordNumber: "MR-001",
    name: "Ahmad Fauzi",
    gender: "L",
    birthDate: new Date("1990-01-12"),
    address: "Jl. Melati No. 1",
    phone: "081234567801",
    bloodType: "O",
  },
  {
    medicalRecordNumber: "MR-002",
    name: "Siti Aisyah",
    gender: "P",
    birthDate: new Date("1992-03-22"),
    address: "Jl. Mawar No. 2",
    phone: "081234567802",
    bloodType: "A",
  },
  {
    medicalRecordNumber: "MR-003",
    name: "Budi Santoso",
    gender: "L",
    birthDate: new Date("1988-07-15"),
    address: "Jl. Kenanga No. 3",
    phone: "081234567803",
    bloodType: "B",
  },
  {
    medicalRecordNumber: "MR-004",
    name: "Dewi Lestari",
    gender: "P",
    birthDate: new Date("1995-11-30"),
    address: "Jl. Anggrek No. 4",
    phone: "081234567804",
    bloodType: "AB",
  },
  {
    medicalRecordNumber: "MR-005",
    name: "Rizky Pratama",
    gender: "L",
    birthDate: new Date("2000-02-18"),
    address: "Jl. Dahlia No. 5",
    phone: "081234567805",
    bloodType: "O",
  },
  {
    medicalRecordNumber: "MR-006",
    name: "Nina Kartika",
    gender: "P",
    birthDate: new Date("1991-06-09"),
    address: "Jl. Flamboyan No. 6",
    phone: "081234567806",
    bloodType: "A",
  },
  {
    medicalRecordNumber: "MR-007",
    name: "Andi Wijaya",
    gender: "L",
    birthDate: new Date("1985-12-25"),
    address: "Jl. Cendana No. 7",
    phone: "081234567807",
    bloodType: "B",
  },
  {
    medicalRecordNumber: "MR-008",
    name: "Putri Maharani",
    gender: "P",
    birthDate: new Date("1998-08-14"),
    address: "Jl. Cemara No. 8",
    phone: "081234567808",
    bloodType: "O",
  },
  {
    medicalRecordNumber: "MR-009",
    name: "Agus Salim",
    gender: "L",
    birthDate: new Date("1979-04-10"),
    address: "Jl. Merpati No. 9",
    phone: "081234567809",
    bloodType: "AB",
  },
  {
    medicalRecordNumber: "MR-010",
    name: "Lina Wati",
    gender: "P",
    birthDate: new Date("1987-09-05"),
    address: "Jl. Elang No. 10",
    phone: "081234567810",
    bloodType: "A",
  },
  {
    medicalRecordNumber: "MR-011",
    name: "Hendra Gunawan",
    gender: "L",
    birthDate: new Date("1993-10-19"),
    address: "Jl. Rajawali No. 11",
    phone: "081234567811",
    bloodType: "O",
  },
  {
    medicalRecordNumber: "MR-012",
    name: "Maya Sari",
    gender: "P",
    birthDate: new Date("1996-01-27"),
    address: "Jl. Kutilang No. 12",
    phone: "081234567812",
    bloodType: "B",
  },
  {
    medicalRecordNumber: "MR-013",
    name: "Fajar Nugroho",
    gender: "L",
    birthDate: new Date("1984-05-03"),
    address: "Jl. Nuri No. 13",
    phone: "081234567813",
    bloodType: "A",
  },
  {
    medicalRecordNumber: "MR-014",
    name: "Rani Permata",
    gender: "P",
    birthDate: new Date("2001-12-01"),
    address: "Jl. Jalak No. 14",
    phone: "081234567814",
    bloodType: "O",
  },
  {
    medicalRecordNumber: "MR-015",
    name: "Yoga Prabowo",
    gender: "L",
    birthDate: new Date("1997-06-21"),
    address: "Jl. Merak No. 15",
    phone: "081234567815",
    bloodType: "B",
  },
  {
    medicalRecordNumber: "MR-016",
    name: "Intan Puspita",
    gender: "P",
    birthDate: new Date("1994-02-11"),
    address: "Jl. Bangau No. 16",
    phone: "081234567816",
    bloodType: "AB",
  },
  {
    medicalRecordNumber: "MR-017",
    name: "Doni Saputra",
    gender: "L",
    birthDate: new Date("1989-08-08"),
    address: "Jl. Kakatua No. 17",
    phone: "081234567817",
    bloodType: "O",
  },
  {
    medicalRecordNumber: "MR-018",
    name: "Fitri Handayani",
    gender: "P",
    birthDate: new Date("1999-03-16"),
    address: "Jl. Kenari No. 18",
    phone: "081234567818",
    bloodType: "A",
  },
  {
    medicalRecordNumber: "MR-019",
    name: "Rudi Hartono",
    gender: "L",
    birthDate: new Date("1982-07-29"),
    address: "Jl. Pelikan No. 19",
    phone: "081234567819",
    bloodType: "B",
  },
  {
    medicalRecordNumber: "MR-020",
    name: "Salsa Amelia",
    gender: "P",
    birthDate: new Date("2002-11-07"),
    address: "Jl. Camar No. 20",
    phone: "081234567820",
    bloodType: "O",
  },
];

async function seedPatients() {
  try {
    await mongoose.connect(MONGO_URI);
    await Patient.insertMany(patients);
    console.log("✅ 20 data pasien berhasil ditambahkan");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

seedPatients();
