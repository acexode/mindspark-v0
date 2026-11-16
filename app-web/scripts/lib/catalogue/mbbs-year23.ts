import type { CourseSpec, ModuleDraft } from "../undergrad-course";
import { paletteColor } from "../undergrad-course";

/**
 * MBBS (Medicine), Years 2 and 3: systems and mechanisms of disease, then
 * integration, research and transition to clinical practice. Structure follows
 * docs/research/mbbs-curriculum.md section 3; all wording is original.
 */
const PROGRAMME = "mbbs-medicine";

const MBBS_PALETTE = ["#9b2335", "#0f766e", "#6b3fa0", "#b4472f", "#1f6f78", "#7a2e5a"];

interface SourceRef {
  id: string;
  title: string;
  type: "institution" | "authored";
  url?: string;
}

interface CourseProvenance {
  sources: SourceRef[];
  reviewStatus: "draft";
  verified: false;
  note: string;
}

type MbbsCourseSpec = CourseSpec & { provenance: CourseProvenance };

const SOURCES = {
  cambridge: {
    id: "cambridge-medsci-tripos",
    title: "University of Cambridge Medical Sciences Tripos",
    url: "https://www.path.cam.ac.uk/node/134",
  },
  harvard: {
    id: "harvard-pathways",
    title: "Harvard Medical School Pathways course descriptions",
    url: "https://meded.hms.harvard.edu/pathways-course-descriptions",
  },
  oxford2018: {
    id: "oxford-medicine-entry-2018",
    title: "University of Oxford Medicine course information sheet (2018 entry)",
    url: "https://www.ox.ac.uk/sites/files/oxford/Medicine%202018%20entry.pdf",
  },
  oxford2026: {
    id: "oxford-medicine-cis-2026",
    title: "University of Oxford Medicine course information sheet (2026 entry)",
    url: "https://www.ox.ac.uk/sites/files/oxford/field/field_document/Medicine%20CIS%202026-entry.pdf",
  },
  oxfordStructure: {
    id: "oxford-preclinical-structure",
    title: "University of Oxford Medical Sciences pre-clinical course structure",
    url: "https://www.medsci.ox.ac.uk/study/medicine/pre-clinical/structure",
  },
  uclYear2: {
    id: "ucl-medical-school-year-2",
    title: "UCL Medical School Year 2 course information",
    url: "https://www.ucl.ac.uk/medical-school/staff-students/course-information/year-2",
  },
  uclFoundations: {
    id: "ucl-foundations-health-medical-practice",
    title: "UCL module catalogue: Foundations of Health and Medical Practice",
    url: "https://www.ucl.ac.uk/module-catalogue/modules/foundations-of-health-and-medical-practice-MBBS0013",
  },
  hopkinsG2S: {
    id: "hopkins-genes-to-society",
    title: "Johns Hopkins School of Medicine Genes to Society curriculum",
    url: "https://www.hopkinsmedicine.org/som/curriculum/genes_to_society/year-one/",
  },
  hopkinsCatalogue: {
    id: "hopkins-md-catalogue",
    title: "Johns Hopkins School of Medicine MD programme catalogue",
    url: "https://e-catalogue.jhu.edu/medicine/medical-students/md/md.pdf",
  },
  stanfordHandbook: {
    id: "stanford-preclerkship-courses",
    title: "Stanford MD handbook: required pre-clerkship courses",
    url: "https://med.stanford.edu/md/mdhandbook/section-4--discovery-curriculum-overview/section-4-5-required-pre-clerkship-courses.html",
  },
  stanfordNews: {
    id: "stanford-curriculum-research",
    title: "Stanford Medicine news: new curriculum expands research opportunities",
    url: "https://med.stanford.edu/news/all-news/2018/09/new-med-school-curriculum-expands-opportunities-for-research.html",
  },
} satisfies Record<string, Omit<SourceRef, "type">>;

function provenance(...keys: Array<keyof typeof SOURCES>): CourseProvenance {
  return {
    sources: [
      ...keys.map((key): SourceRef => ({ ...SOURCES[key], type: "institution" })),
      { id: "mindspark-authored", title: "Mindspark authored course structure", type: "authored" },
    ],
    reviewStatus: "draft",
    verified: false,
    note: "Course structure synthesised from published curricula of leading European and US medical schools; wording is original. Not yet clinically reviewed.",
  };
}

type Objectives = [string, string, string];

const unit = (slug: string, name: string, summary: string, objectives: Objectives) => ({
  slug,
  name,
  summary,
  objectives,
});

const mod = (
  slug: string,
  name: string,
  summary: string,
  units: ModuleDraft["units"],
): ModuleDraft => ({ slug, name, summary, units });

const NEURO: ModuleDraft[] = [
  mod("neurons-and-synapses", "Neurons, Synapses and Neurotransmitters", "How nerve cells generate, conduct and transmit signals.", [
    unit("action-potential", "Resting Potential and Action Potential", "Ion gradients, channel behaviour and propagation of the nerve impulse.", [
      "Explain how ion gradients and permeabilities set the resting membrane potential",
      "Describe the phases of an action potential in terms of voltage-gated channel states",
      "Compare conduction speed in myelinated and unmyelinated axons",
    ]),
    unit("synaptic-transmission", "Synaptic Transmission", "Chemical transmission, receptors and synaptic integration.", [
      "Outline the sequence from presynaptic depolarisation to postsynaptic response",
      "Distinguish ionotropic from metabotropic receptors with one example each",
      "Differentiate excitatory from inhibitory postsynaptic potentials and describe summation",
    ]),
    unit("neurotransmitter-systems", "Neurotransmitter Systems", "Major transmitters and the clinical effects of disturbing them.", [
      "Name the principal transmitter of the cholinergic, dopaminergic and GABAergic systems",
      "Relate dopamine depletion in the nigrostriatal pathway to parkinsonian features",
      "Explain how a drug that alters transmitter reuptake changes synaptic signalling",
    ]),
  ]),
  mod("spinal-cord-and-reflexes", "Spinal Cord and Reflexes", "Spinal cord organisation, ascending and descending tracts and reflex arcs.", [
    unit("spinal-cord-anatomy", "Spinal Cord Anatomy and Tracts", "Grey and white matter, and where each tract crosses the midline.", [
      "Identify the dorsal column, spinothalamic and corticospinal tracts on a cord cross-section",
      "State the level at which each of these tracts decussates",
      "Describe the blood supply of the spinal cord and the consequence of anterior spinal artery occlusion",
    ]),
    unit("reflex-arcs", "Reflex Arcs and Muscle Tone", "Stretch and withdrawal reflexes and the difference between upper and lower motor neuron signs.", [
      "Trace the components of the monosynaptic stretch reflex",
      "Contrast upper motor neuron and lower motor neuron lesion signs",
      "Interpret a reduced or exaggerated tendon reflex in terms of the level of the lesion",
    ]),
  ]),
  mod("brainstem-and-cranial-nerves", "Brainstem and Cranial Nerves", "Brainstem structure, cranial nerve nuclei and brainstem syndromes.", [
    unit("brainstem-organisation", "Brainstem Organisation", "Midbrain, pons and medulla, with their nuclei and long tracts.", [
      "Identify the midbrain, pons and medulla and list the cranial nerves attached to each",
      "Describe the function of the reticular formation in arousal and cardiorespiratory control",
      "Explain why small brainstem lesions cause crossed signs",
    ]),
    unit("cranial-nerve-testing", "Cranial Nerve Function and Testing", "Function of cranial nerves I to XII and the bedside examination.", [
      "State the main sensory and motor functions of each cranial nerve",
      "Describe how to test the oculomotor, facial and vagus nerves at the bedside",
      "Localise an isolated cranial nerve palsy to a likely site along its course",
    ]),
  ]),
  mod("cerebral-cortex", "Cerebral Cortex", "Cortical lobes, functional areas, language and the blood supply of the cerebrum.", [
    unit("cortical-areas", "Lobes and Functional Areas", "Motor, sensory, association and language cortex.", [
      "Locate the primary motor and somatosensory cortices and describe their homunculi",
      "Describe the roles of Broca and Wernicke areas in language",
      "Predict the deficit produced by a lesion of the frontal, parietal, temporal or occipital lobe",
    ]),
    unit("cerebral-circulation", "Cerebral Circulation and Stroke", "Arterial territories, the circle of Willis and stroke syndromes.", [
      "Name the territories supplied by the anterior, middle and posterior cerebral arteries",
      "Describe the formation and role of the circle of Willis",
      "Relate a middle cerebral artery infarct to its typical clinical deficits",
    ]),
  ]),
  mod("basal-ganglia-and-cerebellum", "Basal Ganglia and Cerebellum", "Motor control loops that select, refine and coordinate movement.", [
    unit("basal-ganglia", "Basal Ganglia Circuits", "Direct and indirect pathways and movement disorders.", [
      "Name the nuclei that make up the basal ganglia",
      "Contrast the direct and indirect pathways in their effect on thalamocortical output",
      "Relate Parkinson disease and Huntington disease to the circuit changes underlying each",
    ]),
    unit("cerebellar-function", "Cerebellar Function and Lesions", "Coordination, balance and the signs of cerebellar disease.", [
      "Describe the three functional divisions of the cerebellum and their connections",
      "List the signs of a cerebellar hemisphere lesion",
      "Explain why cerebellar signs appear on the same side as the lesion",
    ]),
  ]),
  mod("sensory-systems", "Sensory Systems", "Vision, hearing and somatosensation from receptor to cortex.", [
    unit("visual-system", "Visual System and Visual Pathways", "Retina, optic pathway and visual field defects.", [
      "Describe the pathway from retina to primary visual cortex",
      "Predict the visual field defect caused by a lesion at the optic chiasm",
      "Explain the pupillary light reflex pathway",
    ]),
    unit("auditory-vestibular", "Hearing and Balance", "Cochlear transduction, auditory pathways and the vestibular system.", [
      "Outline sound transduction from the tympanic membrane to the hair cells",
      "Distinguish conductive from sensorineural hearing loss using Rinne and Weber tests",
      "Explain the vestibulo-ocular reflex and the basis of nystagmus",
    ]),
    unit("somatosensation", "Somatosensation", "Touch, proprioception, temperature and pain pathways.", [
      "Classify cutaneous receptors by the modality they detect",
      "Contrast the dorsal column and spinothalamic pathways in modality and decussation",
      "Interpret a dissociated sensory loss to localise a cord lesion",
    ]),
  ]),
  mod("autonomic-nervous-system", "Autonomic Nervous System", "Sympathetic and parasympathetic organisation and control of visceral function.", [
    unit("autonomic-organisation", "Sympathetic and Parasympathetic Organisation", "Outflow, ganglia and transmitters of the two divisions.", [
      "Compare the anatomical outflow of the sympathetic and parasympathetic divisions",
      "State the transmitters and receptor types at preganglionic and postganglionic synapses",
      "Predict the organ-level effects of sympathetic and parasympathetic activation",
    ]),
    unit("autonomic-reflexes", "Autonomic Reflexes and Dysfunction", "Baroreceptor reflex, micturition and autonomic failure.", [
      "Describe the baroreceptor reflex arc and its response to standing",
      "Outline the neural control of bladder filling and voiding",
      "Explain how autonomic failure produces postural hypotension",
    ]),
  ]),
  mod("head-and-neck-anatomy", "Head and Neck Anatomy", "Skull, face, neck, orbit, oral cavity and their neurovascular supply.", [
    unit("skull-and-meninges", "Skull, Meninges and Venous Sinuses", "Cranial fossae, meningeal layers and intracranial haemorrhage.", [
      "Identify the foramina of the cranial fossae and the structures that pass through them",
      "Describe the meningeal layers and the spaces between them",
      "Distinguish extradural, subdural and subarachnoid haemorrhage by their anatomical location",
    ]),
    unit("face-orbit-neck", "Face, Orbit and Neck", "Muscles of the face, orbital contents and the triangles of the neck.", [
      "Describe the motor and sensory innervation of the face",
      "List the extraocular muscles with their nerve supply and actions",
      "Identify the contents of the anterior and posterior triangles of the neck",
    ]),
    unit("oral-cavity-pharynx", "Oral Cavity, Pharynx and Larynx", "Structures of swallowing, speech and the upper airway.", [
      "Describe the stages of swallowing and the muscles and nerves involved",
      "Identify the cartilages and intrinsic muscles of the larynx",
      "Explain the consequence of recurrent laryngeal nerve injury for the voice",
    ]),
  ]),
  mod("sleep-memory-and-pain", "Sleep, Memory and Pain", "Higher functions of the nervous system and their disorders.", [
    unit("sleep-and-arousal", "Sleep and Arousal", "Sleep stages, circadian control and common sleep disorders.", [
      "Describe the electroencephalographic features of the stages of sleep",
      "Explain the role of the suprachiasmatic nucleus in circadian rhythm",
      "Differentiate narcolepsy from obstructive sleep apnoea by mechanism",
    ]),
    unit("memory-systems", "Learning and Memory", "Declarative and procedural memory and the structures that support them.", [
      "Contrast declarative and procedural memory with an example of each",
      "Describe the role of the hippocampus in memory consolidation",
      "Explain long-term potentiation as a cellular model of learning",
    ]),
    unit("pain-pathways", "Pain Pathways and Modulation", "Nociception, referred pain and descending control.", [
      "Differentiate fast and slow pain fibres by type and quality of sensation",
      "Explain the gate control theory and descending pain modulation",
      "Describe the mechanism of referred pain with an example",
    ]),
  ]),
];

