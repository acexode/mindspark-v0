import type { CourseSpec, ModuleDraft } from "../undergrad-course";
import type { SubtopicDraft } from "../topic-builder";

/**
 * MBBS Year 1 (courses 1.1-1.9 of docs/research/mbbs-curriculum.md): the
 * discipline-based foundations year, modelled on the published first-year
 * curricula of Oxford, Cambridge, Karolinska, Johns Hopkins and Harvard.
 * Wording is original; only the structure is synthesised.
 */
const PROGRAMME = "mbbs-medicine";

const MBBS_PALETTE = ["#9b2335", "#0f766e", "#6b3fa0", "#b4442f", "#13696f", "#7a2d6e"];

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

type MbbsCourse = CourseSpec & { provenance: CourseProvenance };

const inst = (id: string, title: string, url: string): SourceRef => ({ id, title, type: "institution", url });

const SRC = {
  cambridgeMedst: inst("cambridge-medical-sciences-tripos", "University of Cambridge - Medical Sciences Tripos", "https://www.biology.cam.ac.uk/undergrads/MedST/Current/CO"),
  cambridgePdn: inst("cambridge-pdn-undergraduate", "University of Cambridge - Anatomy (PDN) undergraduate teaching", "https://www.pdn.cam.ac.uk/undergraduate"),
  oxfordStructure: inst("oxford-preclinical-structure", "University of Oxford - Pre-clinical medicine structure", "https://www.medsci.ox.ac.uk/study/medicine/pre-clinical/structure"),
  oxfordCis: inst("oxford-medicine-cis-2026", "University of Oxford - Medicine course information sheet 2026 entry", "https://www.ox.ac.uk/sites/files/oxford/field/field_document/Medicine%20CIS%202026-entry.pdf"),
  karolinska: inst("karolinska-medicine-programme", "Karolinska Institutet - Medicine programme syllabus", "https://education.ki.se/programme-syllabus-pdf/2LK13/en"),
  hopkinsG2S: inst("johns-hopkins-year-one", "Johns Hopkins School of Medicine - Genes to Society, Year One", "https://www.hopkinsmedicine.org/som/curriculum/genes_to_society/year-one/"),
  hopkinsCatalogue: inst("johns-hopkins-md-catalogue", "Johns Hopkins School of Medicine - MD programme catalogue", "https://e-catalogue.jhu.edu/medicine/medical-students/md/md.pdf"),
  harvardPathways: inst("harvard-pathways", "Harvard Medical School - Pathways curriculum", "https://hms.harvard.edu/education-admissions/md-program/curriculum/pathways"),
};

function provenance(...refs: SourceRef[]): CourseProvenance {
  return {
    sources: [...refs, { id: "mindspark-authored", title: "Mindspark authored course structure", type: "authored" }],
    reviewStatus: "draft",
    verified: false,
    note: "Course structure synthesised from published curricula of leading European and US medical schools; wording is original. Not yet clinically reviewed.",
  };
}

/** One unit with exactly three objectives. */
function unit(slug: string, name: string, summary: string, objectives: [string, string, string]): SubtopicDraft {
  return { slug, name, summary, objectives };
}

function mod(slug: string, name: string, summary: string, units: SubtopicDraft[]): ModuleDraft {
  return { slug, name, summary, units };
}

