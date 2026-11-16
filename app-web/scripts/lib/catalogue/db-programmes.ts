import type { Programme } from "../../../lib/content/schema";

/** Programmes whose courses live in the content database rather than in repo JSON. */
export const DB_PROGRAMMES: Programme[] = [
  {
    slug: "mbbs-medicine",
    name: "MBBS Medicine and Surgery",
    shortName: "MBBS",
    institutionType: "university",
    durationYears: 6,
    description:
      "A six-year medical degree. Years 1-3 cover the pre-clinical sciences (anatomy, physiology, biochemistry, pathology, pharmacology, microbiology and immunology) with public health, ethics and clinical skills alongside; Years 4-6 cover clinical medicine by specialty (medicine, surgery, obstetrics and gynaecology, paediatrics, psychiatry, emergency care, geriatrics, forensic medicine and evidence-based practice) and transition to practice.",
    accentColor: "#9d2f3b",
  },
  {
    slug: "beng-mechanical-engineering",
    name: "BEng Mechanical Engineering",
    shortName: "BEng Mech",
    institutionType: "university",
    durationYears: 4,
    description:
      "A four-year engineering degree covering statics and dynamics, thermodynamics, fluid mechanics, heat transfer, materials, machine design, manufacturing, controls and vibrations. This first release covers the three core years.",
    accentColor: "#b4531a",
  },
];
