"use client";

import React, { useState } from "react";

interface SkillCluster {
  id: string;
  category: string;
  serviceName: string;
  status: "OK" | "NOMINAL";
  uptime: string;
  skills: string[];
  description: string;
}

const CLUSTERS: SkillCluster[] = [
  {
    id: "lang",
    category: "Core Languages",
    serviceName: "srv-languages",
    status: "OK",
    uptime: "99.99%",
    skills: ["Java", "C++", "Python"],
    description: "Multithreaded socket servers, low-level concurrency, algorithmic complexity optimization, and API scripting.",
  },
  {
    id: "cs",
    category: "CS Fundamentals",
    serviceName: "srv-cs-core",
    status: "OK",
    uptime: "99.99%",
    skills: ["DSA", "OOD", "OS", "Complexity Analysis", "Distributed Systems Basics"],
    description: "Algorithmic problem solving, thread synchronization, memory management, and deterministic linearizability.",
  },
  {
    id: "backend",
    category: "Backend Frameworks & APIs",
    serviceName: "srv-backend-frameworks",
    status: "OK",
    uptime: "99.98%",
    skills: ["Spring Boot", "FastAPI", "REST APIs", "OAuth", "Microservices"],
    description: "Production API development, token-based authentication, domain-driven design, and inter-service communication.",
  },
  {
    id: "infra",
    category: "DevOps & Cloud Infrastructure",
    serviceName: "srv-cloud-infra",
    status: "OK",
    uptime: "99.95%",
    skills: [
      "Docker",
      "Kubernetes (Minikube/k3s)",
      "Terraform",
      "GitHub Actions",
      "Argo CD",
      "Prometheus",
      "Grafana",
      "AWS",
      "GCP",
      "Oracle Cloud",
      "Linux",
    ],
    description: "Declarative infrastructure as code, automated GitOps deployment pipelines, container orchestration, and metrics monitoring.",
  },
  {
    id: "data",
    category: "Databases & Storage",
    serviceName: "srv-datastore-layer",
    status: "OK",
    uptime: "99.99%",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
    description: "Relational normalization, ACID transactions, in-memory caching strategies, and document data models.",
  },
  {
    id: "ml",
    category: "ML & Data Analytics",
    serviceName: "srv-data-analytics",
    status: "OK",
    uptime: "99.90%",
    skills: ["NumPy", "Pandas", "Scikit-learn", "Matplotlib", "EDA"],
    description: "Applied machine learning workflows, data wrangling, exploratory data analysis, and lifecycle tracking.",
  },
];

export default function StatusOverlay() {
  const [filter, setFilter] = useState<string>("ALL");

  const filteredClusters = filter === "ALL" ? CLUSTERS : CLUSTERS.filter((c) => c.id === filter);

  return (
    <div className="space-y-6 text-[#E6E8EB] font-mono">
      {/* Header */}
      <div className="border-b border-[#1F242C] pb-4">
        <div className="text-[11px] text-[#C86D32] uppercase tracking-wider mb-1">
          SERVICE STATUS // NODE: STATUS [-34, 0, -28]
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-sans text-[#E6E8EB] tracking-tight">
          Operational Skills & Technology Registry
        </h2>
        <p className="text-xs text-[#878F99] font-sans mt-1">
          Technical stack mapped directly to operational service health indicators. All clusters functioning nominally.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-2.5 py-1 rounded-[2px] border ${
            filter === "ALL"
              ? "bg-[#362216] border-[#C86D32] text-[#E6E8EB]"
              : "bg-[#0A0B0D] border-[#1F242C] text-[#878F99] hover:border-[#2D3440]"
          }`}
        >
          ALL SERVICES
        </button>
        {CLUSTERS.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`px-2 py-1 rounded-[2px] border text-[11px] ${
              filter === c.id
                ? "bg-[#362216] border-[#C86D32] text-[#E6E8EB]"
                : "bg-[#0A0B0D] border-[#1F242C] text-[#878F99] hover:border-[#2D3440]"
            }`}
          >
            {c.category}
          </button>
        ))}
      </div>

      {/* Cluster Services List */}
      <div className="space-y-3">
        {filteredClusters.map((cluster) => (
          <div
            key={cluster.id}
            className="p-3 bg-[#0A0B0D] border border-[#1F242C] rounded-[2px] space-y-2 hover:border-[#2D3440] transition-colors"
          >
            <div className="flex flex-wrap justify-between items-center text-xs gap-2 border-b border-[#1F242C] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-[1px] bg-[#2FA866]" />
                <span className="font-bold text-[#E6E8EB]">{cluster.serviceName}</span>
                <span className="text-[#5A626E] text-[10px]">({cluster.category})</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-[#878F99]">UPTIME: <span className="text-[#2FA866]">{cluster.uptime}</span></span>
                <span className="text-[#5A626E]">|</span>
                <span className="text-[#2FA866] font-semibold">{cluster.status}</span>
              </div>
            </div>

            {/* Skills Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {cluster.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-[#171B22] border border-[#1F242C] text-[#E6E8EB] text-xs rounded-[2px]"
                >
                  {skill}
                </span>
              ))}
            </div>

            <p className="text-[11px] font-sans text-[#878F99] pt-1">
              {cluster.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
