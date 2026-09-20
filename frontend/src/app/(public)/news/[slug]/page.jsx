"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewsBySlug, fetchNews } from "@/store/slice/NewsSlice";
import CommentSection from "@/components/news/CommonSection";
import api from "@/services/api";
import { MessageCircle, Send, Link as LinkIcon, Check, Share2, Eye, MessageSquare, Globe, Clock, ThumbsUp, TrendingUp, Mail, Briefcase, Volume2, Play, Square } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/hi";
import toast from "react-hot-toast";
dayjs.extend(relativeTime);
dayjs.locale("hi");

/* All category tags use the uniform brand crimson — broadcast standard */
const CAT_COLORS = new Proxy({}, { get: () => "#DC2626" });

const LANGUAGES = [
  { code: "hindi", label: "हिंदी" },
  { code: "chhattisgarhi", label: "छत्तीसगढ़ी" },
  { code: "english", label: "English" },
  { code: "marathi", label: "मराठी" },
  { code: "gujarati", label: "ગુજराती" },
];

// ── Convert **bold** markdown to <strong> ─────────────────
// ✅ यह replace करें — bold/italic/heading सब handle करता है
const formatAIContent = (text) => {
  if (!text) return "";
  // Already HTML है तो as-is return करें
  if (/<[a-z][\s\S]*>/i.test(text)) return text;

  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /^### (.+)$/gm,
      '<h3 style="font-size:18px;font-weight:800;margin:20px 0 8px;color:#1a202c">$1</h3>',
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 style="font-size:21px;font-weight:800;margin:24px 0 10px;color:#1a202c">$1</h2>',
    )
    .replace(
      /^# (.+)$/gm,
      '<h1 style="font-size:24px;font-weight:800;margin:28px 0 12px;color:#1a202c">$1</h1>',
    )
    .replace(
      /^[-•] (.+)$/gm,
      '<li style="margin:5px 0;margin-left:20px">$1</li>',
    )
    .replace(
      /^\d+\. (.+)$/gm,
      '<li style="margin:5px 0;margin-left:20px">$1</li>',
    )
    .replace(/\n\n+/g, '</p><p style="margin:0 0 16px">')
    .replace(/\n/g, "<br/>");
};

// ── Share Buttons ─────────────────────────────────────────
const ShareSection = ({ news }) => {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;
  const title = news?.title || "";
  const text = `${title}\n${url}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("लिंक कॉपी हो गया!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("कॉपी नहीं हो सका");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: news?.summary || title, url });
      } catch {}
    }
  };

  const platforms = [
    {
      name: "WhatsApp",
      color: "#25d366",
      icon: <MessageCircle size={14} />,
      url: `https://wa.me/?text=${encodeURIComponent(text)}`,
    },
    {
      name: "Facebook",
      color: "#1877f2",
      icon: <Globe size={14} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "Twitter/X",
      color: "#000000",
      icon: <MessageSquare size={14} />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "Telegram",
      color: "#0088cc",
      icon: <Send size={14} />,
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "LinkedIn",
      color: "#0077b5",
      icon: <Briefcase size={14} />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div
      style={{
        margin: "24px 0",
        padding: "18px",
        background: "#f7fafc",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
      }}
    >
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#4a5568",
          margin: "0 0 14px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <LinkIcon size={16} /> इस खबर को शेयर करें
      </p>

      {/* Share Buttons */}
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}
      >
        {platforms.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: p.color,
              color: "#fff",
              padding: "8px 14px",
              borderRadius: 22,
              fontSize: 12,
              fontWeight: 700,
              textDecoration: "none",
              transition: "transform 0.15s, opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <span>{p.icon}</span> {p.name}
          </a>
        ))}

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: copied ? "#38a169" : "#4a5568",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: 22,
            fontSize: 12,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          {copied ? <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Check size={14} /> कॉपी हुआ!</span> : <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><LinkIcon size={14} /> लिंक कॉपी</span>}
        </button>

        {/* Native Share (Mobile) */}
        {navigator.share && (
          <button
            onClick={handleNativeShare}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "#805ad5",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: 22,
              fontSize: 12,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Share2 size={14} /> शेयर</span>
          </button>
        )}
      </div>

      {/* Link Preview */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          padding: "10px 14px",
        }}
      >
        <p
          style={{
            fontSize: 11,
            color: "#94a3b8",
            margin: "0 0 3px",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          शेयर preview
        </p>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#2d3748",
            margin: "0 0 3px",
            lineHeight: 1.4,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: 11,
            color: "#a0aec0",
            margin: 0,
            wordBreak: "break-all",
          }}
        >
          {url}
        </p>
      </div>
    </div>
  );
};

