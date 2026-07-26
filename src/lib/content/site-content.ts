export const navigation = [
  { label: "Layanan", href: "#layanan" },
  { label: "Karya", href: "#karya" },
  { label: "Proses", href: "#proses" },
  { label: "Kontak", href: "#kontak" },
] as const;

export const services = [
  { title: "Kusen Aluminium", description: "Sistem bukaan untuk rumah, kantor, dan ruang komersial—dirancang mengikuti ukuran dan kebutuhan ruang.", detail: "Pintu / Jendela / Partisi" },
  { title: "Desain Interior", description: "Perencanaan ruang yang menyatukan fungsi, material, pencahayaan, dan karakter penggunanya.", detail: "Hunian / Kantor / Toko" },
] as const;

export const workTypes = ["Fasad & bukaan", "Ruang tinggal", "Ruang kerja", "Ruang komersial"] as const;
export const processSteps = ["Konsultasi", "Pengukuran", "Perencanaan", "Produksi", "Pemasangan"] as const;
