import "./ArticleList.css";
import { useState } from "react";
import ArticleModal from "./ArticleModal";

const ArticleList = ({ articles, loading }) => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  if (loading) {
    return <div className="article-loading">🔄 Loading results...</div>;
  }

  if (!articles.length) {
    return (
      <div className="empty-state">
        😔 No results found. Try changing filters.
      </div>
    );
  }

  return (
    <div className="article-wrapper">

      {articles.map((a, index) => (
        <div className="article-row" key={a._id}>

          {/* LEFT */}
          <div className="article-left">
            <span className="source">
              📰 {a.sourceName}
            </span>

            <span className="date">
              📅 {new Date(a.publishedAt).toLocaleDateString()}
            </span>
          </div>

          {/* MAIN */}
          <div className="article-main">
            <h4>{a.title}</h4>

            <p>
              {a.description?.slice(0, 160)}...
            </p>

            <div className="article-tags">
              <span className="tag lang">
                🌐 {a.language?.toUpperCase() || "N/A"}
              </span>

              <span className="tag index">
                #{index + 1}
              </span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="article-actions">
            <a
              href={a.url}
              target="_blank"
              rel="noreferrer"
            >
              🔗 Open
            </a>

            <button
              onClick={() => setSelectedArticle(a)}
            >
              📄 Details
            </button>
          </div>

        </div>
      ))}

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
};

export default ArticleList;
