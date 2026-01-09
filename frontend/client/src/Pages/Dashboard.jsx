import { useEffect, useState } from "react";
import api from "../services/api";
import ArticleList from "../components/ArticleList";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [language, setLanguage] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchArticles = async () => {
    setLoading(true);

    const params = { page, limit };

    if (search) params.search = search;
    if (selectedSource !== "all") params.source = selectedSource;
    if (from) params.from = from;
    if (to) params.to = to;
    if (language !== "all") params.language = language;

    const res = await api.get("/articles", { params });

    setArticles(res.data.articles || []);
    setTotalPages(res.data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => {
    api.get("/sources").then((res) =>
      setSources(res.data.sources || res.data || [])
    );
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchArticles();
  };

  const handleExport = async () => {
    const params = {};
    if (search) params.search = search;
    if (selectedSource !== "all") params.source = selectedSource;
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
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard">

      {/* === PRODUCT CONTEXT HEADER === */}
      <div className="dashboard-header">
        <div>
          <h2>Media Intelligence Workspace</h2>
          <p>
            Discover, analyze, and monitor narratives across global media
            sources. Use structured filters to reduce noise and surface
            relevant signals.
          </p>
        </div>

        <button
          className="export-btn"
          onClick={handleExport}
          disabled={!articles.length}
        >
          Export Results
        </button>
      </div>


      {/* === FILTER PANEL === */}
      <form className="filter-panel" onSubmit={handleSearch}>
        <div className="filter-grid">

          <div>
            <label>Keyword / Topic</label>
            <input
              type="text"
              placeholder="e.g. AI regulation, climate policy"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <label>Source</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              <option value="all">All Sources</option>
              {sources.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="all">All Languages</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ja">Japanese</option>
              <option value="ru">Russian</option>
              <option value="pt">Portuguese</option>
              <option value="es">Spanish</option>
               <option value="th">Thai</option>
              <option value="ko">Korean</option>
            </select>
      
          </div>

          <div>
            <label>From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>

          <div>
            <label>To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>

          <button className="search-btn">Run Search</button>
        </div>
      </form>

      {/* === QUERY SUMMARY === */}
      <div className="query-summary">
        <span><b>Query:</b> {search || "All topics"}</span>
        <span><b>Sources:</b> {selectedSource === "all" ? "All" : "Filtered"}</span>
        <span><b>Language:</b> {language === "all" ? "All" : language.toUpperCase()}</span>
      </div>

      {/* === RESULTS === */}
      <ArticleList articles={articles} loading={loading} />

      {/* === PAGINATION === */}
      {totalPages > 1 && (
        <div className="pagination-bar">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}

  

    </div>
  );
};

export default Dashboard;
