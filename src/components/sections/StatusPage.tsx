"use client";

import React, { useState } from "react";
import { StatusDot, ChevronDownIcon } from "@/components/ui/icons";

/**
 * SECTION 2: STATUS PAGE (Skills as Services)
 *
 * EXACT SKILLS FROM PROMPT (Grouped Logically):
 * 1. Languages: Java, C++, Python
 * 2. CS Fundamentals: Data Structures & Algorithms, OOD, Operating Systems, Complexity Analysis, Distributed Systems Basics
 * 3. Backend: Spring Boot, FastAPI, REST APIs, OAuth, Microservices
 * 4. Cloud/DevOps: Docker, Kubernetes (Minikube/k3s), Terraform, GitHub Actions, Argo CD (GitOps), Prometheus, Grafana, AWS, GCP, Oracle Cloud, Linux
 * 5. Data: PostgreSQL, MySQL, MongoDB, Redis, Schema Design, Query Optimization
 * 6. ML/Data Science: NumPy, Pandas, Scikit-learn, Matplotlib, EDA (applied exposure from internship)
 */

interface SkillGroupService {
  id: string;
  name: string;
  category: string;
  status: "ok" | "warn";
  uptime: string;
  p99Stability: string;
  sparkline: number[];
  skills: string[];
  focus: string;
  implementationDetail: string;
}

