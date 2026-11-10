import React from 'react';
import type { FormDataType } from '../types';

interface TemplateProps {
  data: FormDataType;
}

export const TemplateMinimal: React.FC<TemplateProps> = ({ data }) => {
  const { about, education, skills, experience } = data;

  return (
    <div className="w-[794px] min-h-[1123px] bg-white text-stone-800 font-sans shadow-2xl mx-auto flex flex-row overflow-hidden relative leading-normal print:shadow-none print:w-full print:min-h-screen">
      {/* LEFT SIDEBAR: DARK CHARCOAL SLATE */}
      <div className="w-[270px] bg-[#424242] text-white p-7 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          {/* Rectangular Profile Photo */}
          <div className="flex justify-center pt-2">
            <div className="w-40 h-48 overflow-hidden rounded bg-stone-600 border border-stone-500 shadow-md flex items-center justify-center">
              {about.photo ? (
                <img
                  src={about.photo}
                  alt={about.name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-stone-700 text-stone-300 flex items-center justify-center text-4xl font-bold uppercase">
                  {about.name ? about.name.charAt(0) : 'U'}
                </div>
              )}
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-white uppercase pb-1 border-b border-white">
              CONTACT
            </h3>
            <div className="mt-3 space-y-2 text-[11px] text-stone-200">
              {about.phone && (
                <div>
                  <div className="font-bold text-white text-[11px]">Phone</div>
                  <div className="text-stone-300">{about.phone}</div>
                </div>
              )}
              {about.email && (
                <div>
                  <div className="font-bold text-white text-[11px]">Email</div>
                  <div className="text-stone-300 truncate">{about.email}</div>
                </div>
              )}
              {about.location && (
                <div>
                  <div className="font-bold text-white text-[11px]">Address</div>
                  <div className="text-stone-300">{about.location}</div>
                </div>
              )}
              {about.links && about.links.length > 0 && (
                <div>
                  <div className="font-bold text-white text-[11px]">Web</div>
                  <div className="text-stone-300 truncate">{about.links[0].url.replace(/^https?:\/\//, '')}</div>
                </div>
              )}
            </div>
          </div>

          {/* EXPERTISE / SKILLS */}
          {skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] text-white uppercase pb-1 border-b border-white">
                EXPERTISE
              </h3>
              <ul className="mt-3 space-y-1.5 text-[11px] text-stone-200">
                {skills.map((skill) => (
                  <li key={skill.id} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                    <span>{skill.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* LANGUAGES */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-white uppercase pb-1 border-b border-white">
              LANGUAGES
            </h3>
            <ul className="mt-3 space-y-1.5 text-[11px] text-stone-200">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                <span>English</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                <span>Hindi</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                <span>Regional / French</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* RIGHT MAIN AREA: CRISP WHITE WITH ACCENT WAVES */}
      <div className="flex-1 p-9 relative flex flex-col justify-between overflow-hidden">
        {/* Top Right Curved Wave Graphic */}
        <div className="absolute -top-10 -right-10 w-72 h-52 pointer-events-none z-0">
          <svg viewBox="0 0 200 150" fill="none" className="w-full h-full opacity-60">
            <path
              d="M50 0 C 120 40, 150 10, 200 80 L 200 0 Z"
              fill="#d1d5db"
            />
            <path
              d="M0 0 C 80 60, 130 30, 200 120 L 200 0 Z"
              fill="#e5e7eb"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Content Container */}
        <div className="relative z-10 space-y-6">
          {/* HEADER */}
          <div className="pt-2 pb-4 border-b-2 border-stone-800">
            <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 uppercase">
              {about.name || 'YOUR NAME'}
            </h1>
            <h2 className="text-xs font-semibold tracking-[0.3em] text-stone-600 uppercase mt-2">
              {about.profession || 'GRAPHIC DESIGNER'}
            </h2>
          </div>

          {/* ABOUT MYSELF */}
          {about.summary && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold tracking-[0.2em] text-stone-900 uppercase pb-1 border-b-2 border-stone-800 inline-block">
                ABOUT MYSELF
              </h3>
              <p className="text-[11.5px] leading-relaxed text-stone-700 text-justify">
                {about.summary}
              </p>
            </div>
          )}

          {/* EXPERIENCE */}
          {experience.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-[0.2em] text-stone-900 uppercase pb-1 border-b-2 border-stone-800 inline-block">
                EXPERIENCE
              </h3>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="text-[12px] font-bold text-stone-900">
                      {exp.company} <span className="font-semibold text-stone-600">| {exp.period}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-stone-700 italic">
                      {exp.title}
                    </div>
                    {exp.responsibilities && (
                      <p className="text-[11px] leading-relaxed text-stone-600">
                        {exp.responsibilities}
                      </p>
                    )}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="list-disc list-inside text-[10.5px] text-stone-600 space-y-0.5 mt-1">
                        {exp.achievements.map((ach) => (
                          <li key={ach.id}>{ach.text}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-[0.2em] text-stone-900 uppercase pb-1 border-b-2 border-stone-800 inline-block">
                EDUCATION
              </h3>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="grid grid-cols-12 gap-4 text-[11px]">
                    <div className="col-span-3 font-bold text-stone-900">
                      {edu.year || ''}
                    </div>
                    <div className="col-span-9 space-y-0.5">
                      <div className="font-bold text-stone-800">{edu.institution}</div>
                      <div className="text-stone-600">{edu.degree}</div>
                      {edu.description && (
                        <div className="text-[10px] text-stone-500">{edu.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Right Curved Wave Graphic */}
        <div className="absolute -bottom-10 -right-10 w-72 h-36 pointer-events-none z-0">
          <svg viewBox="0 0 200 100" fill="none" className="w-full h-full opacity-60">
            <path
              d="M0 100 C 60 40, 140 80, 200 10 L 200 100 Z"
              fill="#e5e7eb"
            />
            <path
              d="M50 100 C 100 60, 160 90, 200 40 L 200 100 Z"
              fill="#d1d5db"
              opacity="0.7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
