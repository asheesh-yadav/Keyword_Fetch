import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ArticleList from "../components/ArticleList";
import "../styles/rules.css";

const RuleDetails = () => {
  const { id } = useParams();

  const [articles, setArticles] = useState([]);
  const [ruleName, setRuleName] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  const fetchRuleArticles = async () => {
    setLoading(true);

    const res = await api.get(`/rules/${id}/articles`, {
      params: { page, limit }
    });

    setArticles(res.data.articles || []);
    setTotal(res.data.total || 0);
    setLoading(false);
  };

  const fetchRuleInfo = async () => {
    const res = await api.get("/rules");
    const rules = res.data.rules || res.data;
    const rule = rules.find((r) => r._id === id);
    if (rule) setRuleName(rule.name);
  };

  useEffect(() => {
    fetchRuleInfo();
  }, [id]);

  useEffect(() => {
    fetchRuleArticles();
  }, [id, page]);

  return (
    <div className="container-fluid rule-details">
      <div className="mb-4">
        <h4 className="fw-bold">{ruleName}</h4>
        <p className="text-muted">
          Articles matched by this monitoring rule
        </p>
      </div>

      <ArticleList articles={articles} loading={loading} />

      {/* PAGINATION */}
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

export default RuleDetails;
