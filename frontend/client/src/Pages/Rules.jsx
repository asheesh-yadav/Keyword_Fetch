import { useEffect, useState } from "react";
import api from "../services/api";
import RuleForm from "../components/RuleForm";
import "../styles/rules.css";

const Rules = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightRuleId, setHighlightRuleId] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(6); 
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (highlightRuleId) {
      setTimeout(() => setHighlightRuleId(null), 4000);
    }
  }, [highlightRuleId]);

  const fetchRules = async (newRuleId) => {
    setLoading(true);

    const res = await api.get("/rules", {
      params: { page, limit }
    });

   setRules(res.data.rules || []);
setTotalPages(res.data.totalPages || 1);
    setHighlightRuleId(newRuleId || null);
    setLoading(false);
  };

  useEffect(() => {
    fetchRules();
  }, [page]);

  // -------- delete rules
  const deleteRule = async (id) => {
    if (!window.confirm("Delete this rule?")) return;

    try {
      await api.delete(`/rules/${id}`);
      fetchRules(); // refresh
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete rule");
    }
  };

  return (
    <div className="container-fluid rules-page">
      <div className="mb-4">
        <h4 className="fw-bold">Monitoring Rules</h4>
        <p className="text-muted">
          Automatically monitor keywords and receive alerts
        </p>
      </div>

      <RuleForm onCreated={fetchRules} />

      <div className="row g-4">
        {loading ? (
          <div className="text-center py-5">Loading rules...</div>
        ) : (
          rules.map((rule) => (
            <div className="col-md-6 col-lg-4" key={rule._id}>
              <div
                className={`card rule-card h-100 ${
                  highlightRuleId === rule._id ? "rule-highlight" : ""
                }`}
              >
                <div className="card-body">
                  <h6 className="fw-bold">{rule.name}</h6>

                  <div className="mb-2">
                    {rule.keywords.map((k) => (
                      <span
                        key={k}
                        className="badge bg-light text-dark me-1"
                      >
                        {k}
                      </span>
                    ))}
                  </div>

                  <p className="text-muted small mb-1">
                    Alert: {rule.alertType}
                  </p>

                  <p className="text-muted small">
                    Status: {rule.status}
                  </p>

                  <div className="d-flex gap-2 mt-3">
                    <button
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() =>
                        window.location.href = `/rules/${rule._id}`
                      }
                    >
                      View Results
                    </button>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      disabled={loading}
                      onClick={() => deleteRule(rule._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* === PAGINATION === */}
      {totalPages > 1 && (
        <div className="pagination-bar mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Rules;