const COURSES: MbbsCourse[] = [
  // ---------------------------------------------------------------- 1.1
  {
    slug: "mbbs-gross-anatomy-1",
    code: "MBB101",
    name: "Gross Anatomy I: Trunk, Thorax, Abdomen and Pelvis",
    shortName: "Gross Anatomy I",
    description:
      "Regional anatomy of the back, thorax, abdomen, pelvis and perineum, taught with surface anatomy, cross-sectional imaging and the clinical relevance of each structure.",
    year: "Year1",
    semester: 1,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(0),
    icon: "Heartbeat",
    provenance: provenance(SRC.cambridgePdn, SRC.hopkinsG2S, SRC.oxfordStructure),
    modules: [
      mod("anatomical-language", "Anatomical Terminology and Planes", "The shared vocabulary of position, direction and section used across all of anatomy.", [
        unit("terminology-planes", "Anatomical Position, Planes and Terms", "Standard position, directional terms and the three cardinal planes.", [
          "Describe the anatomical position and use directional terms such as proximal, distal and medial correctly",
          "Identify the sagittal, coronal and transverse planes on a diagram or scan",
          "Translate a clinical description of location into precise anatomical terminology",
        ]),
        unit("surface-anatomy", "Surface Anatomy and Palpable Landmarks", "Using bony and soft-tissue landmarks to locate deep structures.", [
          "Locate the sternal angle, costal margin and iliac crests by palpation on a living subject",
          "Project the position of the heart borders and lung margins onto the chest wall",
          "Explain how surface landmarks guide procedures such as lumbar puncture",
        ]),
      ]),
      mod("back-vertebral-column", "Back and Vertebral Column", "The bony column, its muscles and the spinal cord it protects.", [
        unit("vertebrae-joints", "Vertebrae, Joints and Ligaments", "Regional vertebral features and the supporting ligaments.", [
          "Distinguish cervical, thoracic and lumbar vertebrae by their characteristic features",
          "Describe the intervertebral disc and the ligaments that stabilise the vertebral column",
          "Explain how disc herniation can compress a spinal nerve root",
        ]),
        unit("spinal-cord-meninges", "Spinal Cord, Meninges and Dermatomes", "Cord segments, meningeal spaces and the dermatomal map.", [
          "List the meningeal layers and the spaces between them, including the epidural space",
          "Describe the level at which the adult spinal cord ends relative to the vertebral column",
          "Use the dermatome map to relate a sensory deficit to a spinal level",
        ]),
      ]),
      mod("thoracic-wall-cavity", "Thoracic Wall and Cavity", "The thoracic cage, respiratory muscles and the pleural cavities.", [
        unit("thoracic-cage-muscles", "Thoracic Cage and Muscles of Respiration", "Ribs, sternum, intercostal spaces and the diaphragm.", [
          "Identify the components of a typical rib and the contents of the intercostal neurovascular bundle",
          "Describe the attachments and innervation of the diaphragm",
          "Explain why a chest drain is inserted above the upper border of a rib",
        ]),
        unit("lungs-pleura", "Lungs, Pleura and Bronchial Tree", "Lobes, fissures, pleural reflections and bronchopulmonary segments.", [
          "Describe the lobes, fissures and hilar structures of the right and left lungs",
          "Outline the layers of pleura and the costodiaphragmatic recess",
          "Explain why aspirated material more commonly enters the right main bronchus",
        ]),
      ]),
      mod("heart-mediastinum", "Heart and Mediastinum", "The heart, great vessels and the compartments of the mediastinum.", [
        unit("heart-chambers-valves", "Heart Chambers, Valves and Conduction System", "Internal anatomy of the heart and its conducting tissue.", [
          "Name the four chambers and four valves of the heart in the direction of blood flow",
          "Locate the surface projection and auscultation points of each heart valve",
          "Trace the conduction pathway from the sinoatrial node to the Purkinje fibres",
        ]),
        unit("coronary-supply", "Coronary Circulation and Pericardium", "Arterial supply and venous drainage of the heart, and the pericardial sac.", [
          "Trace the origin and main branches of the right and left coronary arteries",
          "Relate occlusion of a specific coronary artery to the region of myocardium affected",
          "Describe the layers of the pericardium and the transverse and oblique sinuses",
        ]),
        unit("mediastinum-vessels", "Mediastinal Divisions, Aorta and Venous Drainage", "Superior and inferior mediastinum contents, aortic arch branches and the azygos system.", [
          "List the contents of the superior, anterior, middle and posterior mediastinum",
          "Name the three branches of the aortic arch in order",
          "Describe the azygos venous system as a pathway between the superior and inferior vena cavae",
        ]),
      ]),
      mod("abdominal-wall-peritoneum", "Abdominal Wall and Peritoneum", "The layered abdominal wall, inguinal region and peritoneal arrangement.", [
        unit("abdominal-wall-inguinal", "Abdominal Wall and Inguinal Canal", "Muscle layers, rectus sheath and the boundaries of the inguinal canal.", [
          "Describe the layers of the anterior abdominal wall from skin to peritoneum",
          "State the boundaries and contents of the inguinal canal",
          "Distinguish direct from indirect inguinal hernias by their relationship to the inferior epigastric vessels",
        ]),
        unit("peritoneum-mesenteries", "Peritoneum, Mesenteries and Peritoneal Spaces", "Intraperitoneal versus retroperitoneal organs and the greater and lesser sacs.", [
          "Classify abdominal organs as intraperitoneal, retroperitoneal or secondarily retroperitoneal",
          "Describe the greater omentum, lesser omentum and the omental foramen",
          "Explain how fluid or infection spreads between peritoneal spaces",
        ]),
      ]),
      mod("gi-organs-vessels", "Gastrointestinal Organs and Vessels", "Foregut, midgut and hindgut structures with their blood supply and innervation.", [
        unit("foregut-structures", "Oesophagus, Stomach, Duodenum and Pancreas", "Foregut derivatives and their relations.", [
          "Describe the regions of the stomach and the relations of the duodenum and pancreas",
          "Identify the sites where the oesophagus is constricted or crosses other structures",
          "Explain how a posterior duodenal ulcer can erode the gastroduodenal artery",
        ]),
        unit("liver-biliary-portal", "Liver, Biliary Tree and Hepatic Portal System", "Hepatic segments, bile ducts and portosystemic anastomoses.", [
          "Trace bile from the hepatocytes to the major duodenal papilla",
          "Describe the tributaries of the hepatic portal vein and the portal triad",
          "Identify the sites of portosystemic anastomosis and the clinical signs of portal hypertension",
        ]),
        unit("gut-arterial-supply", "Coeliac, Superior and Inferior Mesenteric Arteries", "Arterial territories of the foregut, midgut and hindgut.", [
          "Name the branches of the coeliac trunk and the organs each supplies",
          "Compare the territories supplied by the superior and inferior mesenteric arteries",
          "Explain why the watershed region of the colon is vulnerable to ischaemia",
        ]),
      ]),
      mod("kidneys-posterior-abdomen", "Kidneys and Posterior Abdomen", "The retroperitoneal organs and great vessels of the posterior abdominal wall.", [
        unit("kidney-ureter-anatomy", "Kidneys, Ureters and Suprarenal Glands", "Renal relations, vasculature and the course of the ureter.", [
          "Describe the relations and fascial coverings of the kidneys",
          "Identify the three anatomical constrictions of the ureter",
          "Explain why renal colic pain refers to the loin and groin",
        ]),
        unit("posterior-wall-vessels", "Posterior Abdominal Wall, Aorta and Inferior Vena Cava", "Muscles, lumbar plexus origin and the great vessels.", [
          "Name the paired branches of the abdominal aorta",
          "Describe the tributaries and course of the inferior vena cava",
          "List the muscles of the posterior abdominal wall and their nerve supply",
        ]),
      ]),
      mod("pelvis-perineum", "Pelvis and Perineum", "The bony pelvis, pelvic floor, pelvic viscera and the perineal triangles.", [
        unit("bony-pelvis-floor", "Bony Pelvis and Pelvic Floor", "Pelvic bones, ligaments and the levator ani group.", [
          "Distinguish the true from the false pelvis and state the boundaries of the pelvic inlet",
          "Describe the muscles of the pelvic floor and their role in continence",
          "Compare the typical male and female pelvis in terms of obstetric relevance",
        ]),
        unit("pelvic-viscera", "Pelvic Viscera and Neurovascular Supply", "Bladder, rectum, reproductive organs and the internal iliac system.", [
          "Describe the position and peritoneal relations of the bladder, rectum, uterus and prostate",
          "Trace the branches of the internal iliac artery to the pelvic organs",
          "Explain the autonomic innervation of the bladder",
        ]),
        unit("perineum-triangles", "Perineum, Anal and Urogenital Triangles", "Perineal spaces, ischioanal fossa and pudendal nerve.", [
          "Define the boundaries of the anal and urogenital triangles",
          "Describe the course of the pudendal nerve and the structures it supplies",
          "Explain the clinical importance of the ischioanal fossa in abscess formation",
        ]),
      ]),
    ],
  },
  // ---------------------------------------------------------------- 1.2
  {
    slug: "mbbs-histology-cell-biology",
    code: "MBB102",
    name: "Histology and Cell Biology",
    shortName: "Histology & Cells",
    description:
      "The structure and function of cells and the four basic tissues, with microscopy skills for recognising normal tissue and linking its architecture to physiological role.",
    year: "Year1",
    semester: 1,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(1),
    icon: "Microscope",
    provenance: provenance(SRC.cambridgeMedst, SRC.karolinska, SRC.harvardPathways),
    modules: [
      mod("cell-structure-organelles", "Cell Structure and Organelles", "The compartments of the eukaryotic cell and what each one does.", [
        unit("nucleus-ribosomes", "Nucleus, Ribosomes and the Endomembrane System", "Sites of gene expression and protein processing.", [
          "Describe the structure of the nuclear envelope and the function of the nucleolus",
          "Trace a secreted protein from the rough endoplasmic reticulum to the cell surface",
          "Distinguish the roles of the rough and smooth endoplasmic reticulum",
        ]),
        unit("mitochondria-lysosomes", "Mitochondria, Lysosomes and Peroxisomes", "Energy production and degradation compartments.", [
          "Explain the role of mitochondria in ATP production and apoptosis",
          "Describe how lysosomes degrade material delivered by endocytosis and autophagy",
          "Relate a lysosomal storage disorder to the enzyme deficiency that causes it",
        ]),
      ]),
      mod("membranes-transport", "Membranes and Transport", "How the lipid bilayer controls what enters and leaves the cell.", [
        unit("membrane-structure", "Membrane Structure and Fluidity", "Lipids, proteins and the fluid mosaic model.", [
          "Describe the fluid mosaic model of the plasma membrane",
          "Explain how cholesterol and fatty acid saturation affect membrane fluidity",
          "Distinguish integral from peripheral membrane proteins",
        ]),
        unit("membrane-transport", "Passive and Active Transport", "Diffusion, channels, carriers and pumps.", [
          "Compare simple diffusion, facilitated diffusion and active transport",
          "Explain how the Na+/K+-ATPase generates and maintains the resting ion gradients",
          "Describe how secondary active transport couples to the sodium gradient",
        ]),
      ]),
      mod("cytoskeleton-cell-cycle", "Cytoskeleton and Cell Cycle", "Internal scaffolding, cell division and the checkpoints that control it.", [
        unit("cytoskeleton-filaments", "Microfilaments, Intermediate Filaments and Microtubules", "Cytoskeletal components and their functions.", [
          "Compare the structure and roles of actin filaments, intermediate filaments and microtubules",
          "Describe how motor proteins move cargo along microtubules",
          "Explain how cilia and flagella derive from microtubule arrays",
        ]),
        unit("cell-cycle-control", "Cell Cycle Control and Cancer", "Cyclins, checkpoints and loss of growth control.", [
          "Outline the phases of the cell cycle and the events of mitosis",
          "Explain the function of cyclin-dependent kinases at the G1/S checkpoint",
          "Describe how loss of p53 or Rb function contributes to uncontrolled proliferation",
        ]),
      ]),
      mod("cell-signalling", "Cell Signalling", "How cells detect and respond to extracellular messages.", [
        unit("receptors-second-messengers", "Receptors and Second Messengers", "G-protein-coupled receptors, cAMP and calcium signalling.", [
          "Describe the activation cycle of a G-protein-coupled receptor",
          "Explain how cAMP and intracellular calcium act as second messengers",
          "Compare the actions of cell-surface receptors with those of intracellular nuclear receptors",
        ]),
        unit("kinase-cascades", "Receptor Tyrosine Kinases and Signal Cascades", "Growth factor signalling and its dysregulation.", [
          "Outline signalling from a receptor tyrosine kinase through the Ras-MAP kinase pathway",
          "Explain how signal amplification and termination are achieved",
          "Identify how constitutive activation of a signalling protein can drive tumour growth",
        ]),
      ]),
      mod("epithelia-glands", "Epithelia and Glands", "Lining tissues and secretory structures.", [
        unit("epithelial-classification", "Classification of Epithelia", "Shape, layering and specialisations of epithelial cells.", [
          "Classify epithelia by cell shape and number of layers and give a location for each type",
          "Describe tight junctions, desmosomes and hemidesmosomes and their functions",
          "Match an epithelial type to its functional requirement, such as absorption or protection",
        ]),
        unit("glands-secretion", "Exocrine and Endocrine Glands", "Gland architecture and modes of secretion.", [
          "Distinguish exocrine from endocrine glands by structure and delivery of product",
          "Compare merocrine, apocrine and holocrine secretion with an example of each",
          "Identify serous and mucous secretory cells by their histological appearance",
        ]),
      ]),
      mod("connective-bone-cartilage", "Connective Tissue, Bone and Cartilage", "Supporting tissues and their extracellular matrix.", [
        unit("connective-matrix", "Connective Tissue Cells and Matrix", "Fibroblasts, collagen, elastin and ground substance.", [
          "Describe the cells and fibres of loose and dense connective tissue",
          "Explain how collagen is synthesised and why defects cause connective tissue disease",
          "Distinguish dense regular from dense irregular connective tissue by location and function",
        ]),
        unit("cartilage-bone-histology", "Cartilage and Bone Histology", "Cartilage types, osteons and bone remodelling cells.", [
          "Compare hyaline, elastic and fibrocartilage by structure and location",
          "Identify the osteon, lamellae and Haversian canal on a bone section",
          "Describe how osteoblasts, osteocytes and osteoclasts cooperate in bone remodelling",
        ]),
      ]),
      mod("muscle-nerve-tissue", "Muscle and Nerve Tissue", "Excitable tissues and their microscopic organisation.", [
        unit("muscle-histology", "Skeletal, Cardiac and Smooth Muscle", "Fibre organisation and sarcomere structure.", [
          "Distinguish skeletal, cardiac and smooth muscle on appearance and innervation",
          "Describe the sarcomere and name the A band, I band and Z disc",
          "Identify intercalated discs as the defining feature of cardiac muscle",
        ]),
        unit("nerve-tissue-histology", "Neurons, Glia and Peripheral Nerve", "Cell types of the nervous system and nerve sheaths.", [
          "Describe the parts of a neuron and the function of each",
          "Compare the roles of astrocytes, oligodendrocytes, microglia and Schwann cells",
          "Identify the endoneurium, perineurium and epineurium on a nerve cross-section",
        ]),
      ]),
      mod("blood-lymphoid-tissue", "Blood and Lymphoid Tissue", "Blood cells and the organs of the immune system.", [
        unit("blood-cells-haemopoiesis", "Blood Cells and Haemopoiesis", "Formed elements and their origin in the marrow.", [
          "Identify erythrocytes, platelets and the five types of leucocyte on a blood film",
          "Outline the differentiation of haemopoietic stem cells into myeloid and lymphoid lineages",
          "Describe the characteristic appearance of a neutrophil compared with a lymphocyte",
        ]),
        unit("lymphoid-organs", "Lymph Nodes, Spleen and Thymus", "Architecture of the lymphoid organs.", [
          "Describe the cortex, paracortex and medulla of a lymph node",
          "Distinguish red pulp from white pulp in the spleen",
          "Explain the role of the thymus in T-cell maturation",
        ]),
      ]),
      mod("microscopy-staining", "Microscopy and Staining", "The practical methods used to visualise tissue.", [
        unit("light-microscopy", "Tissue Preparation and Light Microscopy", "Fixation, sectioning and haematoxylin and eosin staining.", [
          "Outline the steps from fixation to a stained paraffin section",
          "Explain why haematoxylin stains nuclei blue-purple and eosin stains cytoplasm pink",
          "Recognise common artefacts such as folds, shrinkage and tears on a slide",
        ]),
        unit("special-stains-em", "Special Stains, Immunohistochemistry and Electron Microscopy", "Techniques for identifying specific components.", [
          "State the purpose of a periodic acid-Schiff stain and an immunohistochemical stain",
          "Compare the resolution and uses of light and transmission electron microscopy",
          "Select an appropriate stain to demonstrate a given tissue component",
        ]),
      ]),
    ],
  },
  // ---------------------------------------------------------------- 1.3
  {
    slug: "mbbs-medical-biochemistry",
    code: "MBB103",
    name: "Medical Biochemistry and Metabolism",
    shortName: "Biochemistry",
    description:
      "The chemistry of proteins, enzymes and the major metabolic pathways, with emphasis on regulation, integration between tissues and the biochemical basis of disease.",
    year: "Year1",
    semester: 1,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(2),
    icon: "Flask",
    provenance: provenance(SRC.oxfordCis, SRC.cambridgeMedst, SRC.karolinska),
    modules: [
      mod("amino-acids-proteins", "Amino Acids and Proteins", "Building blocks of proteins and the levels of protein structure.", [
        unit("amino-acid-chemistry", "Amino Acid Chemistry and the Peptide Bond", "Side-chain classes, ionisation and peptide linkage.", [
          "Classify amino acids by side-chain properties and identify the essential amino acids",
          "Calculate the net charge of a peptide at a given pH from its pKa values",
          "Describe the formation and planar character of the peptide bond",
        ]),
        unit("protein-structure", "Protein Structure and Folding", "Primary to quaternary structure and misfolding disease.", [
          "Distinguish primary, secondary, tertiary and quaternary protein structure",
          "Explain how haemoglobin illustrates cooperative oxygen binding",
          "Describe how misfolded proteins such as prions or amyloid lead to disease",
        ]),
      ]),
      mod("enzymes-kinetics", "Enzymes and Kinetics", "Catalysis, kinetics and regulation of enzyme activity.", [
        unit("enzyme-kinetics", "Michaelis-Menten Kinetics", "Km, Vmax and the Lineweaver-Burk plot.", [
          "Define Km and Vmax and interpret them from a Michaelis-Menten curve",
          "Use a Lineweaver-Burk plot to determine kinetic parameters",
          "Explain how substrate concentration affects reaction velocity",
        ]),
        unit("enzyme-inhibition-regulation", "Enzyme Inhibition and Regulation", "Competitive and non-competitive inhibition, allostery and covalent modification.", [
          "Distinguish competitive from non-competitive inhibition by their effects on Km and Vmax",
          "Describe allosteric regulation and feedback inhibition of a metabolic pathway",
          "Give an example of a clinically used drug that acts as an enzyme inhibitor",
        ]),
      ]),
      mod("carbohydrate-metabolism", "Carbohydrate Metabolism", "Glucose handling from glycolysis to glycogen.", [
        unit("glycolysis-pdh", "Glycolysis and Pyruvate Fate", "The glycolytic pathway, its regulation and the fate of pyruvate.", [
          "List the main steps of glycolysis and identify its irreversible regulatory enzymes",
          "Compare the fate of pyruvate under aerobic and anaerobic conditions",
          "Explain why red blood cells depend entirely on glycolysis",
        ]),
        unit("gluconeogenesis-glycogen", "Gluconeogenesis and Glycogen Metabolism", "Making and storing glucose.", [
          "Describe how gluconeogenesis bypasses the irreversible steps of glycolysis",
          "Outline glycogen synthesis and breakdown and their hormonal control",
          "Link a glycogen storage disease to its enzyme defect and clinical features",
        ]),
        unit("pentose-phosphate", "Pentose Phosphate Pathway", "NADPH production and ribose supply.", [
          "State the two main products of the pentose phosphate pathway and their uses",
          "Explain why glucose-6-phosphate dehydrogenase deficiency causes haemolysis",
          "Describe the importance of NADPH in reductive biosynthesis and antioxidant defence",
        ]),
      ]),
      mod("lipid-metabolism", "Lipid Metabolism", "Fatty acid, ketone and cholesterol metabolism with lipoprotein transport.", [
        unit("fatty-acid-oxidation-synthesis", "Fatty Acid Oxidation and Synthesis", "Beta-oxidation, lipogenesis and their regulation.", [
          "Outline beta-oxidation of a saturated fatty acid and the role of carnitine",
          "Contrast the location and regulation of fatty acid synthesis with that of oxidation",
          "Explain how ketone bodies are produced during prolonged fasting",
        ]),
        unit("cholesterol-lipoproteins", "Cholesterol and Lipoprotein Transport", "Cholesterol synthesis, lipoprotein classes and dyslipidaemia.", [
          "Describe the rate-limiting step of cholesterol synthesis and its inhibition by statins",
          "Compare the roles of chylomicrons, VLDL, LDL and HDL in lipid transport",
          "Explain how defective LDL receptors cause familial hypercholesterolaemia",
        ]),
      ]),
      mod("bioenergetics-oxphos", "Bioenergetics and Oxidative Phosphorylation", "The citric acid cycle and the mitochondrial electron transport chain.", [
        unit("citric-acid-cycle", "The Citric Acid Cycle", "Acetyl-CoA oxidation and cycle regulation.", [
          "Describe the net inputs and outputs of one turn of the citric acid cycle",
          "Identify the points of regulation of the cycle by energy status",
          "Explain how cycle intermediates serve biosynthetic pathways",
        ]),
        unit("electron-transport-atp", "Electron Transport and ATP Synthesis", "Proton gradient, chemiosmosis and inhibitors.", [
          "Outline the flow of electrons through the respiratory chain complexes",
          "Explain how the proton gradient drives ATP synthase",
          "Predict the effect of cyanide or an uncoupling agent on cellular respiration",
        ]),
      ]),
      mod("nitrogen-urea-cycle", "Nitrogen Metabolism and the Urea Cycle", "Disposal of amino acid nitrogen.", [
        unit("amino-acid-catabolism", "Transamination and Amino Acid Catabolism", "Removing and transporting amino nitrogen.", [
          "Describe the role of aminotransferases and pyridoxal phosphate in transamination",
          "Distinguish glucogenic from ketogenic amino acids",
          "Explain how ammonia is transported from peripheral tissue to the liver",
        ]),
        unit("urea-cycle-disorders", "The Urea Cycle and its Disorders", "Ureagenesis and hyperammonaemia.", [
          "List the reactions of the urea cycle and the compartments in which they occur",
          "Explain why urea cycle defects cause hyperammonaemia and neurological symptoms",
          "Interpret a plasma ammonia result in the context of liver disease",
        ]),
      ]),
      mod("nucleotide-metabolism", "Nucleotide Metabolism", "Purine and pyrimidine synthesis, salvage and degradation.", [
        unit("purine-pyrimidine", "Purine and Pyrimidine Synthesis and Salvage", "De novo and salvage routes to nucleotides.", [
          "Compare de novo and salvage pathways for purine nucleotides",
          "Explain how Lesch-Nyhan syndrome arises from a salvage pathway enzyme defect",
          "Identify the enzymes targeted by antimetabolite drugs such as methotrexate",
        ]),
        unit("purine-degradation-gout", "Purine Degradation and Gout", "Uric acid formation and hyperuricaemia.", [
          "Trace purine degradation to uric acid",
          "Explain how allopurinol reduces uric acid production",
          "Describe the pathogenesis of gouty arthritis from urate crystal deposition",
        ]),
      ]),
      mod("metabolic-integration", "Integration of Metabolism and Diabetes", "Tissue-specific metabolism and its hormonal control across feeding and fasting.", [
        unit("fed-fasted-states", "Fed, Fasting and Starvation States", "Hormonal control of fuel use.", [
          "Describe the actions of insulin and glucagon on liver, muscle and adipose tissue",
          "Compare the principal fuels used by the brain in the fed state and in prolonged starvation",
          "Explain how the liver maintains blood glucose between meals",
        ]),
        unit("diabetes-metabolism", "Metabolic Basis of Diabetes Mellitus", "Disordered fuel metabolism in diabetes.", [
          "Explain the metabolic basis of diabetic ketoacidosis",
          "Contrast type 1 and type 2 diabetes in terms of insulin deficiency and resistance",
          "Interpret fasting glucose and HbA1c results in diagnosing diabetes",
        ]),
        unit("inborn-errors", "Inborn Errors of Metabolism", "Recognising and screening for metabolic disease.", [
          "Explain the biochemical basis of phenylketonuria and the rationale for newborn screening",
          "Describe how an enzyme deficiency leads to substrate accumulation and product deficiency",
          "Identify clinical and laboratory clues that suggest an inborn error of metabolism",
        ]),
      ]),
      mod("vitamins-minerals", "Vitamins and Minerals", "Micronutrient function and deficiency states.", [
        unit("water-fat-soluble-vitamins", "Water-soluble and Fat-soluble Vitamins", "Coenzyme roles and deficiency syndromes.", [
          "Match each B vitamin to the coenzyme form and the reaction it supports",
          "Describe the functions of vitamins A, D, E and K",
          "Relate deficiency of vitamin C, thiamine or vitamin D to its clinical syndrome",
        ]),
        unit("minerals-nutrition", "Minerals and Nutritional Assessment", "Iron, calcium, iodine and energy balance.", [
          "Describe the absorption, transport and storage of iron",
          "Explain the physiological importance of calcium, iodine and zinc",
          "Calculate body mass index and interpret it in nutritional assessment",
        ]),
      ]),
    ],
  },
  // ---------------------------------------------------------------- 1.4
  {
    slug: "mbbs-molecular-genetics-embryology",
    code: "MBB104",
    name: "Molecular Genetics and Embryology",
    shortName: "Genetics & Embryology",
    description:
      "From DNA structure and gene expression to patterns of inheritance, and from fertilisation to organogenesis, including the origin of genetic disease and congenital anomalies.",
    year: "Year1",
    semester: 1,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(3),
    icon: "Dna",
    provenance: provenance(SRC.oxfordCis, SRC.harvardPathways, SRC.cambridgeMedst),
    modules: [
      mod("dna-replication-repair", "DNA Structure, Replication and Repair", "The molecule of inheritance and how it is copied and protected.", [
        unit("dna-structure-replication", "DNA Structure and Replication", "Double helix, replication fork and enzymes.", [
          "Describe the antiparallel double helix and base-pairing rules of DNA",
          "Outline the roles of helicase, primase, DNA polymerase and ligase at the replication fork",
          "Explain why the lagging strand is synthesised as Okazaki fragments",
        ]),
        unit("dna-damage-repair", "DNA Damage and Repair", "Mutagens and repair pathways.", [
          "Distinguish base excision, nucleotide excision and mismatch repair",
          "Explain how defective nucleotide excision repair causes xeroderma pigmentosum",
          "Relate impaired mismatch repair to hereditary non-polyposis colorectal cancer",
        ]),
      ]),
      mod("transcription-translation", "Transcription and Translation", "Flow of information from gene to protein.", [
        unit("transcription-processing", "Transcription and RNA Processing", "RNA polymerase, capping, splicing and polyadenylation.", [
          "Describe the stages of transcription by RNA polymerase II",
          "Outline 5' capping, splicing and polyadenylation of pre-mRNA",
          "Explain how alternative splicing produces multiple proteins from one gene",
        ]),
        unit("translation-code", "The Genetic Code and Translation", "Ribosomes, tRNA and the types of point mutation.", [
          "Explain the degeneracy and universality of the genetic code",
          "Outline initiation, elongation and termination of translation",
          "Classify point mutations as silent, missense, nonsense or frameshift with their likely effects",
        ]),
      ]),
      mod("gene-regulation-epigenetics", "Gene Regulation and Epigenetics", "How gene expression is switched on and off.", [
        unit("transcriptional-control", "Transcription Factors and Regulatory Elements", "Promoters, enhancers and the lac operon model.", [
          "Describe how promoters, enhancers and transcription factors control gene expression",
          "Explain the lac operon as an example of inducible gene regulation",
          "Give an example of a disease caused by a mutation in a regulatory sequence",
        ]),
        unit("epigenetic-mechanisms", "DNA Methylation, Histone Modification and Imprinting", "Heritable changes without altered sequence.", [
          "Describe how DNA methylation and histone acetylation alter gene expression",
          "Explain genomic imprinting using Prader-Willi and Angelman syndromes",
          "State how X-chromosome inactivation equalises gene dosage between sexes",
        ]),
      ]),
      mod("inheritance-patterns", "Mendelian and Complex Inheritance", "Patterns of transmission and risk calculation.", [
        unit("mendelian-patterns", "Autosomal and X-linked Inheritance", "Dominant, recessive and X-linked patterns and pedigrees.", [
          "Draw a pedigree using standard symbols from a family history",
          "Identify autosomal dominant, autosomal recessive and X-linked patterns from a pedigree",
          "Calculate the recurrence risk for an autosomal recessive condition in siblings of an affected child",
        ]),
        unit("risk-population-genetics", "Hardy-Weinberg Equilibrium and Carrier Risk", "Allele frequencies and carrier calculation.", [
          "Apply the Hardy-Weinberg equation to estimate carrier frequency from disease incidence",
          "Explain how consanguinity raises the risk of recessive disease",
          "Describe reduced penetrance and variable expressivity with an example",
        ]),
        unit("complex-mitochondrial-inheritance", "Multifactorial and Mitochondrial Inheritance", "Polygenic traits and maternal transmission.", [
          "Explain how genes and environment interact in multifactorial disease",
          "Describe the maternal inheritance pattern of mitochondrial DNA disorders",
          "Define heteroplasmy and explain why it produces variable severity",
        ]),
      ]),
      mod("chromosomal-disorders", "Chromosomal Disorders", "Disease caused by changes in chromosome number or structure.", [
        unit("aneuploidy", "Aneuploidy and Non-disjunction", "Trisomies and sex chromosome abnormalities.", [
          "Explain how non-disjunction in meiosis produces trisomy 21",
          "Describe the clinical features of Down, Turner and Klinefelter syndromes",
          "Relate the risk of trisomy to advancing maternal age",
        ]),
        unit("structural-abnormalities", "Deletions, Translocations and Karyotyping", "Structural rearrangements and their detection.", [
          "Distinguish balanced from unbalanced chromosomal translocations",
          "Explain how a Robertsonian translocation can lead to familial Down syndrome",
          "Interpret a karyotype description written in standard nomenclature",
        ]),
      ]),
      mod("gametogenesis-fertilisation", "Gametogenesis and Fertilisation", "Formation of gametes and the start of a new individual.", [
        unit("meiosis-gametes", "Meiosis, Spermatogenesis and Oogenesis", "Reductive division and gamete maturation.", [
          "Compare mitosis and meiosis with respect to outcome and genetic variation",
          "Describe the stages of spermatogenesis and oogenesis and where each arrests",
          "Explain how crossing over and independent assortment generate diversity",
        ]),
        unit("fertilisation-cleavage", "Fertilisation, Cleavage and Implantation", "From zygote to implanted blastocyst.", [
          "Outline the events of fertilisation, including the acrosome reaction",
          "Describe cleavage and the formation of the morula and blastocyst",
          "Explain how implantation in an abnormal site results in an ectopic pregnancy",
        ]),
      ]),
      mod("early-development-germ-layers", "Weeks 1-3 and the Germ Layers", "Bilaminar and trilaminar disc formation.", [
        unit("bilaminar-trilaminar-disc", "Bilaminar Disc and Gastrulation", "Formation of the three germ layers.", [
          "Describe the formation of the epiblast and hypoblast in the second week",
          "Explain how gastrulation establishes ectoderm, mesoderm and endoderm",
          "Identify the primitive streak and notochord and state their inductive roles",
        ]),
        unit("germ-layer-derivatives", "Germ Layer Derivatives and Neurulation", "Fate of each layer and neural tube closure.", [
          "List the major tissues derived from ectoderm, mesoderm and endoderm",
          "Describe neurulation and the origin of the neural crest",
          "Explain how failed neural tube closure produces spina bifida and the role of folic acid",
        ]),
      ]),
      mod("organogenesis", "Organogenesis: Heart, Gut and Limbs", "Development of key organ systems.", [
        unit("heart-development", "Development of the Heart", "Heart tube, looping and septation.", [
          "Describe formation and looping of the primitive heart tube",
          "Outline septation of the atria and ventricles",
          "Explain the fetal circulation and the changes that occur at birth",
        ]),
        unit("gut-limb-development", "Development of the Gut and Limbs", "Foregut, midgut rotation and limb bud formation.", [
          "Describe midgut herniation and rotation and the defects arising from failure of return",
          "Outline the formation of limb buds and the role of the apical ectodermal ridge",
          "Explain the embryological basis of oesophageal atresia with tracheo-oesophageal fistula",
        ]),
      ]),
      mod("congenital-anomalies-teratogens", "Congenital Anomalies and Teratogens", "Causes and prevention of birth defects.", [
        unit("teratogens", "Teratogens and Critical Periods", "Agents that disrupt development.", [
          "Define a teratogen and explain why timing of exposure determines the defect",
          "Give examples of drugs, infections and toxins known to be teratogenic",
          "Describe the features of fetal alcohol spectrum disorder",
        ]),
        unit("genetic-testing", "Prenatal Screening and Genetic Testing", "Screening versus diagnosis and test interpretation.", [
          "Distinguish a screening test from a diagnostic test in prenatal care",
          "Compare chorionic villus sampling and amniocentesis in timing and risk",
          "Interpret a simple genetic test result, including a positive predictive value, for a counselling scenario",
        ]),
      ]),
    ],
  },
  // ---------------------------------------------------------------- 1.5
  {
    slug: "mbbs-intro-medicine-ethics-public-health",
    code: "MBB105",
    name: "Introduction to Medicine: Professionalism, Public Health and Ethics I",
    shortName: "Intro to Medicine",
    description:
      "The role of the doctor, foundations of medical ethics and communication, the social determinants of health, basic epidemiology and first reflective contact with patients.",
    year: "Year1",
    semester: 1,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(4),
    icon: "Scales",
    provenance: provenance(SRC.karolinska, SRC.hopkinsCatalogue, SRC.oxfordCis),
    modules: [
      mod("role-of-doctor-professionalism", "The Role of the Doctor and Professionalism", "Expectations of a medical student and a practising doctor.", [
        unit("professional-identity", "Professional Identity and Duties of a Doctor", "Core professional values and responsibilities.", [
          "Describe the core duties of a doctor as set out in a professional code of conduct",
          "Explain what is meant by professional boundaries with patients",
          "Identify behaviours that constitute unprofessional conduct for a medical student",
        ]),
        unit("reflective-practice-wellbeing", "Reflective Practice, Teamwork and Wellbeing", "Learning from experience and working in teams.", [
          "Write a structured reflection on a learning experience using a recognised model",
          "Describe the roles of different members of a multidisciplinary healthcare team",
          "Outline strategies for maintaining personal wellbeing during medical training",
        ]),
      ]),
      mod("communication-consent", "Communication and Consent Basics", "Fundamentals of talking with patients and obtaining agreement.", [
        unit("communication-skills", "Core Communication Skills", "Listening, open questions and empathy.", [
          "Use open and closed questions appropriately in a patient conversation",
          "Demonstrate active listening techniques including summarising and reflection",
          "Respond to a patient's expressed emotion with an empathic statement",
        ]),
        unit("informed-consent", "Informed Consent and Capacity", "Requirements for valid consent.", [
          "State the elements required for valid informed consent",
          "Apply a capacity assessment to a simple clinical scenario",
          "Explain when treatment may lawfully proceed without a patient's consent",
        ]),
      ]),
      mod("ethical-principles", "The Four Principles of Ethics", "A framework for reasoning about ethical problems.", [
        unit("four-principles", "Autonomy, Beneficence, Non-maleficence and Justice", "Definition and application of each principle.", [
          "Define autonomy, beneficence, non-maleficence and justice with a clinical example of each",
          "Identify which principles conflict in a described case",
          "Justify a course of action by weighing the principles in order of relevance",
        ]),
        unit("ethical-reasoning", "Applying an Ethical Framework to a Case", "Structured analysis of dilemmas.", [
          "Apply a stepwise framework to analyse a simple ethical dilemma",
          "Distinguish an ethical issue from a legal or purely clinical issue",
          "Present a reasoned ethical argument that acknowledges the opposing view",
        ]),
      ]),
      mod("confidentiality", "Confidentiality", "Protecting patient information and its justified exceptions.", [
        unit("duty-of-confidentiality", "Duty of Confidentiality and its Limits", "When information may be shared.", [
          "Explain why confidentiality is important to the doctor-patient relationship",
          "List circumstances in which disclosure without consent may be justified",
          "Decide what information may be shared with relatives in a given scenario",
        ]),
        unit("records-information-governance", "Health Records and Information Governance", "Handling patient data responsibly.", [
          "Describe good practice in storing and sharing patient records securely",
          "Explain the risks of discussing patients on social media or in public spaces",
          "Outline a patient's right of access to their own health record",
        ]),
      ]),
      mod("determinants-sociology", "Health Determinants and Medical Sociology", "How social circumstances shape health.", [
        unit("social-determinants", "Social Determinants and Health Inequalities", "Income, education, environment and access.", [
          "Describe the main social determinants of health with an example of each",
          "Explain the concept of a social gradient in health",
          "Suggest how health inequalities might be reduced at population level",
        ]),
        unit("illness-behaviour", "Illness Experience and Health Behaviour", "The patient perspective on disease.", [
          "Distinguish disease from illness and sickness",
          "Describe the sick role and its limitations",
          "Explain how health beliefs influence a patient's use of services and adherence",
        ]),
      ]),
      mod("epidemiology-measures", "Epidemiology Measures", "Quantifying disease frequency and association.", [
        unit("incidence-prevalence", "Incidence, Prevalence and Rates", "Measures of disease occurrence.", [
          "Calculate incidence and prevalence from a data table",
          "Explain the relationship between incidence, prevalence and disease duration",
          "Compare crude and age-standardised rates and say when each is appropriate",
        ]),
        unit("study-design-association", "Study Designs and Measures of Association", "Cohort, case-control and cross-sectional studies.", [
          "Compare cross-sectional, case-control and cohort study designs by strengths and weaknesses",
          "Calculate a relative risk and an odds ratio from a two-by-two table",
          "Identify bias and confounding as threats to the validity of a study",
        ]),
      ]),
      mod("health-systems", "Health Systems Overview", "How health services are organised and funded.", [
        unit("levels-of-care", "Primary, Secondary and Tertiary Care", "Structure of service delivery.", [
          "Distinguish primary, secondary and tertiary levels of healthcare",
          "Describe the principle of primary health care as set out in the Alma-Ata declaration",
          "Trace the pathway of a patient referred from community care to a hospital specialist",
        ]),
        unit("health-financing-prevention", "Health Financing and Levels of Prevention", "Funding models and prevention strategies.", [
          "Compare tax-funded, insurance-based and out-of-pocket health financing models",
          "Define primary, secondary and tertiary prevention with an example of each",
          "Explain the role of screening programmes in secondary prevention",
        ]),
      ]),
      mod("first-patient-contact", "First Patient Contact and Reflection", "Early supervised patient encounters.", [
        unit("patient-interview-basics", "Introducing Yourself and Conducting a Basic Interview", "Opening, gathering information and closing a consultation.", [
          "Introduce yourself, state your role and obtain permission to speak with a patient",
          "Elicit a patient's presenting concern using a structured opening",
          "Close an interview with a summary and an opportunity for questions",
        ]),
        unit("patient-reflection", "Learning from the Patient Encounter", "Reflection on early contact.", [
          "Identify what the patient's experience of illness added to your understanding of disease",
          "Reflect on your own emotional response to a patient encounter",
          "Set a specific learning goal arising from a patient interaction",
        ]),
      ]),
    ],
  },
  // ---------------------------------------------------------------- 1.6
  {
    slug: "mbbs-human-physiology-1",
    code: "MBB106",
    name: "Human Physiology I: Cardiovascular, Respiratory and Renal",
    shortName: "Physiology I",
    description:
      "Homeostasis and the function of the heart, circulation, lungs and kidneys, with emphasis on regulation, quantitative reasoning and interpreting clinical measurements.",
    year: "Year1",
    semester: 2,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(5),
    icon: "Pulse",
    provenance: provenance(SRC.oxfordStructure, SRC.cambridgeMedst, SRC.hopkinsG2S),
    modules: [
      mod("body-fluids-homeostasis", "Body Fluids and Homeostasis", "Fluid compartments and the principle of negative feedback.", [
        unit("fluid-compartments", "Body Fluid Compartments and Osmolarity", "Intracellular, interstitial and plasma volumes.", [
          "Describe the distribution of total body water among its compartments",
          "Calculate plasma osmolarity from sodium, glucose and urea concentrations",
          "Predict the movement of water between compartments after infusion of isotonic and hypotonic fluids",
        ]),
        unit("feedback-control", "Homeostasis and Feedback Control", "Set points, sensors and effectors.", [
          "Identify the sensor, integrator and effector in a negative feedback loop",
          "Distinguish negative from positive feedback with a physiological example of each",
          "Explain how a perturbation of a regulated variable is detected and corrected",
        ]),
      ]),
      mod("cardiac-electrophysiology", "Cardiac Electrophysiology and the ECG", "Electrical activity of the heart and its recording.", [
        unit("cardiac-action-potential", "Cardiac Action Potentials and Pacemaker Activity", "Ion currents in nodal and ventricular cells.", [
          "Describe the phases of the ventricular myocyte action potential and the ions responsible",
          "Explain how pacemaker cells in the sinoatrial node generate spontaneous depolarisation",
          "Predict the effect of hyperkalaemia on cardiac excitability",
        ]),
        unit("ecg-interpretation", "The Electrocardiogram", "Waves, intervals and rhythm.", [
          "Relate the P wave, QRS complex and T wave to the electrical events of the cardiac cycle",
          "Calculate heart rate from an ECG rhythm strip",
          "Recognise sinus rhythm, atrial fibrillation and heart block on an ECG",
        ]),
      ]),
      mod("cardiac-cycle-output", "Cardiac Cycle and Output", "Mechanical function of the heart.", [
        unit("cardiac-cycle", "Pressure-Volume Events of the Cardiac Cycle", "Systole, diastole, valves and heart sounds.", [
          "Describe the pressure and volume changes in the left ventricle through one cardiac cycle",
          "Relate the first and second heart sounds to valve closure",
          "Interpret a pressure-volume loop to identify stroke volume",
        ]),
        unit("cardiac-output-regulation", "Cardiac Output and its Regulation", "Preload, afterload, contractility and heart rate.", [
          "Calculate cardiac output from stroke volume and heart rate",
          "Explain the Frank-Starling relationship and its significance",
          "Describe how sympathetic and parasympathetic stimulation alter heart rate and contractility",
        ]),
      ]),
      mod("haemodynamics-blood-pressure", "Vascular Haemodynamics and Blood Pressure", "Flow, resistance and arterial pressure regulation.", [
        unit("flow-resistance", "Flow, Pressure and Resistance", "Poiseuille's relationship and vessel properties.", [
          "Apply the relationship between pressure, flow and resistance to the circulation",
          "Explain why small changes in vessel radius greatly alter resistance",
          "Compare the pressure and compliance characteristics of arteries, capillaries and veins",
        ]),
        unit("blood-pressure-control", "Control of Arterial Blood Pressure", "Baroreceptor reflex and hormonal regulation.", [
          "Calculate mean arterial pressure from systolic and diastolic values",
          "Describe the baroreceptor reflex response to a fall in blood pressure",
          "Explain the role of the renin-angiotensin-aldosterone system in long-term pressure control",
        ]),
        unit("microcirculation", "Microcirculation and Tissue Fluid Exchange", "Starling forces and oedema.", [
          "Describe the Starling forces governing fluid movement across capillary walls",
          "Predict the effect of raised venous pressure or low plasma albumin on tissue fluid",
          "Explain the role of the lymphatic system in returning interstitial fluid",
        ]),
      ]),
      mod("lung-mechanics-gas-exchange", "Lung Mechanics and Gas Exchange", "Ventilation, compliance and diffusion of gases.", [
        unit("ventilation-mechanics", "Mechanics of Breathing and Lung Volumes", "Compliance, surfactant and spirometry.", [
          "Define the lung volumes and capacities and identify them on a spirometry trace",
          "Explain the role of surfactant in reducing surface tension and preventing alveolar collapse",
          "Distinguish an obstructive from a restrictive pattern using FEV1 and FVC",
        ]),
        unit("gas-exchange-transport", "Gas Exchange and Oxygen Transport", "Diffusion, ventilation-perfusion and haemoglobin.", [
          "Describe diffusion of oxygen and carbon dioxide across the alveolar-capillary membrane",
          "Explain how ventilation-perfusion mismatch causes hypoxaemia",
          "Interpret the oxygen-haemoglobin dissociation curve and factors that shift it",
        ]),
      ]),
      mod("control-of-breathing", "Control of Breathing", "Neural and chemical regulation of ventilation.", [
        unit("respiratory-centres", "Respiratory Centres and Reflexes", "Brainstem generation of the breathing rhythm.", [
          "Identify the brainstem regions that generate and modify the respiratory rhythm",
          "Describe the role of pulmonary stretch receptors in the Hering-Breuer reflex",
          "Explain how voluntary control of breathing is overridden by chemical drive",
        ]),
        unit("chemoreceptors", "Central and Peripheral Chemoreceptors", "Response to carbon dioxide, hydrogen ions and hypoxia.", [
          "Compare the stimuli detected by central and peripheral chemoreceptors",
          "Explain why carbon dioxide is the main drive to breathe in healthy people",
          "Describe the ventilatory response to hypoxia and the risk of oxygen therapy in chronic hypercapnia",
        ]),
      ]),
      mod("renal-filtration-tubular", "Renal Filtration and Tubular Function", "Formation of urine from plasma.", [
        unit("glomerular-filtration", "Glomerular Filtration and Renal Blood Flow", "Filtration barrier, GFR and autoregulation.", [
          "Describe the three layers of the glomerular filtration barrier",
          "Estimate glomerular filtration rate from creatinine clearance",
          "Explain how autoregulation keeps filtration stable across a range of blood pressures",
        ]),
        unit("tubular-transport", "Tubular Reabsorption and Secretion", "Segmental handling of solutes and water.", [
          "State the main solutes reabsorbed in the proximal tubule, loop of Henle and distal nephron",
          "Explain how the countercurrent mechanism produces concentrated urine",
          "Describe how antidiuretic hormone alters water permeability of the collecting duct",
        ]),
      ]),
      mod("acid-base-electrolytes", "Acid-Base and Electrolytes", "Regulation of pH, sodium, potassium and fluid volume.", [
        unit("acid-base-balance", "Acid-Base Balance and Blood Gas Interpretation", "Buffers, compensation and disorders.", [
          "Apply the Henderson-Hasselbalch relationship to bicarbonate and carbon dioxide",
          "Classify a blood gas result as respiratory or metabolic acidosis or alkalosis",
          "Describe the renal and respiratory compensation for a primary acid-base disturbance",
        ]),
        unit("sodium-potassium-balance", "Sodium, Potassium and Water Balance", "Hormonal control of electrolytes.", [
          "Explain how aldosterone regulates sodium and potassium excretion",
          "Describe the causes and effects of hyponatraemia and hyperkalaemia",
          "Outline how natriuretic peptides oppose the renin-angiotensin-aldosterone system",
        ]),
      ]),
      mod("exercise-altitude", "Exercise and Altitude", "Integrated responses to physiological stress.", [
        unit("exercise-response", "Cardiovascular and Respiratory Response to Exercise", "Integration during sustained activity.", [
          "Describe the changes in cardiac output, ventilation and regional blood flow during exercise",
          "Explain how training adaptations lower resting heart rate",
          "Define maximal oxygen uptake and the factors that limit it",
        ]),
        unit("altitude-adaptation", "Acclimatisation to Altitude", "Responses to reduced inspired oxygen.", [
          "Explain why alveolar oxygen falls at altitude despite unchanged oxygen fraction",
          "Describe the immediate and long-term ventilatory and haematological adaptations to altitude",
          "Outline the pathophysiology of acute mountain sickness",
        ]),
      ]),
    ],
  },
  // ---------------------------------------------------------------- 1.7
  {
    slug: "mbbs-human-physiology-2",
    code: "MBB107",
    name: "Human Physiology II: Gastrointestinal, Endocrine, Reproductive and Muscle",
    shortName: "Physiology II",
    description:
      "Muscle contraction, digestion and absorption, endocrine control systems, reproductive physiology and thermoregulation, linking mechanism to clinical presentation.",
    year: "Year1",
    semester: 2,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(0),
    icon: "Drop",
    provenance: provenance(SRC.oxfordStructure, SRC.cambridgeMedst, SRC.karolinska),
    modules: [
      mod("muscle-contraction", "Muscle Contraction", "Excitation-contraction coupling and mechanics of muscle.", [
        unit("skeletal-muscle-contraction", "Skeletal Muscle Excitation-Contraction Coupling", "From neuromuscular junction to cross-bridge cycling.", [
          "Describe neuromuscular transmission and the generation of the end-plate potential",
          "Outline excitation-contraction coupling and the role of calcium and troponin",
          "Explain how myasthenia gravis impairs neuromuscular transmission",
        ]),
        unit("muscle-mechanics", "Muscle Mechanics, Fibre Types and Smooth Muscle", "Length-tension, summation and fibre classification.", [
          "Interpret the length-tension relationship of skeletal muscle",
          "Compare type I and type II muscle fibres by metabolism and function",
          "Contrast the contraction mechanism of smooth muscle with that of skeletal muscle",
        ]),
      ]),
      mod("gi-motility-secretion", "Gastrointestinal Motility and Secretion", "Control of movement and secretions in the gut.", [
        unit("gi-motility", "Gut Motility and its Neural Control", "Enteric nervous system, peristalsis and reflexes.", [
          "Describe the roles of the myenteric and submucosal plexuses",
          "Compare peristalsis with segmentation and state where each occurs",
          "Explain the phases of swallowing and the function of the lower oesophageal sphincter",
        ]),
        unit("gi-secretions", "Salivary, Gastric and Pancreatic Secretions", "Composition and regulation of digestive juices.", [
          "Describe the cells of the gastric gland and the product of each",
          "Outline the cephalic, gastric and intestinal phases of gastric acid secretion",
          "Explain the roles of gastrin, secretin and cholecystokinin in digestion",
        ]),
      ]),
      mod("digestion-absorption", "Digestion and Absorption", "Breakdown and uptake of nutrients.", [
        unit("macronutrient-digestion", "Digestion and Absorption of Carbohydrate, Protein and Fat", "Enzymes and transport mechanisms.", [
          "Describe the digestion and absorption of carbohydrate, protein and fat",
          "Explain why bile salts and micelles are necessary for fat absorption",
          "Relate lactase deficiency or coeliac disease to a defect in absorption",
        ]),
        unit("water-vitamin-absorption", "Absorption of Water, Electrolytes and Vitamins", "Small and large intestine function.", [
          "Describe how water and electrolytes are absorbed along the gut",
          "Explain the requirement for intrinsic factor in vitamin B12 absorption",
          "Outline the pathophysiology of secretory diarrhoea such as that caused by cholera toxin",
        ]),
      ]),
      mod("liver-bile", "Liver and Bile", "Hepatic functions and bile formation.", [
        unit("liver-functions", "Metabolic and Synthetic Functions of the Liver", "Roles of the hepatocyte.", [
          "List the major metabolic, synthetic and detoxification functions of the liver",
          "Explain which liver function tests reflect synthetic capacity and which reflect cholestasis or injury",
          "Describe the role of the liver in clotting factor and albumin production",
        ]),
        unit("bile-bilirubin", "Bile Formation and Bilirubin Metabolism", "Enterohepatic circulation and jaundice.", [
          "Trace the production, conjugation and excretion of bilirubin",
          "Describe the enterohepatic circulation of bile salts",
          "Distinguish pre-hepatic, hepatic and post-hepatic jaundice by laboratory findings",
        ]),
      ]),
      mod("endocrine-axes", "Endocrine Axes", "Hypothalamic-pituitary control of peripheral glands.", [
        unit("hypothalamus-pituitary", "Hypothalamus and Pituitary Hormones", "Anterior and posterior pituitary function.", [
          "Distinguish the neural from the vascular link between hypothalamus and the posterior and anterior pituitary",
          "List the anterior pituitary hormones and their target organs",
          "Explain the actions of antidiuretic hormone and oxytocin",
        ]),
        unit("hpa-thyroid-axes", "The Adrenal and Thyroid Axes", "Cortisol and thyroid hormone regulation.", [
          "Describe the hypothalamic-pituitary-adrenal axis and its negative feedback",
          "Outline the synthesis and action of thyroid hormones",
          "Predict the biochemical pattern in primary hypothyroidism versus hyperthyroidism",
        ]),
        unit("growth-stress-hormones", "Growth Hormone and Stress Responses", "Anabolic and catabolic hormone actions.", [
          "Describe the regulation and metabolic effects of growth hormone",
          "Explain the physiological actions of cortisol and adrenaline during stress",
          "Relate cortisol excess to the features of Cushing syndrome",
        ]),
      ]),
      mod("glucose-calcium-regulation", "Glucose and Calcium Regulation", "Hormonal control of two tightly regulated plasma variables.", [
        unit("glucose-homeostasis", "Pancreatic Hormones and Glucose Homeostasis", "Insulin and glucagon secretion and action.", [
          "Describe the regulation of insulin secretion by the pancreatic beta cell",
          "Explain the cellular actions of insulin and glucagon on glucose handling",
          "Interpret an oral glucose tolerance test",
        ]),
        unit("calcium-phosphate", "Calcium and Phosphate Homeostasis", "Parathyroid hormone, vitamin D and calcitonin.", [
          "Explain how parathyroid hormone and vitamin D raise plasma calcium",
          "Describe the synthesis of active vitamin D and the organs involved",
          "Relate hypocalcaemia to its neuromuscular signs",
        ]),
      ]),
      mod("reproductive-endocrinology", "Reproductive Endocrinology", "Hormonal control of the male and female reproductive systems.", [
        unit("male-reproductive-physiology", "Male Reproductive Physiology", "Testicular function and its control.", [
          "Describe the roles of LH and FSH in testicular function",
          "Explain the negative feedback of testosterone and inhibin on the pituitary",
          "Outline the stages and duration of spermatogenesis",
        ]),
        unit("menstrual-cycle", "The Ovarian and Menstrual Cycles", "Follicular, ovulatory and luteal phases.", [
          "Describe the follicular, ovulatory and luteal phases and the hormones dominating each",
          "Explain the positive feedback mechanism that triggers the LH surge",
          "Relate changes in endometrial structure to ovarian hormone levels",
        ]),
      ]),
      mod("pregnancy-lactation", "Pregnancy and Lactation", "Physiological changes of pregnancy and breastfeeding.", [
        unit("pregnancy-physiology", "Placenta and Maternal Adaptation", "Hormones of pregnancy and systemic changes.", [
          "State the main functions of the placenta, including hormone production",
          "Explain the basis of a urinary pregnancy test using human chorionic gonadotrophin",
          "Describe the cardiovascular and respiratory adaptations of normal pregnancy",
        ]),
        unit("parturition-lactation", "Parturition and Lactation", "Initiation of labour and milk production.", [
          "Outline the hormonal and mechanical factors involved in the initiation of labour",
          "Describe the roles of prolactin and oxytocin in lactation",
          "Explain the positive feedback loop operating during labour",
        ]),
      ]),
      mod("thermoregulation", "Thermoregulation", "Maintenance of core body temperature.", [
        unit("heat-balance", "Heat Production, Loss and Control", "Hypothalamic set point and effector responses.", [
          "List the routes of heat loss and the mechanisms of heat production",
          "Describe how the hypothalamus coordinates responses to cold and heat",
          "Explain how pyrogens reset the hypothalamic set point to cause fever",
        ]),
        unit("temperature-disorders", "Hypothermia and Hyperthermia", "Failure of thermoregulation.", [
          "Distinguish fever from hyperthermia by the state of the hypothalamic set point",
          "Describe the physiological consequences of hypothermia",
          "Outline the risk factors and features of heat stroke",
        ]),
      ]),
    ],
  },
  // ---------------------------------------------------------------- 1.8
  {
    slug: "mbbs-gross-anatomy-2",
    code: "MBB108",
    name: "Gross Anatomy II: Limbs and Musculoskeletal System",
    shortName: "Gross Anatomy II",
    description:
      "Bones, joints, muscles, nerves and vessels of the upper and lower limbs, with functional anatomy of posture and gait and the clinical localisation of injury.",
    year: "Year1",
    semester: 2,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(1),
    icon: "Bone",
    provenance: provenance(SRC.cambridgePdn, SRC.oxfordStructure),
    modules: [
      mod("upper-limb-bones-joints", "Upper Limb Bones and Joints", "Skeleton and articulations of the shoulder, arm, forearm and hand.", [
        unit("shoulder-girdle", "Shoulder Girdle and Glenohumeral Joint", "Clavicle, scapula, humerus and rotator cuff.", [
          "Identify the bony landmarks of the clavicle, scapula and proximal humerus",
          "Name the four rotator cuff muscles and state the action of each",
          "Explain why the glenohumeral joint is mobile but prone to dislocation",
        ]),
        unit("elbow-wrist-hand", "Elbow, Forearm, Wrist and Hand", "Joints, carpal bones and hand function.", [
          "Describe the movements of the elbow and the radioulnar joints",
          "Name the carpal bones and identify the scaphoid as the most commonly fractured",
          "Explain the muscles responsible for the power and precision grips",
        ]),
      ]),
      mod("brachial-plexus-nerves", "Brachial Plexus and Upper Limb Nerves", "Neural supply of the upper limb.", [
        unit("brachial-plexus", "Organisation of the Brachial Plexus", "Roots, trunks, divisions, cords and branches.", [
          "Draw the roots, trunks, divisions and cords of the brachial plexus and its major terminal branches",
          "Identify the spinal levels contributing to each terminal nerve",
          "Explain Erb palsy and Klumpke palsy in terms of the roots involved",
        ]),
        unit("upper-limb-nerve-injuries", "Peripheral Nerve Injuries of the Upper Limb", "Median, ulnar, radial and axillary nerves.", [
          "Describe the motor and sensory distribution of the median, ulnar, radial and axillary nerves",
          "Predict the signs of an injury to a nerve at the carpal tunnel, elbow or humeral shaft",
          "Perform a systematic motor and sensory screen of the upper limb nerves",
        ]),
      ]),
      mod("lower-limb-bones-joints", "Lower Limb Bones and Joints", "Skeleton and articulations of the hip, thigh, leg and foot.", [
        unit("hip-thigh", "Hip Joint and Thigh", "Femur, acetabulum and thigh compartments.", [
          "Identify the bony landmarks of the pelvis and femur relevant to the hip joint",
          "Describe the blood supply of the femoral head and its clinical significance after neck fracture",
          "List the muscles of the anterior, medial and posterior compartments of the thigh with their nerve supply",
        ]),
        unit("knee-leg-ankle-foot", "Knee, Leg, Ankle and Foot", "Menisci, cruciate ligaments and arches of the foot.", [
          "Describe the ligaments and menisci that stabilise the knee joint",
          "Explain the mechanism of injury and clinical test for an anterior cruciate ligament tear",
          "Describe the arches of the foot and the structures that maintain them",
        ]),
      ]),
      mod("lumbosacral-plexus", "Lumbosacral Plexus and Lower Limb Nerves", "Neural supply of the lower limb.", [
        unit("lumbar-sacral-plexus", "Lumbar and Sacral Plexuses", "Femoral, obturator and sciatic nerves.", [
          "Name the roots and the main branches of the lumbar and sacral plexuses",
          "Describe the course of the sciatic nerve and its division into tibial and common fibular nerves",
          "Identify the safe upper outer quadrant for gluteal intramuscular injection and the reason for it",
        ]),
        unit("lower-limb-nerve-injuries", "Peripheral Nerve Injuries of the Lower Limb", "Common fibular, femoral and gluteal nerve lesions.", [
          "Predict the gait abnormality caused by common fibular nerve injury at the fibular neck",
          "Explain Trendelenburg sign as a consequence of superior gluteal nerve damage",
          "Distinguish a sciatic from a femoral nerve lesion by motor and sensory loss",
        ]),
      ]),
      mod("limb-vascular-supply", "Vascular Supply and Venous Drainage", "Arteries, veins and lymphatics of the limbs.", [
        unit("limb-arteries", "Arterial Supply of the Upper and Lower Limbs", "Arterial trunks, anastomoses and palpable pulses.", [
          "Trace the arterial pathway from the subclavian artery to the digital arteries",
          "Trace the arterial pathway from the femoral artery to the dorsalis pedis",
          "Locate the sites at which brachial, radial, femoral, popliteal and posterior tibial pulses are palpated",
        ]),
        unit("limb-veins-lymphatics", "Venous Drainage and Lymphatics of the Limbs", "Superficial and deep veins and nodes.", [
          "Distinguish the superficial from the deep veins of the limbs and the perforating connections",
          "Explain how venous valve failure leads to varicose veins",
          "Describe the lymph node groups draining the upper and lower limbs",
        ]),
        unit("compartments-syndrome", "Fascial Compartments and Compartment Syndrome", "Compartment contents and pressure injury.", [
          "List the fascial compartments of the leg and the muscles and nerves within each",
          "Explain how raised compartment pressure causes ischaemia of muscle and nerve",
          "Recognise the clinical features that prompt urgent fasciotomy",
        ]),
      ]),
      mod("gait-posture", "Gait and Posture", "Functional anatomy of standing and walking.", [
        unit("posture-stance", "Posture and Weight Bearing", "Muscles maintaining upright stance.", [
          "Describe the curvatures of the vertebral column and the muscles that maintain posture",
          "Explain the line of gravity relative to the hip, knee and ankle in quiet standing",
          "Identify how the arches of the foot transmit body weight",
        ]),
        unit("gait-cycle", "The Gait Cycle", "Stance and swing phases and muscle activity.", [
          "Divide the gait cycle into stance and swing phases and describe each",
          "Identify the muscles active at heel strike and toe off",
          "Describe how weakness of a specific muscle group produces a characteristic abnormal gait",
        ]),
      ]),
      mod("fractures-joint-injuries", "Fractures and Joint Injuries", "Anatomical consequences of trauma.", [
        unit("fracture-anatomy", "Common Fractures and Associated Injuries", "Fracture patterns and neurovascular risk.", [
          "Describe the typical fracture patterns of the distal radius, clavicle and neck of femur",
          "Relate a fracture site to its likely neurovascular complication",
          "Describe the stages of fracture healing",
        ]),
        unit("joint-dislocations-ligaments", "Dislocations and Ligament Injuries", "Joint stability and injury.", [
          "Explain why anterior shoulder dislocation can injure the axillary nerve",
          "Compare a sprain with a dislocation in terms of the structures damaged",
          "Describe the unhappy triad of knee injury and the structures involved",
        ]),
      ]),
      mod("msk-imaging", "Musculoskeletal Imaging", "Reading plain films and cross-sectional images of the limbs.", [
        unit("plain-radiography-msk", "Plain Radiography of Bones and Joints", "Systematic approach to a limb radiograph.", [
          "Apply a systematic approach to reading a plain radiograph of a limb",
          "Identify the normal bony landmarks on radiographs of the shoulder, wrist and knee",
          "Recognise a fracture line, joint space narrowing and a dislocation on an image",
        ]),
        unit("ct-mri-ultrasound-msk", "CT, MRI and Ultrasound of the Musculoskeletal System", "Choosing and interpreting modalities.", [
          "Compare the strengths of CT, MRI and ultrasound in imaging bone and soft tissue",
          "Identify major muscles and joint structures on a limb cross-sectional image",
          "Select an appropriate imaging modality for a suspected ligament or tendon injury",
        ]),
      ]),
    ],
  },
  // ---------------------------------------------------------------- 1.9
  {
    slug: "mbbs-clinical-skills-1",
    code: "MBB109",
    name: "Clinical Skills and Learning with Patients I",
    shortName: "Clinical Skills I",
    description:
      "Structured history-taking, general inspection and vital signs, introductory systems examination, infection control, first aid and documentation, practised on simulated and real patients.",
    year: "Year1",
    semester: 2,
    creditUnits: 4,
    programme: PROGRAMME,
    accentColor: paletteColor(2),
    icon: "Stethoscope",
    provenance: provenance(SRC.oxfordCis, SRC.hopkinsG2S),
    modules: [
      mod("history-taking", "History-Taking Structure", "Gathering a complete and organised patient history.", [
        unit("history-framework", "Presenting Complaint and History Framework", "Components of a medical history.", [
          "List the components of a structured medical history in the correct order",
          "Explore a presenting complaint using a framework such as site, onset, character and severity",
          "Elicit past medical, drug, allergy, family and social history",
        ]),
        unit("history-presentation", "Summarising and Presenting a History", "Organising findings for a colleague.", [
          "Summarise a patient history in a concise structured case presentation",
          "Identify red-flag symptoms that require urgent escalation",
          "Check your understanding of the history by reflecting it back to the patient",
        ]),
      ]),
      mod("inspection-vital-signs", "General Inspection and Vital Signs", "The first look at the patient and the basic measurements.", [
        unit("general-inspection", "General Inspection and Hands", "Observation for signs of systemic disease.", [
          "Describe a patient's general appearance using systematic observations",
          "Identify clubbing, anaemia, jaundice and cyanosis on inspection",
          "Examine the hands for signs that point to cardiovascular, respiratory or hepatic disease",
        ]),
        unit("measuring-vital-signs", "Measuring and Recording Vital Signs", "Pulse, blood pressure, respiratory rate, temperature and saturation.", [
          "Measure pulse rate and rhythm and describe its character",
          "Measure blood pressure accurately using a sphygmomanometer and appropriately sized cuff",
          "Record respiratory rate, temperature and oxygen saturation and recognise abnormal values",
        ]),
      ]),
      mod("cardiovascular-respiratory-exam", "Cardiovascular and Respiratory Examination", "Structured examination of the heart and lungs.", [
        unit("cardiovascular-examination", "Cardiovascular Examination", "Inspection, palpation and auscultation of the heart.", [
          "Perform a structured cardiovascular examination including jugular venous pressure and peripheral pulses",
          "Palpate the apex beat and locate the four auscultation areas",
          "Identify the first and second heart sounds on auscultation",
        ]),
        unit("respiratory-examination", "Respiratory Examination", "Chest inspection, percussion and auscultation.", [
          "Perform a structured respiratory examination including chest expansion and tracheal position",
          "Compare percussion notes across symmetrical areas of the chest",
          "Distinguish normal vesicular breath sounds from added sounds such as wheeze and crackles",
        ]),
      ]),
      mod("abdominal-examination", "Abdominal Examination", "Systematic examination of the abdomen.", [
        unit("abdomen-inspection-palpation", "Inspection, Palpation and Percussion of the Abdomen", "Regions, organs and masses.", [
          "Divide the abdomen into regions and relate each to the underlying organs",
          "Palpate the abdomen gently and deeply and identify signs of peritonism",
          "Examine for hepatomegaly, splenomegaly and ascites",
        ]),
        unit("abdomen-auscultation-completion", "Auscultation and Completing the Abdominal Examination", "Bowel sounds, hernial orifices and associated findings.", [
          "Auscultate for bowel sounds and abdominal bruits",
          "Examine the hernial orifices with the patient standing or coughing",
          "State which further examinations would complete the abdominal assessment",
        ]),
      ]),
      mod("infection-control", "Hand Hygiene and Infection Control", "Preventing transmission of infection in clinical settings.", [
        unit("hand-hygiene", "Hand Hygiene Technique and Indications", "The five moments for hand hygiene.", [
          "Demonstrate the recommended steps of handwashing with soap and water",
          "State the five moments for hand hygiene during patient care",
          "Choose between alcohol hand rub and handwashing for a given situation",
        ]),
        unit("standard-precautions", "Standard Precautions and Personal Protective Equipment", "Protecting patients and staff.", [
          "Don and doff gloves, a gown and a mask in the correct sequence",
          "Explain the principle of standard precautions applied to all patients",
          "Describe the safe handling and disposal of sharps",
        ]),
      ]),
      mod("bls-first-aid", "Basic Life Support and First Aid", "Immediate management of collapse and common emergencies.", [
        unit("basic-life-support", "Basic Life Support and Defibrillation", "Recognising cardiac arrest and starting CPR.", [
          "Recognise cardiac arrest and activate the emergency response",
          "Perform chest compressions at the recommended rate and depth with rescue breaths",
          "Use an automated external defibrillator following its prompts",
        ]),
        unit("first-aid-emergencies", "First Aid for Bleeding, Choking and Recovery Position", "Managing common emergencies.", [
          "Control external bleeding using direct pressure",
          "Manage an adult with complete airway obstruction from choking",
          "Place an unconscious breathing patient in the recovery position",
        ]),
      ]),
      mod("documentation", "Documentation", "Recording clinical information accurately and legally.", [
        unit("clinical-note-writing", "Writing a Clinical Note", "Legible, structured and timely records.", [
          "Write a clinical entry that is dated, timed, legible and signed",
          "Record history and examination findings in a structured format",
          "Distinguish fact from interpretation when documenting a patient encounter",
        ]),
        unit("records-legal-ethical", "Legal and Ethical Aspects of Record-Keeping", "Accuracy, confidentiality and retention.", [
          "Explain why accurate records are important for patient safety and medicolegal reasons",
          "Describe how to correct a documentation error appropriately",
          "State the confidentiality requirements that apply to written and electronic notes",
        ]),
      ]),
      mod("communicating-anxious-patients", "Communicating with Anxious Patients", "Responding to distress and difficult conversations.", [
        unit("recognising-anxiety", "Recognising and Responding to Anxiety", "Verbal and non-verbal cues.", [
          "Identify verbal and non-verbal signs that a patient is anxious",
          "Respond to a patient's concern using empathic and non-judgemental language",
          "Adapt pace and vocabulary to the patient's level of understanding",
        ]),
        unit("explaining-procedures", "Explaining Procedures and Checking Understanding", "Clear explanations and shared understanding.", [
          "Explain a simple clinical examination or procedure in plain language",
          "Use the teach-back method to check that a patient has understood",
          "Respond appropriately to a patient who refuses an examination",
        ]),
      ]),
    ],
  },
];

function paletteColor(index: number): string {
  return MBBS_PALETTE[index % MBBS_PALETTE.length]!;
}

export const MBBS_YEAR_1: CourseSpec[] = COURSES;