const PATHOLOGY: ModuleDraft[] = [
  mod("cell-injury-and-death", "Cell Injury and Death", "How cells respond to stress and how injury becomes irreversible.", [
    unit("causes-of-injury", "Causes and Mechanisms of Cell Injury", "Hypoxia, toxins and oxidative stress as drivers of injury.", [
      "List the main causes of cell injury with one example of each",
      "Explain how ischaemia leads to loss of ATP and cell swelling",
      "Describe the role of free radicals in cell membrane damage",
    ]),
    unit("necrosis-and-apoptosis", "Necrosis and Apoptosis", "Patterns of cell death and their morphology.", [
      "Distinguish necrosis from apoptosis by mechanism and morphology",
      "Identify coagulative, liquefactive, caseous and fat necrosis by their typical setting",
      "Describe the intrinsic and extrinsic pathways that trigger apoptosis",
    ]),
    unit("cellular-adaptation", "Cellular Adaptation", "Hypertrophy, hyperplasia, atrophy and metaplasia.", [
      "Define hypertrophy, hyperplasia, atrophy and metaplasia",
      "Give a physiological and a pathological example of hyperplasia",
      "Explain why metaplasia can predispose to dysplasia and cancer",
    ]),
  ]),
  mod("inflammation", "Acute and Chronic Inflammation", "The vascular and cellular events that defend against injury and infection.", [
    unit("acute-inflammation", "Acute Inflammation", "Vascular changes, neutrophil recruitment and chemical mediators.", [
      "Describe the vascular changes of acute inflammation and their cause",
      "Outline the steps of leucocyte margination, rolling, adhesion and emigration",
      "State the outcomes of acute inflammation, including resolution and abscess formation",
    ]),
    unit("chronic-inflammation", "Chronic Inflammation and Granulomas", "Macrophage-dominated inflammation and granuloma formation.", [
      "Compare the cells and timescale of acute and chronic inflammation",
      "Describe how a granuloma forms and name two diseases that produce them",
      "Explain the systemic features of inflammation, including fever and acute phase proteins",
    ]),
  ]),
  mod("repair-and-fibrosis", "Repair and Fibrosis", "Regeneration, scar formation and the factors that impair healing.", [
    unit("regeneration-and-scarring", "Regeneration and Scar Formation", "Cell types that regenerate and the stages of tissue repair.", [
      "Differentiate labile, stable and permanent cell populations",
      "Describe the stages of wound healing by primary and secondary intention",
      "Explain how granulation tissue matures into a scar",
    ]),
    unit("healing-complications", "Impaired Healing and Pathological Fibrosis", "Systemic and local factors that disturb repair.", [
      "List local and systemic factors that delay wound healing",
      "Describe the pathogenesis of keloid and hypertrophic scarring",
      "Explain how chronic injury leads to organ fibrosis, with cirrhosis as an example",
    ]),
  ]),
  mod("haemodynamics-and-thrombosis", "Haemodynamics, Thrombosis and Shock", "Disorders of blood flow, clotting and circulatory failure.", [
    unit("thrombosis-and-embolism", "Thrombosis and Embolism", "Virchow triad, thrombus fate and embolic sources.", [
      "State the three components of Virchow triad with an example of each",
      "Distinguish a thrombus from a post-mortem clot",
      "Trace the path of an embolus from a deep vein thrombosis to the lungs",
    ]),
    unit("oedema-and-infarction", "Oedema, Congestion and Infarction", "Fluid imbalance and tissue death from vascular occlusion.", [
      "Explain the Starling forces that produce oedema",
      "Differentiate red from pale infarcts by tissue type and mechanism",
      "Describe the pathological changes of chronic passive congestion of the liver",
    ]),
    unit("shock", "Shock", "Types of circulatory failure and their consequences.", [
      "Classify shock as hypovolaemic, cardiogenic, obstructive or distributive",
      "Describe the compensatory mechanisms active in early shock",
      "Explain how prolonged shock leads to multi-organ failure",
    ]),
  ]),
  mod("neoplasia", "Neoplasia", "Tumour biology, behaviour, grading and staging.", [
    unit("tumour-biology", "Benign and Malignant Tumours", "Features that separate benign from malignant growth.", [
      "Contrast benign and malignant tumours by differentiation, growth and spread",
      "Name the main routes of metastasis with one tumour example of each",
      "Explain the terms dysplasia and carcinoma in situ",
    ]),
    unit("carcinogenesis", "Molecular Basis of Cancer", "Oncogenes, tumour suppressors and carcinogens.", [
      "Distinguish oncogenes from tumour suppressor genes with an example of each",
      "Describe the role of TP53 in the response to DNA damage",
      "Explain the multi-step model of carcinogenesis using colorectal cancer",
    ]),
    unit("grading-and-staging", "Grading and Staging", "How tumour extent and differentiation guide prognosis.", [
      "Differentiate tumour grade from tumour stage",
      "Interpret the T, N and M components of the TNM system",
      "Explain why stage is generally the stronger prognostic factor",
    ]),
  ]),
  mod("genetic-and-developmental-disease", "Genetic and Developmental Disease", "Inherited and congenital disorders and their patterns of transmission.", [
    unit("inheritance-patterns", "Patterns of Inheritance", "Mendelian and non-Mendelian transmission of disease.", [
      "Identify autosomal dominant, autosomal recessive and X-linked inheritance from a pedigree",
      "Calculate the recurrence risk for the child of two carriers of a recessive condition",
      "Explain how trinucleotide repeat expansion produces anticipation",
    ]),
    unit("chromosomal-and-congenital", "Chromosomal and Congenital Disorders", "Aneuploidy, structural abnormalities and teratogens.", [
      "Describe the cause and main features of trisomy 21",
      "Distinguish malformation, deformation and disruption",
      "Name three teratogens and the defect each is associated with",
    ]),
  ]),
  mod("ageing-pathology", "Ageing", "Cellular and tissue changes of ageing.", [
    unit("cellular-ageing", "Cellular Mechanisms of Ageing", "Telomere shortening, senescence and accumulated damage.", [
      "Describe the role of telomere shortening in cellular senescence",
      "Explain how accumulated oxidative and DNA damage contribute to ageing",
      "Distinguish normal ageing changes from age-related disease",
    ]),
    unit("tissue-ageing", "Ageing of Tissues and Organs", "Typical age-related changes and their clinical effect.", [
      "List typical age-related changes in the cardiovascular and musculoskeletal systems",
      "Explain why older patients show reduced physiological reserve",
      "Relate sarcopenia to frailty and risk of falls",
    ]),
  ]),
  mod("nutritional-and-environmental-pathology", "Nutritional and Environmental Pathology", "Disease caused by dietary imbalance, toxins and physical agents.", [
    unit("nutritional-disease", "Nutritional Disease", "Deficiency states, malnutrition and obesity.", [
      "Describe the features of kwashiorkor and marasmus",
      "Match vitamin deficiencies to their characteristic clinical syndromes",
      "Explain the metabolic complications associated with obesity",
    ]),
    unit("environmental-injury", "Environmental and Physical Injury", "Toxins, radiation, tobacco, alcohol and thermal injury.", [
      "Describe the pathological effects of chronic tobacco and alcohol exposure",
      "Explain how ionising radiation damages tissue at the cellular level",
      "Outline the local and systemic effects of burns and hypothermia",
    ]),
  ]),
  mod("amyloid-and-deposition", "Amyloidosis and Deposition Diseases", "Abnormal protein and mineral deposition in tissues.", [
    unit("amyloidosis", "Amyloidosis", "Protein misfolding and its organ consequences.", [
      "Explain how protein misfolding leads to amyloid deposition",
      "Distinguish AL from AA amyloidosis by precursor protein and associated disease",
      "Describe the Congo red staining appearance of amyloid under polarised light",
    ]),
    unit("calcification-and-pigments", "Pathological Calcification and Pigments", "Dystrophic and metastatic calcification and intracellular deposits.", [
      "Differentiate dystrophic from metastatic calcification",
      "Describe the pathogenesis of gout as a crystal deposition disease",
      "Identify haemosiderin and lipofuscin by their origin and significance",
    ]),
  ]),
];

const MICRO: ModuleDraft[] = [
  mod("bacterial-structure-and-growth", "Bacterial Structure and Growth", "Bacterial cell architecture, classification and growth dynamics.", [
    unit("bacterial-cell-structure", "Bacterial Cell Structure", "Cell wall, capsule, flagella and genetic elements.", [
      "Contrast the cell wall structure of Gram-positive and Gram-negative bacteria",
      "Describe the role of the capsule and pili in virulence",
      "Explain how plasmids and bacteriophages transfer genes between bacteria",
    ]),
    unit("growth-and-culture", "Bacterial Growth and Laboratory Culture", "Growth phases, culture media and identification.", [
      "Describe the four phases of the bacterial growth curve",
      "Distinguish selective, differential and enriched culture media",
      "Interpret a Gram stain as the first step in bacterial identification",
    ]),
  ]),
  mod("gram-positive-and-negative-pathogens", "Gram-Positive and Gram-Negative Pathogens", "Medically important bacteria and the syndromes they cause.", [
    unit("gram-positive-pathogens", "Gram-Positive Pathogens", "Staphylococci, streptococci, clostridia and related organisms.", [
      "Differentiate Staphylococcus aureus from coagulase-negative staphylococci",
      "Classify streptococci by haemolysis and Lancefield grouping",
      "Describe the toxin-mediated diseases caused by Clostridium species",
    ]),
    unit("gram-negative-pathogens", "Gram-Negative Pathogens", "Enteric bacilli, Neisseria, Pseudomonas and related organisms.", [
      "Name the common Gram-negative causes of urinary tract infection and bacteraemia",
      "Describe the role of lipopolysaccharide endotoxin in septic shock",
      "Link Neisseria meningitidis and Neisseria gonorrhoeae to their clinical syndromes",
    ]),
    unit("atypical-and-mycobacteria", "Mycobacteria and Atypical Bacteria", "Tuberculosis, intracellular organisms and spirochaetes.", [
      "Describe the pathogenesis of primary and reactivated tuberculosis",
      "Explain why acid-fast staining is used for mycobacteria",
      "Name an intracellular bacterial pathogen and the syndrome it causes",
    ]),
  ]),
  mod("viruses", "Viruses", "Viral structure, replication and important human viral diseases.", [
    unit("viral-replication", "Viral Structure and Replication", "Genome types, replication cycle and host cell effects.", [
      "Classify viruses by genome type and presence of an envelope",
      "Outline the stages of the viral replication cycle",
      "Explain how antigenic drift differs from antigenic shift in influenza",
    ]),
    unit("clinical-virology", "Clinically Important Viruses", "Respiratory, hepatitis, herpes and retroviruses.", [
      "Distinguish the hepatitis viruses by transmission route and risk of chronicity",
      "Describe latency and reactivation in herpesvirus infection",
      "Explain how HIV infection leads to progressive immunodeficiency",
    ]),
  ]),
  mod("fungi-and-parasites", "Fungi and Parasites", "Pathogenic fungi, protozoa and helminths.", [
    unit("medical-mycology", "Medical Mycology", "Superficial, subcutaneous and opportunistic fungal infection.", [
      "Differentiate superficial from invasive fungal infections by tissue involved",
      "Identify the patient groups at risk of invasive candidiasis and aspergillosis",
      "Describe the mechanisms of action of azole and polyene antifungals",
    ]),
    unit("parasitology", "Protozoa and Helminths", "Malaria and other major parasitic diseases.", [
      "Describe the life cycle of Plasmodium and the origin of malarial fever",
      "Distinguish nematodes, cestodes and trematodes by morphology and example",
      "Explain how the chosen diagnostic test differs between malaria and intestinal helminthiasis",
    ]),
  ]),
  mod("antimicrobials-and-resistance", "Antimicrobial Mechanisms and Resistance", "How antimicrobials act and how bacteria evade them.", [
    unit("antibiotic-mechanisms", "Antibiotic Classes and Mechanisms", "Targets of beta-lactams, macrolides, quinolones and others.", [
      "Match each major antibiotic class to its cellular target",
      "Distinguish bactericidal from bacteriostatic agents",
      "Choose a logical empirical antibiotic class for a given site of infection and likely organism",
    ]),
    unit("resistance-mechanisms", "Mechanisms of Resistance", "Enzymatic inactivation, target change and efflux.", [
      "Describe how beta-lactamase production confers resistance",
      "Explain the mechanism of methicillin resistance in Staphylococcus aureus",
      "Outline how selection pressure and horizontal gene transfer spread resistance",
    ]),
    unit("antimicrobial-stewardship", "Antimicrobial Stewardship", "Using antimicrobials responsibly to limit resistance.", [
      "State the principles of antimicrobial stewardship",
      "Explain why culture and sensitivity results should guide de-escalation",
      "Describe the risk of Clostridioides difficile infection after broad-spectrum antibiotics",
    ]),
  ]),
  mod("sterilisation-and-infection-control", "Sterilisation and Infection Control", "Preventing the spread of infection in healthcare settings.", [
    unit("sterilisation-methods", "Sterilisation and Disinfection", "Physical and chemical methods of microbial killing.", [
      "Differentiate sterilisation, disinfection and antisepsis",
      "Describe how autoclaving kills microorganisms, including spores",
      "Select an appropriate decontamination method for a given item of equipment",
    ]),
    unit("infection-prevention", "Infection Prevention in Practice", "Standard precautions, isolation and outbreak control.", [
      "Describe the five moments for hand hygiene",
      "Distinguish contact, droplet and airborne transmission-based precautions",
      "Outline the steps taken to investigate a hospital outbreak",
    ]),
  ]),
  mod("sepsis", "Sepsis", "Recognition and management of dysregulated host response to infection.", [
    unit("sepsis-pathophysiology", "Sepsis Pathophysiology", "From infection to organ dysfunction.", [
      "Define sepsis and septic shock",
      "Explain how pathogen-associated molecular patterns trigger the systemic inflammatory response",
      "Describe how vasodilatation and capillary leak cause hypotension in sepsis",
    ]),
    unit("sepsis-recognition", "Recognition and Initial Management", "Early warning, cultures and time-critical therapy.", [
      "Apply an early warning score to identify a deteriorating septic patient",
      "List the elements of an initial sepsis bundle",
      "Explain why blood cultures are taken before antibiotics where this causes no delay",
    ]),
  ]),
  mod("vaccines", "Vaccines", "Principles of immunisation and vaccine types.", [
    unit("vaccine-types", "Vaccine Types and Mechanisms", "Live attenuated, inactivated, subunit and mRNA vaccines.", [
      "Compare live attenuated and inactivated vaccines on immunogenicity and safety",
      "Explain the role of adjuvants and conjugation in vaccine design",
      "Describe how an mRNA vaccine induces an immune response",
    ]),
    unit("immunisation-programmes", "Immunisation Programmes and Herd Immunity", "Population protection and vaccine safety monitoring.", [
      "Explain herd immunity and how the threshold depends on the basic reproduction number",
      "Identify contraindications to live vaccines",
      "Describe how vaccine safety is monitored after licensing",
    ]),
  ]),
  mod("healthcare-associated-and-global-infection", "Healthcare-Associated and Global Infections", "Infections acquired in care settings and infections of global importance.", [
    unit("healthcare-associated-infection", "Healthcare-Associated Infection", "Device-related, surgical-site and ventilator-associated infection.", [
      "Identify the main types of healthcare-associated infection",
      "Describe how biofilms on catheters and lines promote persistent infection",
      "State measures that reduce catheter-associated urinary tract infection",
    ]),
    unit("global-infectious-disease", "Global Infectious Disease", "HIV, tuberculosis, malaria and emerging infections.", [
      "Describe the global burden of HIV, tuberculosis and malaria",
      "Explain how zoonotic spillover leads to emerging infections",
      "Outline the role of surveillance in controlling an epidemic",
    ]),
  ]),
];

