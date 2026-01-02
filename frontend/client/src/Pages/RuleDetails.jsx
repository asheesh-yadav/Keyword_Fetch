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

  const fetchRuleArticles = async () => {
    setLoading(true);

    const res = await api.get(`/rules/${id}/articles`);

    setArticles(res.data.articles || []);
    setLoading(false);
  };

  const fetchRuleInfo = async () => {
    const res = await api.get("/rules");
    const rule = res.data.rules.find((r) => r._id === id);
    if (rule) setRuleName(rule.name);
  };

  useEffect(() => {
    fetchRuleInfo();
    fetchRuleArticles();
  }, [id]);

  return (
    <div className="container-fluid rule-details">
      <div className="mb-4">
        <h4 className="fw-bold">{ruleName}</h4>
        <p className="text-muted">
          Articles matched by this monitoring rule
        </p>
      </div>

      <ArticleList articles={articles} loading={loading} />
    </div>
  );
};

export default RuleDetails;
