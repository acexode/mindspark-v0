# Mechanical Engineering BEng/BS: curriculum outline for MindSpark

Status: research draft, no app changes. Date: 2026-11-15.

## 0. How this was built, and confidence levels

Method: web searches and page fetches of published programme pages, plus the existing repo subject trees (`app-web/content/subjects/cve-*`). Topic lists below are **my own synthesis** of what these programmes cover, written as original outlines. No lecture text, slides or syllabus wording was copied; sources justify the *course list and sequencing*, not the topic wording.

| Source | What was verified | Confidence |
|---|---|---|
| Imperial College, Mechanical Engineering ([course page](https://www.imperial.ac.uk/study/courses/undergraduate/mechanical-engineering/)) | Full module list Y1-Y3 (MEng page; BEng not separately confirmed) | High |
| MIT Course 2 ([degree chart](https://catalog.mit.edu/degree-charts/mechanical-engineering-course-2)) | Core is 2.001, 2.003, 2.005, 2.006, 2.086 (numerical computation), 2.670 (ME tools), plus an electronics subject (2.678 etc.). Seen via search summary; the catalogue page returned 503 on fetch | Medium |
| UC Berkeley ME ([programme page](https://engineering.berkeley.edu/academics/undergraduate-programs/mechanical-engineering/)) | ENGIN 7, 26, 29; ME 40 Thermodynamics; ME C85 Solid Mechanics; ME 100, 102B, 103, 104 (Eng. Mechanics II), 106 Fluids, 108 Materials, 109 Heat Transfer, 132 Dynamic Systems and Feedback; MATH 51-54, PHYS 7A/B | High |
| Georgia Tech ([catalog](https://catalog.gatech.edu/programs/mechanical-engineering-general-bs)) | ME 2016 Computer Applications, ME 3017 System Dynamics, ME 3322 Thermodynamics, ME 3345 Heat Transfer, ME 3180 Machine Design (older sheet) | Medium |
| Cambridge Engineering Tripos ([Part IB guide](https://teaching.eng.cam.ac.uk/node/541)) | Part IB papers: Mechanics, Structures, Materials, Thermofluid Mechanics (and Mathematical Methods in older years). Part IA list **not** verified (fetch 404) | Medium for IB, low for IA |
| Michigan ME ([handbook](https://me.engin.umich.edu/academics/undergrad/handbook/bachelors)) | ME 211, 235, 240, 250, 320, 350, 360, 382, 395 in the core; 128 credits, 45 credit ME core | Medium |
| Stanford ME ([bulletin](https://bulletin.stanford.edu/programs/ME-BS)) | ME 30 Thermodynamics, ME 70 Fluids, ME 80 Mechanics of Materials, ME 131 Heat Transfer, ME 161 Dynamic Systems, Vibrations and Control (sheets vary by year) | Medium |
| ETH Zurich ([programme page](https://ethz.ch/en/studies/bachelor/bachelors-degree-programmes/engineering-sciences/mechanical-engineering.html)) | 180 ECTS BSc; first four semesters are compulsory fundamentals (Product Development, Control Engineering, Thermodynamics, etc.). No per-semester list obtained | Low-Medium |
| TU Delft | **Not verified**: programme page 404, no official list found. Used only as a general-shape check. Fetch the Delft study guide before citing it | Low |

Honest gaps: ETH, Delft and Cambridge Part IA need a manual pass against their official study guides before any course is labelled "based on" them in the product.

## 1. Design principles

- 4 semesters of fundamentals, then application courses, mirroring the consensus across Imperial, MIT, Berkeley, Michigan: statics/mechanics + materials + thermodynamics + maths + CAD/computing in Y1, then dynamics, fluids, heat transfer, stress analysis, mechatronics in Y2, then controls, vibrations, machine design, FEA, project in Y3.
- Course size matches the repo pattern: 6 topics x 3 subtopics for a reuse-compatible subject (see `content-authoring-guide.md`); the 6-10 topic ranges below are the "full" course, and a first release can ship the first 6.
- Suggested subject slug prefix: `mce-` (e.g. `ug.mce-thermodynamics-1`), parallel to the existing `cve-` prefix. **Check `docs/content-authoring-guide.md` section 4 ID regex before adopting.**
- Course codes (MCE1xx etc.) are placeholders of mine, not any university's.

## 2. Overlap with existing repo subjects

| Existing subject (in `content/subjects/`) | Existing topics | Proposed mech course | Overlap and recommendation |
|---|---|---|---|
| `cve-engineering-mechanics` | force systems, equilibrium, trusses, frames/beams/cables, centroids and 2nd moments, friction | MCE102 Statics and Mechanics | About 85% overlap. **Reuse**; add only machine-oriented FBD work. Cross-link rather than copy. |
| `cve-fluid-mechanics-1` | properties, statics, kinematics, energy and momentum, pipe flow, dimensional analysis | MCE201 Fluid Mechanics 1 | About 90% overlap. **Reuse as-is**; add mech-specific application questions only (pumps, jets on vanes). |
| `cve-engineering-materials` | structure, mechanical behaviour, concrete, steel, timber/masonry, failure | MCE103 Materials 1, MCE213 Materials 2, MCE312 | About 50% overlap (structure, mechanical behaviour, failure). Concrete and timber/masonry are civil-only. **Reuse topics 1, 2, 6; author new** alloys and phase diagrams, heat treatment, polymers, composites, ceramics, selection. |
| `cve-engineering-mathematics-1` | functions/limits, differentiation, integration, vectors/matrices, ODEs, series | MCE101 Engineering Mathematics A | About 90% overlap. **Reuse directly**; add complex numbers if missing (verify). |
| `cve-engineering-mathematics-2` | multivariable, vector calculus, ODE 2/Laplace/PDE, numerical methods, probability, statistics | MCE111 Maths B, MCE203 Maths C | About 80% overlap. **Reuse**; add Fourier series if not covered (verify). |
| `cve-autocad-drafting` | drafting studio (DXF) | MCE104 Drawing and CAD | Partial. Reuse drafting basics; mechanical needs GD&T, assemblies, 3D parametric modelling (new). |
| `cve-structural-mechanics-1/2` (not in your list, but present) | beams, stress | MCE114, MCE205 | Likely heavy overlap on bending, shear, deflection, Mohr. **Check before authoring**; reuse and extend with shafts, pressure vessels, fatigue. |
| `cve-hydraulics` | open channel/pipe hydraulics | none | Avoid; cross-link only for pipe flow. |
| `physics`, `cs-programming-fundamentals`, `cs-probability-statistics` | | MCE105, MCE115, MCE203 | Prerequisite cross-links rather than new content. |

Net new authoring: about 17 of the ~30 courses below are fully new; 5 are reuse or light extension; the rest partial.

## 3. Curriculum outline

"Src" = programmes whose published structure supports the course. "Ovl" = repo overlap.

### YEAR 1

#### Semester 1.1

**MCE101 Engineering Mathematics A**
- Src: Imperial *Mathematics and Computing 1*; Berkeley MATH 51-53; MIT GIR calculus. Ovl: `cve-engineering-mathematics-1` (reuse).
- Topics: 1 Functions, limits, continuity. 2 Differentiation (rules, implicit, related rates, optimisation). 3 Integration (techniques, improper, centroids, work). 4 Complex numbers (Argand, polar, Euler). 5 Vectors (dot, cross, lines, planes). 6 Matrices (determinants, linear systems, eigenvalues). 7 First- and second-order ODEs. 8 Series (Taylor, convergence).
- Outcomes: differentiate and integrate engineering functions; solve linear systems and eigenproblems; solve basic ODEs for mechanical models; express oscillations with complex exponentials.

**MCE102 Statics and Introduction to Mechanics**
- Src: Imperial *Mechanics*; Cambridge IB *Mechanics*; Michigan ME 211. Ovl: `cve-engineering-mechanics` (reuse).
- Topics: 1 Vectors, forces, moments, couples. 2 Equivalent force systems. 3 Equilibrium 2D/3D, FBDs. 4 Trusses (joints, sections). 5 Frames and machines. 6 Beams (shear force, bending moment). 7 Friction (dry, wedges, belts). 8 Centroids and second moments.
- Outcomes: draw correct FBDs; solve determinate structures and machines; compute section properties.

**MCE103 Engineering Materials 1**
- Src: Imperial *Materials 1*; Cambridge IB *Materials*; Berkeley ME 108. Ovl: partial with `cve-engineering-materials` topics 1, 2, 6.
- Topics: 1 Bonding and crystal structure. 2 Defects and diffusion. 3 Tensile test and stress-strain. 4 Elasticity, plasticity, hardness. 5 Phase diagrams (Fe-C, eutectics). 6 Heat treatment and microstructure. 7 Polymers and ceramics overview. 8 Property charts and selection.
- Outcomes: read a stress-strain curve; relate microstructure to strength; use a property chart for first-pass selection.

**MCE104 Engineering Drawing and CAD**
- Src: Berkeley ENGIN 26/29; Imperial *Design and Manufacture 1*; MIT 2.670. Ovl: `cve-autocad-drafting` (partial).
- Topics: 1 Orthographic projection and sections. 2 Dimensioning, tolerances, fits. 3 GD&T basics. 4 Sketching and constraints. 5 Parametric solid modelling. 6 Assemblies and mates. 7 Standard fasteners and threads. 8 ISO/ASME conventions, bill of materials.
- Outcomes: produce a dimensioned part and assembly drawing; apply a fit; model a part with design intent.

**MCE105 Computing for Engineers**
- Src: Berkeley ENGIN 7; Georgia Tech ME 2016; MIT 2.086; Imperial *Maths and Computing*. Ovl: `cs-programming-fundamentals` (prerequisite cross-link).
- Topics: 1 Variables, control flow. 2 Functions and modules. 3 Arrays and vectorisation. 4 Plotting and data. 5 Root finding. 6 Numerical integration and ODE solvers. 7 Curve fitting. 8 Debugging and verification.
- Outcomes: code and validate numerical solutions to engineering problems; plot and interpret results.

#### Semester 1.2

**MCE111 Engineering Mathematics B**
- Src: Imperial *Maths and Computing 2*; MIT 18.03; Berkeley MATH 54. Ovl: `cve-engineering-mathematics-2` topics 1-3 (reuse).
- Topics: 1 Partial derivatives, gradients. 2 Multiple integrals. 3 Vector calculus (div, curl, theorems). 4 Forced second-order ODEs. 5 Laplace transforms. 6 Fourier series. 7 Intro to PDEs (heat, wave). 8 Diagonalisation and modes.
- Outcomes: apply vector calculus to fields; solve forced ODEs and relate to resonance; separate variables in simple PDEs.

**MCE112 Thermodynamics 1**
- Src: Imperial *Thermodynamics 1*; Stanford ME 30; Berkeley ME 40; Georgia Tech ME 3322. Ovl: none.
- Topics: 1 System, state, properties, units. 2 Ideal gas and property tables. 3 Work and heat. 4 First law (closed, open, steady-flow devices). 5 Second law statements. 6 Entropy, isentropic efficiency. 7 Carnot, engines, refrigerators. 8 Intro to Rankine and Brayton cycles.
- Outcomes: perform first and second law balances on turbines, compressors, nozzles, heat exchangers; compute cycle efficiency.

**MCE113 Dynamics 1 (Particle Kinematics and Kinetics)**
- Src: Imperial *Mechanics*; Michigan ME 240; Berkeley ME 104. Ovl: none.
- Topics: 1 Rectilinear and curvilinear kinematics. 2 Polar and normal-tangential coordinates. 3 Relative and constrained motion. 4 Newton's second law. 5 Work-energy. 6 Impulse-momentum, impact. 7 Central-force motion. 8 Drag problems solved numerically.
- Outcomes: choose a coordinate system; apply energy and momentum methods; model drag numerically.

**MCE114 Mechanics of Materials (Stress Analysis 1)**
- Src: Imperial *Stress Analysis 1*; Cambridge IB *Structures*; Stanford ME 80; Berkeley ME C85. Ovl: `cve-structural-mechanics-1` (check; likely substantial).
- Topics: 1 Stress and strain. 2 Axial loading, thermal strain. 3 Torsion of shafts. 4 Bending stress. 5 Shear in beams. 6 Beam deflection. 7 Combined loading. 8 Stress transformation, Mohr circle.
- Outcomes: size shafts and beams for strength and stiffness; determine principal stresses.

**MCE115 Electrical and Electronics Fundamentals (Mechatronics 1)**
- Src: Imperial *Mechatronics 1*; MIT 2.678; Berkeley ME 100. Ovl: `physics` (partial).
- Topics: 1 Circuit laws, DC analysis. 2 RC/RL transients. 3 AC and impedance. 4 Op-amps. 5 Diodes and transistors as switches. 6 Sensors (strain gauge, thermocouple, encoder). 7 Actuators (DC motor, stepper). 8 Microcontroller I/O.
- Outcomes: analyse simple circuits; condition a sensor signal; drive a motor from a microcontroller.

**MCE116 Design and Manufacture 1 (Workshop and Design Methods)**
- Src: Imperial *Design and Manufacture 1*; Berkeley ENGIN 29; MIT 2.670. Ovl: none.
- Topics: 1 Design process, requirements. 2 Concept generation and selection matrices. 3 Metal cutting basics. 4 Joining. 5 Casting and forming overview. 6 Additive manufacturing. 7 Safety and workshop practice. 8 Team project and reporting.
- Outcomes: take a brief to a prototype; choose a process for a simple part; document a design.

### YEAR 2

#### Semester 2.1

**MCE201 Fluid Mechanics 1**
- Src: Imperial *Fluid Mechanics 1*; Cambridge IB *Thermofluid Mechanics*; Berkeley ME 106; Stanford ME 70. Ovl: `cve-fluid-mechanics-1` (reuse in full).
- Topics: properties; statics; kinematics; Bernoulli, energy and momentum; pipe flow; dimensional analysis. Mech additions: pumps and system curves, forces on vanes.
- Outcomes: apply control volumes to jets, pipes, pumps; use similitude.

**MCE202 Thermodynamics 2**
- Src: Imperial *Thermodynamics 2*; Georgia Tech ME 3322. Ovl: none.
- Topics: 1 Exergy and irreversibility. 2 Vapour power cycles (reheat, regeneration). 3 Gas turbine cycles. 4 Internal combustion (Otto, Diesel). 5 Refrigeration and heat pumps. 6 Psychrometrics. 7 Gas mixtures. 8 Combustion and enthalpy of formation.
- Outcomes: evaluate and improve power and refrigeration cycles; do combustion energy balances.

**MCE203 Engineering Mathematics C (Statistics and Numerical Methods)**
- Src: Imperial *Maths 2*, *Statistics A*; Berkeley ENGIN 178; MIT 2.086. Ovl: `cve-engineering-mathematics-2` topics 4-6 (reuse).
- Topics: probability; distributions; estimation and hypothesis tests; regression; error propagation; design of experiments; numerical linear algebra; ODE solvers.
- Outcomes: analyse experimental data with uncertainty; fit and validate models.

**MCE204 Dynamics 2 (Rigid Body)**
- Src: Imperial *Dynamics*; Berkeley ME 104; Michigan ME 240. Ovl: none.
- Topics: 1 Planar rigid-body kinematics. 2 Instantaneous centre. 3 Rotating frames, Coriolis. 4 Mass moment of inertia. 5 Planar kinetics. 6 Work-energy and momentum for rigid bodies. 7 Gears, cams, linkages. 8 Gyroscopic effects (intro).
- Outcomes: analyse mechanisms; compute loads in rotating machinery.

**MCE205 Stress Analysis 2**
- Src: Imperial *Stress Analysis 2*; Berkeley ME C85. Ovl: `cve-structural-mechanics-2` (check).
- Topics: 1 Failure criteria (Tresca, von Mises). 2 Thin and thick pressure vessels. 3 Column buckling. 4 Energy methods (Castigliano). 5 Statically indeterminate structures. 6 Unsymmetric bending, shear centre. 7 Stress concentration. 8 Strain-gauge experiments.
- Outcomes: choose and apply a failure criterion; solve indeterminate problems by energy methods.

**MCE206 Manufacturing Processes**
- Src: Imperial *Design and Manufacture 2*; Berkeley ENGIN 29. Ovl: none.
- Topics: 1 Casting. 2 Bulk forming. 3 Sheet forming. 4 Machining mechanics. 5 Welding metallurgy. 6 Powder and additive processes. 7 Process capability and tolerances. 8 Cost estimation.
- Outcomes: select a process by geometry, volume and tolerance; estimate cutting forces and cost.

#### Semester 2.2

**MCE211 Heat Transfer**
- Src: Imperial *Heat Transfer*; Berkeley ME 109; Georgia Tech ME 3345; Stanford ME 131. Ovl: none.
- Topics: 1 Conduction (1D, resistances, fins). 2 Transient conduction. 3 Numerical conduction. 4 Forced convection. 5 Natural convection. 6 Boiling and condensation. 7 Radiation (view factors, networks). 8 Heat exchangers (LMTD, effectiveness-NTU).
- Outcomes: size a heat exchanger or fin; estimate a convection coefficient from correlations.

**MCE212 Fluid Mechanics 2**
- Src: Imperial *Fluid Mechanics 2*; Cambridge IB *Thermofluid Mechanics*; Berkeley ME 106. Ovl: extends `cve-fluid-mechanics-1`.
- Topics: 1 Differential continuity and Navier-Stokes. 2 Potential flow. 3 Viscous exact solutions. 4 Boundary layers. 5 Drag and lift. 6 Turbulence (intro). 7 Compressible 1D flow, nozzles, shocks. 8 Turbomachinery intro.
- Outcomes: estimate drag and lift; analyse nozzle and choked flow.

**MCE213 Materials 2 (Metals, Polymers, Composites)**
- Src: Imperial *Materials 2*; Berkeley ME 108; Cambridge IB *Materials*. Ovl: new beyond `cve-engineering-materials`.
- Topics: 1 Dislocations and strengthening. 2 Steels and non-ferrous alloys. 3 Heat treatment kinetics (TTT). 4 Polymers (viscoelasticity). 5 Ceramics and glass. 6 Composites (rule of mixtures, laminates). 7 Corrosion. 8 Selection with performance indices.
- Outcomes: select material with indices; predict composite stiffness.

**MCE214 Machine Design 1 (Machine Elements)**
- Src: Georgia Tech ME 3180; Michigan ME 350; Stanford ME 112 (older sheets). Ovl: none.
- Topics: 1 Static strength design. 2 Fatigue (S-N, Goodman, Marin factors). 3 Shafts and keys. 4 Bearings. 5 Gears (spur, helical). 6 Threaded fasteners and joints. 7 Springs. 8 Brakes and clutches.
- Outcomes: design a shaft with a fatigue check; select bearings and gears with life calculations.

**MCE215 System Dynamics and Control 1**
- Src: Georgia Tech ME 3017; Berkeley ME 132; Imperial *Mechatronics 2*; Stanford ME 161. Ovl: Laplace cross-link to `cve-engineering-mathematics-2`.
- Topics: 1 Modelling (mechanical, electrical, thermal, fluid). 2 Transfer functions, block diagrams. 3 First- and second-order response. 4 Frequency response, Bode. 5 Stability (Routh). 6 PID control. 7 Root locus. 8 Simulation.
- Outcomes: model a plant and predict its response; tune a PID loop.

**MCE216 Computational Methods and Intro to FEA**
- Src: MIT 2.086; Imperial *Finite Element Analysis and Applications*; Berkeley ENGIN 7. Ovl: none.
- Topics: 1 Discretisation, finite differences. 2 Bar and truss elements. 3 Beam elements. 4 Meshing and convergence. 5 2D stress problems. 6 Heat-conduction FE. 7 Verification and validation. 8 Interpreting results critically.
- Outcomes: build and check a simple FE model; spot mesh and boundary-condition errors.

### YEAR 3

#### Semester 3.1

**MCE301 Control Engineering**
- Src: ETH *Control Engineering* (named on programme page); Berkeley ME 132; Imperial *Mechatronics 3A*. Ovl: none.
- Topics: 1 State-space models. 2 Controllability and observability. 3 State feedback and observers. 4 Lead/lag compensation. 5 Digital control (sampling, z-transform). 6 Nyquist and margins. 7 Disturbance rejection. 8 Hardware implementation.
- Outcomes: design a state-feedback controller; implement a discrete controller.

**MCE302 Machine Dynamics and Vibrations**
- Src: Imperial *Machine Dynamics and Vibrations A*; Michigan ME 240/360; Stanford ME 161. Ovl: ODE/Laplace cross-links.
- Topics: 1 SDOF free and forced vibration. 2 Damping and Q. 3 Base excitation and isolation. 4 MDOF modal analysis. 5 Unbalance and balancing. 6 Torsional vibration. 7 Continuous systems. 8 Vibration measurement.
- Outcomes: predict natural frequencies and responses; specify an isolator.

**MCE303 Thermofluid Applications**
- Src: Imperial *Thermodynamics 3A*, *Fluid Mechanics 3A*; MIT 2.006. Ovl: none.
- Topics: 1 Turbomachinery (velocity triangles, Euler equation). 2 Pumps and fans. 3 Turbine stages. 4 Power plant analysis. 5 IC engine performance. 6 Refrigeration systems. 7 HVAC. 8 Energy and sustainability analysis.
- Outcomes: size a pump or turbine stage; analyse plant efficiency.

**MCE304 Machine Design 2 and Design Project**
- Src: Imperial *Design, Make and Test Project*; Georgia Tech ME 3180; Michigan capstone. Ovl: none.
- Topics: 1 Requirements and design review. 2 Systems integration. 3 Design for manufacture/assembly. 4 Tolerance stack-up. 5 Reliability and FMEA. 6 Prototyping and test planning. 7 Safety and standards. 8 Project management.
- Outcomes: deliver and test a team design; justify decisions in a design report.

**MCE305 Manufacturing Systems and Metrology**
- Src: Imperial *Design and Manufacture* strand; Michigan MFG courses. Ovl: none.
- Topics: CNC and CAM; automation; process planning; statistical process control; metrology and CMM; lean; quality standards.
- Outcomes: plan a process; apply control charts.

#### Semester 3.2

**MCE311 Finite Element Analysis and Applications**
- Src: Imperial *Finite Element Analysis and Applications A*. Ovl: extends MCE216.
- Topics: variational formulation; isoparametric elements; plates and shells; nonlinear intro; contact; modal and dynamic FE; thermal-structural coupling; modelling best practice.
- Outcomes: choose element type and boundary conditions; validate against hand calculations.

**MCE312 Fracture, Fatigue and Failure Analysis**
- Src: Imperial *Fracture Mechanics A*; Cambridge IB *Materials*. Ovl: `cve-engineering-materials` topic 6 (partial).
- Topics: LEFM and K; toughness; fatigue crack growth (Paris); S-N and strain-life; creep; failure case studies; NDT; fitness-for-service.
- Outcomes: estimate critical crack size and fatigue life.

**MCE313 Mechatronics and Instrumentation**
- Src: Imperial *Mechatronics 3A*, *Embedded C*; Berkeley ME 102B, ME 103. Ovl: extends MCE115.
- Topics: embedded C; ADC and signal processing; sensors and noise; motor drives; PLC basics; communication buses; robot kinematics (intro); integration lab.
- Outcomes: build a sensor-actuator loop with real-time constraints.

**MCE314 Advanced Heat Transfer and Energy Systems**
- Src: Georgia Tech ME 3345; Stanford ME 131. Ovl: none.
- Topics: heat exchanger design; two-phase flow; electronics cooling; solar thermal; combustion; CFD intro; thermal management; energy storage.
- Outcomes: design a thermal management solution.

**MCE315 Engineering Practice, Ethics and Management**
- Src: Imperial *Professional Engineering Skills 1-3*. Ovl: none.
- Topics: ethics and codes; risk and safety; sustainability and LCA; economics; IP; teamwork; communication; professional registration.
- Outcomes: evaluate a design for risk and sustainability.

### YEAR 4 (optional electives)

Author on demand as 6-topic courses. Candidates, with the Imperial Year 3 options as the verified anchors: Tribology; Automotive Design and Motorsport; Computational Continuum Mechanics; Introduction to Nuclear Energy; Nuclear Fusion; Polymer Structure, Properties and Application; Statistics. Additional candidates (common at the other programmes, not individually verified): Computational Fluid Dynamics, Advanced Control and Robotics, Turbomachinery, Combustion and IC Engines, Renewable Energy, MEMS (Berkeley ME 119 is an optional design elective), Composites Design, Additive Manufacturing, Acoustics and Vibration Engineering (a Georgia Tech BS concentration), Biomechanics, Aerospace Structures.

## 4. Sequencing and prerequisites

MCE101 -> 111 -> 203. MCE102 -> 114 -> 205 -> 214 -> 304. MCE112 -> 202 -> 303; 112 -> 211 -> 314. MCE113 -> 204 -> 302. MCE201 -> 212 -> 303. MCE215 -> 301. MCE216 -> 311. Per the repo rule, prerequisites stay advisory, not hard gates.

## 5. Image sources and licences

Not legal advice; always check the individual file page.

| Source | Licence | Requirements | Notes |
|---|---|---|---|
| Wikimedia Commons | Per file: public domain, CC0, CC BY, CC BY-SA | Record author, source URL, licence name and link; for CC BY-SA keep derivatives under CC BY-SA; mark changes | The Commons reuse-guide fetch failed (404); this is standard practice, confirm on the live page. Best for photos of machines, engines, gears |
| OpenStax (University Physics etc.) | Conflicting statements found: OpenStax help centre cites CC BY-NC-SA for some books; University Physics front matter says CC BY 4.0. **Verify per book and edition** | Credit "OpenStax" with URL; keep third-party credit lines on individual figures | Redraw diagrams as SVG rather than reusing |
| MIT OpenCourseWare | CC BY-NC-SA 4.0 (confirmed on the OCW terms page) | Credit and licence link; indicate changes; no implied MIT endorsement; **NonCommercial**; ShareAlike on derivatives | Third-party items inside OCW may have other terms. If MindSpark is commercial, treat OCW as inspiration only, not reuse |
| NASA, NIST, USGS | Generally US-government public domain (some exceptions) | Credit as courtesy; check each | Engines, turbines, spacecraft |
| Openverse filtered to CC0/PDM | CC0 / public domain mark | None legally; log provenance | Verify at the source page |
| Own SVGs | Ours | None | Preferred for concept diagrams |

Suggested provenance fields per image: `author`, `sourceUrl`, `licence`, `licenceUrl`, `modified`, so a credits page can be generated.

## 6. Which diagrams to generate as SVG

Generate (original, consistent with the notebook aesthetic, cheap, accessible, parametrisable):
- Free-body diagrams, trusses, frames, loaded beams, shear and bending-moment diagrams.
- Mohr's circle, stress elements, stress-strain and S-N curves, schematic phase diagrams.
- Kinematic diagrams: linkages, gear schematics, velocity triangles, coordinate systems.
- Thermodynamic cycles (P-v, T-s, h-s) and component flow schematics.
- Fluids: manometers, hydrostatic force diagrams, control volumes, velocity profiles, pump curves, boundary-layer sketches.
- Controls: block diagrams, root-locus and Bode sketches, step responses.
- Vibration: mass-spring-damper models, mode shapes, transmissibility curves.
- Heat transfer: resistance networks, fin profiles, view-factor geometry.
- Simple orthographic views and sections (pair with the existing DXF/SVG drafting pipeline).

Use sourced photos (Commons, public domain) for: real machines and components, micrographs, fracture surfaces, manufacturing processes, flow-visualisation photographs. Avoid copying textbook figures even from openly licensed books; redraw to keep style uniform and licence obligations minimal.

## 7. Recommended next steps

1. Check the low-confidence sources (ETH, Delft, Cambridge IA) against official study guides.
2. Confirm the ID grammar and whether `mce-` is acceptable.
3. First release order: cross-list reused subjects (MCE101, 102, 201), then author MCE112, 113, 114, 211, 215.
4. Resolve the OpenStax licence per book, and decide whether OCW's NonCommercial term fits MindSpark's model before using any OCW material directly.
