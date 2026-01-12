import { useEffect, useState } from "react";
import api from "../services/api";
import "./RuleForm.css";

const RuleForm = ({ onCreated }) => {
  const [name, setName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [alertType, setAlertType] = useState("instant");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api.get("/sources").then((res) =>
      setSources(res.data.sources || res.data || [])
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await api.post("/rules", {
      name,
      keywords: keywords.split(",").map((k) => k.trim()),
      sources: selectedSource ? [selectedSource] : [],
      alertType,
    });

    setName("");
    setKeywords("");
    setSelectedSource("");
    setAlertType("instant");

    setLoading(false);
    setSuccess("Rule created successfully!");
    onCreated(res.data._id);
  };

  return (
    <div className="rule-wrapper">

      <div className="rule-heading">
        <h2>Create Monitoring Rule</h2>
        <p>Track keywords across your selected media sources</p>
      </div>

      {success && (
        <div className="rule-success">
          ✅ {success}
        </div>
      )}

     <form onSubmit={handleSubmit} className="rule-form-full">

  {/* ROW 1 */}
  <div className="form-row">

    <div className="form-group">
      <label>Rule Name</label>
      <div className="input-wrap">
        <span>📝</span>
        <input
          required
          placeholder="AI Policy Tracker"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    </div>

    <div className="form-group">
      <label>Keywords</label>
      <div className="input-wrap">
        <span>🔍</span>
        <input
          required
          placeholder="AI, regulation, OpenAI"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
      </div>
    </div>

  </div>

  {/* ROW 2 */}
  <div className="form-row">

    <div className="form-group">
      <label>Source</label>
      <div className="input-wrap">
        <span>🌐</span>
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
        >
          <option value="">All Sources</option>
          {sources.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className="form-group">
      <label>Alert Type</label>
      <div className="input-wrap">
        <span>⚡</span>
        <select
          value={alertType}
          onChange={(e) => setAlertType(e.target.value)}
        >
          <option value="instant">Instant Alerts</option>
          <option value="daily">Daily Digest</option>
        </select>
      </div>
    </div>

  </div>

  <button
    className="rule-btn"
    disabled={loading}
  >
    {loading ? "Saving..." : "Create Rule"}
  </button>

</form>

    </div>
  );
};

export default RuleForm;
