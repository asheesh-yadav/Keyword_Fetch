import { useEffect, useState } from "react";
import api from "../services/api";
import ArticleList from "../components/ArticleList";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [source, setSource] = useState("");

  const fetchArticles = async () => {
    setLoading(true);

    const params = {};
    if (keyword) params.keyword = keyword;
    if (source) params.source = source;

    const res = await api.get("/articles", { params });
    setArticles(res.data.articles || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchArticles();
  };

  return (
    <div className="container-fluid dashboard">
      <div className="dashboard-header mb-4">
        <h4 className="fw-bold">Media Intelligence Dashboard</h4>
        <p className="text-muted">
          Search and explore latest articles from monitored sources
        </p>
      </div>

      {/* Filters */}
      <form className="card filter-card mb-4" onSubmit={handleSearch}>
        <div className="card-body row g-3 align-items-end">
          <div className="col-md-5">
            <label className="form-label">Keyword</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Trump, AI regulation"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Source</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Reuters"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <button className="btn btn-primary w-100">
              Search Articles
            </button>
          </div>
        </div>
      </form>

      {/* Articles */}
      <ArticleList articles={articles} loading={loading} />
    </div>
  );
};

export default Dashboard;