const IMMUNO: ModuleDraft[] = [
  mod("innate-immunity-and-complement", "Innate Immunity and Complement", "The first, non-specific lines of defence.", [
    unit("innate-defences", "Barriers, Phagocytes and Pattern Recognition", "Epithelial barriers, neutrophils, macrophages and Toll-like receptors.", [
      "List the physical and chemical barriers that prevent entry of pathogens",
      "Describe how Toll-like receptors recognise pathogen-associated molecular patterns",
      "Explain the steps of phagocytosis and the respiratory burst",
    ]),
    unit("complement-system", "The Complement System", "Classical, alternative and lectin pathways.", [
      "Compare the triggers of the classical, alternative and lectin pathways",
      "Describe the roles of C3b, C5a and the membrane attack complex",
      "Predict the infections associated with inherited complement deficiency",
    ]),
  ]),
  mod("antigen-presentation-and-mhc", "Antigen Presentation and MHC", "How antigens are processed and displayed to T cells.", [
    unit("mhc-molecules", "MHC Class I and Class II Molecules", "Structure, distribution and peptide loading.", [
      "Contrast MHC class I and class II in structure, expression and the T cell subset engaged",
      "Describe the endogenous and exogenous antigen processing pathways",
      "Explain why MHC polymorphism affects disease susceptibility",
    ]),
    unit("antigen-presenting-cells", "Antigen-Presenting Cells", "Dendritic cell activation and migration.", [
      "Describe how dendritic cells capture antigen and migrate to lymph nodes",
      "Explain the need for co-stimulatory signals in T cell activation",
      "Describe the structure and function of lymph nodes in the adaptive response",
    ]),
  ]),
  mod("t-cell-responses", "T-Cell Responses", "T cell development, activation and effector function.", [
    unit("t-cell-development", "T Cell Development and Receptors", "Thymic selection and the T cell receptor.", [
      "Describe positive and negative selection in the thymus",
      "Explain how somatic recombination generates T cell receptor diversity",
      "State the function of CD4 and CD8 co-receptors",
    ]),
    unit("effector-t-cells", "Effector T Cell Functions", "Helper subsets, cytotoxic killing and memory.", [
      "Differentiate Th1, Th2 and Th17 cells by their cytokines and targets",
      "Describe how cytotoxic T cells kill infected cells",
      "Explain the role of regulatory T cells in limiting immune responses",
    ]),
  ]),
  mod("b-cells-and-antibodies", "B Cells and Antibodies", "Humoral immunity and the antibody response.", [
    unit("antibody-structure", "Antibody Structure and Classes", "Immunoglobulin domains and class-specific functions.", [
      "Identify the antigen-binding and effector regions of an immunoglobulin molecule",
      "Match IgG, IgM, IgA, IgE and IgD to their principal roles",
      "Explain how class switching and somatic hypermutation shape the response",
    ]),
    unit("humoral-response", "Primary and Secondary Humoral Response", "B cell activation and immunological memory.", [
      "Describe the events of T-dependent B cell activation in the germinal centre",
      "Compare the kinetics of primary and secondary antibody responses",
      "Explain how maternal IgG provides passive immunity to the newborn",
    ]),
  ]),
  mod("tolerance-and-autoimmunity", "Tolerance and Autoimmunity", "How the body avoids self-attack and what happens when it fails.", [
    unit("immune-tolerance", "Central and Peripheral Tolerance", "Mechanisms that eliminate or silence self-reactive lymphocytes.", [
      "Distinguish central from peripheral tolerance",
      "Describe the role of AIRE in thymic tolerance",
      "Explain how anergy and regulatory T cells maintain peripheral tolerance",
    ]),
    unit("autoimmune-disease", "Autoimmune Disease", "Organ-specific and systemic autoimmunity.", [
      "Contrast organ-specific and systemic autoimmune disease with examples",
      "Describe how molecular mimicry may trigger autoimmunity",
      "Match common autoantibodies to the diseases they support, such as anti-dsDNA and anti-CCP",
    ]),
  ]),
  mod("hypersensitivity", "Hypersensitivity", "Immune responses that cause tissue damage.", [
    unit("hypersensitivity-types", "Gell and Coombs Types I to IV", "Mechanisms and examples of each hypersensitivity type.", [
      "Classify a clinical reaction into hypersensitivity types I to IV by its mechanism",
      "Describe the mast cell events in an IgE-mediated type I reaction",
      "Give one clinical example of each hypersensitivity type",
    ]),
    unit("allergy-and-anaphylaxis", "Allergy and Anaphylaxis", "Atopy, anaphylaxis and its treatment.", [
      "Describe the features and first-line treatment of anaphylaxis",
      "Explain why adrenaline is given intramuscularly in anaphylaxis",
      "Outline the principles of allergen testing and desensitisation",
    ]),
  ]),
  mod("transplantation", "Transplantation Immunology", "Immune recognition of grafts and its control.", [
    unit("graft-rejection", "Graft Rejection and HLA Matching", "Hyperacute, acute and chronic rejection.", [
      "Distinguish hyperacute, acute and chronic rejection by timing and mechanism",
      "Explain the importance of ABO and HLA matching",
      "Describe how graft-versus-host disease arises after haematopoietic transplantation",
    ]),
    unit("immunosuppression", "Immunosuppression", "Drugs used to prevent rejection and their hazards.", [
      "Name the main classes of immunosuppressive drugs and their targets",
      "Explain why transplant recipients have increased infection and cancer risk",
      "Describe why calcineurin inhibitor levels are monitored",
    ]),
  ]),
  mod("immunodeficiency", "Immunodeficiency", "Primary and acquired failure of immune defence.", [
    unit("primary-immunodeficiency", "Primary Immunodeficiency", "Inherited defects of B cells, T cells, phagocytes and complement.", [
      "Match a pattern of recurrent infection to the likely arm of immunity affected",
      "Describe the features of X-linked agammaglobulinaemia and severe combined immunodeficiency",
      "Explain why live vaccines are contraindicated in severe T cell deficiency",
    ]),
    unit("secondary-immunodeficiency", "Secondary Immunodeficiency", "Acquired causes including HIV, drugs and malnutrition.", [
      "List common causes of secondary immunodeficiency",
      "Use CD4 count to stage the risk of opportunistic infection in HIV",
      "Identify opportunistic infections characteristic of profound T cell deficiency",
    ]),
  ]),
  mod("immunotherapy-and-vaccines", "Immunotherapy and Vaccines", "Therapeutic manipulation of the immune system.", [
    unit("monoclonal-antibodies", "Monoclonal Antibodies and Biologics", "Targeted antibody therapy in inflammatory disease and cancer.", [
      "Explain how monoclonal antibodies are produced and named by origin",
      "Describe the mechanism of anti-TNF therapy in inflammatory disease",
      "Identify infection screening needed before biologic therapy",
    ]),
    unit("cancer-immunotherapy", "Immune Surveillance and Cancer Immunotherapy", "Checkpoint inhibition and cellular therapies.", [
      "Describe how tumours evade immune surveillance",
      "Explain the mechanism of PD-1 and CTLA-4 checkpoint inhibitors",
      "Outline the principle of CAR T cell therapy",
    ]),
  ]),
];