const SKILL_SERVICES: SkillGroupService[] = [
  {
    id: "srv-languages",
    name: "srv-core-languages",
    category: "Languages",
    status: "ok",
    uptime: "99.99%",
    p99Stability: "0.8ms",
    sparkline: [2, 1, 2, 2, 3, 2, 1, 2, 2, 1, 2, 1, 1, 2],
    skills: ["Java", "C++", "Python"],
    focus: "Low-latency systems engineering, multi-threaded concurrency, socket programming, script automation",
    implementationDetail: "Core languages used for multithreaded socket servers, algorithmic complexity optimization, and API scripting.",
  },
  {
    id: "srv-cs-core",
    name: "srv-cs-fundamentals",
    category: "CS Fundamentals",
    status: "ok",
    uptime: "99.99%",
    p99Stability: "1.1ms",
    sparkline: [1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 1, 2, 1],
    skills: [
      "Data Structures & Algorithms",
      "Object-Oriented Design (OOD)",
      "Operating Systems",
      "Complexity Analysis",
      "Distributed Systems Basics",
    ],
    focus: "Algorithmic problem solving, thread synchronization, memory management, and deterministic linearizability",
    implementationDetail: "Rigorous algorithmic foundations backed by 100+ LeetCode problems, concurrent state machines, and system call tracing.",
  },
  {
    id: "srv-backend",
    name: "srv-backend-frameworks",
    category: "Backend Engineering",
    status: "ok",
    uptime: "99.98%",
    p99Stability: "3.2ms",
    sparkline: [3, 4, 3, 3, 5, 3, 4, 3, 3, 4, 3, 3, 2, 3],
    skills: ["Spring Boot", "FastAPI", "REST APIs", "OAuth", "Microservices"],
    focus: "Enterprise service orchestration, transactional boundaries, secure auth, asynchronous execution",
    implementationDetail: "Production-grade RESTful architectures utilizing Spring Boot dependency injection and asynchronous FastAPI workers.",
  },
  {
    id: "srv-cloud-devops",
    name: "srv-cloud-devops-mesh",
    category: "Cloud & DevOps",
    status: "ok",
    uptime: "99.97%",
    p99Stability: "5.4ms",
    sparkline: [5, 6, 5, 6, 7, 5, 5, 6, 5, 6, 5, 4, 5, 5],
    skills: [
      "Docker",
      "Kubernetes (Minikube/k3s)",
      "Terraform",
      "GitHub Actions",
      "Argo CD (GitOps)",
      "Prometheus",
      "Grafana",
      "AWS",
      "GCP",
      "Oracle Cloud",
      "Linux",
    ],
    focus: "Declarative infrastructure as code, containerized orchestration, GitOps deployment pipelines, telemetry",
    implementationDetail: "Automated provisioning with Terraform, CI/CD with GitHub Actions, GitOps synchronization via Argo CD, and cluster monitoring via Prometheus/Grafana.",
  },
  {
    id: "srv-data",
    name: "srv-data-persistence",
    category: "Data & Storage",
    status: "ok",
    uptime: "99.99%",
    p99Stability: "1.8ms",
    sparkline: [2, 2, 3, 2, 2, 3, 2, 2, 3, 2, 2, 2, 1, 2],
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Schema Design", "Query Optimization"],
    focus: "ACID transactions, relational normalization, cache-aside read paths, double-entry audit logging",
    implementationDetail: "Relational modeling in PostgreSQL/MySQL paired with sub-millisecond Redis cache layers and append-only ledgers.",
  },
  {
    id: "srv-ml-ds",
    name: "srv-applied-ml-exposure",
    category: "ML & Data Science (Applied Exposure)",
    status: "ok",
    uptime: "99.92%",
    p99Stability: "18.2ms",
    sparkline: [16, 18, 17, 20, 18, 19, 17, 18, 22, 18, 17, 16, 18, 17],
    skills: ["NumPy", "Pandas", "Scikit-learn", "Matplotlib", "EDA", "Python", "Streamlit"],
    focus: "Applied machine learning lifecycle, exploratory data analysis, interactive dashboard prototyping",
    implementationDetail: "Applied exposure gained through 6-week Edunet Foundation (AICTE-IBM SkillsBuild) internship; presented strictly as an applied facet, not primary specialization.",
  },
];

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 18;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible" aria-label="Stability Sparkline">
      <polyline
        fill="none"
        stroke="#C86D32"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export default function StatusPage() {
  const [expandedId, setExpandedId] = useState<string | null>("srv-languages");

  return (
    <section id="status" className="py-16 px-4 max-w-7xl mx-auto font-mono">
      {/* Section Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#1F242C] pb-4">
        <div>
          <div className="text-[11px] text-[#C86D32] uppercase tracking-wider mb-1">
            REGISTRY / CAPABILITIES
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#E6E8EB] font-sans">
            Status Page: Technical Capabilities as Operational Services
          </h2>
        </div>
        <div className="text-xs text-[#8A939E] flex items-center gap-2">
          <StatusDot status="ok" />
          <span>ALL_SERVICES_NOMINAL</span>
          <span className="text-[#5A626E]">|</span>
          <span>DOMAINS: 6 ACTIVE</span>
        </div>
      </div>

      {/* Industrial Status Table */}
      <div className="bg-[#111419] border border-[#232A35] rounded-[2px] overflow-hidden text-xs">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 bg-[#14181F] border-b border-[#1F242C] text-[#5A626E] text-[11px] font-medium uppercase">
          <div className="col-span-4">Capability Identifier</div>
          <div className="col-span-3">Domain Specialization</div>
          <div className="col-span-2">Uptime (90d)</div>
          <div className="col-span-2">Stability / Latency</div>
          <div className="col-span-1 text-right">Spec</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#1A1F26]">
          {SKILL_SERVICES.map((srv) => {
            const isExpanded = expandedId === srv.id;
            return (
              <div key={srv.id} className="transition-colors hover:bg-[#151920]">
                {/* Main Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : srv.id)}
                  className="px-4 py-3 cursor-pointer flex flex-col md:grid md:grid-cols-12 gap-3 items-start md:items-center"
                >
                  {/* Service ID & Status */}
                  <div className="md:col-span-4 flex items-center gap-2.5 w-full">
                    <StatusDot status={srv.status} />
                    <span className="text-[#E6E8EB] font-semibold">{srv.name}</span>
                  </div>

                  {/* Domain */}
                  <div className="md:col-span-3 text-[#8A939E]">
                    {srv.category}
                  </div>

                  {/* Uptime */}
                  <div className="md:col-span-2 flex items-center gap-2">
                    <span className="text-[#2FA866] font-medium">{srv.uptime}</span>
                    <span className="text-[10px] text-[#5A626E]">verified</span>
                  </div>

                  {/* Sparkline & Latency */}
                  <div className="md:col-span-2 flex items-center gap-3">
                    <Sparkline data={srv.sparkline} />
                    <span className="text-[#8A939E] text-[11px]">{srv.p99Stability}</span>
                  </div>

                  {/* Chevron Toggle */}
                  <div className="md:col-span-1 flex justify-end w-full md:w-auto">
                    <button
                      className="text-[#8A939E] hover:text-[#E6E8EB] p-1"
                      aria-label={isExpanded ? "Collapse capability details" : "Expand capability details"}
                    >
                      <ChevronDownIcon rotated={isExpanded} size={13} />
                    </button>
                  </div>
                </div>

                {/* Expanded Drawer */}
                {isExpanded && (
                  <div className="px-4 py-3.5 bg-[#0C0E12] border-t border-[#1B2028] text-xs space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] text-[#5A626E] uppercase mb-1">Functional Scope</div>
                        <p className="text-[#8A939E] leading-relaxed font-sans">{srv.focus}</p>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#5A626E] uppercase mb-1">Architecture Notes</div>
                        <p className="text-[#8A939E] leading-relaxed font-sans">{srv.implementationDetail}</p>
                      </div>
                    </div>

                    {/* Skill Badges */}
                    <div>
                      <div className="text-[10px] text-[#5A626E] uppercase mb-1.5">Technologies & Tools</div>
                      <div className="flex flex-wrap gap-1.5">
                        {srv.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-[#171B22] border border-[#232A35] rounded-[2px] text-[11px] text-[#E6E8EB]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
