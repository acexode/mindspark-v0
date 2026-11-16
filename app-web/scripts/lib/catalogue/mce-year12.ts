import type { CourseSpec, ModuleDraft } from "../undergrad-course";
import { paletteColor } from "../undergrad-course";
import type { SubtopicDraft } from "../topic-builder";

/**
 * BEng Mechanical Engineering, Years 1 and 2. Course list and sequencing follow
 * docs/research/mechanical-curriculum.md. Courses that reuse existing repo
 * subjects (mathematics 1/2, engineering mechanics, fluid mechanics 1) are
 * intentionally NOT duplicated here.
 */
const PROGRAMME = "beng-mechanical-engineering";

/** Oranges, steels and teals. */
export const MCE_PALETTE = ["#b3541e", "#4a5d73", "#1f7a7a", "#c77a1f", "#5f6b78", "#2a8f8a"];

interface Provenance {
  sources: Array<{ id: string; title: string; type: "institution" | "authored"; url?: string }>;
  reviewStatus: "draft";
  verified: false;
  note: string;
}

/** A course spec carrying provenance (toSubject currently ignores extra fields). */
export type CourseWithProvenance = CourseSpec & { provenance: Provenance };

const SOURCES = {
  imperial: { id: "imperial-mechanical-engineering", title: "Imperial College London, Mechanical Engineering", url: "https://www.imperial.ac.uk/study/courses/undergraduate/mechanical-engineering/" },
  mit: { id: "mit-course-2", title: "MIT Course 2 (Mechanical Engineering)", url: "https://catalog.mit.edu/degree-charts/mechanical-engineering-course-2" },
  berkeley: { id: "berkeley-mechanical-engineering", title: "UC Berkeley, Mechanical Engineering", url: "https://engineering.berkeley.edu/academics/undergraduate-programs/mechanical-engineering/" },
  gatech: { id: "georgia-tech-mechanical-engineering", title: "Georgia Tech, Mechanical Engineering BS", url: "https://catalog.gatech.edu/programs/mechanical-engineering-general-bs" },
  cambridge: { id: "cambridge-engineering-tripos", title: "Cambridge Engineering Tripos", url: "https://teaching.eng.cam.ac.uk/node/541" },
  michigan: { id: "michigan-mechanical-engineering", title: "University of Michigan, Mechanical Engineering", url: "https://me.engin.umich.edu/academics/undergrad/handbook/bachelors" },
  stanford: { id: "stanford-mechanical-engineering", title: "Stanford University, Mechanical Engineering BS", url: "https://bulletin.stanford.edu/programs/ME-BS" },
} as const;

type SourceKey = keyof typeof SOURCES;

const NOTE =
  "Course structure synthesised from published curricula of leading European and US engineering programmes; wording is original. Not yet technically reviewed.";

const u = (slug: string, name: string, summary: string, objectives: [string, string, string]): SubtopicDraft => ({
  slug,
  name,
  summary,
  objectives,
});

const m = (slug: string, name: string, summary: string, units: SubtopicDraft[]): ModuleDraft => ({
  slug,
  name,
  summary,
  units,
});

interface Meta {
  slug: string;
  code: string;
  name: string;
  shortName: string;
  description: string;
  year: "Year1" | "Year2";
  semester: 1 | 2;
  creditUnits: number;
  icon: string;
  src: SourceKey[];
}

let colourIndex = 0;
function course(meta: Meta, modules: ModuleDraft[]): CourseWithProvenance {
  const { src, ...rest } = meta;
  return {
    ...rest,
    programme: PROGRAMME,
    accentColor: paletteColor(MCE_PALETTE, colourIndex++),
    modules,
    provenance: {
      sources: [
        ...src.map((key) => ({ ...SOURCES[key], type: "institution" as const })),
        { id: "mindspark-authored", title: "Mindspark authored course structure", type: "authored" as const },
      ],
      reviewStatus: "draft",
      verified: false,
      note: NOTE,
    },
  };
}