const PHARM: ModuleDraft[] = [
  mod("pharmacokinetics", "Pharmacokinetics (ADME)", "What the body does to a drug: absorption, distribution, metabolism and excretion.", [
    unit("absorption-and-distribution", "Absorption and Distribution", "Routes of administration, bioavailability and volume of distribution.", [
      "Compare routes of administration by speed of onset and bioavailability",
      "Calculate the volume of distribution from dose and plasma concentration",
      "Explain how plasma protein binding affects drug distribution",
    ]),
    unit("clearance-and-half-life", "Clearance, Half-Life and Steady State", "Core pharmacokinetic parameters and dosing.", [
      "Calculate half-life from clearance and volume of distribution",
      "Estimate the time to reach steady state after starting regular dosing",
      "Determine a loading dose and a maintenance dose from target concentration",
    ]),
    unit("elimination-kinetics", "First-Order and Zero-Order Elimination", "Linear and saturable elimination.", [
      "Distinguish first-order from zero-order elimination with an example drug",
      "Explain why phenytoin shows disproportionate rises in level after small dose increases",
      "Describe how renal impairment alters dosing of renally cleared drugs",
    ]),
  ]),
  mod("pharmacodynamics-and-receptors", "Pharmacodynamics and Receptors", "What a drug does to the body: receptor binding and response.", [
    unit("receptor-theory", "Receptor Theory", "Agonists, antagonists and receptor families.", [
      "Differentiate full agonist, partial agonist, antagonist and inverse agonist",
      "Compare ligand-gated channels, G-protein-coupled, kinase-linked and nuclear receptors",
      "Describe the effect of a competitive antagonist on an agonist dose-response curve",
    ]),
    unit("signal-transduction", "Signal Transduction and Tolerance", "Second messengers, desensitisation and tolerance.", [
      "Trace a G-protein-coupled receptor signal through cAMP to a cellular response",
      "Explain receptor desensitisation and down-regulation",
      "Distinguish tolerance, dependence and tachyphylaxis",
    ]),
  ]),
  mod("dose-response-and-therapeutic-index", "Dose-Response and Therapeutic Index", "Quantifying drug potency, efficacy and safety.", [
    unit("dose-response-curves", "Dose-Response Relationships", "Potency, efficacy, EC50 and graded response.", [
      "Read potency and maximal efficacy from a dose-response curve",
      "Differentiate potency from efficacy when comparing two drugs",
      "Explain the use of a logarithmic dose axis",
    ]),
    unit("therapeutic-index", "Therapeutic Index and Drug Monitoring", "Narrow therapeutic index drugs and therapeutic drug monitoring.", [
      "Define therapeutic index and explain its limits as a safety measure",
      "Name three drugs with a narrow therapeutic index",
      "Identify when therapeutic drug monitoring is indicated and when to sample",
    ]),
  ]),
  mod("drug-metabolism-and-interactions", "Drug Metabolism and Interactions", "Biotransformation and the interactions that follow from it.", [
    unit("phase-metabolism", "Phase I and Phase II Metabolism", "Cytochrome P450 and conjugation reactions.", [
      "Distinguish phase I oxidation from phase II conjugation reactions",
      "Describe the first-pass effect and its impact on oral bioavailability",
      "Explain what is meant by a prodrug with one example",
    ]),
    unit("interaction-mechanisms", "Mechanisms of Drug Interactions", "Enzyme induction, inhibition and pharmacodynamic interaction.", [
      "Give an example of an enzyme inducer and an enzyme inhibitor and their effect on a substrate",
      "Explain the interaction between warfarin and a CYP inhibitor such as a macrolide",
      "Distinguish pharmacokinetic from pharmacodynamic drug interactions",
    ]),
  ]),
  mod("adverse-drug-reactions", "Adverse Drug Reactions", "Classification, recognition and reporting of drug harm.", [
    unit("adverse-reaction-types", "Type A and Type B Reactions", "Predictable and idiosyncratic adverse effects.", [
      "Classify an adverse reaction as type A (augmented) or type B (bizarre) with examples",
      "Describe common drug-induced organ toxicities such as hepatotoxicity and nephrotoxicity",
      "Explain how teratogenic drugs are identified and avoided in pregnancy",
    ]),
    unit("reporting-adverse-reactions", "Detecting and Reporting Adverse Reactions", "Causality assessment and spontaneous reporting.", [
      "Apply a basic causality assessment to a suspected adverse reaction",
      "Describe how spontaneous reporting systems detect new safety signals",
      "Explain how a patient is counselled after a suspected drug allergy",
    ]),
  ]),
  mod("autonomic-pharmacology", "Autonomic Pharmacology", "Drugs acting at adrenergic and cholinergic synapses.", [
    unit("adrenergic-drugs", "Adrenergic Agonists and Antagonists", "Alpha and beta receptor pharmacology.", [
      "Match adrenoceptor subtypes to their principal tissue effects",
      "Explain why beta-blockers lower heart rate and blood pressure",
      "Describe the cautions for non-selective beta-blockers in asthma",
    ]),
    unit("cholinergic-drugs", "Cholinergic and Anticholinergic Drugs", "Muscarinic and nicotinic pharmacology.", [
      "Describe the effects of muscarinic antagonists such as atropine",
      "Explain how acetylcholinesterase inhibitors act in myasthenia gravis",
      "List the features of anticholinergic toxicity",
    ]),
  ]),
  mod("prescribing-basics", "Prescribing Basics and Safe Use", "Writing a safe, clear and appropriate prescription.", [
    unit("prescription-writing", "Writing a Prescription", "Legal and safe prescription components.", [
      "List the essential elements of a complete inpatient prescription",
      "Use approved generic drug names and unambiguous dose units",
      "Convert between units such as micrograms and milligrams without error",
    ]),
    unit("safe-prescribing", "Safe Prescribing and High-Risk Drugs", "Medication errors, high-risk drugs and special populations.", [
      "Identify high-risk drug classes including anticoagulants, insulin and opioids",
      "Adjust a prescription for renal impairment, pregnancy or older age",
      "Explain the role of medicines reconciliation on admission",
    ]),
  ]),
  mod("pharmacogenomics", "Pharmacogenomics", "Genetic variation in drug response.", [
    unit("pharmacogenetic-variants", "Pharmacogenetic Variants", "Polymorphisms that alter metabolism and sensitivity.", [
      "Explain how CYP2D6 and CYP2C19 polymorphisms alter drug response",
      "Describe the role of TPMT testing before thiopurine therapy",
      "State why HLA-B*5701 testing precedes abacavir treatment",
    ]),
    unit("personalised-prescribing", "Towards Personalised Prescribing", "Using genotype to guide drug choice and dose.", [
      "Outline how a genotype result may change drug choice or dose",
      "Discuss the limits and cost considerations of routine pharmacogenetic testing",
      "Explain the ethical issues in storing and using patient genetic data",
    ]),
  ]),
];

const SYSTEMS: ModuleDraft[] = [
  mod("cardiovascular-disease", "Cardiovascular Disease", "Ischaemic heart disease, heart failure, arrhythmia and hypertension.", [
    unit("ischaemic-heart-disease", "Ischaemic Heart Disease", "Atherosclerosis, angina and myocardial infarction.", [
      "Describe the pathogenesis of an atherosclerotic plaque and plaque rupture",
      "Differentiate stable angina, unstable angina and myocardial infarction",
      "Interpret a troponin rise and ST-segment elevation in a patient with chest pain",
    ]),
    unit("heart-failure-and-arrhythmia", "Heart Failure and Arrhythmia", "Pump failure and rhythm disturbance.", [
      "Distinguish heart failure with reduced from preserved ejection fraction",
      "Explain the neurohormonal activation in chronic heart failure",
      "Recognise atrial fibrillation on an electrocardiogram and state its main complication",
    ]),
    unit("hypertension", "Hypertension", "Causes, effects and treatment of raised blood pressure.", [
      "Differentiate primary from secondary causes of hypertension",
      "Describe the end-organ damage caused by sustained hypertension",
      "Match first-line antihypertensive classes to their mechanisms",
    ]),
  ]),
  mod("respiratory-disease", "Respiratory Disease", "Obstructive, restrictive and neoplastic lung disease.", [
    unit("obstructive-lung-disease", "Asthma and COPD", "Airway inflammation and airflow obstruction.", [
      "Compare the pathophysiology of asthma and chronic obstructive pulmonary disease",
      "Interpret an obstructive pattern on spirometry using FEV1 and FVC",
      "Match bronchodilator and anti-inflammatory drug classes to their mechanisms",
    ]),
    unit("restrictive-and-neoplastic-lung", "Interstitial Lung Disease and Lung Cancer", "Fibrosing lung disease and primary lung tumours.", [
      "Describe a restrictive spirometry pattern and the reduced gas transfer seen in interstitial disease",
      "Name the main histological types of lung cancer and their association with smoking",
      "Identify the features of a lung mass on chest radiography",
    ]),
  ]),
  mod("renal-and-fluid-disorders", "Renal and Fluid Disorders", "Kidney injury, glomerular disease and disorders of fluid and electrolytes.", [
    unit("acute-and-chronic-kidney-disease", "Acute Kidney Injury and Chronic Kidney Disease", "Causes, classification and consequences of renal failure.", [
      "Classify acute kidney injury as prerenal, intrinsic or postrenal with causes",
      "Describe the staging of chronic kidney disease by eGFR and albuminuria",
      "List the metabolic complications of advanced renal failure",
    ]),
    unit("electrolyte-disorders", "Electrolyte and Acid-Base Disorders", "Sodium, potassium and acid-base disturbance.", [
      "Outline a diagnostic approach to hyponatraemia using volume status",
      "State the electrocardiogram changes of hyperkalaemia and the emergency treatment",
      "Interpret an arterial blood gas to identify a metabolic or respiratory acid-base disorder",
    ]),
  ]),
  mod("gastrointestinal-and-liver-disease", "Gastrointestinal and Liver Disease", "Disorders of the gut, liver and pancreas.", [
    unit("gastrointestinal-disease", "Upper and Lower Gastrointestinal Disease", "Peptic ulcer, inflammatory bowel disease and colorectal cancer.", [
      "Describe the role of Helicobacter pylori and NSAIDs in peptic ulcer disease",
      "Distinguish Crohn disease from ulcerative colitis by distribution and histology",
      "Identify alarm symptoms that prompt investigation for colorectal cancer",
    ]),
    unit("liver-disease", "Liver Disease", "Hepatitis, cirrhosis and their complications.", [
      "Differentiate pre-hepatic, hepatic and post-hepatic jaundice using liver function tests",
      "Describe the causes and complications of cirrhosis including portal hypertension",
      "Explain how hepatic encephalopathy develops",
    ]),
  ]),
  mod("endocrine-and-metabolic-disease", "Endocrine and Metabolic Disease", "Disorders of hormone production and energy metabolism.", [
    unit("diabetes-mellitus", "Diabetes Mellitus", "Type 1 and type 2 diabetes and their complications.", [
      "Contrast the pathogenesis of type 1 and type 2 diabetes",
      "Describe the microvascular and macrovascular complications of diabetes",
      "Explain the mechanism and initial management of diabetic ketoacidosis",
    ]),
    unit("thyroid-and-adrenal-disease", "Thyroid, Adrenal and Pituitary Disease", "Hormone excess and deficiency states.", [
      "Differentiate primary hypothyroidism from hyperthyroidism by clinical features and thyroid function tests",
      "Describe the features and causes of Cushing syndrome and Addison disease",
      "Explain the negative feedback loop of the hypothalamic-pituitary-adrenal axis",
    ]),
  ]),
  mod("haematological-disease", "Haematology", "Disorders of red cells, white cells and haemostasis.", [
    unit("anaemia", "Anaemia", "Classification by red cell size and cause.", [
      "Classify anaemia as microcytic, normocytic or macrocytic with causes of each",
      "Interpret iron studies to separate iron deficiency from anaemia of chronic disease",
      "Explain the mechanism of vitamin B12 deficiency in pernicious anaemia",
    ]),
    unit("haemostasis-and-malignancy", "Haemostasis and Haematological Malignancy", "Bleeding, clotting disorders and leukaemia.", [
      "Distinguish the extrinsic and intrinsic pathways using PT and APTT",
      "Describe the mechanism of action of warfarin and of direct oral anticoagulants",
      "Differentiate acute from chronic leukaemia by cell maturity and tempo",
    ]),
  ]),
  mod("musculoskeletal-and-rheumatology", "Musculoskeletal Disease and Rheumatology", "Joint, bone and connective tissue disorders.", [
    unit("arthritis", "Osteoarthritis, Rheumatoid Arthritis and Gout", "Degenerative, autoimmune and crystal arthropathies.", [
      "Contrast osteoarthritis and rheumatoid arthritis in pattern of joint involvement and pathology",
      "Describe the crystals and joint fluid findings in gout and pseudogout",
      "Name the main classes of disease-modifying and anti-inflammatory drugs in arthritis",
    ]),
    unit("bone-and-connective-tissue-disease", "Bone and Connective Tissue Disease", "Osteoporosis, fractures and systemic lupus erythematosus.", [
      "Explain the pathogenesis of osteoporosis and its fracture risk",
      "Describe the stages of fracture healing",
      "List the multisystem features of systemic lupus erythematosus",
    ]),
  ]),
  mod("dermatology-basics", "Dermatology Basics", "Common skin conditions and skin cancer.", [
    unit("inflammatory-skin-disease", "Inflammatory Skin Disease", "Eczema, psoriasis and acne.", [
      "Describe the distribution and morphology of eczema and psoriasis",
      "Use correct dermatological terms such as macule, papule, plaque and vesicle",
      "Match topical treatments to common inflammatory skin conditions",
    ]),
    unit("skin-cancer", "Skin Cancer", "Basal cell carcinoma, squamous cell carcinoma and melanoma.", [
      "Differentiate basal cell carcinoma, squamous cell carcinoma and melanoma by behaviour",
      "Apply the ABCDE criteria to assess a pigmented lesion",
      "Explain the role of ultraviolet exposure and Breslow thickness in melanoma",
    ]),
  ]),
  mod("reproductive-and-breast-disease", "Reproductive and Breast Disease", "Disorders of the reproductive tract and breast.", [
    unit("gynaecological-disease", "Gynaecological and Obstetric Disorders", "Cervical, ovarian and endometrial disease and pregnancy complications.", [
      "Describe the role of human papillomavirus in cervical carcinogenesis and screening",
      "Differentiate benign from malignant ovarian lesions by presentation",
      "Define pre-eclampsia and describe its main features",
    ]),
    unit("breast-and-prostate-disease", "Breast and Prostate Disease", "Common benign and malignant lesions.", [
      "Describe the triple assessment of a breast lump",
      "Explain the significance of oestrogen receptor and HER2 status in breast cancer",
      "Outline the benefits and harms of PSA testing for prostate cancer",
    ]),
  ]),
];

