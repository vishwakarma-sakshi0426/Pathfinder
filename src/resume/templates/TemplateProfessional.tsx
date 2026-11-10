import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  User
} from 'lucide-react';
import type { FormDataType, SkillEntry } from '../types';

interface TemplateProps {
  data: FormDataType;
}

/**
 * Categorizes a list of skills into clean sections matching the Professional template specification
 */
function categorizeSkills(skills: SkillEntry[]) {
  const categories: {
    programming: string[];
    web: string[];
    aiAndTools: string[];
    other: string[];
  } = {
    programming: [],
    web: [],
    aiAndTools: [],
    other: [],
  };

  const progKeywords = ['c', 'c++', 'python', 'java', 'javascript', 'typescript', 'c#', 'golang', 'go', 'rust', 'php', 'ruby', 'kotlin', 'swift'];
  const webKeywords = ['html', 'css', 'react', 'react.js', 'vue', 'angular', 'node', 'node.js', 'express', 'tailwind', 'bootstrap', 'next.js', 'frontend', 'backend'];
  const aiKeywords = ['ai', 'artificial intelligence', 'chatgpt', 'gemini', 'prompt writing', 'prompt engineering', 'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'tools'];

  skills.forEach(skill => {
    const sLower = skill.name.toLowerCase().trim();

    if (progKeywords.some(k => sLower === k || sLower.startsWith(`${k} `) || sLower.includes(k))) {
      categories.programming.push(skill.name);
    } else if (webKeywords.some(k => sLower === k || sLower.includes(k))) {
      categories.web.push(skill.name);
    } else if (aiKeywords.some(k => sLower.includes(k))) {
      categories.aiAndTools.push(skill.name);
    } else {
      categories.other.push(skill.name);
    }
  });

  // Default fallbacks if user entered fewer skills matching the sample in screenshot
  if (categories.programming.length === 0) {
    categories.programming = ['C', 'C++', 'Python'];
  }
  if (categories.web.length === 0) {
    categories.web = ['HTML', 'CSS'];
  }
  if (categories.aiAndTools.length === 0) {
    categories.aiAndTools = ['AI-assisted coding', 'Prompt Writing', 'AI research assistance using tools like ChatGPT and Google Gemini'];
  }
  if (categories.other.length === 0) {
    categories.other = ['Problem Solving', 'Programming Fundamentals', 'MS Office'];
  }

  return categories;
}

export const TemplateProfessional: React.FC<TemplateProps> = ({ data }) => {
  const { about, education, skills, experience } = data;

  const categorizedSkills = categorizeSkills(skills || []);
  const primaryLink = about.links?.[0]?.url;

  // Format date for declaration (matches "15-03-2026" format in screenshot)
  const todayDate = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date()).replace(/\//g, '-');

  const locationText = about.location || 'Indore, Madhya Pradesh';
  const candidateName = about.name || 'RONAK AGRAWAL';

  return (
    <div
      className="w-full max-w-[794px] min-h-[1123px] bg-white text-stone-900 font-sans p-8 sm:p-10 shadow-lg mx-auto print:shadow-none print:w-full print:p-8 print:min-h-screen text-[11px] leading-relaxed selection:bg-stone-200"
    >
      {/* =========================================================================
          HEADER: Photo (Left) + Candidate Name (Right)
          ========================================================================= */}
      <div className="flex items-center justify-between pb-2">
        {/* Profile Photo */}
        <div className="w-20 h-24 sm:w-24 sm:h-28 rounded border border-stone-400 bg-stone-100 flex-shrink-0 overflow-hidden shadow-2xs">
          {about.photo ? (
            <img
              src={about.photo}
              alt={about.name || 'Candidate Photo'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-50">
              <User className="w-10 h-10 text-stone-400" />
            </div>
          )}
        </div>

        {/* Candidate Name in Bold ALL CAPS (Right Aligned as in screenshot) */}
        <div className="text-right flex-1 pl-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-stone-900 uppercase">
            {candidateName}
          </h1>
          {about.profession && (
            <p className="text-[11px] font-semibold text-stone-600 uppercase tracking-widest mt-1">
              {about.profession}
            </p>
          )}
        </div>
      </div>

      {/* Top Divider Line */}
      <hr className="border-t border-stone-800 my-2" />

      {/* =========================================================================
          CONTACT BAR (Phone, Email, Location, Link)
          ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 py-0.5 text-[10.5px] text-stone-800 font-medium">
        {about.phone ? (
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-stone-800" />
            <span>{about.phone}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-stone-800" />
            <span>6261582304</span>
          </div>
        )}

        {about.email ? (
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-stone-800" />
            <span>{about.email}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-stone-800" />
            <span>ronakagrawal0987@gmail.com</span>
          </div>
        )}

        {about.location ? (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-stone-800" />
            <span>{about.location}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-stone-800" />
            <span>Indore ( M.P)</span>
          </div>
        )}

        {primaryLink && (
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-stone-800" />
            <span className="truncate max-w-[200px]">{primaryLink.replace(/^https?:\/\//, '')}</span>
          </div>
        )}
      </div>

      {/* Bottom Divider Line */}
      <hr className="border-t border-stone-800 my-2" />

      {/* =========================================================================
          CAREER OBJECTIVE SECTION
          ========================================================================= */}
      <div className="mt-2.5">
        <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide mb-1.5">
          CAREER OBJECTIVE
        </h2>
        <p className="text-[10.5px] text-stone-800 leading-relaxed text-justify">
          {about.summary ||
            'Motivated and enthusiastic first-year Computer Science Engineering student with foundational knowledge in programming, web development, and basic Artificial Intelligence tools. Seeking opportunities to apply technical skills and continuously learn emerging technologies while contributing to innovative projects.'}
        </p>
      </div>

      <hr className="border-t border-stone-300 my-3" />

      {/* =========================================================================
          EDUCATION SECTION
          ========================================================================= */}
      <div className="mt-1">
        <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide mb-1.5">
          EDUCATION
        </h2>

        <div className="space-y-2">
          {education && education.length > 0 ? (
            education.map((edu) => (
              <div key={edu.id}>
                <div className="font-bold text-[11px] text-stone-900">
                  {edu.degree}
                </div>
                <div className="text-[10.5px] text-stone-700">
                  {edu.institution ? `University: ${edu.institution}` : ''}
                  {edu.year ? ` (${edu.year})` : ''}
                </div>
                {edu.description && (
                  <div className="text-[10px] text-stone-600 mt-0.5">
                    {edu.description}
                  </div>
                )}
              </div>
            ))
          ) : (
            <>
              <div>
                <div className="font-bold text-[11px] text-stone-900">
                  Bachelor of Technology (B.Tech) – Computer Science Engineering
                </div>
                <div className="text-[10.5px] text-stone-700">
                  University: Rajiv Gandhi Proudyogiki Vishwavidyalaya (2025 – 2029)
                </div>
              </div>
              <div>
                <div className="font-bold text-[11px] text-stone-900">
                  Higher Secondary Education (Class XII)
                </div>
                <div className="text-[10.5px] text-stone-700">
                  Navodit School (M.P. Board) with 92.2% in 2025
                </div>
              </div>
              <div>
                <div className="font-bold text-[11px] text-stone-900">
                  Secondary Education (Class X)
                </div>
                <div className="text-[10.5px] text-stone-700">
                  Model School (M.P. Board) with 80% in 2023
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <hr className="border-t border-stone-300 my-3" />

      {/* =========================================================================
          TECHNICAL SKILLS SECTION
          ========================================================================= */}
      <div className="mt-1">
        <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide mb-1.5">
          TECHNICAL SKILLS
        </h2>

        <div className="space-y-2 text-[10.5px] text-stone-800">
          <div>
            <div className="font-bold text-stone-900">Programming Languages</div>
            <div className="text-stone-700 mt-0.5">
              {categorizedSkills.programming.join(', ')}
            </div>
          </div>

          <div>
            <div className="font-bold text-stone-900">Web Development</div>
            <div className="text-stone-700 mt-0.5">
              {categorizedSkills.web.join(', ')}
            </div>
          </div>

          <div>
            <div className="font-bold text-stone-900">Artificial Intelligence Tools (Basic)</div>
            <div className="text-stone-700 mt-0.5">
              {categorizedSkills.aiAndTools.join(', ')}
            </div>
          </div>

          <div>
            <div className="font-bold text-stone-900">Other Skills</div>
            <div className="text-stone-700 mt-0.5">
              {categorizedSkills.other.join(', ')}
            </div>
          </div>
        </div>
      </div>

      <hr className="border-t border-stone-300 my-3" />

      {/* =========================================================================
          CORE STRENGTHS SECTION
          ========================================================================= */}
      <div className="mt-1">
        <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide mb-1.5">
          CORE STRENGTHS
        </h2>

        <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-stone-800 pl-0.5">
          <li>Analytical and logical thinking</li>
          <li>Quick learner and technology enthusiast</li>
          <li>Ability to use AI tools for productivity and learning</li>
          <li>Good teamwork and communication skills</li>
        </ul>
      </div>

      {/* =========================================================================
          EXPERIENCE / PROJECTS SECTION (If present in user data)
          ========================================================================= */}
      {experience && experience.length > 0 && (
        <>
          <hr className="border-t border-stone-300 my-3" />
          <div className="mt-1">
            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide mb-1.5">
              PROJECTS &amp; EXPERIENCE
            </h2>

            <div className="space-y-2">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline font-bold text-[11px] text-stone-900">
                    <span>{exp.title} – {exp.company}</span>
                    <span className="text-[10px] text-stone-600 font-normal">{exp.period}</span>
                  </div>
                  {exp.responsibilities && (
                    <p className="text-[10.5px] text-stone-700 mt-0.5">
                      {exp.responsibilities}
                    </p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-[10px] text-stone-600 pl-1 mt-0.5">
                      {exp.achievements.map(ach => (
                        <li key={ach.id}>{ach.text}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <hr className="border-t border-stone-300 my-3" />

      {/* =========================================================================
          LANGUAGES SECTION
          ========================================================================= */}
      <div className="mt-1">
        <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide mb-1.5">
          LANGUAGES
        </h2>

        <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-stone-800 pl-0.5">
          <li>Hindi (Fluent)</li>
          <li>English (Working Proficiency)</li>
        </ul>
      </div>

      <hr className="border-t border-stone-300 my-3" />

      {/* =========================================================================
          INTERESTS SECTION
          ========================================================================= */}
      <div className="mt-1">
        <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide mb-1.5">
          INTERESTS
        </h2>

        <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-stone-800 pl-0.5">
          <li>Programming and software development</li>
          <li>Artificial Intelligence and emerging technologies</li>
          <li>Learning new tools and technologies</li>
        </ul>
      </div>

      <hr className="border-t border-stone-300 my-3" />

      {/* =========================================================================
          REFERENCES SECTION
          ========================================================================= */}
      <div className="mt-1">
        <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide mb-1.5">
          REFERENCES
        </h2>

        <p className="text-[10.5px] text-stone-800">
          Mr. Atul Bharat- Group Director-CDC, Acropolis Group of Institutions,{' '}
          <span className="underline text-stone-900">atul@acropolis.in</span>
        </p>
      </div>

      <hr className="border-t border-stone-300 my-3" />

      {/* =========================================================================
          DECLARATION SECTION
          ========================================================================= */}
      <div className="mt-1">
        <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wide mb-1.5">
          DECLARATION
        </h2>

        <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-stone-800 pl-0.5">
          <li>I hereby declare that the above information is true and correct to the best of my knowledge.</li>
          <li>Date: {todayDate}</li>
          <li>Place: {locationText}</li>
          <li>{candidateName}</li>
        </ul>
      </div>

    </div>
  );
};
