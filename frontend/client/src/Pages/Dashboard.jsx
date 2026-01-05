import { useEffect, useState } from "react";
import api from "../services/api";
import ArticleList from "../components/ArticleList";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [language, setLanguage] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchArticles = async () => {
    setLoading(true);

    const params = {
      page,
      limit,
    };

    if (search) params.search = search;
    if (source) params.source = source;
    if (from) params.from = from;
    if (to) params.to = to;
    if (language !== "all") params.language = language;

    const res = await api.get("/articles", { params });

    setArticles(res.data.articles || []);
    setTotalPages(res.data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchArticles();
  };

  // Export CSV
  const handleExport = async () => {
    const params = {};
    if (search) params.search = search;
    if (source) params.source = source;
    if (from) params.from = from;
    if (to) params.to = to;

    const res = await api.get("/articles/export", {
      params,
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "articles.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  // Pagination numbers
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${page === i ? "active" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => setPage(i)}
          >
            {i}
          </button>
        </li>
      );
    }

    return (
     <nav className="mt-4">
      <ul className="pagination justify-content-center align-items-center">

        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
        </li>

        <li className="page-item disabled">
          <span className="page-link">
            Page {page} of {totalPages}
          </span>
        </li>

        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </li>

      </ul>
    </nav>
    );
  };

  return (
    <div className="container-fluid dashboard">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold">Media Intelligence Dashboard</h4>
          <p className="text-muted mb-0">
            Search and explore latest articles
          </p>
        </div>

        <button
          className="btn btn-outline-secondary"
          onClick={handleExport}
          disabled={!articles.length}
        >
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <form className="card filter-card mb-4" onSubmit={handleSearch}>
        <div className="card-body row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Keyword</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Trump, AI regulation"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Source</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Reuters"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>

                  <div className="col-md-2">
                      <label className="form-label">Language</label>
                      <select
                          className="form-select"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                      >
                          <option value="all">All</option>
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="ja">Japanese</option>
                      </select>
                  </div>

          <div className="col-md-2">
            <label className="form-label">From</label>
            <input
              type="date"
              className="form-control"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">To</label>
            <input
              type="date"
              className="form-control"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div className="col-md-1">
            <button className="btn btn-primary w-100">
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Articles */}
      <ArticleList articles={articles} loading={loading} />

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default Dashboard;