const PSYCH: ModuleDraft[] = [
  mod("cognition-and-perception", "Cognition and Perception", "How people attend, perceive, remember and decide.", [
    unit("attention-and-perception", "Attention and Perception", "Selective attention and perceptual organisation.", [
      "Describe the processes of selective and divided attention",
      "Explain how top-down expectations influence perception",
      "Identify cognitive features that can contribute to diagnostic error",
    ]),
    unit("memory-and-decision-making", "Memory and Clinical Decision-Making", "Memory systems and heuristics in reasoning.", [
      "Distinguish working memory from long-term memory",
      "Describe how anchoring and availability bias distort clinical judgement",
      "Explain how cognitive impairment is screened in a clinical setting",
    ]),
  ]),
  mod("learning-and-behaviour-change", "Learning and Behaviour Change", "Learning theory and models used to change health behaviour.", [
    unit("learning-theory", "Learning Theory", "Classical conditioning, operant conditioning and social learning.", [
      "Distinguish classical from operant conditioning with a clinical example of each",
      "Explain how phobias can be acquired and treated through exposure",
      "Describe the role of modelling in social learning",
    ]),
    unit("behaviour-change-models", "Behaviour Change Models", "Stages of change and motivational interviewing.", [
      "Apply the stages of change model to a patient who smokes",
      "Describe the core techniques of motivational interviewing",
      "Use the health belief model to explain why a patient does not attend screening",
    ]),
  ]),
  mod("stress-coping-and-illness-behaviour", "Stress, Coping and Illness Behaviour", "How people respond to stress and to being ill.", [
    unit("stress-response", "Stress and Coping", "Physiological stress response and coping strategies.", [
      "Describe the physiological stress response through the sympathetic and HPA axes",
      "Distinguish problem-focused from emotion-focused coping",
      "Explain how chronic stress can affect physical health",
    ]),
    unit("illness-behaviour", "Illness Behaviour and the Sick Role", "Help-seeking, adjustment to illness and medically unexplained symptoms.", [
      "Define illness behaviour and the sick role",
      "Describe the stages of adjustment to a serious diagnosis",
      "Identify features of somatic symptom presentations without dismissing physical causes",
    ]),
  ]),
  mod("mood-and-anxiety-disorders", "Mood and Anxiety Disorders", "Depression, bipolar disorder and anxiety disorders.", [
    unit("depression-and-bipolar", "Depression and Bipolar Disorder", "Diagnosis, risk assessment and treatment.", [
      "List the core and associated symptoms required for a diagnosis of depression",
      "Distinguish bipolar disorder from unipolar depression",
      "Perform a structured assessment of suicide risk",
    ]),
    unit("anxiety-disorders", "Anxiety Disorders", "Generalised anxiety, panic, phobia and obsessive-compulsive disorder.", [
      "Differentiate generalised anxiety disorder, panic disorder and specific phobia by presentation",
      "Describe the first-line psychological and drug treatments for anxiety disorders",
      "Identify physical illnesses and drugs that can mimic anxiety",
    ]),
  ]),
  mod("psychosis", "Psychosis", "Schizophrenia and related disorders.", [
    unit("schizophrenia", "Schizophrenia", "Positive, negative and cognitive features.", [
      "Differentiate positive from negative symptoms of schizophrenia",
      "Describe the dopamine hypothesis and its link to antipsychotic action",
      "Explain how first-episode psychosis is assessed and managed",
    ]),
    unit("antipsychotic-treatment", "Antipsychotic Treatment and Organic Causes", "Drug effects, monitoring and mimics of psychosis.", [
      "Compare typical and atypical antipsychotics on adverse effect profile",
      "Identify the metabolic monitoring required during antipsychotic treatment",
      "List organic and drug-induced causes of acute psychosis",
    ]),
  ]),
  mod("substance-use", "Substance Use", "Alcohol, drugs and dependence.", [
    unit("alcohol-use", "Alcohol Use and Dependence", "Screening, withdrawal and complications.", [
      "Use a brief screening tool such as AUDIT to assess alcohol use",
      "Describe the features and timeline of alcohol withdrawal",
      "Explain why thiamine is given to patients at risk of Wernicke encephalopathy",
    ]),
    unit("drug-misuse", "Drug Misuse and Harm Reduction", "Opioids, stimulants and treatment approaches.", [
      "Describe the effects and withdrawal features of opioid and stimulant use",
      "Explain how opioid substitution therapy reduces harm",
      "Discuss a non-judgemental approach to history-taking about drug use",
    ]),
  ]),
  mod("health-beliefs-and-adherence", "Health Beliefs and Adherence", "Why patients do or do not follow advice.", [
    unit("health-beliefs", "Health Beliefs and Illness Perceptions", "Patient models of illness and their effect on behaviour.", [
      "Describe the domains of the common-sense model of illness perception",
      "Explore a patient's ideas, concerns and expectations in a consultation",
      "Explain how culture and social context shape health beliefs",
    ]),
    unit("medication-adherence", "Medication Adherence", "Causes of non-adherence and ways to support it.", [
      "Differentiate intentional from unintentional non-adherence",
      "Identify practical and perceptual barriers to taking medicines",
      "Propose strategies to improve adherence in a chronic condition",
    ]),
  ]),
  mod("mental-capacity-and-consent", "Mental Capacity and Consent", "Assessing decision-making ability and obtaining valid consent.", [
    unit("capacity-assessment", "Assessing Mental Capacity", "The functional test of capacity.", [
      "State the four abilities assessed in a functional test of capacity",
      "Explain why capacity is decision-specific and time-specific",
      "Describe how to support a patient to make their own decision",
    ]),
    unit("consent-and-mental-health-law", "Consent and Mental Health Legislation", "Valid consent and compulsory treatment.", [
      "List the elements of valid consent",
      "Describe the circumstances in which treatment may be given to a patient who lacks capacity",
      "Outline the principle behind compulsory admission under mental health legislation",
    ]),
  ]),
];

const SKILLS2: ModuleDraft[] = [
  mod("neurological-and-msk-examination", "Neurological and Musculoskeletal Examination", "Systematic examination of the nervous and locomotor systems.", [
    unit("neurological-examination", "Neurological Examination", "Cranial nerves, tone, power, reflexes and sensation.", [
      "Perform a structured examination of the cranial nerves",
      "Grade muscle power using the MRC scale and test tone and reflexes in the limbs",
      "Interpret a combination of findings as an upper or lower motor neuron pattern",
    ]),
    unit("musculoskeletal-examination", "Musculoskeletal Examination", "The look, feel, move approach to joints and the spine.", [
      "Apply the look, feel, move framework to a joint",
      "Perform an examination of the knee including special tests",
      "Screen the spine and gait using the GALS approach",
    ]),
  ]),
  mod("breaking-bad-news", "Breaking Bad News", "Communicating serious information with honesty and compassion.", [
    unit("bad-news-frameworks", "Frameworks for Breaking Bad News", "Preparation, delivery and follow-up.", [
      "Describe the steps of a recognised framework such as SPIKES",
      "Prepare the setting and check a patient's understanding before sharing news",
      "Use a warning shot and plain language when delivering difficult information",
    ]),
    unit("responding-to-emotion", "Responding to Emotion", "Empathic responses and managing strong reactions.", [
      "Identify and name a patient's emotional response in a consultation",
      "Use empathic statements and silence appropriately",
      "Agree a clear plan for next steps and support at the end of the conversation",
    ]),
  ]),
  mod("clinical-reasoning-intro", "Introduction to Clinical Reasoning", "Moving from a presenting problem to a differential diagnosis.", [
    unit("hypothesis-generation", "Hypothesis Generation and Problem Representation", "Forming and refining a differential diagnosis.", [
      "Summarise a presentation as a one-line problem representation",
      "Generate a differential diagnosis ranked by likelihood and by danger",
      "Choose history questions that discriminate between competing diagnoses",
    ]),
    unit("investigation-selection", "Selecting and Interpreting Investigations", "Pre-test probability and the purpose of a test.", [
      "Explain how pre-test probability affects the usefulness of a test result",
      "Select first-line investigations for a common presentation",
      "Avoid common reasoning errors such as premature closure",
    ]),
  ]),
  mod("prescribing-and-drug-charts", "Prescribing and Drug Charts", "Reading and writing inpatient prescriptions.", [
    unit("drug-chart-reading", "Reading a Drug Chart", "Interpreting regular, once-only and as-required prescriptions.", [
      "Identify the patient details, allergy status and prescriber details on a drug chart",
      "Distinguish regular, as-required and once-only prescriptions",
      "Detect a prescribing error such as a missing dose or unit",
    ]),
    unit("writing-prescriptions", "Writing and Reviewing Prescriptions", "Practising accurate prescribing.", [
      "Write a complete prescription for a common drug in a simulated case",
      "Review a patient's chart to stop or adjust unneeded medicines",
      "Calculate a weight-based or renally adjusted dose",
    ]),
  ]),
  mod("practical-procedures", "Venepuncture and Injection Practice", "Safe performance of basic invasive procedures.", [
    unit("venepuncture", "Venepuncture and Cannulation", "Preparation, technique and aseptic practice.", [
      "Prepare equipment and apply aseptic non-touch technique for venepuncture",
      "Obtain informed consent and explain a procedure to a patient",
      "Respond appropriately to a needlestick injury",
    ]),
    unit("injection-techniques", "Injection Techniques", "Subcutaneous and intramuscular injection.", [
      "Identify safe sites for subcutaneous and intramuscular injection",
      "Describe the technique and disposal of sharps",
      "Document an administered injection accurately",
    ]),
  ]),
  mod("safeguarding", "Safeguarding", "Recognising and responding to vulnerability and abuse.", [
    unit("child-safeguarding", "Safeguarding Children", "Recognising signs of abuse and neglect.", [
      "List features in a history or examination that raise concern for child abuse",
      "Describe the duty to share concerns and the local referral route",
      "Explain how to document a safeguarding concern factually",
    ]),
    unit("adult-safeguarding", "Safeguarding Vulnerable Adults", "Recognising abuse, neglect and domestic violence.", [
      "Identify forms of abuse affecting vulnerable adults",
      "Ask about domestic abuse sensitively and in private",
      "Describe when confidentiality may be breached to protect an individual",
    ]),
  ]),
  mod("multidisciplinary-teamwork", "Multidisciplinary Teamwork", "Working effectively with other health professionals.", [
    unit("team-roles", "Roles within the Healthcare Team", "Who does what and when to involve them.", [
      "Describe the roles of nurses, pharmacists, physiotherapists and social workers in patient care",
      "Make a clear referral to another professional",
      "Explain how effective team communication reduces patient harm",
    ]),
    unit("handover-and-communication", "Structured Communication", "SBAR and closed-loop communication.", [
      "Present information using the SBAR format",
      "Use closed-loop communication when receiving an instruction",
      "Escalate a concern assertively and respectfully",
    ]),
  ]),
  mod("case-presentation", "Case Presentation", "Presenting a patient concisely and accurately.", [
    unit("structured-presentation", "Structuring a Case Presentation", "History, examination, impression and plan.", [
      "Deliver a case presentation in a standard sequence within three minutes",
      "Select the pertinent positives and negatives for a presenting complaint",
      "Offer a prioritised differential diagnosis and a management plan",
    ]),
    unit("presentation-feedback", "Receiving Feedback and Reflecting", "Using feedback to improve.", [
      "Receive feedback on a presentation without defensiveness",
      "Identify two specific points for improvement after a presentation",
      "Record reflection in a portfolio using a structured model",
    ]),
  ]),
];

