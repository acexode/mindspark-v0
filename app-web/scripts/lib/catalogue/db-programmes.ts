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
      "A six-year medical degree. This first release covers the three pre-clinical years: anatomy, physiology, biochemistry, pathology, pharmacology, microbiology and immunology, with public health, ethics and clinical skills taught alongside.",
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