export const MCE_YEAR_1_2: CourseSpec[] = [
  /* ------------------------------------------------------------------ YEAR 1 */
  course(
    {
      slug: "mce-materials-for-mechanical-engineers",
      code: "MCE103",
      name: "Materials for Mechanical Engineers",
      shortName: "Mech Materials",
      description:
        "Atomic structure, mechanical testing, phase diagrams, heat treatment, polymers, ceramics, composites and first-pass material selection for mechanical components.",
      year: "Year1",
      semester: 1,
      creditUnits: 3,
      icon: "Cube",
      src: ["imperial", "cambridge", "berkeley"],
    },
    [
      m("bonding-and-crystal-structure", "Bonding and Crystal Structure", "How atomic bonding and crystal packing set the stiffness and density of materials.", [
        u("atomic-bonding", "Atomic Bonding", "Ionic, covalent, metallic and secondary bonds and their effect on properties.", [
          "Classify a material as metallic, ceramic or polymeric from its dominant bonding type",
          "Relate bond strength and the shape of the energy-separation curve to elastic modulus and melting point",
          "Explain why metals conduct electricity while most ceramics and polymers do not",
        ]),
        u("crystal-structures", "Crystal Structures", "FCC, BCC and HCP lattices, packing and directions.", [
          "Calculate the atomic packing factor of a simple cubic, BCC and FCC unit cell",
          "Compute the theoretical density of a metal from its lattice parameter and atomic mass",
          "Identify Miller indices of planes and directions in a cubic crystal",
        ]),
      ]),
      m("defects-and-diffusion", "Defects and Diffusion", "Imperfections in crystals and the thermally activated movement of atoms.", [
        u("point-and-line-defects", "Point and Line Defects", "Vacancies, interstitials, substitutional atoms and dislocations.", [
          "Calculate the equilibrium vacancy fraction at a given temperature using an Arrhenius expression",
          "Distinguish edge from screw dislocations using the Burgers vector",
          "Explain why real metals yield at stresses far below the theoretical shear strength",
        ]),
        u("diffusion", "Diffusion", "Fick's laws and temperature dependence of diffusion.", [
          "Apply Fick's first law to compute steady-state flux through a thin membrane",
          "Calculate a diffusion coefficient at a new temperature from an activation energy",
          "Estimate the case depth produced by carburising using the error-function solution",
        ]),
      ]),
      m("tensile-test", "The Tensile Test and Stress-Strain Behaviour", "Reading a tensile test as the primary source of mechanical property data.", [
        u("engineering-and-true-stress", "Engineering and True Stress-Strain", "Converting between the two definitions and locating key points on the curve.", [
          "Determine yield strength, ultimate tensile strength and ductility from a stress-strain curve",
          "Convert engineering stress and strain to true stress and true strain below necking",
          "Explain why the engineering curve falls after necking while the true curve keeps rising",
        ]),
        u("elastic-modulus-and-resilience", "Stiffness, Resilience and Toughness", "Energy absorbed in elastic and plastic deformation.", [
          "Calculate modulus of resilience from yield strength and Young's modulus",
          "Estimate toughness as the area under a stress-strain curve",
          "Compare two alloys for energy absorption using their stress-strain data",
        ]),
      ]),
      m("elasticity-plasticity-hardness", "Elasticity, Plasticity and Hardness", "Quantifying how materials deform and resist indentation.", [
        u("elastic-constants", "Elastic Constants", "Young's modulus, shear modulus, Poisson's ratio and bulk modulus.", [
          "Use the relation between E, G and Poisson's ratio for an isotropic material to find a missing constant",
          "Calculate lateral strain from an axial strain and Poisson's ratio",
          "Compute the volume change of a bar under uniaxial tension",
        ]),
        u("hardness-and-strengthening", "Hardness Testing and Strengthening", "Brinell, Vickers and Rockwell tests and the ways metals are strengthened.", [
          "Compute a Brinell or Vickers hardness number from indentation measurements",
          "Estimate tensile strength from hardness using the approximate proportionality for steels",
          "Describe how grain refinement, solid solution and strain hardening each impede dislocation motion",
        ]),
      ]),
      m("phase-diagrams", "Phase Diagrams", "Equilibrium phases, compositions and fractions read from binary diagrams.", [
        u("binary-phase-diagrams", "Binary Isomorphous and Eutectic Diagrams", "Liquidus, solidus, tie lines and the lever rule.", [
          "Apply the lever rule to compute phase fractions at a stated temperature and composition",
          "Identify eutectic, peritectic and solvus features on a binary diagram",
          "Sketch the cooling path and resulting microstructure of an alloy through a eutectic reaction",
        ]),
        u("iron-carbon-diagram", "The Iron-Carbon Diagram", "Ferrite, austenite, cementite and the eutectoid reaction.", [
          "Calculate the fractions of proeutectoid ferrite and pearlite in a hypoeutectoid steel",
          "Locate the eutectoid composition and temperature on the Fe-Fe3C diagram",
          "Distinguish a steel from a cast iron by carbon content",
        ]),
      ]),
      m("heat-treatment-microstructure", "Heat Treatment and Microstructure", "Controlling properties of steels through thermal cycles.", [
        u("annealing-quenching-tempering", "Annealing, Quenching and Tempering", "How cooling rate sets the microstructure of a steel.", [
          "Explain why rapid quenching of a medium-carbon steel produces martensite",
          "Predict the effect of tempering temperature on hardness and toughness of a quenched steel",
          "Select a heat treatment to meet a stated hardness and toughness target",
        ]),
        u("hardenability", "Hardenability and Surface Treatments", "Depth of hardening and case-hardening routes.", [
          "Read a Jominy end-quench curve to compare the hardenability of two steels",
          "Explain the role of alloying elements in raising hardenability",
          "Compare carburising, nitriding and induction hardening for a gear tooth",
        ]),
      ]),
      m("polymers-ceramics-overview", "Polymers, Ceramics and Composites Overview", "First look at non-metallic engineering materials and how they differ from metals.", [
        u("polymers", "Polymers", "Thermoplastics, thermosets and elastomers, and the glass transition.", [
          "Distinguish thermoplastics, thermosets and elastomers by structure and behaviour on heating",
          "Describe how temperature relative to the glass transition changes stiffness of an amorphous polymer",
          "Select a polymer class for a snap-fit part and justify the choice",
        ]),
        u("ceramics-and-composites", "Ceramics and Composites", "Brittle behaviour of ceramics and the idea of combining phases.", [
          "Explain why ceramics are strong in compression but weak in tension",
          "Estimate the longitudinal modulus of a fibre composite using the rule of mixtures",
          "Compare the specific stiffness of a carbon-fibre laminate with that of steel",
        ]),
      ]),
      m("property-charts-selection", "Property Charts and Selection", "Choosing materials systematically rather than by habit.", [
        u("property-charts", "Reading Property Charts", "Ashby-style charts of property against property.", [
          "Locate material classes on a modulus-density chart and identify the stiffest per unit mass",
          "Apply a guideline line of constant E over density to rank candidate materials",
          "Explain what a chart reveals about the range of properties within one material class",
        ]),
        u("performance-indices-intro", "Performance Indices", "Combining function, constraint and objective into a single index.", [
          "Derive the performance index for a light, stiff tie loaded in tension",
          "Rank three candidate materials using a stated performance index and property values",
          "Distinguish function, constraints, objective and free variables in a selection problem",
        ]),
      ]),
    ],
  ),

  course(
    {
      slug: "mce-engineering-drawing-cad",
      code: "MCE104",
      name: "Engineering Drawing and CAD",
      shortName: "Drawing & CAD",
      description:
        "Orthographic projection, dimensioning, tolerances and fits, GD&T, parametric solid modelling, assemblies and the standard conventions of mechanical drawings.",
      year: "Year1",
      semester: 1,
      creditUnits: 3,
      icon: "PenNib",
      src: ["imperial", "berkeley", "mit"],
    },
    [
      m("orthographic-projection", "Orthographic Projection and Sections", "Representing three-dimensional parts unambiguously on paper.", [
        u("projection-views", "First and Third Angle Projection", "Arranging principal views and choosing a minimum set.", [
          "Draw front, top and side views of a part from a pictorial sketch",
          "Distinguish first-angle from third-angle projection from the symbol on a drawing",
          "Select the minimum set of views that fully describes a part",
        ]),
        u("sectional-views", "Sectional and Auxiliary Views", "Revealing hidden features and true shapes of inclined faces.", [
          "Construct a full section through a part and apply the correct hatching conventions",
          "Identify features that are not sectioned by convention, such as ribs and shafts cut lengthwise",
          "Construct an auxiliary view showing the true shape of an inclined surface",
        ]),
      ]),
      m("dimensioning-tolerances-fits", "Dimensioning, Tolerances and Fits", "Specifying size so that parts are interchangeable and functional.", [
        u("dimensioning-practice", "Dimensioning Practice", "Placing dimensions clearly and without redundancy.", [
          "Dimension a part so each feature is defined once and no dimension is redundant",
          "Choose datums that reflect how a part is made and how it functions",
          "Identify chain, baseline and coordinate dimensioning and state the tolerance accumulation of each",
        ]),
        u("limits-and-fits", "Limits and Fits", "Clearance, transition and interference fits using the ISO system.", [
          "Compute maximum and minimum clearance or interference from hole and shaft limits",
          "Classify a fit as clearance, transition or interference",
          "Select a preferred fit for a bearing seat and justify it",
        ]),
      ]),
      m("gdt-basics", "Geometric Dimensioning and Tolerancing", "Controlling form, orientation and location beyond plus-minus tolerances.", [
        u("gdt-symbols", "Feature Control Frames and Datums", "Reading the symbols that govern geometric tolerances.", [
          "Interpret the components of a feature control frame",
          "Explain how a datum reference frame constrains the six degrees of freedom of a part",
          "Distinguish form, orientation, location and runout tolerances",
        ]),
        u("position-and-material-condition", "Position and Material Condition", "True position and the bonus tolerance from material condition modifiers.", [
          "Calculate the diameter of the position tolerance zone for a hole from coordinates and deviation",
          "Compute bonus tolerance for a hole at maximum material condition",
          "Explain why geometric tolerancing can permit a larger tolerance than a coordinate tolerance",
        ]),
      ]),
      m("sketching-and-constraints", "Sketching and Constraints", "Building fully defined two-dimensional profiles for solid models.", [
        u("freehand-sketching", "Freehand and Technical Sketching", "Communicating design ideas quickly in isometric and orthographic form.", [
          "Produce a proportioned isometric sketch of a simple component",
          "Sketch orthographic views by hand with correct line types",
          "Annotate a concept sketch with the key dimensions that drive the design",
        ]),
        u("sketch-constraints", "Geometric and Dimensional Constraints", "Fully defining a sketch with relations and dimensions.", [
          "Apply geometric constraints such as tangent, concentric and symmetric to a sketch profile",
          "Identify an under-defined or over-defined sketch from the degrees of freedom remaining",
          "Choose dimensions that capture design intent rather than convenient numbers",
        ]),
      ]),
      m("parametric-solid-modelling", "Parametric Solid Modelling", "Building parts as feature trees that can be edited reliably.", [
        u("features-and-feature-tree", "Features and the Feature Tree", "Extrudes, revolves, holes, fillets and patterns.", [
          "Plan a feature sequence that builds a stepped shaft with a keyway",
          "Use pattern and mirror features to avoid repeating geometry",
          "Predict how reordering features in the tree changes or breaks the model",
        ]),
        u("design-intent", "Design Intent and Model Robustness", "Parameters, equations and configurations that survive edits.", [
          "Link dimensions with equations so a family of parts updates from key parameters",
          "Identify modelling choices that cause rebuild failures when a dimension changes",
          "Create a configuration of a part for two different sizes",
        ]),
      ]),
      m("assemblies-and-mates", "Assemblies and Mates", "Combining parts and checking that they fit and move as intended.", [
        u("assembly-mates", "Mates and Degrees of Freedom", "Constraining components relative to each other.", [
          "Choose mates that give a pin joint, a slider and a rigidly fixed connection",
          "Count the degrees of freedom remaining after a set of mates",
          "Detect an interference between two components in an assembly",
        ]),
        u("exploded-views-and-motion", "Exploded Views and Simple Motion", "Communicating assembly order and checking movement.", [
          "Produce an exploded view that shows the assembly sequence",
          "Check a crank-slider assembly through its range of motion for collisions",
          "Add a balloon and part number to each component in an assembly drawing",
        ]),
      ]),
      m("fasteners-and-threads", "Standard Fasteners and Threads", "Specifying and drawing the standard parts used in nearly every assembly.", [
        u("thread-representation", "Thread Terminology and Representation", "Pitch, major diameter and conventional thread drawing.", [
          "Interpret a metric thread designation such as M10 x 1.5",
          "Draw an external and an internal thread using the conventional representation",
          "Distinguish coarse from fine pitch and state where each is preferred",
        ]),
        u("fastener-selection", "Fastener Selection", "Bolts, screws, washers, nuts and locking features.", [
          "Select a fastener type for a joint that must be disassembled repeatedly",
          "Specify clearance hole and counterbore sizes for a socket head cap screw",
          "Choose a locking method for a bolt subject to vibration",
        ]),
      ]),
      m("drawing-standards-and-bom", "Drawing Standards and Bill of Materials", "Producing a complete, standards-compliant drawing package.", [
        u("title-blocks-and-standards", "Title Blocks, Line Types and Standards", "Conventions in ISO and ASME drawings.", [
          "Identify the required fields of a title block and the purpose of each",
          "Apply the correct line types for visible, hidden, centre and section lines",
          "Compare ISO and ASME conventions for projection symbol and dimension units",
        ]),
        u("bill-of-materials", "Bills of Materials and Drawing Revision", "Listing parts and controlling changes.", [
          "Construct a bill of materials from a given assembly",
          "Explain the purpose of a revision table and a drawing issue number",
          "Check a drawing package for completeness before release",
        ]),
      ]),
    ],
  ),

  course(
    {
      slug: "mce-computing-for-engineers",
      code: "MCE105",
      name: "Computing for Engineers",
      shortName: "Computing",
      description:
        "Programming and numerical computing for mechanical engineering problems: control flow, functions, arrays, plotting, root finding, numerical integration, ODE solvers and curve fitting.",
      year: "Year1",
      semester: 1,
      creditUnits: 3,
      icon: "Code",
      src: ["berkeley", "gatech", "mit", "imperial"],
    },
    [
      m("variables-and-control-flow", "Variables and Control Flow", "The building blocks of any engineering program.", [
        u("data-types-and-expressions", "Data Types and Expressions", "Numbers, strings, booleans and operator precedence.", [
          "Evaluate an engineering formula in code with correct operator precedence",
          "Explain the difference between integer and floating-point arithmetic and its consequence for rounding",
          "Convert units explicitly within a program to avoid mixed-unit errors",
        ]),
        u("branching-and-loops", "Branching and Loops", "Conditionals, for-loops and while-loops.", [
          "Write a loop that accumulates a sum until a tolerance condition is met",
          "Use a conditional to classify a flow as laminar or turbulent from its Reynolds number",
          "Trace the values of variables through a short loop by hand",
        ]),
      ]),
      m("functions-and-modules", "Functions and Modules", "Structuring code so it can be tested and reused.", [
        u("writing-functions", "Writing Functions", "Parameters, return values and scope.", [
          "Write a function that returns the second moment of area of a rectangular section from its dimensions",
          "Distinguish local from global variables and explain a scope-related bug",
          "Add input checks that reject physically impossible arguments",
        ]),
        u("modules-and-libraries", "Modules and Libraries", "Splitting programs and using numerical libraries.", [
          "Organise related functions into a module that can be imported by another script",
          "Call a numerical library routine instead of writing the algorithm from scratch",
          "Read library documentation to determine argument order, units and return values",
        ]),
      ]),
      m("arrays-and-vectorisation", "Arrays and Vectorisation", "Working with whole datasets in one operation.", [
        u("array-creation-and-indexing", "Arrays, Indexing and Slicing", "Creating and selecting from vectors and matrices.", [
          "Create evenly spaced vectors and use them to evaluate a function over a range",
          "Extract rows, columns and sub-blocks of a matrix by slicing",
          "Apply boolean masks to select the data points that satisfy a condition",
        ]),
        u("vectorised-operations", "Vectorised Operations and Linear Algebra", "Element-wise operations and matrix solves.", [
          "Replace a loop over data points with an equivalent vectorised expression",
          "Solve a linear system for the member forces of a small truss using a library solver",
          "Distinguish element-wise from matrix multiplication and predict the output shape",
        ]),
      ]),
      m("plotting-and-data", "Plotting and Data", "Turning numbers into evidence.", [
        u("engineering-plots", "Producing Engineering Plots", "Axes, labels, units, scales and legends.", [
          "Produce a labelled plot with units on both axes and a legend for multiple series",
          "Choose linear, semi-log or log-log axes appropriate to the relationship being shown",
          "Identify misleading choices of axis range or scale in a given plot",
        ]),
        u("reading-and-cleaning-data", "Reading and Cleaning Data", "Importing measurements and handling bad points.", [
          "Import a tabular data file of sensor readings into arrays",
          "Detect and handle missing or outlying values with a stated rule",
          "Compute summary statistics for a measured data set and report them with appropriate precision",
        ]),
      ]),
      m("root-finding", "Root Finding", "Solving nonlinear equations numerically.", [
        u("bracketing-methods", "Bisection and Bracketing", "Reliable methods that need a sign change.", [
          "Apply the bisection method for several iterations by hand and bound the error",
          "Write a program that stops when the bracket width falls below a given tolerance",
          "Determine the number of bisection iterations needed to reach a stated accuracy",
        ]),
        u("newton-method", "Newton-Raphson and Convergence", "Fast iteration and its failure modes.", [
          "Perform Newton-Raphson iterations to solve the Colebrook friction factor equation",
          "Identify starting guesses for which Newton's method diverges or oscillates",
          "Compare the convergence rate of bisection and Newton's method on the same problem",
        ]),
      ]),
      m("integration-and-odes", "Numerical Integration and ODE Solvers", "Approximating integrals and time-marching differential equations.", [
        u("numerical-integration", "Trapezoidal and Simpson Rules", "Integrating sampled data and functions.", [
          "Estimate the work done by a variable force from tabulated data using the trapezoidal rule",
          "Apply Simpson's rule and compare its error with the trapezoidal rule as step size halves",
          "State the order of accuracy of each rule",
        ]),
        u("ode-solvers", "Euler and Runge-Kutta Methods", "Solving initial value problems for physical systems.", [
          "Advance a first-order ODE for a cooling body using explicit Euler steps",
          "Convert a second-order mass-spring-damper equation into a first-order system for a solver",
          "Show how step size affects accuracy and stability for the Euler and fourth-order Runge-Kutta methods",
        ]),
      ]),
      m("curve-fitting", "Curve Fitting", "Building models from measured data.", [
        u("least-squares-fitting", "Least Squares Fitting", "Fitting straight lines and polynomials.", [
          "Fit a straight line to calibration data using least squares and report slope and intercept",
          "Linearise a power-law relationship with a log transform before fitting",
          "Compute the coefficient of determination and interpret its value",
        ]),
        u("interpolation", "Interpolation", "Estimating values between data points.", [
          "Interpolate a property table value linearly between two entries",
          "Contrast polynomial interpolation with least squares fitting for noisy data",
          "Identify the oscillation problem of high-order polynomial interpolation on equally spaced points",
        ]),
      ]),
      m("debugging-and-verification", "Debugging and Verification", "Knowing that a computed answer is right.", [
        u("debugging-strategies", "Debugging Strategies", "Reading errors, isolating faults and testing small pieces.", [
          "Locate a fault by reading a traceback and printing intermediate values",
          "Reduce a failing program to the smallest example that reproduces the error",
          "Write a simple test that checks a function against a known hand-calculated result",
        ]),
        u("verification-checks", "Verification and Sanity Checks", "Dimensional analysis, limiting cases and convergence tests.", [
          "Verify a numerical result against a closed-form solution for a simplified case",
          "Check the dimensional consistency of a formula implemented in code",
          "Run a step-size convergence study and report the observed order of accuracy",
        ]),
      ]),
    ],
  ),

  course(
    {
      slug: "mce-thermodynamics-1",
      code: "MCE112",
      name: "Thermodynamics I",
      shortName: "Thermo I",
      description:
        "Properties and states, work and heat, the first and second laws, entropy, and the analysis of steady-flow devices and basic heat engines and refrigerators.",
      year: "Year1",
      semester: 2,
      creditUnits: 4,
      icon: "Thermometer",
      src: ["imperial", "stanford", "berkeley", "gatech"],
    },
    [
      m("systems-and-properties", "Systems, State and Properties", "The language of thermodynamics: what we analyse and how we describe it.", [
        u("systems-and-state", "Systems, Boundaries and State", "Closed, open and isolated systems; intensive and extensive properties.", [
          "Classify a device as a closed system or a control volume and state what crosses its boundary",
          "Distinguish intensive from extensive properties and give examples of each",
          "State the state postulate for a simple compressible substance",
        ]),
        u("units-pressure-temperature", "Units, Pressure and Temperature", "Absolute scales, gauge pressure and the zeroth law.", [
          "Convert between gauge and absolute pressure and between Celsius and kelvin",
          "Calculate the pressure at the base of a manometer column from fluid height and density",
          "Explain the zeroth law as the basis of temperature measurement",
        ]),
      ]),
      m("ideal-gas-and-property-tables", "Ideal Gas and Property Tables", "Finding property values for gases and for phase-changing fluids.", [
        u("ideal-gas-model", "The Ideal Gas Model", "Equation of state and the specific heats of ideal gases.", [
          "Compute the mass of gas in a rigid tank from pressure, volume and temperature using pV = mRT",
          "Relate cp, cv and the specific gas constant R for an ideal gas",
          "Decide whether the ideal gas model is acceptable for a given state by comparing compressibility factor Z with one",
        ]),
        u("steam-tables", "Phase Change and Property Tables", "Saturated, compressed and superheated states and quality.", [
          "Determine the quality of a saturated mixture from specific volume using table values",
          "Look up enthalpy and entropy for superheated steam by interpolation",
          "Locate a state on a T-v diagram relative to the saturation dome",
        ]),
      ]),
      m("work-and-heat", "Work and Heat", "Energy transfers across a system boundary.", [
        u("boundary-work", "Boundary Work", "Work done by expansion and compression processes.", [
          "Compute boundary work for isobaric, isothermal and polytropic processes",
          "Estimate work from the area under a p-V diagram",
          "Determine the sign of work for expansion and compression with a stated sign convention",
        ]),
        u("heat-transfer-modes-intro", "Heat and Other Work Modes", "Heat as energy in transit and shaft and electrical work.", [
          "Distinguish heat from work as a mode of energy transfer",
          "Calculate shaft power from torque and angular speed",
          "Compute heat transfer for a closed system given its energy change and work done",
        ]),
      ]),
      m("first-law", "The First Law", "Energy conservation applied to closed systems and control volumes.", [
        u("first-law-closed", "First Law for Closed Systems", "Internal energy change from heat and work.", [
          "Apply the closed-system energy balance to a piston-cylinder device",
          "Determine the final temperature of an ideal gas compressed adiabatically with known work input",
          "Evaluate the heat transfer in a constant-volume process from internal energy change",
        ]),
        u("steady-flow-devices", "Steady-Flow Energy Equation", "Nozzles, turbines, compressors, throttles and heat exchangers.", [
          "Write the steady-flow energy equation and simplify it for a turbine, nozzle and throttle",
          "Calculate the exit velocity of an adiabatic nozzle from inlet and outlet enthalpies",
          "Determine the heat removed in a heat exchanger from the mass flow rate and enthalpy change",
        ]),
      ]),
      m("second-law", "The Second Law", "Why some processes happen and their reverse does not.", [
        u("second-law-statements", "Kelvin-Planck and Clausius Statements", "Direction of processes and the limits of conversion.", [
          "State the Kelvin-Planck and Clausius statements and show that violating one violates the other",
          "Identify whether a claimed heat engine or refrigerator is possible from its energy flows",
          "Explain what makes a process reversible and list common sources of irreversibility",
        ]),
        u("thermal-efficiency-and-cop", "Efficiency and Coefficient of Performance", "Measures of merit for engines, refrigerators and heat pumps.", [
          "Calculate thermal efficiency of a heat engine from heat input and net work",
          "Calculate the COP of a refrigerator and of a heat pump from the heat flows",
          "Relate the COP of a heat pump to that of a refrigerator operating between the same reservoirs",
        ]),
      ]),
      m("entropy", "Entropy and Isentropic Efficiency", "A property that measures irreversibility.", [
        u("entropy-and-tds", "Entropy and the T-ds Relations", "Entropy change in ideal gases and substances.", [
          "Calculate the entropy change of an ideal gas between two states with constant specific heats",
          "Use the entropy balance to test whether a process violates the second law",
          "Read the final state of an isentropic expansion of steam from a T-s diagram or table",
        ]),
        u("isentropic-efficiency", "Isentropic Efficiency", "Comparing real turbines, pumps and compressors with the ideal.", [
          "Compute the actual exit enthalpy of a turbine from its isentropic efficiency",
          "Calculate the actual work needed by a compressor given its isentropic efficiency",
          "Explain why isentropic efficiency is defined differently for turbines and compressors",
        ]),
      ]),
      m("carnot-engines-refrigerators", "Carnot Cycle, Engines and Refrigerators", "The upper limit on performance.", [
        u("carnot-cycle", "The Carnot Cycle", "Reversible cycle between two reservoirs.", [
          "Calculate the Carnot efficiency of an engine between two stated reservoir temperatures",
          "Sketch the Carnot cycle on p-V and T-s diagrams",
          "Explain why no real engine can exceed the Carnot efficiency between the same reservoirs",
        ]),
        u("carnot-refrigerator", "Carnot Refrigerators and Heat Pumps", "Limits of cooling and heating performance.", [
          "Calculate the maximum COP of a refrigerator operating between a given cold space and ambient",
          "Estimate the minimum work to remove a given heat load from a cold space",
          "Compare a real refrigerator COP with the Carnot limit to judge its quality",
        ]),
      ]),
      m("introduction-to-power-cycles", "Introduction to Power Cycles", "First look at the Rankine and Brayton cycles.", [
        u("rankine-intro", "The Simple Rankine Cycle", "Boiler, turbine, condenser and pump.", [
          "Draw the ideal Rankine cycle on a T-s diagram and label its four processes",
          "Calculate net work, heat input and thermal efficiency for a simple Rankine cycle using steam tables",
          "Explain how raising boiler pressure or lowering condenser pressure affects efficiency",
        ]),
        u("brayton-intro", "The Simple Brayton Cycle", "Compressor, combustor and turbine.", [
          "Calculate the efficiency of the ideal Brayton cycle from its pressure ratio using cold-air-standard assumptions",
          "Determine compressor and turbine work from temperatures at each state",
          "Explain why a large fraction of turbine work is absorbed by the compressor",
        ]),
      ]),
    ],
  ),

  course(
    {
      slug: "mce-dynamics-1",
      code: "MCE113",
      name: "Dynamics I: Particle Kinematics and Kinetics",
      shortName: "Dynamics I",
      description:
        "Motion of particles in rectilinear and curvilinear coordinates, Newton's second law, work-energy, impulse-momentum, impact, central-force motion and numerical drag problems.",
      year: "Year1",
      semester: 2,
      creditUnits: 3,
      icon: "SneakerMove",
      src: ["imperial", "michigan", "berkeley"],
    },
    [
      m("rectilinear-and-curvilinear-kinematics", "Rectilinear and Curvilinear Kinematics", "Describing motion without regard to its cause.", [
        u("rectilinear-motion", "Rectilinear Motion", "Position, velocity and acceleration along a line.", [
          "Integrate an acceleration function to obtain velocity and position with given initial conditions",
          "Use constant-acceleration equations to find stopping distance of a vehicle",
          "Interpret v-t and a-t graphs to find displacement and change in velocity",
        ]),
        u("projectile-and-cartesian", "Cartesian Curvilinear Motion", "Vector description of planar and projectile motion.", [
          "Calculate range and maximum height of a projectile launched at a given angle in the absence of drag",
          "Resolve velocity and acceleration of a particle into Cartesian components",
          "Determine when a projectile reaches a target at a given height",
        ]),
      ]),
      m("polar-and-normal-tangential", "Polar and Normal-Tangential Coordinates", "Coordinate systems matched to the geometry of the path.", [
        u("normal-tangential", "Normal and Tangential Components", "Speed change along the path and direction change across it.", [
          "Compute the normal and tangential acceleration components of a particle on a circular path",
          "Determine the radius of curvature of a path from speed and normal acceleration",
          "Choose between Cartesian and path coordinates for a given problem and justify the choice",
        ]),
        u("polar-coordinates", "Polar Coordinates", "Radial and transverse components for rotating arms and orbits.", [
          "Write radial and transverse acceleration components for a bead sliding on a rotating arm",
          "Compute the velocity of a particle given r, dr/dt, theta and d theta/dt",
          "Identify the centripetal and Coriolis terms in the polar acceleration expression",
        ]),
      ]),
      m("relative-and-constrained-motion", "Relative and Constrained Motion", "Connected bodies and moving observers.", [
        u("relative-motion", "Relative Motion", "Velocities and accelerations measured from a moving frame.", [
          "Compute the relative velocity of two vehicles travelling on different headings",
          "Determine the heading a boat must hold to cross a river with current to a stated point",
          "Relate absolute, relative and frame velocities with the correct vector equation",
        ]),
        u("dependent-motion", "Dependent Motion of Connected Particles", "Cable and pulley constraints.", [
          "Write the cable-length constraint for a pulley system and differentiate it",
          "Find the velocity of one block from that of another in a pulley system",
          "Relate accelerations of connected bodies for use in Newton's second law",
        ]),
      ]),
      m("newtons-second-law", "Newton's Second Law", "Force, mass and acceleration for particles.", [
        u("force-acceleration-method", "The Force-Acceleration Method", "Free-body diagrams and equations of motion.", [
          "Draw a free-body diagram of a particle and write its equations of motion in chosen coordinates",
          "Calculate the acceleration of a block on an incline with friction",
          "Determine the tension in a string supporting a particle moving in a vertical circle",
        ]),
        u("curvilinear-kinetics", "Kinetics in Curvilinear Coordinates", "Forces required to produce circular and curved motion.", [
          "Calculate the banking angle for a vehicle rounding a curve without lateral friction",
          "Find the normal force on a particle at the top and bottom of a vertical loop",
          "Determine the maximum speed on a flat curve for a given coefficient of friction",
        ]),
      ]),
      m("work-and-energy", "Work and Energy", "Scalar methods that avoid solving for acceleration.", [
        u("work-energy-principle", "The Work-Energy Principle", "Work of forces and change in kinetic energy.", [
          "Compute the work done by a variable force along a path by integration",
          "Apply the work-energy principle to find the speed of a particle after moving a stated distance",
          "Calculate the work done by gravity, a spring and friction in the same problem",
        ]),
        u("conservative-forces-and-power", "Conservative Forces, Potential Energy and Power", "Conservation of mechanical energy.", [
          "Apply conservation of mechanical energy to a particle moving under gravity and a spring",
          "Determine whether a given force field is conservative",
          "Compute the power required to drive a load at constant speed up an incline given efficiency",
        ]),
      ]),
      m("impulse-momentum-impact", "Impulse, Momentum and Impact", "Time-based methods for short-duration forces and collisions.", [
        u("linear-impulse-momentum", "Linear Impulse and Momentum", "Conservation of momentum for particle systems.", [
          "Apply the impulse-momentum principle to find velocity change from a time-varying force",
          "Use conservation of linear momentum to find the recoil velocity of a gun and projectile",
          "Compute the average force during a collision from the impulse and contact duration",
        ]),
        u("impact", "Impact and Coefficient of Restitution", "Direct and oblique collisions.", [
          "Determine post-impact velocities for direct central impact using momentum and the coefficient of restitution",
          "Calculate the kinetic energy lost in a perfectly plastic collision",
          "Analyse oblique impact with a smooth fixed surface using normal and tangential components",
        ]),
      ]),
      m("angular-momentum-central-force", "Angular Momentum and Central-Force Motion", "Motion under forces directed at a fixed centre.", [
        u("angular-momentum-particle", "Angular Momentum of a Particle", "Moment of momentum and its conservation.", [
          "Calculate the angular momentum of a particle about a fixed point",
          "Use conservation of angular momentum to relate speeds at two radii under a central force",
          "Explain why areal velocity is constant under a central force",
        ]),
        u("orbital-motion", "Orbital Motion", "Circular and elliptical orbits under inverse-square gravity.", [
          "Compute circular orbit speed and period at a given radius from the gravitational parameter",
          "Calculate the escape velocity from the surface of a planet",
          "Relate speeds at perigee and apogee of an elliptical orbit using energy and angular momentum",
        ]),
      ]),
      m("drag-and-numerical-dynamics", "Drag and Numerical Dynamics", "Problems that have no closed-form solution.", [
        u("drag-forces", "Drag Forces and Terminal Velocity", "Linear and quadratic resistance.", [
          "Derive the terminal velocity of a body falling with quadratic drag",
          "Solve for velocity against time for linear drag in closed form",
          "Estimate drag force from a drag coefficient, density, area and speed",
        ]),
        u("numerical-trajectories", "Numerical Trajectories", "Stepping the equations of motion in time.", [
          "Set up the equations of motion of a projectile with drag as a first-order system",
          "Compare a numerical range with the drag-free analytical range and explain the difference",
          "Check a time-stepping result by halving the step size and observing convergence",
        ]),
      ]),
    ],
  ),

  course(
    {
      slug: "mce-mechanics-of-materials",
      code: "MCE114",
      name: "Mechanics of Materials",
      shortName: "Mech of Materials",
      description:
        "Stress and strain, axial loading, torsion of shafts, bending stress, shear in beams, beam deflection, combined loading and stress transformation with Mohr's circle.",
      year: "Year1",
      semester: 2,
      creditUnits: 4,
      icon: "Ruler",
      src: ["imperial", "cambridge", "stanford", "berkeley"],
    },
    [
      m("stress-and-strain", "Stress and Strain", "The measures of internal force and deformation.", [
        u("normal-and-shear-stress", "Normal and Shear Stress", "Average stress in axially loaded members and pins.", [
          "Calculate the average normal stress in a rod loaded axially",
          "Compute the average shear stress in a pin or bolt in single and double shear",
          "Determine bearing stress between a pin and a plate",
        ]),
        u("strain-and-hookes-law", "Strain and Hooke's Law", "Normal and shear strain and the linear elastic response.", [
          "Calculate normal strain from change in length and original length",
          "Apply Hooke's law in one dimension to find elongation of a bar under load",
          "Relate shear stress to shear strain using the shear modulus",
        ]),
      ]),
      m("axial-loading-thermal", "Axial Loading and Thermal Strain", "Deformation and stress in bars, including statically indeterminate cases.", [
        u("axial-deformation", "Axial Deformation of Bars", "Stepped bars and variable loads.", [
          "Compute total elongation of a stepped bar under several axial loads",
          "Solve for the reactions of a bar fixed at both ends and loaded axially using compatibility",
          "Determine the deflection of a bar under its own weight",
        ]),
        u("thermal-stress", "Thermal Strain and Stress", "Restrained expansion and composite bars.", [
          "Calculate the stress in a bar heated while constrained between rigid walls",
          "Find the load shared by two materials of different expansion coefficients bonded together",
          "Determine the thermal elongation of an unrestrained member",
        ]),
      ]),
      m("torsion-of-shafts", "Torsion of Shafts", "Circular shafts transmitting torque.", [
        u("torsion-formula", "The Torsion Formula", "Shear stress and angle of twist in circular shafts.", [
          "Calculate maximum shear stress in a solid or hollow circular shaft under a given torque",
          "Compute the angle of twist of a shaft of known length, material and torque",
          "Determine the torque capacity of a shaft for a given allowable shear stress",
        ]),
        u("power-transmission-and-indeterminate-torsion", "Power Transmission and Statically Indeterminate Shafts", "Sizing shafts for power and sharing torque between members.", [
          "Determine the shaft diameter needed to transmit a given power at a given speed",
          "Solve for the reaction torques in a shaft fixed at both ends",
          "Compare the mass of a solid shaft with a hollow shaft of equal torque capacity",
        ]),
      ]),
      m("bending-stress", "Bending Stress", "Stress distribution in beams under moment.", [
        u("flexure-formula", "The Flexure Formula", "Bending stress from moment and second moment of area.", [
          "Calculate the maximum tensile and compressive bending stress in a beam cross-section",
          "Locate the neutral axis of an asymmetric cross-section and compute its second moment of area",
          "Select a standard section for a given moment and allowable stress",
        ]),
        u("composite-beams", "Composite and Non-Rectangular Sections", "Transformed sections for beams of two materials.", [
          "Construct a transformed section for a beam of two materials using the modular ratio",
          "Compute the stress in each material of a bonded two-material beam",
          "Compare the bending capacity of an I-section and a rectangle of equal area",
        ]),
      ]),
      m("shear-in-beams", "Shear in Beams", "Transverse shear stress distribution and shear flow.", [
        u("shear-stress-formula", "The Shear Stress Formula", "Shear stress from the first moment of area.", [
          "Calculate the maximum transverse shear stress in a rectangular beam",
          "Plot the shear stress distribution through the depth of an I-beam web and flange",
          "Compute the first moment of area for the portion of a section above a given level",
        ]),
        u("shear-flow", "Shear Flow and Fastener Spacing", "Connecting built-up members.", [
          "Calculate shear flow at the interface between flange and web of a built-up beam",
          "Determine the spacing of nails or bolts to resist the interface shear",
          "Explain why shear flow is the quantity that connectors must resist",
        ]),
      ]),
      m("beam-deflection", "Beam Deflection", "Slope and deflection under load.", [
        u("integration-method", "Double Integration", "Elastic curve from the moment equation.", [
          "Derive the deflection equation of a cantilever with an end load by double integration",
          "Apply boundary conditions to determine integration constants for a simply supported beam",
          "Find the location and magnitude of maximum deflection of a simply supported beam under a point load",
        ]),
        u("superposition-and-tables", "Superposition and Standard Cases", "Combining known solutions.", [
          "Use superposition to find the deflection of a beam under two loads from tabulated cases",
          "Solve a propped cantilever by treating the prop reaction as a redundant",
          "Check a beam design against a limiting deflection of span over a stated ratio",
        ]),
      ]),
      m("combined-loading", "Combined Loading", "Several actions at once.", [
        u("axial-and-bending", "Axial Load with Bending", "Eccentric loading and the core of a section.", [
          "Compute the stress at the corners of a section under axial load and eccentric moment",
          "Determine the eccentricity at which tensile stress first appears in a rectangular column",
          "Combine direct and bending stresses at a stated point of a bracket",
        ]),
        u("bending-and-torsion", "Bending with Torsion", "Shafts under combined actions.", [
          "Calculate the stresses at the surface of a shaft carrying both bending moment and torque",
          "Identify the critical point on a loaded shaft where stresses are largest",
          "Determine the equivalent bending moment for a shaft under combined moment and torque",
        ]),
      ]),
      m("stress-transformation-mohr", "Stress Transformation and Mohr's Circle", "Stress state resolved on any plane.", [
        u("plane-stress-transformation", "Plane Stress Transformation", "Stresses on inclined planes.", [
          "Calculate normal and shear stress on a plane inclined at a given angle in plane stress",
          "Determine principal stresses and the angle to the principal planes",
          "Find the maximum in-plane shear stress and the associated normal stress",
        ]),
        u("mohrs-circle", "Mohr's Circle", "Graphical representation of plane stress and strain.", [
          "Construct Mohr's circle for a given plane stress state and read principal and maximum shear stresses",
          "Relate points on Mohr's circle to physical planes in the material",
          "Determine strains in a gauge direction from a strain-rosette measurement using strain transformation",
        ]),
      ]),
    ],
  ),

  course(
    {
      slug: "mce-electrical-electronics-fundamentals",
      code: "MCE115",
      name: "Electrical and Electronics Fundamentals",
      shortName: "Elec & Electronics",
      description:
        "Circuit laws and DC analysis, transients, AC and impedance, operational amplifiers, semiconductor switches, sensors, actuators and microcontroller input and output for mechatronic systems.",
      year: "Year1",
      semester: 2,
      creditUnits: 3,
      icon: "Circuitry",
      src: ["imperial", "mit", "berkeley"],
    },
    [
      m("circuit-laws-dc", "Circuit Laws and DC Analysis", "Voltage, current and power in resistive networks.", [
        u("ohm-and-kirchhoff", "Ohm's and Kirchhoff's Laws", "Series, parallel and the two conservation laws.", [
          "Calculate equivalent resistance of series-parallel networks",
          "Apply Kirchhoff's current and voltage laws to solve a two-loop circuit",
          "Compute power dissipated by each element in a circuit",
        ]),
        u("network-theorems", "Network Theorems", "Nodal analysis, superposition and Thevenin equivalents.", [
          "Solve a three-node circuit using nodal analysis",
          "Derive the Thevenin equivalent of a network seen from a pair of terminals",
          "Determine the load resistance that receives maximum power from a source",
        ]),
      ]),
      m("rc-rl-transients", "RC and RL Transients", "How circuits respond to a sudden change.", [
        u("capacitor-and-inductor", "Capacitors and Inductors", "Energy storage and the element laws.", [
          "Relate current and voltage for a capacitor and for an inductor",
          "Calculate the energy stored in a capacitor and in an inductor",
          "Explain why capacitor voltage and inductor current cannot change instantaneously",
        ]),
        u("first-order-transients", "First-Order Step Response", "Time constants of RC and RL circuits.", [
          "Calculate the time constant of an RC and of an RL circuit",
          "Determine the capacitor voltage at a stated time after a step input",
          "Compute the time for a first-order response to reach 95 percent of its final value",
        ]),
      ]),
      m("ac-and-impedance", "AC Circuits and Impedance", "Sinusoidal steady state.", [
        u("phasors", "Sinusoids and Phasors", "Amplitude, frequency, phase and RMS values.", [
          "Compute the RMS value of a sinusoidal voltage from its amplitude",
          "Represent a sinusoidal voltage and current as phasors and find the phase difference",
          "Convert between time-domain sinusoids and complex phasor form",
        ]),
        u("impedance-and-power", "Impedance and AC Power", "Complex impedance, real power and power factor.", [
          "Calculate the impedance of a series RLC circuit at a given frequency",
          "Determine the resonant frequency of a series RLC circuit",
          "Compute real power, reactive power and power factor for an AC load",
        ]),
      ]),
      m("operational-amplifiers", "Operational Amplifiers", "Building blocks of analogue signal conditioning.", [
        u("ideal-opamp", "The Ideal Op-Amp", "Virtual short and infinite input impedance.", [
          "Derive the gain of an inverting and a non-inverting amplifier using ideal op-amp rules",
          "Select resistor values to achieve a stated gain",
          "Explain the role of negative feedback in setting the closed-loop gain",
        ]),
        u("opamp-applications", "Op-Amp Applications", "Summing, difference and filtering stages.", [
          "Design a summing amplifier combining two sensor signals with chosen weights",
          "Calculate the cut-off frequency of a first-order active low-pass filter",
          "Describe how a difference amplifier rejects common-mode noise",
        ]),
      ]),
      m("diodes-and-transistors", "Diodes and Transistors as Switches", "Semiconductor devices in power and logic control.", [
        u("diodes", "Diodes", "Rectification and protection.", [
          "Sketch the output of a half-wave rectifier for a sinusoidal input including the forward drop",
          "Explain why a flyback diode is placed across an inductive load",
          "Determine the series resistor needed to run an LED at a chosen current from a given supply",
        ]),
        u("transistor-switching", "Transistor Switching", "Driving loads from logic-level signals.", [
          "Choose a base resistor to saturate a bipolar transistor switching a given load",
          "Describe the operation of a MOSFET as a low-side switch",
          "Calculate power dissipated in a transistor switch in the on state",
        ]),
      ]),
      m("sensors", "Sensors", "Converting physical quantities into electrical signals.", [
        u("strain-and-temperature-sensors", "Strain Gauges and Thermocouples", "Resistive and voltage-output sensors.", [
          "Calculate the output of a quarter Wheatstone bridge for a given gauge factor and strain",
          "Explain how a half or full bridge improves sensitivity and compensates temperature",
          "Describe the principle and cold-junction requirement of a thermocouple",
        ]),
        u("position-and-speed-sensors", "Position and Speed Sensors", "Encoders, potentiometers and signal conditioning.", [
          "Compute the angular resolution of an incremental encoder from its counts per revolution",
          "Determine the speed of a shaft from encoder pulse frequency",
          "Choose an amplifier gain and filter to condition a low-level sensor output for an ADC",
        ]),
      ]),
      m("actuators", "Actuators", "Electromechanical devices that produce motion.", [
        u("dc-motors", "DC Motors", "Torque, speed and back-EMF.", [
          "Relate motor torque to armature current and back-EMF to speed using the motor constants",
          "Calculate steady-state speed of a DC motor under a given load torque and supply voltage",
          "Explain how pulse-width modulation controls average motor voltage",
        ]),
        u("stepper-and-servo", "Stepper and Servo Motors", "Incremental and closed-loop positioning.", [
          "Calculate the step angle and steps required for a stated rotation of a stepper motor",
          "Compare open-loop stepper and closed-loop servo positioning for a given application",
          "Choose a motor and gear ratio to meet a torque and speed requirement",
        ]),
      ]),
      m("microcontroller-io", "Microcontroller Input and Output", "Interfacing a digital controller with the physical world.", [
        u("digital-io", "Digital Input and Output", "Reading switches and driving outputs.", [
          "Wire a push button with a pull-up resistor and explain why the pull-up is needed",
          "Write a program that reads a digital input and drives an output accordingly",
          "Debounce a mechanical switch using a time-based method",
        ]),
        u("adc-and-pwm", "Analogue Input and PWM Output", "Sampling a voltage and generating a variable output.", [
          "Compute the voltage resolution of an ADC from its bit depth and reference",
          "Convert a raw ADC reading into a physical quantity using a calibration relation",
          "Generate a PWM signal with a specified duty cycle to set average output voltage",
        ]),
      ]),
    ],
  ),

  course(
    {
      slug: "mce-design-and-manufacture-1",
      code: "MCE116",
      name: "Design and Manufacture I: Workshop and Design Methods",
      shortName: "Design & Mfg I",
      description:
        "The engineering design process, concept generation and selection, basic metal cutting, joining, casting and forming, additive manufacturing, workshop safety and a team prototype project.",
      year: "Year1",
      semester: 2,
      creditUnits: 3,
      icon: "Toolbox",
      src: ["imperial", "berkeley", "mit"],
    },
    [
      m("design-process-and-requirements", "The Design Process and Requirements", "From a client's need to a measurable specification.", [
        u("design-stages", "Stages of the Design Process", "Need, specification, concept, detail and test.", [
          "Describe the stages of a design process and the outputs of each stage",
          "Distinguish a need statement from a design specification",
          "Explain how iteration between stages reduces risk",
        ]),
        u("requirements-specification", "Writing Requirements", "Functional, constraint and performance requirements.", [
          "Write a requirement as a measurable statement with a target value and test method",
          "Classify requirements as functional, performance, interface or regulatory",
          "Identify an ambiguous requirement in a brief and rewrite it testably",
        ]),
      ]),
      m("concept-generation-selection", "Concept Generation and Selection", "Creating options and choosing between them transparently.", [
        u("concept-generation", "Concept Generation", "Functional decomposition and morphological charts.", [
          "Decompose a product into a function structure of inputs and outputs",
          "Build a morphological chart listing solution principles for each sub-function",
          "Combine sub-solutions into at least three distinct overall concepts",
        ]),
        u("selection-matrices", "Selection Matrices", "Weighted decision methods.", [
          "Construct a weighted decision matrix with justified criteria weights",
          "Score concepts against criteria and identify the most sensitive weight",
          "Explain the limitations of a weighted matrix in early design",
        ]),
      ]),
      m("metal-cutting-basics", "Metal Cutting Basics", "How material is removed and what that implies for the part.", [
        u("turning-and-milling", "Turning, Milling and Drilling", "Main machine tools and their motions.", [
          "Calculate the spindle speed in rev/min for a chosen cutting speed and workpiece diameter",
          "Compute the material removal rate for a turning operation from speed, feed and depth of cut",
          "Choose between turning and milling for a given feature geometry",
        ]),
        u("tooling-and-surface-finish", "Tooling and Surface Finish", "Tool materials and quality of the cut surface.", [
          "Compare high-speed steel and carbide tool materials on hardness and toughness",
          "Estimate theoretical surface roughness from feed and tool nose radius",
          "Explain how cutting fluid affects tool life and surface finish",
        ]),
      ]),
      m("joining-processes", "Joining", "Permanent and temporary methods of assembling parts.", [
        u("welding-brazing-soldering", "Welding, Brazing and Soldering", "Fusion and non-fusion joining.", [
          "Distinguish welding, brazing and soldering by whether the parent metal melts",
          "Describe the main arc welding processes and where each is used",
          "Identify common weld defects and their likely causes",
        ]),
        u("mechanical-and-adhesive-joints", "Mechanical and Adhesive Joints", "Fasteners, rivets and adhesives.", [
          "Compare bolted, riveted and adhesive joints for a thin sheet application",
          "Explain why adhesive joints are best loaded in shear and avoid peel",
          "Select a joining method given material pair, loading and disassembly needs",
        ]),
      ]),
      m("casting-and-forming-overview", "Casting and Forming Overview", "Shaping material by pouring or deformation.", [
        u("casting-basics", "Casting Basics", "Moulds, patterns, gating and shrinkage.", [
          "Describe sand casting and die casting and the part types suited to each",
          "Apply a shrinkage allowance to a pattern dimension",
          "Explain the function of risers and gates in a casting",
        ]),
        u("forming-basics", "Forming Basics", "Forging, rolling, extrusion and sheet bending.", [
          "Compare hot and cold working on strength, finish and required force",
          "Calculate the bend allowance for a sheet metal bend from radius, angle and thickness",
          "Select forging or casting for a part given strength requirements and volume",
        ]),
      ]),
      m("additive-manufacturing", "Additive Manufacturing", "Building parts layer by layer.", [
        u("am-processes", "Additive Processes", "Material extrusion, vat photopolymerisation and powder bed fusion.", [
          "Describe the principle of fused deposition modelling and of powder bed fusion",
          "Compare additive manufacturing with machining for a low-volume complex part",
          "Identify design features that need support structures in an additive build",
        ]),
        u("design-for-am", "Designing for Additive", "Orientation, anisotropy and finishing.", [
          "Choose a build orientation to balance strength, surface finish and support volume",
          "Explain why layer-wise parts are anisotropic",
          "Estimate build time and material use for a part from layer height and volume",
        ]),
      ]),
      m("safety-and-workshop-practice", "Safety and Workshop Practice", "Working safely with tools and machines.", [
        u("risk-assessment", "Risk Assessment", "Hazards, likelihood and control measures.", [
          "Identify the hazards of a given workshop task and rate their risk",
          "Apply the hierarchy of controls to reduce a hazard",
          "Complete a simple risk assessment form for a bench operation",
        ]),
        u("machine-safety-and-ppe", "Machine Safety and PPE", "Guards, isolation and protective equipment.", [
          "Select appropriate personal protective equipment for turning, grinding and welding",
          "Explain the purpose of machine guards and emergency stops",
          "Describe a safe start-up and shut-down routine for a pillar drill",
        ]),
      ]),
      m("team-project-and-reporting", "Team Project and Reporting", "Taking a brief to a documented prototype.", [
        u("teamwork-and-planning", "Teamwork and Project Planning", "Roles, schedules and meetings.", [
          "Build a task breakdown and Gantt chart for a short design project",
          "Assign team roles and define the deliverable for each milestone",
          "Record meeting decisions and actions in a concise log",
        ]),
        u("prototype-and-report", "Prototype Testing and Reporting", "Verifying against the specification and communicating results.", [
          "Test a prototype against the measurable requirements and tabulate the outcome",
          "Structure a design report so a reader can follow the decisions and evidence",
          "Present a manufacturing plan listing processes, tools and stock for each part",
        ]),
      ]),
    ],
  ),

  /* ------------------------------------------------------------------ YEAR 2 */
  course(
    {
      slug: "mce-thermodynamics-2",
      code: "MCE202",
      name: "Thermodynamics II",
      shortName: "Thermo II",
      description:
        "Exergy and irreversibility, vapour and gas power cycles, internal combustion engines, refrigeration, psychrometrics, gas mixtures and combustion energy balances.",
      year: "Year2",
      semester: 1,
      creditUnits: 4,
      icon: "Flame",
      src: ["imperial", "gatech"],
    },
    [
      m("exergy-and-irreversibility", "Exergy and Irreversibility", "Quantifying the useful part of energy.", [
        u("exergy-concept", "Exergy of Heat and Flow", "Maximum useful work relative to the surroundings.", [
          "Calculate the flow exergy of a stream relative to stated dead-state conditions",
          "Determine the exergy of heat transfer at a given temperature",
          "Explain the difference between energy conservation and exergy destruction",
        ]),
        u("exergy-balance", "Exergy Balance and Second-Law Efficiency", "Locating where useful work is lost.", [
          "Compute exergy destruction in a throttle valve and in a heat exchanger",
          "Calculate the second-law efficiency of a turbine from actual and reversible work",
          "Relate exergy destruction to entropy generation using the Gouy-Stodola relation",
        ]),
      ]),
      m("vapour-power-cycles", "Vapour Power Cycles", "Improving the Rankine cycle.", [
        u("superheat-and-reheat", "Superheat and Reheat", "Raising mean heat-addition temperature and dryness at exit.", [
          "Calculate the efficiency of a Rankine cycle with reheat using steam tables",
          "Explain how reheat limits moisture in the turbine exhaust",
          "Quantify the effect of non-ideal turbine and pump efficiencies on cycle performance",
        ]),
        u("regeneration", "Regenerative Feedwater Heating", "Open and closed feedwater heaters.", [
          "Compute the extraction fraction for an open feedwater heater by an energy balance",
          "Calculate the thermal efficiency of a Rankine cycle with one open feedwater heater",
          "Explain why regeneration raises the average temperature at which heat is added",
        ]),
      ]),
      m("gas-turbine-cycles", "Gas Turbine Cycles", "Brayton cycle refinements.", [
        u("brayton-real", "Real Brayton Cycle", "Component efficiencies and optimum pressure ratio.", [
          "Determine the pressure ratio that maximises specific work for given inlet and turbine-entry temperatures",
          "Calculate cycle efficiency with isentropic efficiencies for compressor and turbine",
          "Explain the difference between the thermal efficiency and the specific work of a gas turbine",
        ]),
        u("regeneration-intercooling", "Regeneration, Intercooling and Reheat", "Enhancements to the gas turbine.", [
          "Calculate regenerator effectiveness and the resulting fuel saving",
          "Explain how intercooling and reheat increase net work",
          "Describe the combined-cycle arrangement and why its efficiency exceeds either cycle alone",
        ]),
      ]),
      m("internal-combustion-cycles", "Internal Combustion Engine Cycles", "Piston engine air-standard analysis.", [
        u("otto-and-diesel", "Otto and Diesel Cycles", "Spark-ignition and compression-ignition ideals.", [
          "Calculate the efficiency of the Otto cycle from its compression ratio",
          "Compute the efficiency of the Diesel cycle from compression ratio and cut-off ratio",
          "Compare Otto and Diesel efficiency at equal compression ratio and explain the limit on Otto compression ratio",
        ]),
        u("engine-performance", "Engine Performance Measures", "Mean effective pressure and indicated work.", [
          "Calculate mean effective pressure from net cycle work and displacement volume",
          "Determine indicated power from mean effective pressure, displacement and engine speed",
          "Relate brake power, indicated power and mechanical efficiency",
        ]),
      ]),
      m("refrigeration-and-heat-pumps", "Refrigeration and Heat Pumps", "Vapour compression and its variations.", [
        u("vapour-compression", "Vapour-Compression Cycle", "Evaporator, compressor, condenser and expansion valve.", [
          "Calculate COP of an ideal vapour-compression cycle from refrigerant property tables",
          "Determine refrigerating effect and compressor power for a given cooling load",
          "Explain why a throttle valve replaces the turbine in a practical cycle",
        ]),
        u("refrigerant-and-cycle-variants", "Refrigerant Selection and Cycle Variants", "Two-stage cycles and working fluid properties.", [
          "Describe the effect of subcooling and superheating on COP",
          "Explain why a two-stage cycle with flash intercooling suits large pressure ratios",
          "Compare refrigerants on pressure levels, latent heat and environmental impact",
        ]),
      ]),
      m("psychrometrics", "Psychrometrics", "Properties of humid air and air-conditioning processes.", [
        u("humid-air-properties", "Humid Air Properties", "Humidity ratio, relative humidity and dew point.", [
          "Calculate humidity ratio from partial pressure of water vapour",
          "Determine relative humidity and dew point temperature from dry-bulb and humidity ratio",
          "Read specific enthalpy of moist air from a psychrometric chart",
        ]),
        u("air-conditioning-processes", "Air-Conditioning Processes", "Heating, cooling, dehumidification and mixing.", [
          "Compute the cooling load for sensible cooling with dehumidification of an air stream",
          "Find the state of two air streams after adiabatic mixing",
          "Determine the water added by an evaporative cooler using the adiabatic saturation process",
        ]),
      ]),
      m("combustion-and-gas-mixtures", "Gas Mixtures and Combustion", "Mixing ideal gases and burning fuels.", [
        u("ideal-gas-mixtures", "Ideal Gas Mixtures", "Mole and mass fractions, partial pressures.", [
          "Convert between mass fractions and mole fractions of a gas mixture",
          "Calculate mixture molar mass and specific heats from component data",
          "Apply Dalton's law to find partial pressures in a mixture",
        ]),
        u("combustion-energy-balance", "Combustion and Enthalpy of Formation", "Air-fuel ratio and first law for reacting systems.", [
          "Balance a combustion reaction of a hydrocarbon fuel with air and compute the air-fuel ratio",
          "Calculate the heat released by a steady-flow combustor using enthalpies of formation",
          "Determine the adiabatic flame temperature estimate by iteration of the energy balance",
        ]),
      ]),
    ],
  ),

  course(
    {
      slug: "mce-dynamics-2",
      code: "MCE204",
      name: "Dynamics II: Rigid Body Dynamics",
      shortName: "Dynamics II",
      description:
        "Planar kinematics and kinetics of rigid bodies, instantaneous centres, rotating frames, mass moments of inertia, energy and momentum methods, mechanisms and introductory gyroscopic effects.",
      year: "Year2",
      semester: 1,
      creditUnits: 4,
      icon: "GearSix",
      src: ["imperial", "berkeley", "michigan"],
    },
    [
      m("planar-rigid-body-kinematics", "Planar Rigid-Body Kinematics", "Velocity and acceleration of points on a rotating and translating body.", [
        u("rotation-and-general-motion", "Rotation and General Plane Motion", "Translation plus rotation.", [
          "Relate the velocities of two points on a rigid body using the relative-velocity equation",
          "Calculate the velocity of a point on a rolling wheel without slip",
          "Determine angular velocity of a link from the speed of one end and the geometry",
        ]),
        u("relative-acceleration", "Relative Acceleration", "Tangential and normal components of relative acceleration.", [
          "Compute the acceleration of a point on a rigid body from that of another point and the angular velocity and acceleration",
          "Resolve relative acceleration into tangential and centripetal parts",
          "Determine the angular acceleration of a connecting rod at a stated crank position",
        ]),
      ]),
      m("instantaneous-centre", "Instantaneous Centre of Rotation", "A geometric shortcut for velocity analysis.", [
        u("locating-the-ic", "Locating the Instantaneous Centre", "Using velocity directions to find the centre.", [
          "Locate the instantaneous centre of a link from the velocity directions of two points",
          "Compute the velocity of a point on a body from its distance to the instantaneous centre",
          "Explain why the instantaneous centre has zero velocity but generally nonzero acceleration",
        ]),
        u("ic-in-mechanisms", "Instantaneous Centres in Linkages", "Four-bar and slider-crank analysis.", [
          "Find the angular velocity of the coupler of a four-bar linkage using instantaneous centres",
          "Determine slider velocity in a slider-crank at a given crank angle",
          "Apply the Aronhold-Kennedy theorem to locate a non-obvious instantaneous centre",
        ]),
      ]),
      m("rotating-frames-and-coriolis", "Rotating Frames and Coriolis Acceleration", "Motion measured from a rotating reference.", [
        u("rotating-reference-frames", "Rotating Reference Frames", "Time derivatives of vectors in moving frames.", [
          "Express the velocity of a point in a rotating frame using the transport relation",
          "Compute the velocity of a slider moving along a rotating arm",
          "Distinguish between absolute and relative motion in problem statements",
        ]),
        u("coriolis", "The Coriolis Acceleration", "The cross term from motion within a rotating frame.", [
          "Calculate the Coriolis acceleration of a collar sliding along a rotating rod",
          "Identify all four terms in the acceleration of a point moving in a rotating frame",
          "Explain the direction of Coriolis acceleration with respect to the angular velocity and relative velocity",
        ]),
      ]),
      m("mass-moment-of-inertia", "Mass Moment of Inertia", "The rotational analogue of mass.", [
        u("computing-inertia", "Computing Mass Moments of Inertia", "Integration and standard shapes.", [
          "Calculate the mass moment of inertia of a uniform rod and a disc about their axes",
          "Apply the parallel-axis theorem to shift a moment of inertia to a new axis",
          "Compute the moment of inertia of a composite body from its parts",
        ]),
        u("radius-of-gyration", "Radius of Gyration and Equivalent Systems", "Compact descriptions of rotating inertia.", [
          "Determine the radius of gyration of a body from its moment of inertia and mass",
          "Compute the equivalent inertia referred to a motor shaft for a geared load",
          "Explain how the distribution of mass about the axis affects angular acceleration under torque",
        ]),
      ]),
      m("planar-rigid-body-kinetics", "Planar Rigid-Body Kinetics", "Forces and moments producing planar motion.", [
        u("equations-of-motion", "Equations of Planar Motion", "Translation, fixed-axis rotation and general motion.", [
          "Write the three planar equations of motion for a rigid body from its free-body diagram",
          "Compute the angular acceleration of a pivoted bar released from rest",
          "Determine the minimum friction coefficient for a cylinder to roll without slip down an incline",
        ]),
        u("constrained-motion-kinetics", "Constrained and Rolling Motion", "Combining kinematic constraints with kinetics.", [
          "Combine a rolling-without-slip constraint with the equations of motion to find acceleration",
          "Determine the tension in the cable of a winch drum lowering a mass with drum inertia",
          "Calculate pin reactions on a rotating member with an off-centre centre of mass",
        ]),
      ]),
      m("energy-and-momentum-rigid-body", "Work-Energy and Momentum for Rigid Bodies", "Scalar and impulsive methods for rigid bodies.", [
        u("work-energy-rigid", "Work and Energy", "Translational plus rotational kinetic energy.", [
          "Calculate the kinetic energy of a rolling body from translation and rotation terms",
          "Apply energy conservation to find the speed of a pendulum bar at the bottom of its swing",
          "Compute the work done by a torque acting through an angular displacement",
        ]),
        u("impulse-and-angular-momentum", "Impulse-Momentum and Angular Momentum", "Impact and sudden torque effects.", [
          "Apply conservation of angular momentum to a body struck by a particle",
          "Determine angular velocity of a flywheel after a given torque impulse",
          "Locate the centre of percussion of a bar and explain its significance",
        ]),
      ]),
      m("gears-cams-linkages", "Gears, Cams and Linkages", "Common mechanisms in machines.", [
        u("gear-trains", "Gear Trains", "Speed ratios of simple, compound and epicyclic trains.", [
          "Calculate the output speed of a compound gear train from tooth numbers",
          "Determine the speed of the arm of a simple epicyclic gear train using the tabular method",
          "Relate torque ratio to speed ratio for an ideal gear pair",
        ]),
        u("cams-and-linkages", "Cams and Linkages", "Follower motion and four-bar kinematics.", [
          "Plot the displacement of a follower for a given cam profile specification",
          "Check a four-bar linkage for Grashof condition and classify its type",
          "Determine the transmission angle and explain its effect on force transfer",
        ]),
      ]),
      m("gyroscopic-effects", "Gyroscopic Effects", "Introduction to rotation of spinning bodies about a second axis.", [
        u("gyroscopic-couple", "Gyroscopic Couple", "Spin, precession and the reaction moment.", [
          "Calculate the gyroscopic couple on a spinning rotor precessing at a given rate",
          "Determine the direction of the gyroscopic reaction on bearings",
          "Compute the steady precession rate of a spinning top or gyroscope under gravity torque",
        ]),
        u("gyroscopic-applications", "Applications of Gyroscopic Effects", "Vehicles and rotating machinery.", [
          "Estimate the gyroscopic bearing reactions of a ship turbine rotor when the vessel pitches",
          "Calculate the change in wheel reactions when a vehicle with rotating wheels turns",
          "Explain how gyroscopic effects influence the stability of a spinning rotor on a flexible shaft",
        ]),
      ]),
    ],
  ),

  course(
    {
      slug: "mce-stress-analysis-2",
      code: "MCE205",
      name: "Stress Analysis II",
      shortName: "Stress Analysis II",
      description:
        "Failure criteria, pressure vessels, column buckling, energy methods, statically indeterminate structures, unsymmetric bending, stress concentration and strain-gauge experiments.",
      year: "Year2",
      semester: 1,
      creditUnits: 4,
      icon: "Stack",
      src: ["imperial", "berkeley"],
    },
    [
      m("failure-criteria", "Failure Criteria", "Predicting yield under multiaxial stress.", [
        u("yield-criteria", "Tresca and von Mises", "Maximum shear stress and distortion energy theories.", [
          "Compute the von Mises equivalent stress from a given plane stress state",
          "Calculate the Tresca factor of safety for a biaxial stress state",
          "Compare the Tresca and von Mises yield loci and identify where they agree",
        ]),
        u("brittle-failure-criteria", "Brittle Material Criteria", "Maximum normal stress and Mohr-Coulomb.", [
          "Apply the maximum normal stress criterion to a brittle component",
          "Explain why a brittle material needs a different criterion from a ductile one",
          "Determine the factor of safety of a cast iron part under biaxial stress",
        ]),
      ]),
      m("pressure-vessels", "Thin and Thick Pressure Vessels", "Hoop and axial stress in cylinders and spheres.", [
        u("thin-walled-vessels", "Thin-Walled Vessels", "Membrane stresses.", [
          "Calculate hoop and longitudinal stress in a thin-walled cylinder under internal pressure",
          "Determine the minimum wall thickness for a spherical vessel with a given allowable stress",
          "Compute the change in diameter of a pressurised thin cylinder using the elastic constants",
        ]),
        u("thick-cylinders", "Thick-Walled Cylinders", "Lame equations and compound cylinders.", [
          "Calculate radial and hoop stress through the wall of a thick cylinder using the Lame equations",
          "Determine the interface pressure of a shrink-fit compound cylinder",
          "Explain why the maximum hoop stress in a thick cylinder is at the inner surface",
        ]),
      ]),
      m("column-buckling", "Column Buckling", "Instability of slender compression members.", [
        u("euler-buckling", "Euler Buckling", "Critical load for ideal columns.", [
          "Calculate the Euler critical load for a pinned-pinned column",
          "Apply the effective length factor for fixed-free and fixed-fixed end conditions",
          "Determine the slenderness ratio below which Euler theory no longer applies",
        ]),
        u("practical-columns", "Practical Columns and Eccentric Loads", "Initial imperfection and empirical formulas.", [
          "Use the Johnson parabola for short and intermediate columns of a given steel",
          "Compute the maximum stress in an eccentrically loaded column using the secant formula",
          "Choose a section to resist a given compressive load with a stated factor of safety against buckling",
        ]),
      ]),
      m("energy-methods", "Energy Methods", "Strain energy, Castigliano and virtual work.", [
        u("strain-energy", "Strain Energy", "Energy stored under axial, bending and torsional loading.", [
          "Calculate strain energy in a bar under axial load and in a beam under bending",
          "Find the deflection of the load point of a simple structure using strain energy equating to work",
          "Compute the impact stress in a bar struck by a falling mass using energy balance",
        ]),
        u("castigliano-unit-load", "Castigliano and Unit-Load Methods", "Deflections from energy derivatives.", [
          "Apply Castigliano's second theorem to find the deflection of a cantilever tip",
          "Use a dummy load to find the deflection at a point where no load is applied",
          "Compute the deflection of a frame by the unit load method",
        ]),
      ]),
      m("indeterminate-structures", "Statically Indeterminate Structures", "More unknowns than equilibrium equations.", [
        u("redundant-members", "Redundant Members and Compatibility", "Solving with an extra equation from deformation.", [
          "Determine the degree of indeterminacy of a truss or beam",
          "Solve a propped cantilever for the prop reaction using Castigliano's theorem",
          "Calculate member forces in a truss with one redundant bar",
        ]),
        u("indeterminate-effects", "Settlement, Misfit and Temperature Effects", "Self-stress in redundant structures.", [
          "Calculate the force induced in a redundant bar by a lack-of-fit",
          "Determine support reactions caused by a differential support settlement",
          "Explain why a statically determinate structure carries no stress from temperature change",
        ]),
      ]),
      m("unsymmetric-bending-and-shear-centre", "Unsymmetric Bending and Shear Centre", "Beams whose loads are not in a principal plane.", [
        u("unsymmetric-bending", "Unsymmetric Bending", "Product of area and principal axes.", [
          "Compute principal second moments of area and the orientation of principal axes",
          "Calculate bending stress at a point for a moment not aligned with a principal axis",
          "Determine the neutral axis orientation for unsymmetric bending of an angle section",
        ]),
        u("shear-centre", "Shear Flow and Shear Centre", "Open thin-walled sections.", [
          "Calculate shear flow distribution in a channel section under vertical shear",
          "Locate the shear centre of a channel section",
          "Explain why loading through the shear centre prevents twisting of an open section",
        ]),
      ]),
      m("stress-concentration", "Stress Concentration", "Localised amplification at geometric discontinuities.", [
        u("stress-concentration-factors", "Concentration Factors", "Holes, fillets and notches.", [
          "Calculate the maximum stress at a hole in a plate using the theoretical concentration factor Kt",
          "Read Kt from a chart for a stepped shaft with a shoulder fillet",
          "Explain why the stress concentration at a small circular hole in a wide plate is 3 in tension",
        ]),
        u("mitigating-concentration", "Mitigating Stress Concentration", "Design changes that lower peak stress.", [
          "Select a fillet radius that lowers the stress concentration at a shaft shoulder",
          "Compare the effect of concentration on ductile and brittle materials under static load",
          "Propose geometry modifications to flatten the stress flow around a cut-out",
        ]),
      ]),
      m("strain-gauge-experiments", "Strain Gauge Experiments", "Measuring stress in real structures.", [
        u("strain-gauge-measurement", "Strain Gauge Measurement", "Bridge circuits and calibration.", [
          "Calculate strain from the output voltage of a Wheatstone bridge with a given gauge factor",
          "Select a bridge configuration that cancels temperature effects in a bending test",
          "Estimate uncertainty in a strain measurement from calibration and noise",
        ]),
        u("rosettes-and-comparison", "Strain Rosettes and Comparison with Theory", "Determining principal strains from three gauges.", [
          "Calculate principal strains and directions from a 45 degree rectangular rosette",
          "Convert principal strains to principal stresses using the elastic constants",
          "Compare experimental and theoretical stress at a point and discuss the discrepancy",
        ]),
      ]),
    ],
  ),

  course(
    {
      slug: "mce-manufacturing-processes",
      code: "MCE206",
      name: "Manufacturing Processes",
      shortName: "Mfg Processes",
      description:
        "Casting, bulk and sheet forming, machining mechanics, welding metallurgy, powder and additive processes, process capability, tolerances and cost estimation.",
      year: "Year2",
      semester: 1,
      creditUnits: 3,
      icon: "Factory",
      src: ["imperial", "berkeley"],
    },
    [
      m("casting", "Casting", "Shaping metal by solidification in a mould.", [
        u("solidification-and-gating", "Solidification and Gating", "Freezing time and mould filling.", [
          "Estimate solidification time of a casting using Chvorinov's rule",
          "Size a riser so that it freezes after the casting it feeds",
          "Explain how gating design reduces turbulence and inclusions",
        ]),
        u("casting-processes", "Casting Processes and Defects", "Sand, investment and die casting.", [
          "Compare sand, investment and high-pressure die casting by tolerance, finish and volume",
          "Identify causes of porosity, shrinkage cavities and cold shuts",
          "Select a casting process for a part given geometry, material and annual quantity",
        ]),
      ]),
      m("bulk-forming", "Bulk Forming", "Plastic deformation of billets.", [
        u("forging-and-rolling", "Forging and Rolling", "Compressive forming of metal.", [
          "Calculate the forging force for a cylindrical upset with a given flow stress and friction",
          "Estimate the maximum reduction possible in a single rolling pass from friction coefficient and roll radius",
          "Explain the difference in grain structure between forged and cast parts",
        ]),
        u("extrusion-and-drawing", "Extrusion and Drawing", "Forcing metal through a die.", [
          "Calculate extrusion ratio and estimate extrusion pressure from flow stress",
          "Determine the draw force and reduction in a wire-drawing pass",
          "Choose between forward and backward extrusion for a given product shape",
        ]),
      ]),
      m("sheet-forming", "Sheet Forming", "Cutting and bending thin plates.", [
        u("shearing-and-bending", "Shearing and Bending", "Blanking, punching and bend allowances.", [
          "Calculate the punch force to blank a part from sheet given shear strength, perimeter and thickness",
          "Compute bend allowance and springback consideration for a sheet metal bend",
          "Determine the recommended die clearance for a blanking operation",
        ]),
        u("deep-drawing", "Deep Drawing", "Forming cups from flat blanks.", [
          "Calculate the limiting drawing ratio and the blank diameter for a cup of given dimensions",
          "Identify the causes of wrinkling and tearing in deep drawing",
          "Explain the role of blank holder force and lubrication",
        ]),
      ]),
      m("machining-mechanics", "Machining Mechanics", "Forces and energy in metal cutting.", [
        u("chip-formation", "Chip Formation and Orthogonal Cutting", "Shear plane and chip thickness ratio.", [
          "Calculate the shear angle from the chip thickness ratio and rake angle",
          "Determine cutting force components from a dynamometer measurement and compute friction angle",
          "Estimate the specific cutting energy from power and material removal rate",
        ]),
        u("tool-life", "Tool Life and Economics", "Taylor's equation and cost-optimal speed.", [
          "Apply Taylor's tool life equation to predict life at a new cutting speed",
          "Calculate the cutting speed that minimises machining cost per part",
          "Explain how tool wear mechanisms differ between low and high cutting speeds",
        ]),
      ]),
      m("welding-metallurgy", "Welding Metallurgy", "What heat does to the metal around a weld.", [
        u("weld-heat-flow", "Heat Flow in Welding", "Heat input and cooling rate.", [
          "Calculate arc welding heat input per unit length from voltage, current, travel speed and efficiency",
          "Explain how heat input affects cooling rate and grain size in the heat-affected zone",
          "Identify the fusion zone, heat-affected zone and parent metal in a weld cross-section",
        ]),
        u("weld-defects-and-weldability", "Weldability and Defects", "Cracking, distortion and residual stress.", [
          "Calculate carbon equivalent to assess hydrogen cracking risk in a steel",
          "Describe why preheating reduces the risk of cold cracking",
          "Explain how residual stresses and distortion arise from restrained thermal contraction",
        ]),
      ]),
      m("powder-and-additive-processes", "Powder and Additive Processes", "Near-net-shape manufacturing without bulk removal.", [
        u("powder-metallurgy", "Powder Metallurgy", "Pressing and sintering.", [
          "Describe the sequence of blending, compaction and sintering of a powder metal part",
          "Estimate the density of a sintered compact from porosity",
          "Identify parts for which powder metallurgy is more economical than machining",
        ]),
        u("additive-processes", "Metal and Polymer Additive Processes", "Selective laser melting, extrusion and binder jetting.", [
          "Compare powder bed fusion and directed energy deposition by feature resolution and build rate",
          "Explain the origin of residual stress in a laser powder bed fusion part",
          "Decide whether a part is better made by casting, machining or additive manufacturing at a given batch size",
        ]),
      ]),
      m("process-capability-and-tolerances", "Process Capability and Tolerances", "Matching processes to dimensional requirements.", [
        u("achievable-tolerances", "Achievable Tolerances and Surface Finish", "Typical capability by process.", [
          "Select a process that can meet a stated tolerance and surface roughness",
          "Describe the effect of tool wear and thermal expansion on dimensional accuracy",
          "Specify an appropriate finishing process for a precision bearing seat",
        ]),
        u("capability-indices", "Process Capability Indices", "Cp and Cpk from measured data.", [
          "Compute Cp and Cpk from the mean and standard deviation of a process",
          "Interpret a Cpk below one in terms of expected defect rate",
          "Calculate the statistical tolerance of an assembly from the standard deviations of its parts",
        ]),
      ]),
      m("cost-estimation", "Cost Estimation", "Comparing process routes economically.", [
        u("cost-structure", "Fixed and Variable Costs", "Tooling, material, labour and overhead.", [
          "Break the unit cost of a part into material, labour, tooling and overhead components",
          "Calculate the break-even quantity between two processes with different tooling and unit costs",
          "Explain why high tooling costs favour high-volume production",
        ]),
        u("process-selection-economics", "Process Selection Economics", "Choosing a route for a given volume.", [
          "Estimate machining time and cost for a simple turned part",
          "Compare casting plus finish machining with machining from bar for 100 and 100 000 parts",
          "Recommend a manufacturing route and justify it with cost, quality and lead time",
        ]),
      ]),
    ],
  ),

  course(
    {
      slug: "mce-heat-transfer",
      code: "MCE211",
      name: "Heat Transfer",
      shortName: "Heat Transfer",
      description:
        "Conduction, transient conduction, numerical conduction, forced and natural convection, boiling and condensation, radiation and heat exchanger design.",
      year: "Year2",
      semester: 2,
      creditUnits: 4,
      icon: "ThermometerHot",
      src: ["imperial", "berkeley", "gatech", "stanford"],
    },
    [
      m("steady-conduction", "Steady One-Dimensional Conduction", "Fourier's law and thermal resistance.", [
        u("fouriers-law-and-resistances", "Fourier's Law and Thermal Resistances", "Plane walls, cylinders and composite layers.", [
          "Calculate heat flow through a composite plane wall using a thermal resistance network",
          "Compute heat loss through a cylindrical pipe wall with insulation",
          "Determine the interface temperature between two layers in series",
        ]),
        u("fins-and-critical-radius", "Fins and Critical Insulation Radius", "Extended surfaces and insulation limits.", [
          "Calculate heat transfer from a straight fin of uniform section with adiabatic tip",
          "Determine fin efficiency and effectiveness from fin parameters",
          "Compute the critical insulation radius of a cylindrical pipe and explain when insulation increases heat loss",
        ]),
      ]),
      m("transient-conduction", "Transient Conduction", "Temperature changing with time.", [
        u("lumped-capacitance", "Lumped Capacitance", "Uniform-temperature bodies and the Biot number.", [
          "Calculate the Biot number and decide whether the lumped capacitance model is valid",
          "Determine the temperature of a small body at a stated time using the exponential response",
          "Compute the time constant of a thermocouple junction in a gas stream",
        ]),
        u("semi-infinite-and-charts", "Semi-Infinite Solids and Heisler Charts", "Spatial gradients in transient conduction.", [
          "Use the semi-infinite solid solution to find surface contact temperature or penetration depth",
          "Read centre temperature of a plane wall from a Heisler chart for a given Fourier number",
          "Estimate the time for the centre of a steel billet to reach a target temperature",
        ]),
      ]),
      m("numerical-conduction", "Numerical Conduction", "Finite-difference solutions.", [
        u("finite-difference-steady", "Finite-Difference Steady Conduction", "Nodal equations for 1D and 2D.", [
          "Write the finite-difference energy balance for an interior node in a two-dimensional grid",
          "Set up the nodal equations for a node on a convective boundary",
          "Solve a small set of nodal equations by Gauss-Seidel iteration",
        ]),
        u("finite-difference-transient", "Transient Finite-Difference Methods", "Explicit time stepping and stability.", [
          "Apply the explicit finite-difference scheme to advance temperatures one time step",
          "Determine the maximum stable time step from the Fourier number criterion",
          "Contrast explicit and implicit schemes on stability and cost per step",
        ]),
      ]),
      m("forced-convection", "Forced Convection", "Heat transfer to a flowing fluid.", [
        u("external-forced-convection", "External Flow", "Plates, cylinders and spheres.", [
          "Compute the average Nusselt number and heat transfer coefficient for laminar flow over a flat plate",
          "Estimate heat loss from a cylinder in cross-flow using a Nusselt correlation",
          "Explain the role of the Reynolds and Prandtl numbers in convection correlations",
        ]),
        u("internal-forced-convection", "Internal Flow", "Heat transfer in tubes and ducts.", [
          "Calculate the exit bulk temperature of a fluid heated in a tube with uniform wall flux",
          "Select a Nusselt correlation for fully developed turbulent flow in a tube",
          "Determine the fully developed laminar Nusselt number for constant wall temperature versus constant flux",
        ]),
      ]),
      m("natural-convection", "Natural Convection", "Buoyancy-driven flow.", [
        u("buoyancy-and-grashof", "Buoyancy and the Grashof and Rayleigh Numbers", "Dimensionless groups for free convection.", [
          "Calculate the Rayleigh number for a vertical plate in air",
          "Explain how the transition to turbulence in natural convection depends on the Rayleigh number",
          "Determine the volumetric expansion coefficient of an ideal gas at a given temperature",
        ]),
        u("natural-convection-correlations", "Natural Convection Correlations", "Plates, cylinders and enclosures.", [
          "Estimate heat loss from a vertical heated wall using a Nusselt correlation",
          "Compute the heat transfer across a horizontal air layer heated from below",
          "Compare natural and forced convection coefficients for a given application",
        ]),
      ]),
      m("boiling-and-condensation", "Boiling and Condensation", "Phase-change heat transfer.", [
        u("pool-boiling", "Pool Boiling", "Boiling curve and regimes.", [
          "Identify natural convection, nucleate, transition and film boiling on a boiling curve",
          "Estimate the critical heat flux for saturated pool boiling of water",
          "Explain why heat flux controlled equipment risks burnout at the critical heat flux",
        ]),
        u("condensation", "Film Condensation", "Nusselt theory for condensing vapour.", [
          "Calculate the average condensation heat transfer coefficient on a vertical plate using the Nusselt expression",
          "Compute the condensation rate from the heat removed and latent heat",
          "Explain why dropwise condensation gives a higher heat transfer coefficient than film condensation",
        ]),
      ]),
      m("radiation", "Thermal Radiation", "Heat transfer by electromagnetic waves.", [
        u("blackbody-and-emissivity", "Blackbody Radiation and Emissivity", "Stefan-Boltzmann law and surface properties.", [
          "Calculate the emissive power of a blackbody at a given temperature",
          "Determine radiative heat exchange between a small gray body and large surroundings",
          "Explain how absorptivity, reflectivity and transmissivity sum to unity",
        ]),
        u("view-factors-and-networks", "View Factors and Radiation Networks", "Exchange between surfaces.", [
          "Apply reciprocity and summation rules to find an unknown view factor",
          "Build a radiation resistance network for a two-surface enclosure and compute net exchange",
          "Calculate the effect of a radiation shield between two parallel plates",
        ]),
      ]),
      m("heat-exchangers", "Heat Exchangers", "Sizing and rating equipment that transfers heat between fluids.", [
        u("lmtd-method", "The LMTD Method", "Overall coefficient and log-mean temperature difference.", [
          "Compute the overall heat transfer coefficient including fouling resistances",
          "Calculate the log-mean temperature difference for parallel and counterflow arrangements",
          "Determine the area required of a counterflow exchanger for a stated duty",
        ]),
        u("effectiveness-ntu", "The Effectiveness-NTU Method", "Rating when outlet temperatures are unknown.", [
          "Calculate NTU and effectiveness of a counterflow heat exchanger",
          "Determine outlet temperatures of an existing exchanger using effectiveness-NTU relations",
          "Choose between LMTD and effectiveness-NTU methods based on which temperatures are known",
        ]),
      ]),
    ],
  ),

  course(
    {
      slug: "mce-fluid-mechanics-2",
      code: "MCE212",
      name: "Fluid Mechanics II",
      shortName: "Fluid Mech II",
      description:
        "Differential continuity and the Navier-Stokes equations, potential flow, viscous solutions, boundary layers, drag and lift, introductory turbulence, compressible flow and turbomachinery.",
      year: "Year2",
      semester: 2,
      creditUnits: 4,
      icon: "Waves",
      src: ["imperial", "cambridge", "berkeley"],
    },
    [
      m("continuity-and-navier-stokes", "Differential Continuity and Navier-Stokes", "Governing equations of fluid motion.", [
        u("differential-continuity", "Differential Continuity and Stream Function", "Mass conservation at a point.", [
          "Verify whether a given velocity field satisfies incompressible continuity",
          "Derive a stream function for a two-dimensional incompressible flow",
          "Compute the volume flow between two streamlines from stream function values",
        ]),
        u("navier-stokes-equations", "The Navier-Stokes Equations", "Momentum balance with viscous stress.", [
          "Identify the terms of the incompressible Navier-Stokes equation as inertia, pressure, viscous and body force",
          "Simplify the Navier-Stokes equations for unidirectional steady flow",
          "State the no-slip boundary condition and its use in solving viscous flows",
        ]),
      ]),
      m("potential-flow", "Potential Flow", "Inviscid, irrotational flow fields.", [
        u("velocity-potential", "Velocity Potential and Elementary Flows", "Uniform flow, source, sink and vortex.", [
          "Derive velocity components from a velocity potential and stream function",
          "Describe the flow fields of a source, sink and free vortex and their strengths",
          "Check whether a velocity field is irrotational",
        ]),
        u("superposition-flows", "Superposition and Flow Past Cylinders", "Building flows by adding solutions.", [
          "Construct flow past a circular cylinder by superposing uniform flow and a doublet",
          "Calculate surface pressure coefficient on a cylinder in potential flow",
          "Explain why potential flow predicts zero drag and what this paradox reveals",
        ]),
      ]),
      m("viscous-exact-solutions", "Viscous Exact Solutions", "Closed-form solutions of Navier-Stokes.", [
        u("couette-and-poiseuille", "Couette and Poiseuille Flow", "Flow between plates and in pipes.", [
          "Derive the velocity profile for plane Couette flow with a moving plate",
          "Calculate the flow rate through a circular pipe in laminar flow using Hagen-Poiseuille",
          "Determine the shear stress at the wall for laminar pipe flow from pressure gradient",
        ]),
        u("film-and-rotating-flows", "Film and Rotating Flows", "Gravity-driven films and bearings.", [
          "Derive the velocity profile of a gravity-driven film on an inclined plane",
          "Calculate the torque on a journal bearing from the viscous shear in the oil film",
          "Estimate flow rate over an inclined plane from film thickness",
        ]),
      ]),
      m("boundary-layers", "Boundary Layers", "Thin regions where viscosity matters.", [
        u("boundary-layer-concepts", "Boundary Layer Concepts", "Thickness, displacement and momentum thickness.", [
          "Calculate boundary layer thickness on a flat plate using the Blasius result",
          "Determine displacement and momentum thickness from a given velocity profile",
          "Compute the skin friction coefficient for laminar flow over a flat plate",
        ]),
        u("momentum-integral", "Momentum Integral and Separation", "Approximate methods and adverse pressure gradients.", [
          "Apply the von Karman momentum integral equation with an assumed profile",
          "Explain why an adverse pressure gradient causes boundary layer separation",
          "Estimate the turbulent boundary layer thickness at a given distance using a power-law correlation",
        ]),
      ]),
      m("drag-and-lift", "Drag and Lift", "Forces on bodies in a stream.", [
        u("drag-forces", "Drag on Bodies", "Skin friction, pressure drag and drag coefficients.", [
          "Calculate the drag on a sphere or cylinder from a drag coefficient chart value",
          "Distinguish skin friction from form drag and give examples of bodies dominated by each",
          "Explain how streamlining reduces pressure drag",
        ]),
        u("lift-and-aerofoils", "Lift and Aerofoils", "Circulation and lift coefficient.", [
          "Compute the lift force on a wing from lift coefficient, density, speed and area",
          "Relate lift to circulation using the Kutta-Joukowski theorem",
          "Describe stall in terms of boundary layer separation on the upper surface",
        ]),
      ]),
      m("turbulence-intro", "Introduction to Turbulence", "Fluctuating flow at high Reynolds number.", [
        u("reynolds-averaging", "Reynolds Decomposition and Averaging", "Mean and fluctuating parts.", [
          "Decompose velocity into mean and fluctuating components and compute turbulence intensity",
          "Explain how Reynolds stresses arise from averaging the momentum equation",
          "Describe why averaged equations are not closed",
        ]),
        u("turbulent-wall-flows", "Turbulent Wall-Bounded Flows", "Log law and friction.", [
          "Apply the logarithmic law of the wall to estimate velocity at a given distance from the surface",
          "Estimate wall shear stress in turbulent pipe flow from the friction factor",
          "Compare mixing and velocity profile fullness in laminar and turbulent pipe flow",
        ]),
      ]),
      m("compressible-flow", "Compressible One-Dimensional Flow", "Nozzles, choking and shocks.", [
        u("isentropic-flow", "Isentropic Flow and Nozzles", "Mach number and area-velocity relations.", [
          "Calculate stagnation temperature and pressure from static conditions and Mach number",
          "Determine the choked mass flow rate through a nozzle throat",
          "Explain how nozzle area change affects velocity in subsonic and supersonic flow",
        ]),
        u("normal-shocks", "Normal Shock Waves", "Discontinuities in supersonic flow.", [
          "Calculate downstream Mach number and pressure ratio across a normal shock",
          "Show that stagnation temperature is conserved but stagnation pressure drops across a shock",
          "Determine the operating regimes of a convergent-divergent nozzle at different back pressures",
        ]),
      ]),
      m("turbomachinery-intro", "Introduction to Turbomachinery", "Machines that exchange energy with fluids.", [
        u("euler-turbomachine-equation", "The Euler Turbomachine Equation", "Angular momentum and work transfer.", [
          "Derive the specific work of a turbomachine from the change in angular momentum",
          "Draw and use inlet and outlet velocity triangles for a centrifugal pump impeller",
          "Calculate the head developed by a pump from impeller dimensions and speed",
        ]),
        u("specific-speed-and-matching", "Specific Speed and System Matching", "Choosing the right type of machine.", [
          "Calculate pump specific speed and select a pump type from it",
          "Use the affinity laws to predict changes in flow, head and power with speed",
          "Determine the operating point of a pump from its curve and the system curve",
        ]),
      ]),
    ],
  ),

  course(
    {
      slug: "mce-materials-2",
      code: "MCE213",
      name: "Materials II: Metals, Polymers and Composites",
      shortName: "Materials II",
      description:
        "Dislocation strengthening, steels and non-ferrous alloys, transformation kinetics, polymer viscoelasticity, ceramics, composites, corrosion and selection with performance indices.",
      year: "Year2",
      semester: 2,
      creditUnits: 3,
      icon: "Atom",
      src: ["imperial", "berkeley", "cambridge"],
    },
    [
      m("dislocations-and-strengthening", "Dislocations and Strengthening", "Why metals are strong, and how to make them stronger.", [
        u("dislocation-mechanics", "Dislocation Slip", "Slip systems and critical resolved shear stress.", [
          "Calculate resolved shear stress on a slip system using Schmid's law",
          "Identify the slip systems of FCC and BCC crystals and compare their ductility",
          "Explain why single crystals yield at the critical resolved shear stress",
        ]),
        u("strengthening-mechanisms", "Strengthening Mechanisms", "Grain boundaries, solutes, precipitates and work hardening.", [
          "Apply the Hall-Petch relation to predict the yield strength of a metal with a given grain size",
          "Compare solid-solution, precipitation and strain hardening as strengthening routes",
          "Estimate the effect of cold work on yield strength and ductility and explain how annealing restores them",
        ]),
      ]),
      m("steels-and-nonferrous-alloys", "Steels and Non-Ferrous Alloys", "The main families of engineering metals.", [
        u("steel-types", "Carbon and Alloy Steels", "Classification and typical uses.", [
          "Classify steels as low, medium or high carbon and give typical applications",
          "Explain the role of Cr, Ni, Mo and Mn in alloy steels",
          "Describe the composition and corrosion behaviour of austenitic stainless steel",
        ]),
        u("aluminium-titanium-copper", "Aluminium, Titanium and Copper Alloys", "Light and conductive alloys.", [
          "Compare the specific strength of aluminium, titanium and steel alloys",
          "Explain precipitation hardening in an aluminium-copper alloy",
          "Select an alloy family for an aircraft bracket, a heat exchanger tube and an electrical connector",
        ]),
      ]),
      m("heat-treatment-kinetics", "Heat Treatment Kinetics", "How fast transformations happen.", [
        u("ttt-and-cct-diagrams", "TTT and CCT Diagrams", "Time-temperature-transformation behaviour.", [
          "Read a TTT diagram to predict the microstructure of a steel cooled along a stated path",
          "Determine the critical cooling rate required to avoid pearlite and form martensite",
          "Distinguish isothermal TTT from continuous-cooling CCT diagrams",
        ]),
        u("precipitation-and-tempering-kinetics", "Precipitation and Tempering Kinetics", "Ageing and tempering curves.", [
          "Explain how ageing time and temperature affect hardness of a precipitation-hardened alloy",
          "Use the Hollomon-Jaffe parameter to compare tempering treatments",
          "Specify a heat-treatment schedule to reach a target hardness in a medium-carbon steel",
        ]),
      ]),
      m("polymers-viscoelasticity", "Polymers and Viscoelasticity", "Time-dependent mechanical behaviour.", [
        u("polymer-structure-properties", "Polymer Structure and Properties", "Molecular weight, crystallinity and crosslinking.", [
          "Relate crystallinity and crosslink density to stiffness and melting behaviour of a polymer",
          "Calculate number- and weight-average molecular weight from a distribution table",
          "Compare the properties of thermoplastics such as polyethylene, nylon and PEEK for engineering use",
        ]),
        u("viscoelastic-models", "Viscoelastic Models", "Creep and stress relaxation.", [
          "Use a Maxwell model to predict stress relaxation at constant strain",
          "Use a Kelvin-Voigt model to predict creep under constant stress",
          "Explain how temperature and loading rate shift the stiffness of a polymer",
        ]),
      ]),
      m("ceramics-and-glass", "Ceramics and Glass", "Hard, brittle and heat-resistant materials.", [
        u("ceramic-structure-and-strength", "Ceramic Structure and Strength", "Flaws and the Weibull approach.", [
          "Explain why the strength of ceramics scatters and depends on specimen size",
          "Apply the Griffith criterion to estimate fracture stress from flaw size",
          "Use the Weibull distribution to compute the survival probability at a stated stress",
        ]),
        u("glass-and-engineering-ceramics", "Glass and Engineering Ceramics", "Glass transition and common technical ceramics.", [
          "Describe the glass transition and how thermal tempering produces compressive surface stress",
          "Compare alumina, silicon carbide and zirconia on hardness, toughness and temperature capability",
          "Select a ceramic for a wear or high-temperature component and state its limits",
        ]),
      ]),
      m("composites", "Composites", "Combining phases to achieve properties neither has alone.", [
        u("rule-of-mixtures", "Rule of Mixtures", "Stiffness of fibre composites.", [
          "Calculate the longitudinal and transverse modulus of a unidirectional composite from fibre fraction",
          "Determine the fraction of the load carried by the fibres in a composite under uniaxial tension",
          "Explain why a composite is much weaker transverse to the fibres",
        ]),
        u("laminates", "Laminates", "Ply orientation and laminate behaviour.", [
          "Describe how ply angle and stacking sequence affect in-plane stiffness",
          "Explain why a symmetric laminate does not warp under in-plane load",
          "Select a layup for a thin-walled tube loaded in torsion",
        ]),
      ]),
      m("corrosion", "Corrosion", "Environmental degradation of metals.", [
        u("electrochemical-corrosion", "Electrochemical Corrosion", "Anodes, cathodes and the galvanic series.", [
          "Explain corrosion as paired anodic and cathodic half-reactions",
          "Use the galvanic series to predict which metal corrodes in a bimetallic couple",
          "Calculate the corrosion rate from corrosion current density using Faraday's law",
        ]),
        u("corrosion-forms-and-protection", "Forms of Corrosion and Protection", "Pitting, crevice and stress corrosion; coatings and cathodic protection.", [
          "Identify uniform, pitting, crevice and stress-corrosion cracking from their appearance",
          "Compare sacrificial anode and impressed-current cathodic protection",
          "Specify a protection method for a steel structure in a marine environment",
        ]),
      ]),
      m("selection-with-performance-indices", "Selection with Performance Indices", "Systematic, quantitative material choice.", [
        u("deriving-indices", "Deriving Performance Indices", "Function, objective and constraint.", [
          "Derive the performance index for a minimum-mass beam of given stiffness and square section",
          "Derive the index for a light, strong tie and compare it with the beam index",
          "Identify the free variable eliminated in the derivation of a performance index",
        ]),
        u("applying-indices", "Applying Indices and Trade-offs", "Screening, ranking and multiple objectives.", [
          "Screen a material database using constraints and rank survivors with a performance index",
          "Plot a candidate set on a property chart with a selection line for the index",
          "Resolve a conflict between cost and performance using a stated trade-off value",
        ]),
      ]),
    ],
  ),

  course(
    {
      slug: "mce-machine-design-1",
      code: "MCE214",
      name: "Machine Design I: Machine Elements",
      shortName: "Machine Design I",
      description:
        "Static and fatigue strength design, shafts and keys, bearings, gears, threaded fasteners, springs, brakes and clutches.",
      year: "Year2",
      semester: 2,
      creditUnits: 4,
      icon: "Gear",
      src: ["gatech", "michigan", "stanford"],
    },
    [
      m("static-strength-design", "Static Strength Design", "Sizing members against yield and fracture.", [
        u("factor-of-safety-and-load-cases", "Factor of Safety and Load Cases", "Allowable stress and design factors.", [
          "Calculate the factor of safety against yielding for a loaded member using the von Mises criterion",
          "Choose a design factor with reference to load uncertainty and consequence of failure",
          "Identify the critical section of a machine part from its free-body diagram",
        ]),
        u("static-failure-of-parts", "Static Failure of Ductile and Brittle Parts", "Applying failure theories to components.", [
          "Compute the factor of safety of a brittle part using a modified Mohr criterion",
          "Combine axial, bending and torsional stresses at a critical point of a stepped shaft",
          "Evaluate the effect of stress concentration on static design of ductile and brittle parts",
        ]),
      ]),
      m("fatigue-design", "Fatigue", "Failure under repeated loading.", [
        u("sn-curve-and-endurance-limit", "S-N Curves and Endurance Limit", "Stress-life behaviour.", [
          "Estimate the endurance limit of a steel from its ultimate tensile strength",
          "Apply Marin factors to adjust a laboratory endurance limit for a real component",
          "Read the number of cycles to failure at a given stress amplitude from an S-N curve",
        ]),
        u("mean-stress-and-goodman", "Mean Stress and Goodman Criterion", "Combining alternating and mean stress.", [
          "Calculate the factor of safety for fatigue using the Goodman criterion",
          "Plot a point on a Goodman diagram to determine whether it lies in the safe zone",
          "Apply Miner's rule to estimate cumulative damage under variable amplitude loading",
        ]),
      ]),
      m("shafts-and-keys", "Shafts and Keys", "Rotating members carrying torque and bending.", [
        u("shaft-design", "Shaft Design for Strength and Fatigue", "Combined bending and torsion at a shoulder.", [
          "Determine the minimum shaft diameter for a given bending moment, torque and fatigue factor of safety",
          "Apply stress concentration factors at shoulders and keyways in a shaft fatigue check",
          "Check a shaft's deflection and slope at bearing and gear locations",
        ]),
        u("keys-and-couplings", "Keys, Splines and Couplings", "Transmitting torque to hubs.", [
          "Size a parallel key to transmit a given torque considering shear and bearing stress",
          "Compare keys, splines and interference fits for torque transmission",
          "Select a rigid or flexible coupling for a shaft with misalignment",
        ]),
      ]),
      m("bearings", "Bearings", "Supporting rotating shafts.", [
        u("rolling-element-bearings", "Rolling-Element Bearings", "Selection by load, speed and life.", [
          "Calculate the basic rating life in millions of revolutions from dynamic load rating and equivalent load",
          "Compute the equivalent dynamic load for a bearing carrying combined radial and axial load",
          "Select a ball or roller bearing type for given load directions and speed",
        ]),
        u("journal-bearings", "Journal Bearings", "Hydrodynamic lubrication basics.", [
          "Explain how a hydrodynamic oil film forms and carries load in a journal bearing",
          "Calculate bearing pressure and the Sommerfeld number for a given operating condition",
          "Estimate friction torque and power loss in a lightly loaded journal bearing",
        ]),
      ]),
      m("gears", "Gears", "Transmitting power at fixed speed ratios.", [
        u("spur-gear-geometry", "Spur Gear Geometry and Forces", "Pitch, module and tooth loads.", [
          "Calculate pitch diameter, centre distance and speed ratio from module and tooth numbers",
          "Determine tangential and radial tooth forces for a given transmitted power",
          "Check the minimum number of teeth to avoid undercutting for a stated pressure angle",
        ]),
        u("gear-strength-and-helical", "Gear Strength and Helical Gears", "Bending and contact stress.", [
          "Calculate Lewis bending stress at the root of a spur gear tooth",
          "Compute the axial thrust and normal tooth force on a helical gear",
          "Explain why helical gears run more smoothly but impose axial load on bearings",
        ]),
      ]),
      m("threaded-fasteners-and-joints", "Threaded Fasteners and Bolted Joints", "Preload and load sharing in joints.", [
        u("bolt-preload-and-torque", "Bolt Preload and Tightening Torque", "Relating torque to clamp load.", [
          "Estimate preload from tightening torque using the torque coefficient",
          "Calculate the tensile stress area and proof load of a metric bolt",
          "Explain why high preload improves fatigue resistance of a bolted joint",
        ]),
        u("joint-stiffness-and-loading", "Joint Stiffness and External Loading", "Bolt and member stiffness.", [
          "Calculate the joint constant from the stiffness of the bolt and clamped members",
          "Determine the bolt load and clamp load under an external tensile force",
          "Check a bolted joint for separation and for shear on the fastener group",
        ]),
      ]),
      m("springs", "Springs", "Elastic energy storage and force generation.", [
        u("helical-compression-springs", "Helical Compression Springs", "Stress, rate and buckling.", [
          "Calculate shear stress in a helical spring including the Wahl correction factor",
          "Determine the spring rate from wire diameter, mean coil diameter, number of coils and shear modulus",
          "Check a compression spring for solid height and buckling",
        ]),
        u("spring-fatigue-and-other", "Spring Fatigue and Other Types", "Cyclic loading and torsion and leaf springs.", [
          "Evaluate the fatigue factor of safety for a spring loaded cyclically between two forces",
          "Calculate the deflection of a torsion spring under a given moment",
          "Choose between series and parallel springs to meet a stated stiffness",
        ]),
      ]),
      m("brakes-and-clutches", "Brakes and Clutches", "Controlled friction engagement.", [
        u("clutch-design", "Clutch Design", "Plate clutches and torque capacity.", [
          "Calculate the torque capacity of a single-plate clutch using uniform wear and uniform pressure assumptions",
          "Determine the axial force needed to transmit a given torque",
          "Explain why uniform wear is the more appropriate design assumption after run-in",
        ]),
        u("brake-design", "Brake Design", "Drum, disc and heat dissipation.", [
          "Calculate braking torque for a short-shoe drum brake including the self-energising effect",
          "Compute the energy to be dissipated when stopping a rotating inertia",
          "Estimate the temperature rise of a disc brake in a single stop",
        ]),
      ]),
    ],
  ),

  course(
    {
      slug: "mce-system-dynamics-control-1",
      code: "MCE215",
      name: "System Dynamics and Control I",
      shortName: "Sys Dyn & Control",
      description:
        "Modelling of mechanical, electrical, thermal and fluid systems, transfer functions, time and frequency response, stability, PID control, root locus and simulation.",
      year: "Year2",
      semester: 2,
      creditUnits: 4,
      icon: "Faders",
      src: ["gatech", "berkeley", "imperial", "stanford"],
    },
    [
      m("modelling-physical-systems", "Modelling Physical Systems", "Turning hardware into equations.", [
        u("mechanical-and-electrical-models", "Mechanical and Electrical Models", "Mass-spring-damper and RLC analogies.", [
          "Derive the equation of motion of a mass-spring-damper from Newton's second law",
          "Write the differential equation of a series RLC circuit and identify its mechanical analogue",
          "Model a DC motor with armature circuit and rotor inertia equations",
        ]),
        u("thermal-and-fluid-models", "Thermal and Fluid Models", "Capacitance and resistance in other domains.", [
          "Write a first-order model for a thermal body with convective heat loss",
          "Derive the differential equation for liquid level in a tank with a resistive outflow",
          "Linearise a nonlinear component equation about an operating point",
        ]),
      ]),
      m("transfer-functions-and-block-diagrams", "Transfer Functions and Block Diagrams", "The Laplace-domain view of dynamic systems.", [
        u("laplace-transfer-functions", "Transfer Functions", "Input-output description from the Laplace transform.", [
          "Derive the transfer function of a mass-spring-damper from its differential equation",
          "Identify poles and zeros of a transfer function and state their meaning",
          "Use partial fractions and Laplace tables to invert a response",
        ]),
        u("block-diagram-algebra", "Block Diagram Algebra", "Series, parallel and feedback reduction.", [
          "Reduce a block diagram with a feedback loop to a single transfer function",
          "Derive the closed-loop transfer function for unity and non-unity feedback",
          "Move a summing junction or pick-off point across a block correctly",
        ]),
      ]),
      m("time-response", "First- and Second-Order Response", "Characteristics of transient behaviour.", [
        u("first-order-response", "First-Order Response", "Time constant and steady-state gain.", [
          "Determine the time constant and DC gain of a first-order system from its step response",
          "Calculate the time to reach 90 percent of the final value of a first-order response",
          "Compute the steady-state output for a given step input amplitude",
        ]),
        u("second-order-response", "Second-Order Response", "Natural frequency, damping ratio and specifications.", [
          "Calculate natural frequency and damping ratio from the characteristic equation",
          "Compute percent overshoot and peak time from damping ratio and natural frequency",
          "Classify a second-order system as underdamped, critically damped or overdamped",
        ]),
      ]),
      m("frequency-response-and-bode", "Frequency Response and Bode Plots", "Steady-state response to sinusoids.", [
        u("frequency-response", "Frequency Response", "Gain and phase versus frequency.", [
          "Compute the steady-state amplitude and phase of the output for a sinusoidal input to a first-order system",
          "Determine the corner frequency of a transfer function",
          "Relate bandwidth to the speed of response of a system",
        ]),
        u("bode-plots", "Bode Plots", "Asymptotic sketching.", [
          "Sketch the asymptotic magnitude and phase Bode plot of a transfer function with simple poles",
          "Read the resonant peak of an underdamped second-order system from a Bode plot",
          "Convert a gain between linear units and decibels",
        ]),
      ]),
      m("stability", "Stability", "Whether a closed loop is safe to operate.", [
        u("pole-locations-and-routh", "Pole Locations and the Routh Criterion", "Algebraic stability test.", [
          "Relate the stability of a system to the location of its poles in the s-plane",
          "Apply the Routh-Hurwitz criterion to determine the number of right-half-plane roots",
          "Find the range of a gain for which a closed-loop system is stable",
        ]),
        u("gain-and-phase-margin", "Gain and Phase Margin", "Relative stability from frequency response.", [
          "Read gain margin and phase margin from a Bode plot",
          "Explain how reduced phase margin affects overshoot of the closed loop",
          "Determine the gain crossover frequency of a loop transfer function",
        ]),
      ]),
      m("pid-control", "PID Control", "The workhorse controller.", [
        u("pid-actions", "Proportional, Integral and Derivative Actions", "What each term does.", [
          "Explain the effect of proportional, integral and derivative action on rise time, overshoot and steady-state error",
          "Calculate steady-state error of a type-0 and type-1 system for a step input with proportional control",
          "Describe integral windup and one method to prevent it",
        ]),
        u("pid-tuning", "PID Tuning", "Practical tuning methods.", [
          "Apply the Ziegler-Nichols ultimate-gain method to set PID gains from a measured ultimate gain and period",
          "Tune a PI controller for a first-order plant to meet a stated closed-loop time constant",
          "Evaluate the trade-off between response speed and robustness when increasing gain",
        ]),
      ]),
      m("root-locus", "Root Locus", "How closed-loop poles move with gain.", [
        u("root-locus-rules", "Root Locus Construction", "Rules for sketching the locus.", [
          "Sketch the root locus of a transfer function with three open-loop poles using the standard rules",
          "Determine the asymptote angles and centroid of a root locus",
          "Find the breakaway point of a locus on the real axis",
        ]),
        u("root-locus-design", "Design Using Root Locus", "Choosing gain and adding compensation.", [
          "Select the gain that gives a desired damping ratio from the root locus",
          "Explain how adding a zero or a pole changes the shape of the locus",
          "Determine the gain at which the locus crosses the imaginary axis",
        ]),
      ]),
      m("simulation", "Simulation", "Testing models and controllers numerically.", [
        u("simulating-linear-systems", "Simulating Linear Systems", "Step, impulse and arbitrary inputs.", [
          "Build a simulation of a second-order system and compare its step response with theory",
          "Choose a solver step size to resolve the fastest dynamics in a model",
          "Verify a simulation by checking steady-state gain and natural frequency against hand calculation",
        ]),
        u("simulating-feedback-loops", "Simulating Feedback Loops", "Closed-loop tests with nonlinearities.", [
          "Simulate a PID loop around a plant model and measure overshoot and settling time",
          "Add actuator saturation to a simulation and observe its effect on the response",
          "Compare a linear simulation with a nonlinear one for a large step input",
        ]),
      ]),
    ],
  ),

  course(
    {
      slug: "mce-computational-methods-fea",
      code: "MCE216",
      name: "Computational Methods and Introduction to FEA",
      shortName: "Comp Methods & FEA",
      description:
        "Discretisation and finite differences, bar, truss and beam finite elements, meshing and convergence, plane stress elements, heat-conduction FE, verification and validation, and critical interpretation of results.",
      year: "Year2",
      semester: 2,
      creditUnits: 3,
      icon: "CubeTransparent",
      src: ["mit", "imperial", "berkeley"],
    },
    [
      m("discretisation-and-finite-differences", "Discretisation and Finite Differences", "Replacing continuous problems with algebraic ones.", [
        u("finite-difference-approximations", "Finite-Difference Approximations", "Derivative formulas and truncation error.", [
          "Derive the central-difference approximation of a second derivative from Taylor series",
          "State the order of accuracy of a forward, backward and central difference",
          "Discretise a one-dimensional boundary value problem on a uniform grid",
        ]),
        u("solving-discrete-systems", "Solving the Discrete System", "Direct and iterative solvers.", [
          "Assemble the tridiagonal system for a one-dimensional diffusion problem and solve it",
          "Compare direct and iterative solvers for large sparse systems",
          "Check a discrete solution against the exact solution and plot the error against step size",
        ]),
      ]),
      m("bar-and-truss-elements", "Bar and Truss Elements", "The simplest finite elements.", [
        u("bar-element", "The Two-Node Bar Element", "Stiffness matrix and assembly.", [
          "Derive the stiffness matrix of a two-node bar element from its axial stiffness AE/L",
          "Assemble the global stiffness matrix for a stepped bar of three elements",
          "Apply boundary conditions and solve for nodal displacements and reactions",
        ]),
        u("truss-element", "Truss Elements in Two Dimensions", "Rotating element matrices to global axes.", [
          "Construct the global stiffness matrix of a 2D truss element from its orientation angle",
          "Solve a small truss for nodal displacements and member forces",
          "Verify a truss solution by checking global equilibrium of the reactions",
        ]),
      ]),
      m("beam-elements", "Beam Elements", "Bending with rotations as unknowns.", [
        u("beam-element-formulation", "Beam Element Formulation", "Hermite shape functions and stiffness matrix.", [
          "State the degrees of freedom of the two-node Euler-Bernoulli beam element",
          "Use cubic shape functions to interpolate deflection within an element",
          "Assemble and solve a two-element cantilever beam model",
        ]),
        u("equivalent-nodal-loads", "Distributed Loads and Equivalent Nodal Loads", "Converting loads to nodes.", [
          "Compute consistent nodal forces and moments for a uniformly distributed load on a beam element",
          "Recover element end moments and shear forces from nodal displacements",
          "Compare the finite-element tip deflection with the exact cantilever result",
        ]),
      ]),
      m("meshing-and-convergence", "Meshing and Convergence", "Making a model accurate enough.", [
        u("mesh-refinement", "Mesh Refinement and Element Order", "h- and p-refinement.", [
          "Distinguish h-refinement from p-refinement and give the benefit of each",
          "Plot a quantity of interest against element count and judge whether it has converged",
          "Choose where to refine a mesh in a stress-concentration region",
        ]),
        u("element-quality", "Element Quality and Locking", "Poor shapes and over-stiff behaviour.", [
          "Identify distorted elements from aspect ratio and skewness measures",
          "Explain shear locking in low-order elements under bending",
          "Choose an element type suited to a thin-walled bending problem",
        ]),
      ]),
      m("plane-stress-problems", "Two-Dimensional Stress Problems", "Plane stress and plane strain elements.", [
        u("constant-strain-triangle", "The Constant-Strain Triangle", "Simplest 2D element.", [
          "Compute the strain-displacement matrix of a three-node triangle from nodal coordinates",
          "Build the plane stress constitutive matrix from E and Poisson's ratio",
          "Explain why the constant-strain triangle gives piecewise-constant stress",
        ]),
        u("plane-stress-vs-strain", "Plane Stress vs Plane Strain and Symmetry", "Choosing idealisations.", [
          "Choose plane stress or plane strain for a thin plate and for a long dam section",
          "Apply symmetry boundary conditions to reduce a model to a quarter",
          "Model a plate with a hole and compare peak stress with the theoretical concentration factor",
        ]),
      ]),
      m("heat-conduction-fe", "Finite-Element Heat Conduction", "The same method for thermal problems.", [
        u("one-dimensional-heat-fe", "One-Dimensional Conduction Elements", "Conductivity matrix and thermal loads.", [
          "Derive the element conductivity matrix for a one-dimensional conduction element",
          "Apply fixed-temperature and convective boundary conditions in a one-dimensional model",
          "Solve for nodal temperatures in a two-layer wall and compare with the thermal-resistance method",
        ]),
        u("thermal-stress-coupling", "Thermal Stress Analysis", "Using temperature fields as loads.", [
          "Explain how a temperature field is applied as a thermal strain load in a structural model",
          "Compute the thermal load vector for a constrained bar element",
          "Identify which boundary conditions allow free thermal expansion without stress",
        ]),
      ]),
      m("verification-and-validation", "Verification and Validation", "Establishing that a model can be trusted.", [
        u("verification-methods", "Verification", "Is the model solved correctly?", [
          "Verify a finite-element model against a known analytical solution",
          "Check that reactions balance the applied loads in a solved model",
          "Perform a mesh independence study and report the discretisation error estimate",
        ]),
        u("validation-methods", "Validation", "Is the model the right model?", [
          "Distinguish verification from validation with an example of each",
          "Compare a simulation with experimental strain data and quantify the difference",
          "Describe the assumptions about material, geometry and loading that most limit model validity",
        ]),
      ]),
      m("interpreting-results", "Interpreting Results Critically", "Avoiding the common traps of FE software.", [
        u("common-modelling-errors", "Common Modelling Errors", "Boundary conditions, singularities and units.", [
          "Identify an under-constrained model from rigid body modes or solver warnings",
          "Explain why a point load or sharp re-entrant corner gives a stress singularity",
          "Detect a unit inconsistency from the order of magnitude of results",
        ]),
        u("reporting-fea-results", "Reporting Results", "Judging and presenting simulation outcomes.", [
          "Select the appropriate stress measure to compare with yield for a ductile material",
          "Interpret averaged versus unaveraged stress contours and judge mesh adequacy from the jumps",
          "Write a short analysis summary stating assumptions, checks performed and the margin of safety",
        ]),
      ]),
    ],
  ),
];