const ADV_PATH: ModuleDraft[] = [
  mod("systemic-pathology", "Organ-Focused Systemic Pathology", "Disease patterns in individual organs studied at tissue level.", [
    unit("cardiorespiratory-pathology", "Cardiovascular and Respiratory Pathology", "Tissue changes in heart and lung disease.", [
      "Describe the gross and microscopic changes of myocardial infarction over time",
      "Compare the pathology of emphysema and chronic bronchitis",
      "Identify the histological features of pneumonia and pulmonary fibrosis",
    ]),
    unit("gastro-renal-pathology", "Gastrointestinal, Hepatic and Renal Pathology", "Tissue changes in gut, liver and kidney disease.", [
      "Describe the histological features of cirrhosis and chronic hepatitis",
      "Distinguish nephritic from nephrotic glomerular disease by pathology and clinical features",
      "Explain the pathological basis of the adenoma-carcinoma sequence",
    ]),
  ]),
  mod("cancer-biology-and-oncology", "Cancer Biology and Oncology Principles", "Biology of cancer and the principles of its treatment.", [
    unit("hallmarks-of-cancer", "Hallmarks of Cancer", "Capabilities acquired by malignant cells.", [
      "List the hallmarks of cancer with a mechanism for each",
      "Explain tumour angiogenesis and its therapeutic targeting",
      "Describe clonal evolution and tumour heterogeneity",
    ]),
    unit("oncology-treatment-principles", "Principles of Cancer Treatment", "Surgery, radiotherapy, chemotherapy and targeted therapy.", [
      "Compare curative and palliative treatment intent",
      "Describe the mechanism and main toxicities of a cytotoxic chemotherapy class",
      "Explain the role of the multidisciplinary tumour board in treatment planning",
    ]),
  ]),
  mod("diagnostic-histopathology", "Diagnostic Histopathology and Cytology", "How tissue and cell samples are processed and reported.", [
    unit("specimen-processing", "Specimen Handling and Staining", "From biopsy to slide.", [
      "Outline the steps from fixation to haematoxylin and eosin staining",
      "Explain why correct specimen labelling and fixation matter",
      "Differentiate biopsy, resection and cytology specimens",
    ]),
    unit("interpreting-pathology-reports", "Interpreting Pathology Reports", "Understanding grade, margins and immunohistochemistry.", [
      "Extract tumour type, grade, stage and margin status from a pathology report",
      "Explain the use of immunohistochemistry in diagnosis and treatment selection",
      "Describe how cervical cytology screening detects pre-malignant change",
    ]),
  ]),
  mod("chemical-pathology", "Chemical Pathology and Laboratory Medicine", "Biochemical and haematological tests in diagnosis and monitoring.", [
    unit("laboratory-test-interpretation", "Interpreting Common Blood Tests", "Urea and electrolytes, liver tests and cardiac markers.", [
      "Interpret a urea and electrolytes result in the context of kidney function",
      "Distinguish hepatocellular from cholestatic patterns on liver function tests",
      "Explain the time course and use of troponin in suspected myocardial infarction",
    ]),
    unit("reference-ranges-and-error", "Reference Ranges and Sources of Error", "Why results are not always abnormal when flagged.", [
      "Explain how reference ranges are derived and why 5% of healthy people fall outside them",
      "Identify pre-analytical causes of spurious results such as haemolysis",
      "Describe the effect of sensitivity and specificity on a diagnostic test",
    ]),
  ]),
  mod("clinical-pharmacology-by-class", "Clinical Pharmacology by Drug Class", "Mechanism, indication and hazards of major drug classes.", [
    unit("cardiovascular-drugs", "Cardiovascular Drugs", "Antihypertensives, antiplatelets, anticoagulants and lipid-lowering drugs.", [
      "Compare ACE inhibitors, ARBs, calcium channel blockers and thiazides by mechanism and adverse effects",
      "Explain the rationale for dual antiplatelet therapy after an acute coronary syndrome",
      "Describe the mechanism of statins and their main adverse effects",
    ]),
    unit("endocrine-and-cns-drugs", "Endocrine and Central Nervous System Drugs", "Antidiabetics, analgesics and psychotropics.", [
      "Compare insulin, metformin and SGLT2 inhibitors by mechanism and risk",
      "Apply the analgesic ladder to the treatment of pain",
      "Describe the mechanism and key adverse effects of SSRIs",
    ]),
  ]),
  mod("pharmacovigilance", "Pharmacovigilance", "Monitoring the safety of medicines in use.", [
    unit("safety-monitoring", "Post-Marketing Safety Monitoring", "Spontaneous reports, registries and signal detection.", [
      "Explain why clinical trials may fail to detect rare adverse effects",
      "Describe the role of national yellow card style reporting schemes",
      "Distinguish a safety signal from a confirmed adverse drug reaction",
    ]),
    unit("reporting-practice", "Reporting an Adverse Event", "Completing a useful report.", [
      "List the information needed for a useful adverse event report",
      "Describe the responsibilities of a prescriber in reporting serious reactions",
      "Explain how reports lead to label changes or withdrawal of a medicine",
    ]),
  ]),
  mod("evidence-based-prescribing", "Evidence-Based Prescribing", "Using guidelines and evidence to choose treatment.", [
    unit("using-guidelines", "Using Clinical Guidelines", "Applying and appraising guidance.", [
      "Locate a relevant national guideline for a given condition",
      "Justify a drug choice by referring to the strength of supporting evidence",
      "Identify when a patient's circumstances justify departing from a guideline",
    ]),
    unit("shared-prescribing-decisions", "Shared Decisions and Polypharmacy", "Tailoring treatment to the patient.", [
      "Discuss benefits and harms of a treatment in a way a patient can understand",
      "Identify potentially inappropriate prescribing in older adults",
      "Conduct a structured medication review to reduce unnecessary drugs",
    ]),
  ]),
  mod("toxicology-and-overdose", "Toxicology and Overdose", "Recognition and management of poisoning.", [
    unit("poisoning-management", "General Approach to Poisoning", "Assessment, decontamination and supportive care.", [
      "Describe an ABCDE-based initial assessment of a poisoned patient",
      "State the indications and contraindications for activated charcoal",
      "Use a toxicology information service to guide management",
    ]),
    unit("common-overdoses", "Common Overdoses and Antidotes", "Paracetamol, opioids, salicylates and others.", [
      "Describe the mechanism of paracetamol hepatotoxicity and the role of acetylcysteine",
      "Match opioid and benzodiazepine overdose to naloxone and flumazenil with their cautions",
      "Recognise the clinical features of salicylate poisoning",
    ]),
  ]),
];

const PUBHEALTH: ModuleDraft[] = [
  mod("study-designs", "Study Designs", "How research questions are matched to study types.", [
    unit("observational-studies", "Observational Studies", "Cohort, case-control and cross-sectional designs.", [
      "Compare cohort, case-control and cross-sectional studies on strengths and limitations",
      "Calculate a relative risk and an odds ratio from a two-by-two table",
      "Choose an appropriate design for a given research question",
    ]),
    unit("randomised-trials", "Randomised Controlled Trials", "Design, randomisation, blinding and analysis.", [
      "Explain how randomisation and blinding reduce bias",
      "Distinguish intention-to-treat from per-protocol analysis",
      "Describe the phases of clinical drug development",
    ]),
  ]),
  mod("bias-and-confounding", "Bias and Confounding", "Systematic error and how to handle it.", [
    unit("types-of-bias", "Types of Bias", "Selection, information and publication bias.", [
      "Identify selection bias, recall bias and observer bias in a study description",
      "Explain how publication bias distorts the evidence base",
      "Suggest a design feature to reduce a named source of bias",
    ]),
    unit("confounding-and-causation", "Confounding and Causation", "Distinguishing association from cause.", [
      "Define a confounder and give an example",
      "Describe stratification and adjustment as ways to handle confounding",
      "Apply the Bradford Hill considerations to judge causality",
    ]),
  ]),
  mod("screening-and-diagnostic-accuracy", "Screening and Diagnostic Accuracy", "Evaluating tests and screening programmes.", [
    unit("test-accuracy", "Sensitivity, Specificity and Predictive Values", "Quantifying how well a test performs.", [
      "Calculate sensitivity, specificity and predictive values from a two-by-two table",
      "Explain how disease prevalence changes positive predictive value",
      "Calculate and interpret a likelihood ratio",
    ]),
    unit("screening-programmes", "Screening Programmes", "Criteria and pitfalls of population screening.", [
      "State the Wilson and Jungner criteria for a screening programme",
      "Explain lead-time bias and overdiagnosis in screening",
      "Discuss the harms and benefits of a named national screening programme",
    ]),
  ]),
  mod("hypothesis-testing-and-confidence-intervals", "Hypothesis Testing and Confidence Intervals", "Statistical inference for clinical research.", [
    unit("hypothesis-testing", "Hypothesis Tests and P Values", "Null hypotheses, error types and power.", [
      "State a null and alternative hypothesis for a clinical comparison",
      "Distinguish type I from type II error and explain statistical power",
      "Interpret a p value correctly and state what it does not mean",
    ]),
    unit("confidence-intervals", "Confidence Intervals and Choosing Tests", "Estimating effect size and selecting a test.", [
      "Interpret a 95 percent confidence interval around an effect estimate",
      "Select between a t test, chi-squared test and non-parametric test for given data",
      "Distinguish statistical significance from clinical significance",
    ]),
  ]),
  mod("regression-and-survival-analysis", "Regression and Survival Analysis", "Modelling relationships and time-to-event outcomes.", [
    unit("regression-models", "Linear and Logistic Regression", "Modelling continuous and binary outcomes.", [
      "Interpret a regression coefficient in a linear model",
      "Interpret an odds ratio from a logistic regression model",
      "Explain how multivariable models adjust for confounders",
    ]),
    unit("survival-analysis", "Survival Analysis", "Kaplan-Meier curves and hazard ratios.", [
      "Read median survival from a Kaplan-Meier curve",
      "Explain censoring in survival data",
      "Interpret a hazard ratio from a Cox model",
    ]),
  ]),
  mod("systematic-reviews", "Systematic Reviews and Meta-Analysis", "Combining evidence and appraising its quality.", [
    unit("systematic-review-methods", "Conducting a Systematic Review", "Question, search, selection and appraisal.", [
      "Formulate a question using the PICO structure",
      "Describe a reproducible search and study selection process",
      "Appraise a trial using a risk-of-bias tool",
    ]),
    unit("meta-analysis", "Meta-Analysis and Heterogeneity", "Pooling results and reading forest plots.", [
      "Interpret a forest plot including the pooled estimate and confidence interval",
      "Explain heterogeneity and how I-squared is used",
      "Describe how a funnel plot can suggest publication bias",
    ]),
  ]),
  mod("global-health-and-burden-of-disease", "Global Health and Burden of Disease", "Measuring and comparing health across populations.", [
    unit("measuring-burden", "Measuring Disease Burden", "Incidence, prevalence, mortality and summary measures.", [
      "Differentiate incidence from prevalence and calculate each from data",
      "Explain the disability-adjusted life year as a summary measure",
      "Standardise rates to compare populations with different age structures",
    ]),
    unit("global-health-challenges", "Global Health Challenges", "Inequalities, determinants and the epidemiological transition.", [
      "Describe the epidemiological transition and its effect on disease patterns",
      "Identify social determinants of health that explain inequalities between populations",
      "Discuss the Sustainable Development Goal framework in relation to health",
    ]),
  ]),
  mod("health-systems-and-policy", "Health-Care Systems and Policy", "How health services are organised and financed.", [
    unit("health-system-models", "Models of Health-Care Systems", "Funding, access and quality.", [
      "Compare tax-funded, insurance-based and out-of-pocket health financing models",
      "Define universal health coverage",
      "Describe the levels of primary, secondary and tertiary care",
    ]),
    unit("prevention-and-policy", "Prevention and Population Interventions", "Primary, secondary and tertiary prevention.", [
      "Classify an intervention as primary, secondary or tertiary prevention",
      "Evaluate a population measure such as a sugar tax using the evidence available",
      "Explain the use of cost-effectiveness analysis in commissioning decisions",
    ]),
  ]),
  mod("environmental-and-occupational-health", "Environmental and Occupational Health", "Health effects of environment and work.", [
    unit("environmental-hazards", "Environmental Hazards", "Air pollution, water quality and climate change.", [
      "Describe the health effects of outdoor and indoor air pollution",
      "Explain how climate change affects health outcomes",
      "Outline the role of water and sanitation in preventing infectious disease",
    ]),
    unit("occupational-disease", "Occupational Disease", "Work-related exposures and their prevention.", [
      "Take an occupational history including exposures",
      "Match common occupational exposures to diseases such as asbestos and mesothelioma",
      "Describe the hierarchy of controls for managing workplace hazards",
    ]),
  ]),
];

