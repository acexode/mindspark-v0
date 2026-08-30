/**
 * Official NERDC / WAEC / NECO topic gaps for the six core subjects.
 * Sources:
 * - NERDC e-Curriculum (General Mathematics themes; JSS English Studies)
 * - examquestions.ng JSS1–JSS3 Mathematics scheme of work
 * - WAEC General Mathematics syllabus 2026 (ijlet.com / waecguide)
 * - WAEC Physics / Chemistry syllabuses (waecsyllabus.com)
 * - NECO Economics syllabus topic list (masterneco.com.ng)
 */
import type { Topic } from "../lib/content/schema";
import { makeTopic } from "./lib/topic-builder";

export const SYLLABUS_GAPS: Record<string, { topics: Topic[] }> = {
  mathematics: {
    topics: [
      makeTopic("sec.mathematics", "jss-number", "JSS Number Work", 20, "Whole numbers, LCM and HCF, directed numbers — NERDC JSS1 Mathematics first term.", ["JSS1"], [
        { slug: "whole-numbers-and-primes", name: "Whole Numbers and Primes", summary: "Place value, prime factors, and the four operations on whole numbers.", objectives: ["Write whole numbers in standard form at JSS level", "Find prime factors of a whole number", "Add, subtract, multiply and divide whole numbers accurately"] },
        { slug: "lcm-and-hcf", name: "LCM and HCF", summary: "Lowest common multiple and highest common factor, with squares and square roots.", objectives: ["Find the LCM of two or three numbers", "Find the HCF of two or three numbers", "Use LCM and HCF in a simple word problem"] },
        { slug: "directed-numbers", name: "Directed Numbers", summary: "Positive and negative numbers and the four operations on them.", objectives: ["Place directed numbers on a number line", "Add and subtract directed numbers", "Multiply and divide directed numbers"] },
      ]),
      makeTopic("sec.mathematics", "jss-shapes-and-graphs", "JSS Shapes and Graphs", 21, "Plane shapes, scale drawing, simple graphs — NERDC JSS1 second and third terms.", ["JSS1", "JSS2"], [
        { slug: "plane-shapes", name: "Plane Shapes", summary: "Squares, rectangles, parallelograms, rhombuses and kites in the environment.", objectives: ["Name common plane shapes and state their properties", "Identify plane shapes in everyday objects", "Solve a simple quantitative problem on a plane shape"] },
        { slug: "scale-drawing", name: "Scale Drawing", summary: "Representing real lengths on paper using a scale.", objectives: ["Explain what a scale drawing is for", "Convert a real length to a drawing length using a scale", "Read a distance from a simple scale drawing"] },
        { slug: "simple-graphs", name: "Simple Graphs", summary: "The Cartesian plane and graphs of linear relations from real life.", objectives: ["Plot a point on the Cartesian plane", "Draw a simple linear graph from a table of values", "Read information from a straight-line graph"] },
      ]),
      makeTopic("sec.mathematics", "further-number", "Further Number (WAEC)", 22, "Modular arithmetic, logical reasoning, matrices and binary operations from the WAEC General Mathematics syllabus.", ["SS2", "SS3"], [
        { slug: "modular-arithmetic", name: "Modular Arithmetic", summary: "Clock and market-day arithmetic: a ≡ b (mod n).", objectives: ["Explain a ≡ b (mod n) with a clock or market-day example", "Add, subtract and multiply in a given modulus", "Solve a simple congruence used in daily life"] },
        { slug: "logical-reasoning", name: "Logical Reasoning", summary: "Statements, negation and implication as listed in the WAEC syllabus.", objectives: ["Identify a simple statement as true or false", "Write the negation of a simple statement", "Interpret an implication 'if p then q'"] },
        { slug: "matrices-2-by-2", name: "2-by-2 Matrices", summary: "WAEC restricts matrices to order 2×2, including determinants and 2×2 simultaneous equations.", objectives: ["Identify the order and type of a 2×2 matrix", "Add, subtract and multiply 2×2 matrices", "Use a determinant to solve two linear equations"] },
        { slug: "binary-operations", name: "Binary Operations", summary: "An operation * defined on a set, as in the WAEC algebraic-processes section.", objectives: ["Evaluate a * b for a given binary operation", "Test a simple operation for commutativity", "Find an identity element when it exists"] },
      ]),
      makeTopic("sec.mathematics", "further-algebra-geometry", "Further Algebra and Geometry (WAEC)", 23, "Change of subject, quadratic graphs, constructions, loci and vectors from the WAEC syllabus.", ["SS2", "SS3"], [
        { slug: "change-of-subject", name: "Change of Subject", summary: "Rearranging a formula and substituting, e.g. v = u + at.", objectives: ["Make a specified variable the subject of a formula", "Substitute given values after changing the subject", "Rearrange a formula that includes a square or a fraction"] },
        { slug: "quadratic-graphs", name: "Graphs of Quadratic Functions", summary: "Tables of values, intercepts, turning point and using a tangent for gradient.", objectives: ["Complete a table of values for y = ax² + bx + c", "Read intercepts and the turning point from a sketch", "Estimate the gradient at a point by drawing a tangent"] },
        { slug: "constructions-and-loci", name: "Constructions and Loci", summary: "WAEC plane-geometry items: bisectors, triangles and simple loci.", objectives: ["Describe how to bisect a line or an angle", "State the locus of points equidistant from two points or two lines", "Identify the locus that matches a given worded condition"] },
        { slug: "vectors", name: "Vectors", summary: "Column vectors, addition and scalar multiplication on the plane.", objectives: ["Write a displacement as a column vector", "Add two vectors and multiply a vector by a scalar", "Find the magnitude of a 2-D vector"] },
      ]),
    ],
  },

  english: {
    topics: [
      makeTopic("sec.english", "jss-reading", "JSS Reading", 20, "Comprehension and listening at junior-secondary level — NERDC English Studies.", ["JSS1", "JSS2"], [
        { slug: "jss-comprehension", name: "JSS Comprehension", summary: "Reading a short passage and answering questions in your own words.", objectives: ["Identify the main idea of a short passage", "Answer a factual question from a passage", "Give the meaning of a word as used in a passage"] },
        { slug: "jss-listening-and-speech", name: "Listening and Speech", summary: "Hearing vowel and consonant sounds and speaking clearly in class.", objectives: ["Identify a given English vowel sound in a familiar word", "Pronounce a short sentence with clear word stress", "Listen and recall two facts from a short spoken text"] },
      ]),
      makeTopic("sec.english", "jss-grammar", "JSS Grammar", 21, "Word classes and simple sentences for JSS1–JSS2.", ["JSS1", "JSS2"], [
        { slug: "jss-nouns-and-verbs", name: "Nouns and Verbs", summary: "Naming words and action words in simple sentences.", objectives: ["Identify nouns and verbs in a simple sentence", "Use the simple present and simple past of common verbs", "Choose the correct verb to agree with a singular or plural subject"] },
        { slug: "jss-simple-sentences", name: "Simple Sentences", summary: "Subject, verb and object in a clear English sentence.", objectives: ["Identify the subject and the verb of a sentence", "Write a simple sentence with a capital letter and a full stop", "Turn a jumbled group of words into a correct sentence"] },
      ]),
      makeTopic("sec.english", "jss-writing", "JSS Writing", 22, "Guided composition and letters for junior secondary.", ["JSS1", "JSS2", "JSS3"], [
        { slug: "jss-narrative-writing", name: "JSS Narrative Writing", summary: "Telling a short, well-ordered story with a beginning, middle and end.", objectives: ["Plan a short narrative with a clear sequence", "Use past-tense verbs to tell what happened", "Write an opening that sets the scene"] },
        { slug: "jss-letters", name: "JSS Letters", summary: "Friendly letters first, then a simple formal letter in JSS3.", objectives: ["Write the address, date and greeting of an informal letter", "State the difference between an informal and a formal letter", "List the features of a simple formal letter"] },
      ]),
    ],
  },

  physics: {
    topics: [
      makeTopic("sec.physics", "jss-basic-physics", "Basic Science: Energy and Force", 20, "JSS Intermediate Science ideas that lead into SS Physics — not SS3 content.", ["JSS1", "JSS2", "JSS3"], [
        { slug: "energy-around-us", name: "Energy Around Us", summary: "Forms of energy a junior student can name and give examples of.", objectives: ["Name common forms of energy (heat, light, sound, electrical, mechanical)", "Give a Nigerian everyday example of each form", "State that energy can change from one form to another"] },
        { slug: "force-and-simple-machines-jss", name: "Force and Simple Machines", summary: "Pushes, pulls and the levers and pulleys used at home and on the farm.", objectives: ["Define a force as a push or a pull", "Name simple machines: lever, pulley, inclined plane", "Give one example of a lever used in a Nigerian home"] },
      ]),
      makeTopic("sec.physics", "further-waves-and-fields", "Further Waves and Fields (WAEC)", 21, "Electromagnetic spectrum, optical instruments, capacitors and fibre optics from the WAEC Physics syllabus.", ["SS2", "SS3"], [
        { slug: "electromagnetic-spectrum", name: "Electromagnetic Spectrum", summary: "Radio to gamma rays and everyday uses of each region.", objectives: ["List the main regions of the electromagnetic spectrum in order", "State a use of radio waves, X-rays and gamma rays", "State that all EM waves travel at the speed of light in vacuum"] },
        { slug: "optical-instruments", name: "Optical Instruments", summary: "The eye, camera, microscope and telescope as applications of lenses.", objectives: ["Describe the camera or the eye as a lens system", "State the function of a simple microscope", "Explain one defect of vision and how a lens corrects it"] },
        { slug: "capacitors", name: "Capacitors", summary: "Storing charge; capacitance and series/parallel combinations.", objectives: ["Define capacitance and state its SI unit", "Calculate charge from Q = CV", "Find the effective capacitance of two capacitors in series or parallel"] },
        { slug: "fibre-optics", name: "Fibre Optics", summary: "Total internal reflection used to carry light in a fibre — a WAEC short-structured topic.", objectives: ["Explain total internal reflection as the principle of fibre optics", "State one medical and one communication use of optical fibre", "Give a reason why fibre is preferred to copper for some signals"] },
      ]),
    ],
  },

  biology: {
    topics: [
      makeTopic("sec.biology", "jss-living-things", "Basic Science: Living Things", 20, "JSS Intermediate Science — characteristics of living things, not SS3 genetics.", ["JSS1", "JSS2"], [
        { slug: "living-and-non-living", name: "Living and Non-living Things", summary: "How we tell a goat from a stone, using the characteristics of life.", objectives: ["List the characteristics of living things (MRS GREN / similar)", "Give examples of living and non-living things in the school compound", "Explain why a car is not a living thing even though it moves"] },
        { slug: "the-human-body-jss", name: "The Human Body (JSS)", summary: "Main organs a junior student should be able to name and place.", objectives: ["Name the brain, heart, lungs, stomach and kidney and state one function of each", "Locate those organs on a simple body outline", "State one way to keep the body healthy"] },
      ]),
      makeTopic("sec.biology", "microorganisms-and-habitats", "Micro-organisms and Habitats (WAEC)", 21, "Microbes, aquatic and terrestrial habitats from the WAEC Biology syllabus.", ["SS1", "SS2"], [
        { slug: "micro-organisms", name: "Micro-organisms", summary: "Bacteria, viruses, fungi and protozoa — useful and harmful examples.", objectives: ["Name the main groups of micro-organisms", "Give one useful and one harmful example of a micro-organism", "State a method of controlling harmful microbes"] },
        { slug: "aquatic-habitats", name: "Aquatic Habitats", summary: "Ponds, streams, lakes and the sea as WAEC ecology items.", objectives: ["Describe a pond or stream habitat in Nigeria", "Name producers, consumers and decomposers in that habitat", "State an adaptation of one aquatic organism"] },
        { slug: "terrestrial-habitats", name: "Terrestrial Habitats", summary: "Forest, grassland and desert, and how organisms cope there.", objectives: ["Describe one Nigerian terrestrial habitat", "State adaptations of a named plant or animal to that habitat", "Explain one human activity that damages the habitat"] },
      ]),
    ],
  },

  chemistry: {
    topics: [
      makeTopic("sec.chemistry", "jss-matter", "Basic Science: Matter", 20, "JSS Intermediate Science — matter and mixtures, not SS3 organic chemistry.", ["JSS1", "JSS2", "JSS3"], [
        { slug: "matter-around-us", name: "Matter Around Us", summary: "Solids, liquids and gases that a junior student can see and describe.", objectives: ["State the three states of matter and the arrangement of particles in each", "Give everyday Nigerian examples of each state", "Describe melting, freezing, evaporation and condensation in simple terms"] },
        { slug: "mixtures-jss", name: "Mixtures", summary: "Separating sand and water, salt and water, and other home mixtures.", objectives: ["Distinguish a mixture from a pure substance at JSS level", "Describe filtration, evaporation and decantation", "Choose a method to separate a named mixture"] },
      ]),
      makeTopic("sec.chemistry", "further-applied-chemistry", "Applied Chemistry (WAEC)", 21, "Qualitative analysis, polymers, soaps and the environment from the WAEC Chemistry syllabus.", ["SS2", "SS3"], [
        { slug: "qualitative-analysis", name: "Qualitative Analysis", summary: "Tests for common gases and ions used in the school laboratory.", objectives: ["State the test and result for hydrogen, oxygen, carbon dioxide and chlorine", "Describe a flame test for Na+, Ca2+ or Cu2+", "Outline how to test for a chloride, sulphate or carbonate in solution"] },
        { slug: "polymers-and-plastics", name: "Polymers and Plastics", summary: "Addition and condensation polymers, and the environmental problem of plastics.", objectives: ["Define a polymer and give an example of an addition and a condensation polymer", "State uses of polythene and nylon", "Give one environmental problem caused by plastic waste in Nigeria"] },
        { slug: "soaps-and-detergents", name: "Soaps and Detergents", summary: "How soap is made and why it behaves differently in hard water.", objectives: ["Outline the making of soap from fat and alkali", "Explain why soap lathers poorly in hard water", "State one advantage of a detergent over soap"] },
        { slug: "environmental-chemistry", name: "Environmental Chemistry", summary: "Air and water pollution and the chemistry behind acid rain.", objectives: ["Name common air pollutants and a source of each in Nigeria", "Explain how acid rain forms", "State one method of reducing a named form of pollution"] },
      ]),
    ],
  },

  economics: {
    topics: [
      makeTopic("sec.economics", "jss-economic-life", "Introduction to Economic Life", 20, "JSS Business Studies / Social Studies ideas — needs, wants and money — not SS3 planning.", ["JSS3"], [
        { slug: "needs-wants-and-money", name: "Needs, Wants and Money", summary: "What a family must have, what it would like, and why we use naira.", objectives: ["Distinguish a need from a want with a home example", "State two functions of money", "Explain why a family must choose what to buy"] },
      ]),
      makeTopic("sec.economics", "tools-and-consumer", "Tools of Analysis and the Consumer (NECO)", 21, "Basic tools, consumer behaviour and price control from the NECO Economics syllabus.", ["SS1", "SS2"], [
        { slug: "tools-of-analysis", name: "Basic Tools of Economic Analysis", summary: "Tables, charts, graphs and simple averages used to present economic data.", objectives: ["Read a simple table or bar chart of economic data", "Calculate the mean, median or mode of a small data set", "Explain why economists use graphs"] },
        { slug: "consumer-behaviour", name: "Consumer Behaviour", summary: "Utility, diminishing marginal utility and consumer equilibrium.", objectives: ["Define total utility and marginal utility", "State the law of diminishing marginal utility", "Explain consumer equilibrium in outline"] },
        { slug: "price-control", name: "Price Control", summary: "Maximum and minimum prices set by government.", objectives: ["Define a price ceiling and a price floor", "Give a Nigerian example of a price control", "State one effect of a maximum price below equilibrium"] },
      ]),
      makeTopic("sec.economics", "firms-and-resources", "Firms, Trade and Resources (NECO)", 22, "Business organisations, distributive trade, natural resources and integration.", ["SS2", "SS3"], [
        { slug: "business-organisations", name: "Business Organisations", summary: "Sole trader, partnership, companies and cooperatives.", objectives: ["State features of a sole proprietorship and a partnership", "Explain limited liability in a company", "Give a reason for forming a cooperative"] },
        { slug: "distributive-trade", name: "Distributive Trade", summary: "Wholesale, retail and the channels that move goods to the buyer.", objectives: ["Distinguish wholesale from retail trade", "Draw a simple channel of distribution", "State one service of the wholesaler to the retailer"] },
        { slug: "natural-resources", name: "Natural Resources", summary: "Petroleum, farmland and minerals and their place in the Nigerian economy.", objectives: ["Name Nigeria's major natural resources", "State the contribution of crude oil to government revenue", "Give one problem of depending heavily on oil"] },
        { slug: "economic-integration", name: "Economic Integration", summary: "ECOWAS and other groupings, plus IMF, World Bank and OPEC.", objectives: ["State the aims of ECOWAS", "Distinguish a free-trade area from a customs union in outline", "State one function of the IMF or the World Bank"] },
      ]),
    ],
  },
};
