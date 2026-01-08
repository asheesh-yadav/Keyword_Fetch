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
    api.get("/sources").then((res) => setSources(res.data.sources || res.data || []));
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
    setSuccess("Rule created successfully");
   onCreated(res.data._id);
  };

  return (
    <div className="card rule-form-card mb-4">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Create Monitoring Rule</h6>
              {success && (
                  <div className="alert alert-success mb-3">
                      {success}
                  </div>
              )}
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Rule Name</label>
            <input
              className="form-control"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Keywords (comma separated)</label>
            <input
              className="form-control"
              placeholder="Trump, AI regulation"
              required
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Source</label>
            <select
              className="form-select"
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

          <div className="col-md-4">
            <label className="form-label">Alert Type</label>
            <select
              className="form-select"
              value={alertType}
              onChange={(e) => setAlertType(e.target.value)}
            >
              <option value="instant">Instant</option>
              <option value="daily">Daily Digest</option>
            </select>
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RuleForm;
