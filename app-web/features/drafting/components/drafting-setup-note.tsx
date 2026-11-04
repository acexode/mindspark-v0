export function DraftingSetupNote({ problem }: { problem: "no-python" | "no-ezdxf" | null }) {
  return (
    <div className="empty-state drafting-setup" role="note">
      <h2>One-time setup needed</h2>
      {problem === "no-python" ? (
        <>
          <p>The drafting studio needs Python 3.9 or newer, which is not installed (or not on the PATH).</p>
          <ol>
            <li>Install Python from python.org. On Windows, tick “Add python.exe to PATH”.</li>
            <li>Restart the app, open a terminal in the app folder, and run the command below.</li>
          </ol>
        </>
      ) : (
        <p>Python is installed but the drawing library is not. Run the command below in the app folder.</p>
      )}
      <pre className="drafting-code">npm run drafting:setup</pre>
      <p className="field-hint">It creates a private Python environment inside the app and installs the drawing library. It does not change your system Python.</p>
    </div>
  );
}