const ETHICS: ModuleDraft[] = [
  mod("consent-and-capacity", "Consent and Capacity", "The legal and ethical basis of agreeing to treatment.", [
    unit("valid-consent", "Valid Consent", "Voluntariness, information and capacity.", [
      "State the requirements for valid consent",
      "Describe what information a reasonable patient would want to know about a risk",
      "Explain the difference between consent, assent and refusal",
    ]),
    unit("capacity-and-best-interests", "Capacity and Best Interests", "Decisions for patients who lack capacity.", [
      "Apply a structured test of decision-making capacity to a clinical case",
      "Explain how a best-interests decision is reached for a patient lacking capacity",
      "Describe the role of advance decisions and lasting powers of attorney",
    ]),
  ]),
  mod("confidentiality-and-data-protection", "Confidentiality and Data Protection", "Handling patient information responsibly.", [
    unit("duty-of-confidentiality", "The Duty of Confidentiality", "When information may be shared.", [
      "Explain the ethical basis of medical confidentiality",
      "Identify circumstances where disclosure without consent can be justified",
      "Describe how to share information appropriately within a care team",
    ]),
    unit("information-governance", "Data Protection and Records", "Legal obligations around patient data.", [
      "State the main principles of data protection legislation as they apply to patient records",
      "Describe safe use of social media and messaging by clinicians",
      "Explain a patient's right of access to their own records",
    ]),
  ]),
  mod("end-of-life-care", "End-of-Life Care", "Ethical and practical issues near the end of life.", [
    unit("palliative-care-principles", "Palliative Care Principles", "Symptom control and holistic care.", [
      "Describe the aims of palliative care",
      "Outline the management of common end-of-life symptoms such as pain and breathlessness",
      "Explain the purpose of advance care planning",
    ]),
    unit("end-of-life-decisions", "Withholding, Withdrawing and Assisted Dying", "Ethical and legal limits of treatment.", [
      "Distinguish withholding or withdrawing treatment from euthanasia",
      "Apply the doctrine of double effect to a palliative sedation case",
      "Discuss the arguments for and against legalising assisted dying",
    ]),
  ]),
  mod("reproductive-ethics", "Reproductive Ethics", "Ethical issues in reproduction and pregnancy.", [
    unit("contraception-and-termination", "Contraception and Termination of Pregnancy", "Rights, law and conscientious objection.", [
      "Describe the legal framework governing termination of pregnancy in your jurisdiction",
      "Explain the scope and limits of conscientious objection",
      "Discuss the competence of young people to consent to contraception",
    ]),
    unit("assisted-reproduction-and-genetics", "Assisted Reproduction and Genetic Testing", "Emerging technologies and their ethical limits.", [
      "Outline the ethical issues in embryo selection and prenatal screening",
      "Explain the ethical principles in counselling about genetic testing",
      "Discuss surrogacy and gamete donation in relation to the interests of the child",
    ]),
  ]),
  mod("research-ethics", "Research Ethics", "Protecting participants in clinical research.", [
    unit("research-oversight", "Research Governance and Ethics Review", "Declaration of Helsinki, ethics committees and consent.", [
      "Describe the role of a research ethics committee",
      "List the principles of the Declaration of Helsinki",
      "Explain informed consent in research, including for vulnerable participants",
    ]),
    unit("research-misconduct", "Research Integrity and Misconduct", "Fabrication, falsification and conflicts of interest.", [
      "Define fabrication, falsification and plagiarism",
      "Explain how conflicts of interest can bias research",
      "Describe the responsibility to report suspected misconduct",
    ]),
  ]),
  mod("resource-allocation", "Resource Allocation", "Fair distribution of limited health resources.", [
    unit("justice-in-health-care", "Distributive Justice", "Theories of fairness in allocation.", [
      "Compare utilitarian and egalitarian approaches to allocation",
      "Explain the use of quality-adjusted life years in decision-making",
      "Apply a fair process framework to a rationing decision",
    ]),
    unit("triage-and-scarcity", "Triage and Scarcity", "Prioritising care in emergencies and shortages.", [
      "Describe the principles of triage in a major incident",
      "Discuss ethical criteria for allocating scarce intensive care resources",
      "Explain the duty to treat and its limits in a pandemic",
    ]),
  ]),
  mod("candour-and-whistleblowing", "Whistleblowing and Duty of Candour", "Openness when things go wrong and raising concerns.", [
    unit("duty-of-candour", "Duty of Candour", "Disclosing errors honestly.", [
      "Define the professional duty of candour",
      "Describe how to disclose a medical error to a patient",
      "Explain how a just culture supports learning from error",
    ]),
    unit("raising-concerns", "Raising Concerns and Whistleblowing", "Protecting patients and protecting those who speak up.", [
      "Outline the steps for raising a patient safety concern",
      "Explain legal protections for those who raise concerns in good faith",
      "Identify barriers to speaking up in clinical teams",
    ]),
  ]),
  mod("equality-diversity-and-health-disparities", "Equality, Diversity and Health Disparities", "Fairness in care and in the profession.", [
    unit("health-disparities", "Health Disparities", "Unequal outcomes across groups.", [
      "Give examples of health disparities by ethnicity, gender and socioeconomic status",
      "Distinguish health inequality from health inequity",
      "Describe how implicit bias can affect clinical decisions",
    ]),
    unit("professional-duties", "Professional Standards and Fitness to Practise", "Regulation, conduct and the duties of a doctor.", [
      "Summarise the core duties set out in a regulator's code of good medical practice",
      "Describe how a doctor's fitness to practise is assessed",
      "Apply a structured ethical framework such as the four principles to a case",
    ]),
  ]),
];

const RESEARCH: ModuleDraft[] = [
  mod("formulating-a-question", "Formulating a Research Question", "Turning a clinical or scientific problem into an answerable question.", [
    unit("identifying-a-gap", "Identifying a Gap in Knowledge", "Scoping and refining a topic.", [
      "Identify an unanswered question from a review of a clinical topic",
      "Refine a broad topic into a focused, feasible question",
      "Write a research question using the PICO or equivalent structure",
    ]),
    unit("aims-and-hypotheses", "Aims, Objectives and Hypotheses", "Defining what a project will test.", [
      "Write a measurable aim with specific objectives",
      "State a testable hypothesis and its null",
      "Assess a project plan for feasibility in time and resources",
    ]),
  ]),
  mod("literature-search", "Literature Search", "Finding and appraising existing evidence.", [
    unit("search-strategy", "Designing a Search Strategy", "Databases, keywords and Boolean logic.", [
      "Select databases appropriate to a medical research question",
      "Construct a Boolean search using controlled vocabulary and keywords",
      "Record search terms and results reproducibly",
    ]),
    unit("critical-appraisal", "Critical Appraisal and Referencing", "Judging quality and managing references.", [
      "Appraise a primary study using a structured checklist",
      "Summarise the evidence from several papers in a coherent synthesis",
      "Manage references with citation software and avoid plagiarism",
    ]),
  ]),
  mod("project-study-design", "Study Design", "Choosing and justifying a methodology.", [
    unit("choosing-a-design", "Choosing a Design and Sample", "Matching method to question.", [
      "Justify a study design for a given research question",
      "Calculate or justify a sample size using appropriate assumptions",
      "Define inclusion and exclusion criteria and primary and secondary outcomes",
    ]),
    unit("ethics-and-approvals", "Ethics and Approvals", "Governance for a student project.", [
      "Identify the approvals required for a research project involving patients or data",
      "Write a participant information sheet in plain language",
      "Describe how participant data will be stored and anonymised",
    ]),
  ]),
  mod("data-collection", "Data Collection", "Gathering reliable, well-documented data.", [
    unit("data-collection-methods", "Collection Methods and Instruments", "Questionnaires, records and laboratory measures.", [
      "Design a data collection form that captures each required variable",
      "Assess the validity and reliability of a measurement instrument",
      "Pilot a data collection method and revise it in response",
    ]),
    unit("data-management", "Data Management and Quality", "Keeping data accurate and secure.", [
      "Create a data dictionary describing each variable and its coding",
      "Apply checks to detect missing, duplicate and implausible values",
      "Back up and store research data securely",
    ]),
  ]),
  mod("project-data-analysis", "Analysis", "Analysing and interpreting the data collected.", [
    unit("descriptive-analysis", "Descriptive Analysis", "Summarising and visualising data.", [
      "Choose appropriate summary measures for continuous and categorical data",
      "Construct clear tables and figures for a results section",
      "Check data distributions before selecting a statistical test",
    ]),
    unit("inferential-analysis", "Inferential Analysis and Interpretation", "Testing hypotheses and judging results.", [
      "Run and report a suitable test for a project comparison using statistical software",
      "Interpret effect sizes with confidence intervals",
      "State the limitations of the analysis and the study",
    ]),
  ]),
  mod("scientific-writing", "Scientific Writing", "Reporting research in a clear, standard structure.", [
    unit("imrad-structure", "Structure of a Scientific Report", "Abstract, introduction, methods, results and discussion.", [
      "Write a structured abstract that states background, methods, results and conclusion",
      "Present methods in enough detail for replication",
      "Write a discussion that places findings in context and avoids overreach",
    ]),
    unit("reporting-guidelines", "Reporting Guidelines and Style", "STROBE, CONSORT and clear prose.", [
      "Select the correct reporting guideline for a study design",
      "Edit a draft for concision, clarity and consistent terminology",
      "Cite sources accurately in a recognised referencing style",
    ]),
  ]),
  mod("presentation", "Poster and Oral Presentation", "Communicating findings to an audience.", [
    unit("poster-design", "Poster Design", "Visual communication of a project.", [
      "Design a poster that conveys the question, method, result and conclusion at a glance",
      "Apply principles of layout, contrast and minimal text",
      "Prepare a one-minute summary to accompany the poster",
    ]),
    unit("oral-presentation", "Oral Presentation and Questions", "Delivering and defending a project.", [
      "Deliver a ten-minute talk to a fixed time limit",
      "Respond to challenging questions honestly, including acknowledging limitations",
      "Use slides that support rather than duplicate the spoken message",
    ]),
  ]),
  mod("research-integrity", "Research Integrity", "Conducting research honestly and responsibly.", [
    unit("good-research-practice", "Good Research Practice", "Honesty, transparency and authorship.", [
      "Describe the core principles of research integrity",
      "Apply authorship criteria to a collaborative project",
      "Explain the value of pre-registration and open data",
    ]),
    unit("supervision-and-reflection", "Supervision, Project Management and Reflection", "Working with a supervisor and learning from the process.", [
      "Agree a project timeline with milestones and review it regularly",
      "Prepare for and record the outcomes of supervision meetings",
      "Reflect on the skills developed through the project and plan further development",
    ]),
  ]),
];

const ANATOMY: ModuleDraft[] = [
  mod("radiographic-anatomy", "Radiographic Anatomy", "Reading plain films of the chest, abdomen and skeleton.", [
    unit("chest-radiograph", "Chest Radiograph Anatomy", "Systematic review of a chest film.", [
      "Apply a systematic approach to review a chest radiograph",
      "Identify the cardiac borders, hilar structures and costophrenic angles",
      "Recognise the radiographic features of a pneumothorax and a pleural effusion",
    ]),
    unit("abdominal-and-skeletal-radiographs", "Abdominal and Skeletal Radiographs", "Bowel gas pattern and bone anatomy.", [
      "Identify the normal gas pattern and the common causes of obstruction on an abdominal film",
      "Describe a fracture using standard terms for site, pattern and displacement",
      "Name the main bony landmarks on radiographs of the limbs and spine",
    ]),
  ]),
  mod("cross-sectional-imaging", "CT, MRI and Ultrasound Anatomy", "Anatomy on cross-sectional and ultrasound images.", [
    unit("ct-anatomy", "CT Anatomy", "Axial anatomy of the head, thorax and abdomen.", [
      "Identify major structures on axial CT of the thorax and abdomen",
      "Describe the effect of contrast on the appearance of vessels and organs",
      "Recognise an intracranial haemorrhage on non-contrast head CT",
    ]),
    unit("mri-and-ultrasound-anatomy", "MRI and Ultrasound Anatomy", "Tissue contrast, planes and safety.", [
      "Differentiate T1 and T2 weighted images by fluid and fat appearance",
      "Describe the principles and advantages of ultrasound in bedside imaging",
      "State the safety considerations that exclude patients from MRI",
    ]),
  ]),
  mod("surgical-approaches", "Surgical Approaches", "Anatomy that determines how surgeons reach an organ.", [
    unit("abdominal-incisions", "Abdominal Incisions and Layers", "Layers crossed in common incisions.", [
      "List the layers of the anterior abdominal wall from skin to peritoneum",
      "Describe the midline, paramedian and transverse incisions and their trade-offs",
      "Explain how incision placement relates to nerve and vessel supply",
    ]),
    unit("thoracic-and-neck-approaches", "Thoracic and Neck Approaches", "Surgical access to chest and neck structures.", [
      "Describe the layers crossed in a thoracotomy and a median sternotomy",
      "Identify the structures at risk during thyroidectomy",
      "Explain the anatomical basis of the safe triangle for chest drain insertion",
    ]),
  ]),
  mod("procedural-anatomy", "Procedural Anatomy", "Anatomy needed for common invasive procedures.", [
    unit("lumbar-puncture", "Lumbar Puncture", "Landmarks, layers and risks.", [
      "Identify the surface landmarks used to locate the L3-L4 interspace",
      "List the layers traversed by a lumbar puncture needle",
      "Explain why a lumbar puncture is performed below the termination of the spinal cord",
    ]),
    unit("central-venous-access", "Central Venous Access and Other Procedures", "Vascular access and aspiration landmarks.", [
      "Describe the anatomical landmarks for internal jugular vein cannulation",
      "Identify the structures at risk during subclavian vein access",
      "Locate the site for knee joint aspiration and name the structures nearby",
    ]),
  ]),
  mod("clinical-anatomy-cases", "Clinical Anatomy Case Sets", "Anatomical reasoning applied to patient presentations.", [
    unit("nerve-injury-cases", "Peripheral Nerve Injury Cases", "Deficits that localise to a nerve.", [
      "Predict the deficit after injury to the median, ulnar, radial and common peroneal nerves",
      "Explain the anatomical vulnerability of each nerve at its common site of injury",
      "Describe the dermatomal pattern used to localise a root lesion",
    ]),
    unit("vascular-and-hernia-cases", "Vascular and Hernia Cases", "Applied anatomy of vessels and the abdominal wall.", [
      "Explain how anatomy distinguishes inguinal from femoral hernia",
      "Describe the arterial supply and collateral circulation relevant to limb ischaemia",
      "Relate the anatomy of the portal and systemic venous anastomoses to the development of varices",
    ]),
  ]),
  mod("embryological-basis-of-anomalies", "Embryological Basis of Anomalies", "How developmental errors give rise to congenital malformation.", [
    unit("cardiac-and-gut-development", "Cardiac and Gut Development", "Common structural defects and their origin.", [
      "Describe the embryological origin of atrial and ventricular septal defects",
      "Explain how failure of rotation or fusion produces common gut malformations",
      "Relate the persistence of fetal shunts to patent ductus arteriosus",
    ]),
    unit("neural-tube-and-pharyngeal-arches", "Neural Tube and Pharyngeal Arch Anomalies", "Closure defects and arch derivatives.", [
      "Describe the cause and spectrum of neural tube defects and the role of folic acid",
      "List the major derivatives of the pharyngeal arches",
      "Explain how cleft lip and palate arise from failed fusion",
    ]),
  ]),
];