// ── Related Card ──────────────────────────────────────────
const RelatedCard = ({ news }) => (
  <Link href={`/news/${news.slug}`}
    style={{ textDecoration: "none", display: "block" }}
  >
    <div style={{ borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
      <img
        src={
          `https://placehold.co/300x180/e2e8f0/94a3b8?text=News`
        }
        alt={news.title}
        style={{
          width: "100%",
          height: 150,
          objectFit: "cover",
          display: "block",
        }}
        onError={(e) => {
          e.target.src = `https://placehold.co/300x180/e2e8f0/94a3b8?text=News`;
        }}
      />
    </div>
    <p
      style={{
        color: "#1a202c",
        fontSize: 13,
        fontWeight: 700,
        margin: "0 0 4px",
        lineHeight: 1.4,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}
    >
      {news.title}
    </p>
    <span style={{ color: "#94a3b8", fontSize: 11 }}>
      {dayjs(news.publishedAt).fromNow()}
    </span>
  </Link>
);

// ── Main Page ─────────────────────────────────────────────
export default function NewsDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const {
    currentNews: news,
    isLoading,
    list,
  } = useSelector((state) => state?.news || {});
  const [translatedContent, setTranslatedContent] = useState(null);
  const [selectedLang, setSelectedLang] = useState("hindi");
  const [isTranslating, setIsTranslating] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [email, setEmail] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (!("speechSynthesis" in window)) {
      toast.error("आपका ब्राउज़र इस सुविधा का समर्थन नहीं करता है");
      return;
    }
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const displayContent = translatedContent || news?.content || "";
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = formatAIContent(displayContent);
      const textToSpeak = tempDiv.textContent || tempDiv.innerText || "";
      
      const utterance = new SpeechSynthesisUtterance((news?.title || "") + ". " + textToSpeak);
      utterance.lang = selectedLang === "english" ? "en-US" : "hi-IN";
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        setIsPlaying(false);
        toast.error("पढ़ने में त्रुटि हुई");
      };
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    dispatch(fetchNewsBySlug(slug));
    if (list.length === 0) dispatch(fetchNews({ limit: 10 }));
    setTranslatedContent(null);
    setSelectedLang("hindi");
    window.scrollTo(0, 0);
  }, [slug, dispatch]);

  const handleTranslate = async (lang) => {
    if (lang === "hindi") {
      setTranslatedContent(null);
      setSelectedLang("hindi");
      return;
    }
    setIsTranslating(true);
    setSelectedLang(lang);
    try {
      const { data } = await api.post("/ai/translate", {
        content: news.content,
        language: lang,
      });
      setTranslatedContent(data.data);
    } catch {
      toast.error("अनुवाद विफल रहा");
    } finally {
      setIsTranslating(false);
    }
  };

  if (isLoading)
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid #e53e3e",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto",
          }}
        />
        <style>{`
          @keyframes spin { to { transform: rotate(360deg) } }
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(229, 62, 62, 0.7); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(229, 62, 62, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(229, 62, 62, 0); }
          }
        `}</style>
      </div>
    );

  if (!news)
    return (
      <div style={{ textAlign: "center", padding: "80px 0", color: "#718096" }}>
        समाचार नहीं मिला
      </div>
    );

  const catColor = CAT_COLORS[news.category] || "#e53e3e";
  const displayContent = translatedContent || news.content || "";
  const formattedContent = formatAIContent(displayContent);
  const relatedNews = list
    .filter((n) => n._id !== news._id && n.category === news.category)
    .slice(0, 4);

  return (
    <>
      

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "#718096",
            padding: "12px 0",
            flexWrap: "wrap",
          }}
        >
          <Link href="/" style={{ color: "#718096", textDecoration: "none" }}>
            होम
          </Link>
          <span>›</span>
          <Link href={`/category/${news.category}`}
            style={{ color: catColor, textDecoration: "none", fontWeight: 600 }}
          >
            {news.category}
          </Link>
          <span>›</span>
          <span style={{ color: "#2d3748" }}>
            {news.title?.slice(0, 40)}...
          </span>
        </div>

        {/* Grid Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) 300px",
            gap: 32,
          }}
          className="news-detail-grid"
        >
          {/* ── ARTICLE ── */}
          <article>
            {/* Title */}
            <h1
              style={{
                fontSize: "clamp(20px, 4vw, 28px)",
                fontWeight: 800,
                color: "#1a202c",
                lineHeight: 1.35,
                margin: "0 0 16px",
              }}
            >
              {news.isBreaking && (
                <span
                  style={{
                    background: "#e53e3e",
                    color: "#fff",
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 3,
                    marginRight: 8,
                    fontWeight: 700,
                    verticalAlign: "middle",
                  }}
                >
                  BREAKING
                </span>
              )}
              {news.title}
            </h1>

            {/* Author + Meta */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 16,
                paddingBottom: 14,
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: catColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {(news.authorName || "र")[0]}
                </div>
                <div>
                  <div
                    style={{ fontSize: 14, fontWeight: 700, color: "#2d3748" }}
                  >
                    {news.authorName || "colour weekly"}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>
                    {dayjs(news.publishedAt).format("DD MMM YYYY")} •{" "}
                    {news.readingTime || "5"} मिनट
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  color: "#94a3b8",
                  fontSize: 12,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={12} /> {news.views || 0}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MessageSquare size={12} /> {news.comments || 0}</span>
              </div>
            </div>

            {/* Main Image */}
            {news.images?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ borderRadius: 10, overflow: "hidden" }}>
                  <img
                    src={news.images[imgIndex]?.url}
                    alt={news.title}
                    style={{
                      width: "100%",
                      maxHeight: 420,
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      e.target.src = `https://placehold.co/720x400/e2e8f0/94a3b8?text=News`;
                    }}
                  />
                </div>
                {news.images[imgIndex]?.caption && (
                  <p
                    style={{
                      fontSize: 12,
                      color: "#718096",
                      margin: "6px 0 0",
                      textAlign: "center",
                      fontStyle: "italic",
                    }}
                  >
                    {news.images[imgIndex].caption}
                  </p>
                )}
                {news.images.length > 1 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      marginTop: 8,
                      justifyContent: "center",
                    }}
                  >
                    {news.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        style={{
                          width: 52,
                          height: 40,
                          border: `2px solid ${i === imgIndex ? catColor : "#e2e8f0"}`,
                          borderRadius: 4,
                          overflow: "hidden",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        <img
                          src={img.url}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Language Selector */}
            <div
              style={{
                background: "#f7fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 16,
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 12,
                    color: "#718096",
                    margin: "0 0 8px",
                    fontWeight: 600,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Globe size={14} /> भाषा चुनें:</span>
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleTranslate(lang.code)}
                      disabled={isTranslating}
                      style={{
                        fontSize: 12,
                        padding: "5px 12px",
                        borderRadius: 20,
                        cursor: "pointer",
                        border: `1px solid ${selectedLang === lang.code ? catColor : "#cbd5e0"}`,
                        background:
                          selectedLang === lang.code ? catColor : "#fff",
                        color: selectedLang === lang.code ? "#fff" : "#4a5568",
                        fontWeight: 600,
                      }}
                    >
                      {lang.label}
                    </button>
                  ))}
                  {isTranslating && (
                    <span
                      style={{
                        fontSize: 12,
                        color: "#718096",
                        alignSelf: "center",
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> अनुवाद हो रहा है...</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* HIGHLIGHTED TTS Listen Button */}
            <div
              style={{
                background: isPlaying ? "#fff5f5" : "linear-gradient(135deg, #fef2f2 0%, #fff 100%)",
                border: `2px solid ${isPlaying ? "#fc8181" : "#feb2b2"}`,
                borderRadius: 12,
                padding: "16px 20px",
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 12px rgba(220, 38, 38, 0.08)",
                transition: "all 0.3s ease"
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: isPlaying ? "#e53e3e" : "#fc8181",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: isPlaying ? "0 0 15px rgba(229, 62, 62, 0.6)" : "none",
                  animation: isPlaying ? "pulse 2s infinite" : "none"
                }}>
                  <Volume2 size={22} />
                </div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 800, color: "#2d3748", margin: "0 0 2px" }}>
                    {isPlaying ? "खबर पढ़ी जा रही है..." : "इस खबर को सुनें"}
                  </p>
                  <p style={{ fontSize: 12, color: "#718096", margin: 0 }}>
                    आर्टिफिशियल इंटेलिजेंस (AI) आवाज़ में
                  </p>
                </div>
              </div>
              <button
                onClick={handleSpeak}
                style={{
                  background: isPlaying ? "#e53e3e" : "#DC2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: 24,
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "background 0.2s, transform 0.1s",
                  boxShadow: "0 2px 8px rgba(220, 38, 38, 0.2)"
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                {isPlaying ? <><Square size={16} fill="currentColor" /> रोकें</> : <><Play size={16} fill="currentColor" /> सुनें</>}
              </button>
            </div>

            {/* Content — AI bold fix */}
            {/* Content */}
            <div
              style={{
                fontSize: 16,
                lineHeight: 1.85,
                color: "#2d3748",
                fontFamily: "Georgia, serif",
              }}
              dangerouslySetInnerHTML={{
                __html: `<p style="margin-bottom:16px">${formatAIContent(displayContent)}</p>`,
              }}
            />

            {/* Tags */}
            {news.tags?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  margin: "20px 0",
                }}
              >
                {news.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "#edf2f7",
                      color: "#4a5568",
                      fontSize: 12,
                      padding: "4px 12px",
                      borderRadius: 20,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Like bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 0",
                borderTop: "1px solid #f0f0f0",
                borderBottom: "1px solid #f0f0f0",
                margin: "20px 0",
              }}
            >
              <button
                onClick={() => setLiked(!liked)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: liked ? "#fff5f5" : "#f7fafc",
                  border: `1px solid ${liked ? "#fc8181" : "#e2e8f0"}`,
                  borderRadius: 20,
                  padding: "7px 16px",
                  cursor: "pointer",
                  fontSize: 13,
                  color: liked ? "#e53e3e" : "#718096",
                  fontWeight: 600,
                }}
              >
                <ThumbsUp size={14} fill={liked ? '#fc8181' : 'none'} /> {liked ? "पसंद किया" : "पसंद करें"} •{" "}
                {(news.likes || 0) + (liked ? 1 : 0)}
              </button>
              <span style={{ fontSize: 13, color: "#94a3b8", display: 'flex', alignItems: 'center', gap: 4 }}>
                <Eye size={14} /> {news.views || 0} views
              </span>
            </div>

            {/* ✅ SHARE SECTION */}
            <ShareSection news={news} />

            {/* Comments */}
            <CommentSection newsId={news._id} />
          </article>

          {/* ── SIDEBAR ── */}
          <aside className="news-sidebar">
            {/* Ad */}
            <div
              style={{
                background: "#f7fafc",
                border: "1px dashed #cbd5e0",
                borderRadius: 8,
                height: 250,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#a0aec0",
                fontSize: 12,
                marginBottom: 20,
              }}
            >
              ADVERTISEMENT
              <br />
              300 × 250
            </div>

            {/* Trending */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #f0f0f0",
                borderRadius: 10,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#1a202c",
                  margin: "0 0 14px",
                  borderBottom: `2px solid ${catColor}`,
                  paddingBottom: 8,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><TrendingUp size={16} /> Trending</span>
              </h3>
              {list.slice(0, 6).map((item) => (
                <Link key={item._id}
                  href={`/news/${item.slug}`}
                  style={{
                    textDecoration: "none",
                    display: "block",
                    padding: "8px 0",
                    borderBottom: "1px solid #f7fafc",
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: catColor,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.category}
                  </span>
                  <p
                    style={{
                      color: "#2d3748",
                      fontSize: 13,
                      fontWeight: 600,
                      margin: "2px 0 0",
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.title}
                  </p>
                </Link>
              ))}
            </div>

            {/* Newsletter */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #f0f0f0",
                borderRadius: 10,
                padding: 18,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><Mail size={28} color="#A0AEC0" /></div>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#1a202c",
                  margin: "0 0 6px",
                }}
              >
                न्यूज़लेटर सब्सक्राइब करें
              </h3>
              <p style={{ fontSize: 12, color: "#718096", margin: "0 0 12px" }}>
                ताज़ा खबरें inbox में पाएं
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="आपका ईमेल"
                style={{
                  width: "100%",
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  padding: "8px 12px",
                  fontSize: 13,
                  outline: "none",
                  marginBottom: 8,
                  boxSizing: "border-box",
                }}
              />
              <button
                style={{
                  width: "100%",
                  background: catColor,
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: 9,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                सब्सक्राइब करें
              </button>
            </div>

            {/* Ad 300x600 */}
            <div
              style={{
                background: "#f7fafc",
                border: "1px dashed #cbd5e0",
                borderRadius: 8,
                height: 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#a0aec0",
                fontSize: 12,
              }}
            >
              ADVERTISEMENT
              <br />
              300 × 400
            </div>
          </aside>
        </div>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div
            style={{
              marginTop: 40,
              paddingTop: 24,
              borderTop: "2px solid #f0f0f0",
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#1a202c",
                margin: "0 0 20px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 4,
                  height: 22,
                  background: catColor,
                  borderRadius: 2,
                  display: "inline-block",
                }}
              />
              संबंधित समाचार
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 20,
              }}
            >
              {relatedNews.map((item) => (
                <RelatedCard key={item._id} news={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .news-detail-grid { grid-template-columns: 1fr !important; }
          .news-sidebar { display: none; }
        }
      `}</style>
    </>
  );
}
