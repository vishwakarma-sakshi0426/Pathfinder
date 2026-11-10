import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Target,
  GraduationCap,
  Briefcase,
  Award,
  Info
} from 'lucide-react';
import type { FormDataType } from '../types';

const LinkedinIcon = ({ size = 10 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

interface TemplateProps {
  data: FormDataType;
}

export const TemplateModern: React.FC<TemplateProps> = ({ data }) => {
  const { about, education, skills, experience } = data;

  // Language/skill level percentages
  const getLevelPercent = (level: string) => {
    switch (level) {
      case 'Expert': return 100;
      case 'Advanced': return 90;
      case 'Intermediate': return 70;
      case 'Beginner': return 50;
      default: return 75;
    }
  };

  const linkedinLink = about.links?.find(l => l.url.includes('linkedin') || l.title.toLowerCase().includes('linkedin'));
  const webLink = about.links?.find(l => !l.url.includes('linkedin') || l.title.toLowerCase().includes('website'));

  return (
    <div className="w-[794px] min-h-[1123px] bg-white text-slate-800 font-sans shadow-2xl mx-auto flex flex-row overflow-hidden relative leading-normal print:shadow-none print:w-full print:min-h-screen">
      {/* LEFT SIDEBAR (Soft Blue ~35% width) */}
      <div className="w-[280px] bg-[#e4edf5] p-7 flex flex-col justify-between border-r border-[#cce0ee] flex-shrink-0">
        <div className="space-y-6">
          {/* Profile Photo with Halo */}
          <div className="flex justify-center pt-2">
            <div className="relative w-36 h-36 rounded-full bg-[#d0e2f0] flex items-center justify-center p-2 shadow-inner">
              {about.photo ? (
                <img
                  src={about.photo}
                  alt={about.name || 'Profile'}
                  className="w-32 h-32 rounded-full object-cover shadow-md border-2 border-white"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-[#1b324d] text-white flex items-center justify-center text-3xl font-bold uppercase shadow-md">
                  {about.name ? about.name.charAt(0) : 'U'}
                </div>
              )}
            </div>
          </div>

          {/* CONTACT SECTION */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#1b324d] uppercase pb-1.5 border-b border-[#afc9dc]">
              CONTACT
            </h3>
            <div className="mt-3.5 space-y-2.5 text-[11px] text-[#243d57]">
              {about.phone && (
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#1b324d] text-white flex items-center justify-center flex-shrink-0">
                    <Phone size={10} />
                  </div>
                  <span className="truncate">{about.phone}</span>
                </div>
              )}

              {about.email && (
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#1b324d] text-white flex items-center justify-center flex-shrink-0">
                    <Mail size={10} />
                  </div>
                  <span className="truncate">{about.email}</span>
                </div>
              )}

              {about.location && (
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#1b324d] text-white flex items-center justify-center flex-shrink-0">
                    <MapPin size={10} />
                  </div>
                  <span className="truncate">{about.location}</span>
                </div>
              )}

              {linkedinLink && (
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#1b324d] text-white flex items-center justify-center flex-shrink-0">
                    <LinkedinIcon size={10} />
                  </div>
                  <span className="truncate">{linkedinLink.url.replace(/^https?:\/\//, '')}</span>
                </div>
              )}

              {webLink && (
                <div className="flex items-center space-x-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#1b324d] text-white flex items-center justify-center flex-shrink-0">
                    <Globe size={10} />
                  </div>
                  <span className="truncate">{webLink.url.replace(/^https?:\/\//, '')}</span>
                </div>
              )}
            </div>
          </div>

          {/* SKILLS SECTION */}
          {skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] text-[#1b324d] uppercase pb-1.5 border-b border-[#afc9dc]">
                SKILLS
              </h3>
              <ul className="mt-3 space-y-1.5 text-[11px] text-[#243d57]">
                {skills.map((skill) => (
                  <li key={skill.id} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1b324d] flex-shrink-0" />
                    <span>{skill.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* LANGUAGES / PROFICIENCIES */}
          {skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold tracking-[0.2em] text-[#1b324d] uppercase pb-1.5 border-b border-[#afc9dc]">
                LANGUAGES
              </h3>
              <div className="mt-3 space-y-2 text-[11px] text-[#243d57]">
                {skills.slice(0, 4).map((item) => (
                  <div key={item.id} className="space-y-0.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span>{item.name}</span>
                      <span className="font-semibold">{getLevelPercent(item.level)}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#bed5e6] overflow-hidden">
                      <div
                        className="h-full bg-[#1b324d] rounded-full"
                        style={{ width: `${getLevelPercent(item.level)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM SIDEBAR BOTANICAL DECORATION & QUOTE */}
        <div className="pt-6 relative">
          {/* Subtle floral/leaf SVG */}
          <svg className="w-20 h-20 text-[#bed5e6] opacity-70 absolute -left-2 bottom-6 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
            <path d="M20,80 Q30,50 60,30 Q45,60 20,80 Z M35,65 Q50,45 75,35 Q60,60 35,65 Z M10,90 Q40,85 70,75 Q40,95 10,90 Z" />
          </svg>
          <div className="relative z-10 text-right pr-2">
            <p className="font-['Dancing_Script',cursive] text-lg text-[#1b324d] italic leading-tight">
              Be the reason for<br />your own success
            </p>
            <div className="w-16 h-0.5 bg-[#afc9dc] ml-auto mt-1" />
          </div>
        </div>
      </div>

      {/* RIGHT MAIN CONTENT AREA (~65% width) */}
      <div className="flex-1 p-8 pt-7 flex flex-col justify-between">
        <div className="space-y-5">
          {/* TOP HEADER */}
          <div className="flex justify-between items-start pb-2">
            <div>
              <h1 className="font-['Dancing_Script',cursive] text-5xl font-bold text-[#1b324d] tracking-normal leading-none">
                {about.name || 'Your Name'}
              </h1>
              <h2 className="text-xs font-bold tracking-[0.25em] text-[#1b324d] uppercase mt-2">
                {about.profession || 'PROFESSION / TITLE'}
              </h2>
            </div>
            <div className="text-right text-[9px] font-semibold tracking-widest text-[#6c8ca6] uppercase leading-tight pt-1">
              <div>LEARN</div>
              <div>PRACTICE</div>
              <div>GROW</div>
            </div>
          </div>

          {/* CAREER OBJECTIVE */}
          {about.summary && (
            <div>
              <div className="flex items-center space-x-2.5 pb-1">
                <div className="w-6 h-6 rounded-full bg-[#466a87] text-white flex items-center justify-center flex-shrink-0">
                  <Target size={13} />
                </div>
                <h3 className="text-xs font-bold tracking-widest text-[#1b324d] uppercase">
                  CAREER OBJECTIVE
                </h3>
                <div className="flex-1 h-[1px] bg-[#d2e0eb]" />
              </div>
              <p className="mt-2 pl-9 text-[11px] leading-relaxed text-slate-600">
                {about.summary}
              </p>
            </div>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <div>
              <div className="flex items-center space-x-2.5 pb-1">
                <div className="w-6 h-6 rounded-full bg-[#466a87] text-white flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={13} />
                </div>
                <h3 className="text-xs font-bold tracking-widest text-[#1b324d] uppercase">
                  EDUCATION
                </h3>
                <div className="flex-1 h-[1px] bg-[#d2e0eb]" />
              </div>

              {/* Timeline Items */}
              <div className="mt-2.5 pl-9 relative border-l border-[#c0d6e6] ml-3 space-y-3.5">
                {education.map((edu) => (
                  <div key={edu.id} className="relative pl-4">
                    <span className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-[#466a87] border-2 border-white" />
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-[12px] font-bold text-slate-800">
                        {edu.degree || 'Degree Title'}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {edu.year || ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 italic">
                      {edu.institution || 'University / Institution'}
                    </p>
                    {edu.description && (
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WORK EXPERIENCE */}
          {experience.length > 0 && (
            <div>
              <div className="flex items-center space-x-2.5 pb-1">
                <div className="w-6 h-6 rounded-full bg-[#466a87] text-white flex items-center justify-center flex-shrink-0">
                  <Briefcase size={13} />
                </div>
                <h3 className="text-xs font-bold tracking-widest text-[#1b324d] uppercase">
                  WORK EXPERIENCE
                </h3>
                <div className="flex-1 h-[1px] bg-[#d2e0eb]" />
              </div>

              <div className="mt-2 pl-9 space-y-3.5">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-[12px] font-bold text-slate-800">
                        {exp.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 italic">
                      {exp.company} {exp.location ? `• ${exp.location}` : ''}
                    </p>
                    {exp.responsibilities && (
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {exp.responsibilities}
                      </p>
                    )}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="list-disc list-inside text-[10.5px] text-slate-600 space-y-0.5 mt-1">
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

          {/* CERTIFICATIONS / SKILLS SPOTLIGHT */}
          {skills.length > 0 && (
            <div>
              <div className="flex items-center space-x-2.5 pb-1">
                <div className="w-6 h-6 rounded-full bg-[#466a87] text-white flex items-center justify-center flex-shrink-0">
                  <Award size={13} />
                </div>
                <h3 className="text-xs font-bold tracking-widest text-[#1b324d] uppercase">
                  CERTIFICATIONS &amp; ACHIEVEMENTS
                </h3>
                <div className="flex-1 h-[1px] bg-[#d2e0eb]" />
              </div>
              <ul className="mt-2 pl-9 space-y-1 text-[11px] text-slate-600">
                {skills.slice(0, 4).map((s) => (
                  <li key={s.id} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#466a87]" />
                    <span>{s.name} — {s.level} Certification</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ADDITIONAL INFORMATION */}
          <div>
            <div className="flex items-center space-x-2.5 pb-1">
              <div className="w-6 h-6 rounded-full bg-[#466a87] text-white flex items-center justify-center flex-shrink-0">
                <Info size={13} />
              </div>
              <h3 className="text-xs font-bold tracking-widest text-[#1b324d] uppercase">
                ADDITIONAL INFORMATION
              </h3>
              <div className="flex-1 h-[1px] bg-[#d2e0eb]" />
            </div>
            <div className="mt-2 pl-9 grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] text-slate-600">
              <div className="flex">
                <span className="w-24 text-slate-500">Location</span>
                <span className="mr-2">:</span>
                <span className="font-medium text-slate-800">{about.location || 'India'}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-slate-500">Profession</span>
                <span className="mr-2">:</span>
                <span className="font-medium text-slate-800">{about.profession || 'Specialist'}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-slate-500">Portfolio</span>
                <span className="mr-2">:</span>
                <span className="font-medium text-slate-800">{webLink ? 'Available' : 'On Request'}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-slate-500">Languages</span>
                <span className="mr-2">:</span>
                <span className="font-medium text-slate-800">English, Regional</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SIGN-OFF */}
        <div className="text-right pt-4 border-t border-[#e2eaf0]">
          <span className="font-['Dancing_Script',cursive] text-2xl text-[#1b324d]">
            Thank You ♡
          </span>
        </div>
      </div>
    </div>
  );
};