const TRANSITION: ModuleDraft[] = [
  mod("clinical-reasoning-and-differentials", "Clinical Reasoning and Differential Diagnosis", "Reasoning from presentation to diagnosis in real patients.", [
    unit("structured-approach-to-presentations", "Structured Approach to Common Presentations", "Chest pain, breathlessness and abdominal pain.", [
      "Take a focused history that distinguishes causes of chest pain",
      "Build a prioritised differential for breathlessness and abdominal pain",
      "Choose initial investigations and justify them for each presentation",
    ]),
    unit("diagnostic-error", "Avoiding Diagnostic Error", "Biases and safeguards in reasoning.", [
      "Identify cognitive biases that cause diagnostic error",
      "Use a diagnostic time-out to reconsider the leading diagnosis",
      "Explain the importance of safety-netting advice when discharging patients",
    ]),
  ]),
  mod("ward-etiquette-and-handover", "Ward Etiquette and Handover", "Working professionally on a clinical ward.", [
    unit("ward-professionalism", "Professional Behaviour on the Ward", "Introductions, dress, privacy and teamwork.", [
      "Introduce oneself to patients and staff with name and role",
      "Maintain patient dignity and privacy during examination and discussion",
      "Describe the limits of a student's role and when to seek supervision",
    ]),
    unit("handover", "Handover and Documentation", "Passing on information safely.", [
      "Give a structured handover that includes outstanding tasks and escalation plans",
      "Write a clear, dated, signed and legible entry in the clinical notes",
      "Explain how poor handover contributes to patient harm",
    ]),
  ]),
  mod("prescribing-safety", "Prescribing Safety", "Safe medicines use before first prescribing responsibility.", [
    unit("prescribing-scenarios", "Prescribing in Clinical Scenarios", "Fluids, analgesia, anticoagulation and insulin.", [
      "Prescribe intravenous fluids appropriately for a patient who is nil by mouth",
      "Select analgesia using the patient's comorbidity and renal function",
      "Identify the safety checks required for insulin and anticoagulant prescriptions",
    ]),
    unit("prescribing-errors", "Recognising and Preventing Errors", "Common prescribing mistakes.", [
      "Identify common prescribing errors in a case-based chart review",
      "Describe system-level measures that reduce medication errors",
      "Explain how to report and learn from a prescribing incident",
    ]),
  ]),
  mod("recognising-deterioration", "Recognising Deterioration", "Detecting and responding to the acutely unwell patient.", [
    unit("early-warning-scores", "Early Warning Scores and Escalation", "Vital signs and the response to abnormal values.", [
      "Record a full set of vital signs and calculate an early warning score",
      "Describe the escalation steps linked to a rising score",
      "Explain why trends in observations matter more than a single value",
    ]),
    unit("abcde-assessment", "ABCDE Assessment", "A structured approach to the acutely unwell patient.", [
      "Perform an ABCDE assessment in a simulated deteriorating patient",
      "Identify and begin immediate treatment for life-threatening problems at each step",
      "Describe the basic life support sequence and when to call for help",
    ]),
  ]),
  mod("patient-safety-and-quality-improvement", "Patient Safety and Quality Improvement", "Learning systems that make care safer.", [
    unit("patient-safety-principles", "Principles of Patient Safety", "Human factors and incident reporting.", [
      "Describe the role of human factors in medical error",
      "Explain the Swiss cheese model of system failure",
      "Report a patient safety incident using a no-blame approach",
    ]),
    unit("quality-improvement-methods", "Quality Improvement Methods", "Plan-do-study-act cycles and audit.", [
      "Apply a plan-do-study-act cycle to a simple ward problem",
      "Distinguish clinical audit from quality improvement and from research",
      "Choose a measure to track whether a change has led to improvement",
    ]),
  ]),
  mod("shadowing-placements", "Shadowing Placements", "Learning from clinicians in practice.", [
    unit("preparing-for-placement", "Preparing for a Placement", "Setting learning goals and meeting requirements.", [
      "Set specific learning goals for a shadowing placement",
      "List the occupational health and mandatory training requirements before clinical contact",
      "Prepare questions that make the best use of a supervisor's time",
    ]),
    unit("learning-from-placement", "Learning from Placement Experience", "Observation, reflection and feedback.", [
      "Take a patient history under supervision and record it accurately",
      "Reflect on an observed consultation using a structured model",
      "Obtain and act on feedback from a supervising clinician",
    ]),
  ]),
  mod("wellbeing-and-resilience", "Wellbeing and Resilience", "Sustaining oneself through clinical training.", [
    unit("stress-and-burnout", "Stress and Burnout in Medicine", "Recognising risk in oneself and colleagues.", [
      "List the features of burnout and compassion fatigue",
      "Identify personal warning signs of declining wellbeing",
      "Describe the support services available to students and doctors",
    ]),
    unit("building-resilience", "Building Resilience and Seeking Help", "Practical habits and professional help-seeking.", [
      "Plan realistic habits for sleep, exercise and social connection",
      "Explain the professional duty to seek help for health concerns",
      "Describe how reflective practice and peer support build resilience",
    ]),
  ]),
];

const PROV = {
  neuro: provenance("cambridge", "harvard"),
  pathology: provenance("oxford2018", "cambridge"),
  micro: provenance("uclYear2"),
  immuno: provenance("harvard"),
  pharm: provenance("oxford2018"),
  systems: provenance("hopkinsG2S", "uclYear2"),
  psych: provenance("oxford2018"),
  skills: provenance("oxford2018"),
  advPath: provenance("oxfordStructure"),
  pubHealth: provenance("hopkinsCatalogue", "stanfordHandbook"),
  ethics: provenance("hopkinsG2S", "uclFoundations"),
  research: provenance("hopkinsG2S", "stanfordNews"),
  anatomy: provenance("oxford2026"),
  transition: provenance("harvard"),
};

const COURSES: MbbsCourseSpec[] = [
  {
    slug: "mbbs-neuroscience",
    code: "MBB201",
    name: "Neuroscience and Head and Neck Anatomy",
    shortName: "Neuroscience",
    description:
      "The structure and function of the nervous system, from the synapse to the cerebral cortex, with the anatomy of the head and neck and the principles of localising a neurological lesion.",
    year: "Year2",
    semester: 1,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(MBBS_PALETTE, 0),
    icon: "Brain",
    modules: NEURO,
    provenance: PROV.neuro,
  },
  {
    slug: "mbbs-general-pathology",
    code: "MBB202",
    name: "General Pathology (Principles of Disease)",
    shortName: "Pathology",
    description:
      "The mechanisms by which injury becomes disease: cell injury, inflammation, repair, vascular disorders, neoplasia, genetic disease, ageing and deposition disorders.",
    year: "Year2",
    semester: 1,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(MBBS_PALETTE, 1),
    icon: "Microscope",
    modules: PATHOLOGY,
    provenance: PROV.pathology,
  },
  {
    slug: "mbbs-microbiology",
    code: "MBB203",
    name: "Microbiology and Infectious Disease",
    shortName: "Microbiology",
    description:
      "Medically important bacteria, viruses, fungi and parasites, the principles of antimicrobial therapy and resistance, infection control, sepsis and vaccination.",
    year: "Year2",
    semester: 1,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(MBBS_PALETTE, 2),
    icon: "Virus",
    modules: MICRO,
    provenance: PROV.micro,
  },
  {
    slug: "mbbs-immunology",
    code: "MBB204",
    name: "Immunology",
    shortName: "Immunology",
    description:
      "Innate and adaptive immunity, tolerance and autoimmunity, hypersensitivity, transplantation, immunodeficiency and immunotherapy.",
    year: "Year2",
    semester: 1,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(MBBS_PALETTE, 3),
    icon: "ShieldCheck",
    modules: IMMUNO,
    provenance: PROV.immuno,
  },
  {
    slug: "mbbs-pharmacology-1",
    code: "MBB205",
    name: "Pharmacology I (Principles)",
    shortName: "Pharmacology I",
    description:
      "How drugs move through and act on the body: pharmacokinetics, receptors and dose-response, metabolism and interactions, adverse reactions, autonomic drugs and safe prescribing.",
    year: "Year2",
    semester: 2,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(MBBS_PALETTE, 4),
    icon: "Pill",
    modules: PHARM,
    provenance: PROV.pharm,
  },
  {
    slug: "mbbs-organ-system-pathophysiology",
    code: "MBB206",
    name: "Integrated Organ-System Pathophysiology",
    shortName: "Pathophysiology",
    description:
      "Disease studied system by system, integrating anatomy, physiology, pathology and pharmacology with the clinical presentation and first-line investigation of common disorders.",
    year: "Year2",
    semester: 2,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(MBBS_PALETTE, 5),
    icon: "Heartbeat",
    modules: SYSTEMS,
    provenance: PROV.systems,
  },
  {
    slug: "mbbs-behavioural-science",
    code: "MBB207",
    name: "Psychology, Sociology and Behavioural Science",
    shortName: "Behavioural Science",
    description:
      "Cognition, learning and behaviour change, stress and illness behaviour, major psychiatric presentations, substance use, adherence, and the principles of capacity and consent.",
    year: "Year2",
    semester: 2,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(MBBS_PALETTE, 0),
    icon: "Brain",
    modules: PSYCH,
    provenance: PROV.psych,
  },
  {
    slug: "mbbs-clinical-skills-2",
    code: "MBB208",
    name: "Clinical Skills and Patient and Doctor II",
    shortName: "Clinical Skills II",
    description:
      "Neurological and musculoskeletal examination, breaking bad news, introductory clinical reasoning, prescribing, practical procedures, safeguarding, teamwork and case presentation.",
    year: "Year2",
    semester: 2,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(MBBS_PALETTE, 1),
    icon: "Stethoscope",
    modules: SKILLS2,
    provenance: PROV.skills,
  },
  {
    slug: "mbbs-advanced-pathology-pharmacology",
    code: "MBB301",
    name: "Advanced Pathology and Clinical Pharmacology",
    shortName: "Adv Path and Pharm",
    description:
      "Organ-focused systemic pathology, cancer biology, diagnostic histopathology, laboratory medicine, clinical pharmacology by drug class, pharmacovigilance, evidence-based prescribing and toxicology.",
    year: "Year3",
    semester: 1,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(MBBS_PALETTE, 2),
    icon: "Flask",
    modules: ADV_PATH,
    provenance: PROV.advPath,
  },
  {
    slug: "mbbs-public-health",
    code: "MBB302",
    name: "Public Health, Epidemiology and Biostatistics",
    shortName: "Public Health",
    description:
      "Study design, bias and confounding, test accuracy, statistical inference, regression and survival analysis, systematic reviews, global health, health systems and environmental health.",
    year: "Year3",
    semester: 1,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(MBBS_PALETTE, 3),
    icon: "ChartBar",
    modules: PUBHEALTH,
    provenance: PROV.pubHealth,
  },
  {
    slug: "mbbs-ethics-law-professionalism",
    code: "MBB303",
    name: "Medical Ethics, Law and Professionalism",
    shortName: "Ethics and Law",
    description:
      "Consent and capacity, confidentiality, end-of-life care, reproductive and research ethics, resource allocation, candour and whistleblowing, and equality in health care.",
    year: "Year3",
    semester: 1,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(MBBS_PALETTE, 4),
    icon: "Scales",
    modules: ETHICS,
    provenance: PROV.ethics,
  },
  {
    slug: "mbbs-research-project",
    code: "MBB304",
    name: "Research Project and Scholarly Concentration",
    shortName: "Research Project",
    description:
      "A supervised research project from question to presentation: literature search, study design, data collection and analysis, scientific writing, communication and research integrity.",
    year: "Year3",
    semester: 2,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(MBBS_PALETTE, 5),
    icon: "Presentation",
    modules: RESEARCH,
    provenance: PROV.research,
  },
  {
    slug: "mbbs-clinical-anatomy-imaging",
    code: "MBB305",
    name: "Clinical Anatomy and Imaging",
    shortName: "Clinical Anatomy",
    description:
      "Consolidation of anatomy through radiographs, CT, MRI and ultrasound, surgical and procedural anatomy, clinical case sets and the embryological basis of congenital anomalies.",
    year: "Year3",
    semester: 2,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(MBBS_PALETTE, 0),
    icon: "Bone",
    modules: ANATOMY,
    provenance: PROV.anatomy,
  },
  {
    slug: "mbbs-transition-to-clinical-practice",
    code: "MBB306",
    name: "Transition to Clinical Practice",
    shortName: "Clinical Transition",
    description:
      "Preparation for clinical clerkships: clinical reasoning, ward conduct and handover, prescribing safety, recognising deterioration, patient safety, placements and personal wellbeing.",
    year: "Year3",
    semester: 2,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(MBBS_PALETTE, 1),
    icon: "FirstAid",
    modules: TRANSITION,
    provenance: PROV.transition,
  },
];

export const MBBS_YEAR_2_3: CourseSpec[] = COURSES;
