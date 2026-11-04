import json
import math
import os
import subprocess
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)

from mindspark_draft.drawing import Drawing, DraftingError, bearing_to_cad_angle  # noqa: E402
from mindspark_draft.sandbox import ScriptError, run, validate  # noqa: E402


def run_cli(request: dict) -> dict:
    done = subprocess.run(
        [sys.executable, "-I", os.path.join(ROOT, "run.py")],
        input=json.dumps(request), capture_output=True, text=True, timeout=60,
    )
    return json.loads(done.stdout)


class BearingTests(unittest.TestCase):
    def test_conversion_table_from_the_course(self):
        expected = {0: 90, 45: 45, 90: 0, 135: 315, 180: 270, 225: 225, 270: 180, 315: 135}
        for bearing, angle in expected.items():
            self.assertEqual(bearing_to_cad_angle(bearing), angle)


class DrawingTests(unittest.TestCase):
    def test_text_height_follows_scale(self):
        self.assertEqual(Drawing("mm", 50).text_height, 150)
        self.assertAlmostEqual(Drawing("m", 100).text_height, 0.3)

    def test_rejects_bad_input_with_a_readable_message(self):
        d = Drawing()
        with self.assertRaisesRegex(DraftingError, "radius"):
            d.circle((0, 0), -5)
        with self.assertRaisesRegex(DraftingError, "pair"):
            d.line("a", (1, 1))
        with self.assertRaisesRegex(DraftingError, "units"):
            Drawing("cm")

    def test_commands_are_recorded_for_geometry(self):
        d = Drawing()
        d.line((0, 0), (100, 50))
        ops = d.operations()
        self.assertEqual(ops[-1]["keys"], ["LINE", "0,0", "100,50", "Enter"])

    def test_room_rejects_overlapping_or_oversized_openings(self):
        d = Drawing()
        with self.assertRaisesRegex(DraftingError, "does not fit"):
            d.room((0, 0), 3000, 3000, doors=[{"side": "south", "at": 2500, "width": 900}])
        with self.assertRaisesRegex(DraftingError, "overlap"):
            d.room((0, 0), 5000, 3000, windows=[{"side": "north", "at": 500, "width": 1000}, {"side": "north", "at": 1200, "width": 1000}])

    def test_room_reports_inside_size(self):
        info = Drawing().room((0, 0), 4000, 3000, wall=200)
        self.assertEqual((info["inner_width"], info["inner_height"]), (3600, 2600))

    def test_closed_square_traverse_has_no_misclosure_and_right_area(self):
        result = Drawing().traverse((0, 0), [(0, 10000), (90, 10000), (180, 10000), (270, 10000)])
        self.assertLess(result["misclosure"], 1e-6)
        self.assertAlmostEqual(result["area"], 1e8, places=0)

    def test_open_traverse_reports_misclosure(self):
        result = Drawing().traverse((0, 0), [(0, 100), (90, 100), (180, 90)])
        self.assertGreater(result["misclosure"], 1)

    def test_traverse_bearing_east_goes_right(self):
        points = Drawing().traverse((0, 0), [(90, 100)], closed=False, label=False)["points"]
        self.assertAlmostEqual(points[1][0], 100)
        self.assertAlmostEqual(points[1][1], 0)


class SandboxTests(unittest.TestCase):
    def rejects(self, source, fragment):
        with self.assertRaises(ScriptError) as caught:
            validate(source)
        self.assertIn(fragment, caught.exception.message)

    def test_rejects_dangerous_constructs(self):
        self.rejects("import os", "imports")
        self.rejects("from os import path", "imports")
        self.rejects("while True:\n    pass", "while")
        self.rejects("x = d.__class__", "not allowed")
        self.rejects("x = ().__class__.__bases__", "not allowed")
        self.rejects("d.doc.saveas('x')", "'doc'")
        self.rejects("x = '{0.__class__}'.format(d)", "'format'")
        self.rejects("class A: pass", "classes")
        self.rejects("f = lambda: 1", "lambda")
        self.rejects("x = _y", "not allowed")
        self.rejects("x = 99999999999", "larger")

    def test_dangerous_builtins_are_simply_absent(self):
        for source in ("open('x')", "eval('1')", "exec('1')", "getattr(d, 'x')", "__import__('os')"):
            with self.assertRaises(ScriptError):
                run(source, Drawing())

    def test_syntax_error_reports_a_line(self):
        with self.assertRaises(ScriptError) as caught:
            validate("d.line((0,0),\n")
        self.assertIsNotNone(caught.exception.line)

    def test_runtime_error_reports_the_script_line(self):
        d = Drawing()
        with self.assertRaises(ScriptError) as caught:
            run("d.line((0, 0), (1, 1))\nd.circle((0, 0), -1)\n", d)
        self.assertEqual(caught.exception.line, 2)
        self.assertEqual(caught.exception.stage, "run")

    def test_range_is_capped(self):
        with self.assertRaises(ScriptError):
            run("for i in range(10**6):\n    pass", Drawing())

    def test_helpers_and_math_are_available(self):
        d = Drawing()
        run("for i in range(3):\n    d.line((0, i * 10), (100 * math.cos(0), i * 10))", d)
        self.assertEqual(d.object_count, 3)


class RunnerTests(unittest.TestCase):
    def test_happy_path_returns_dxf_svg_and_commands(self):
        result = run_cli({"units": "mm", "scale": 50, "script": "d.rectangle((0,0),(4000,3000), layer='WALLS')\nd.dim_linear((0,0),(4000,0), offset=-500)\nd.text('ROOM', (2000,1500), align='MIDDLE_CENTER')"})
        self.assertTrue(result["ok"], result)
        self.assertIn("SECTION", result["dxf"])
        self.assertTrue(result["svg"].lstrip().startswith("<"))
        self.assertEqual(result["summary"]["byType"]["DIMENSION"], 1)
        self.assertIn("WALLS", result["summary"]["layers"])
        self.assertTrue(any(c["keys"][:1] == ["RECTANG"] for c in result["commands"]))

    def test_failure_is_json_with_stage_and_line(self):
        result = run_cli({"script": "d.line((0,0),(1,1))\nd.nope()"})
        self.assertFalse(result["ok"])
        self.assertEqual(result["stage"], "run")
        self.assertEqual(result["line"], 2)

    def test_empty_drawing_is_an_error(self):
        result = run_cli({"script": "x = 1"})
        self.assertFalse(result["ok"])
        self.assertIn("did not draw", result["error"])

    def test_bad_request(self):
        done = subprocess.run([sys.executable, "-I", os.path.join(ROOT, "run.py")], input="not json", capture_output=True, text=True, timeout=30)
        self.assertFalse(json.loads(done.stdout)["ok"])

    def test_entity_cap(self):
        script = "for i in range(5000):\n    for j in range(5):\n        d.line((0, 0), (i + 1, j + 1))"
        result = run_cli({"script": script})
        self.assertFalse(result["ok"])
        self.assertIn("more than", result["error"])


if __name__ == "__main__":
    unittest.main()
