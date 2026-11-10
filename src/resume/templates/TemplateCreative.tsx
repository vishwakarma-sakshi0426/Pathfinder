import React from 'react';
import type { FormDataType } from '../types';

interface TemplateProps {
  data: FormDataType;
}

export const TemplateCreative: React.FC<TemplateProps> = ({ data }) => {
  const { about, education, skills, experience } = data;

  const displayName = about.name?.trim() || 'Your Name';
  const displayProfession = about.profession?.trim() || 'Software Developer';
  const displayEmail = about.email?.trim() || 'yourname@gmail.com';
  const displaySummary = about.summary?.trim() ||
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';

  // Split skills for display: first 5-6 as bullet points
  const displaySkills = skills.length > 0 ? skills.slice(0, 6) : [
    { id: '1', name: 'Lorem Skill One', level: 'Expert' },
    { id: '2', name: 'Lorem Skill Two', level: 'Advanced' },
    { id: '3', name: 'Lorem Skill Three', level: 'Advanced' },
    { id: '4', name: 'Lorem Skill Four', level: 'Intermediate' },
    { id: '5', name: 'Lorem Skill Five', level: 'Intermediate' },
  ];

  // Languages / Key proficiencies with progress bars
  const displayLanguages = [
    { name: 'English', percentage: '100%' },
    { name: skills[0]?.name || 'Hindi', percentage: '90%' },
  ];

  return (
    <div
      className="w-[794px] min-h-[1123px] relative bg-[#ede3d4] text-[#2c2420] font-sans shadow-2xl mx-auto overflow-hidden flex flex-col justify-between select-none print:shadow-none print:w-full print:min-h-screen"
      style={{
        boxSizing: 'border-box',
        backgroundImage: 'radial-gradient(#e5dbc9 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      {/* VINTAGE POSTAL STAMP TOP-RIGHT */}
      <div className="absolute top-1 right-2 text-[10px] font-mono tracking-widest text-[#a89b88] opacity-60 rotate-45 pointer-events-none select-none">
        052•POST
      </div>

      {/* =========================================================================
          TOP SECTION: POLAROID (LEFT) & RED GRID NOTEBOOK HEADER (RIGHT)
          ========================================================================= */}
      <div className="pt-8 px-9 flex justify-between items-start relative z-10">
        
        {/* --- POLAROID PHOTO FRAME (TOP LEFT) --- */}
        <div className="relative rotate-[-2deg] transition-transform">
          {/* Silver Paperclip with Red Ribbon Bow */}
          <div className="absolute -top-4 left-3 z-30">
            {/* Paperclip */}
            <svg width="22" height="42" viewBox="0 0 22 42" fill="none" className="drop-shadow-sm">
              <path
                d="M6 12V30C6 34 9 37 13 37C17 37 20 34 20 30V8C20 4 16 1 11 1C6 1 2 4 2 9V32"
                stroke="#6b7280"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M7 13V29C7 32 9 35 12 35C15 35 18 32 18 29V9C18 5 15 3 11 3C7 3 4 5 4 10V31"
                stroke="#d1d5db"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            {/* Red Ribbon Bow */}
            <div className="absolute -top-1 -left-2 z-40">
              <svg width="34" height="26" viewBox="0 0 34 26" fill="none">
                {/* Left loop */}
                <path d="M16 9 C11 2, 4 3, 5 9 C6 14, 12 12, 16 10 Z" fill="#7a121d" stroke="#520a12" strokeWidth="0.8" />
                {/* Right loop */}
                <path d="M18 9 C23 2, 30 3, 29 9 C28 14, 22 12, 18 10 Z" fill="#7a121d" stroke="#520a12" strokeWidth="0.8" />
                {/* Left ribbon tail */}
                <path d="M14 11 Q9 18 6 23 L9 24 Q13 18 15 13 Z" fill="#8f1623" />
                {/* Right ribbon tail */}
                <path d="M20 11 Q25 18 28 23 L25 24 Q21 18 19 13 Z" fill="#8f1623" />
                {/* Center knot */}
                <ellipse cx="17" cy="9.5" rx="3.5" ry="3" fill="#5c0b14" />
              </svg>
            </div>
          </div>

          {/* Polaroid Outer Card */}
          <div className="w-[172px] bg-white p-2.5 pb-7 rounded-xs shadow-[0_6px_16px_rgba(0,0,0,0.15)] border border-stone-200">
            <div className="w-full aspect-[1/1.05] bg-[#dbe1e8] rounded-xs overflow-hidden flex items-center justify-center relative">
              {about.photo ? (
                <img
                  src={about.photo}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Avatar Silhouette from Reference Image */
                <div className="w-full h-full flex flex-col items-center justify-end pb-0 bg-[#dbe1e8]">
                  <div className="w-16 h-16 rounded-full bg-white mb-2 shadow-inner" />
                  <div className="w-28 h-14 rounded-t-full bg-white" />
                </div>
              )}
            </div>
          </div>

          {/* Botanical Palm Fronds peeking out on left */}
          <div className="absolute -left-10 top-24 -z-10 pointer-events-none">
            <svg width="90" height="130" viewBox="0 0 90 130" fill="none" className="opacity-95">
              <path d="M10 120 Q35 70 85 10" stroke="#2d422f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M25 90 Q10 75 0 85 Q15 95 28 92" fill="#38523b" />
              <path d="M35 78 Q18 60 5 68 Q22 80 38 80" fill="#2d422f" />
              <path d="M46 64 Q28 42 15 48 Q32 64 49 66" fill="#3e5a41" />
              <path d="M58 48 Q40 24 28 30 Q45 46 61 50" fill="#2d422f" />
              <path d="M70 30 Q54 8 42 15 Q58 30 72 32" fill="#38523b" />
              <path d="M85 10 Q70 -5 60 0 Q74 15 85 12" fill="#2d422f" />
            </svg>
          </div>
        </div>

        {/* --- BURGUNDY GRID NOTEBOOK (TOP RIGHT NAME CARD) --- */}
        <div className="relative w-[430px] rounded-xs shadow-[0_6px_18px_rgba(0,0,0,0.18)] overflow-hidden bg-[#72101b] border-t border-b border-[#540b13]">
          {/* White Grid Lines Texture */}
          <div
            className="w-full h-full p-4 pl-9"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.22) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.22) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          >
            {/* Binder Spiral Holes along left edge */}
            <div className="absolute left-2.5 top-0 bottom-0 flex flex-col justify-around py-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-[#ede3d4] shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] border border-[#4d0b13]"
                />
              ))}
            </div>

            {/* Script Handwriting Name */}
            <div className="text-center py-2">
              <h1
                className="text-4xl text-white font-bold tracking-wide drop-shadow-sm"
                style={{ fontFamily: "'Dancing Script', cursive, sans-serif" }}
              >
                {displayName}
              </h1>
              {displayProfession && (
                <p
                  className="text-lg text-white/90 mt-1 italic tracking-wide"
                  style={{ fontFamily: "'Dancing Script', cursive, sans-serif" }}
                >
                  {displayProfession}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MIDDLE SECTION:
          LEFT: RIPPED LINED NOTEBOOK (ABOUT ME)
          RIGHT: POSTCARD & STACKED CLOCKS
          ========================================================================= */}
      <div className="px-9 mt-4 flex justify-between items-start relative z-10">
        
        {/* --- LEFT: RIPPED LINED NOTEBOOK PAPER (ABOUT ME) --- */}
        <div className="w-[375px] relative">
          <div
            className="bg-[#faf8f4] p-5 pt-4 rounded-xs shadow-[0_5px_15px_rgba(0,0,0,0.12)] border-t border-b border-stone-200"
            style={{
              backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 23px, #e2e8f0 24px)',
              backgroundPosition: '0 10px',
            }}
          >
            {/* Jagged Torn Edges at top & bottom */}
            <div className="space-y-1">
              <div className="inline-block">
                <h2
                  className="text-3xl font-bold text-[#1a1412] leading-none"
                  style={{ fontFamily: "'Dancing Script', cursive, sans-serif" }}
                >
                  About Me
                </h2>
                {/* Double burgundy brush underline */}
                <div className="mt-1 flex flex-col gap-0.5">
                  <div className="h-[2px] bg-[#72101b] w-36 rounded-full" />
                  <div className="h-[1.5px] bg-[#72101b] w-28 rounded-full ml-2" />
                </div>
              </div>

              <p className="text-[11.5px] leading-[24px] text-[#2c2420] text-justify mt-3 font-normal">
                {displaySummary}
              </p>
            </div>
          </div>
        </div>

        {/* --- RIGHT: VINTAGE POSTCARD WITH MOUNTAIN SCENERY + STACKED CLOCKS --- */}
        <div className="w-[335px] relative pl-1">
          {/* Postcard Banner */}
          <div className="relative w-[280px] h-[135px] rounded-xs shadow-[0_4px_12px_rgba(0,0,0,0.2)] overflow-hidden bg-[#3b483d] border border-stone-300">
            {/* Scenic Landscape Imagery (Mountain & Meadow backdrop) */}
            <div
              className="w-full h-full relative flex flex-col items-center justify-center p-3 text-center"
              style={{
                backgroundImage: 'linear-gradient(to bottom, rgba(20,30,25,0.45), rgba(15,20,18,0.7)), url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="text-white drop-shadow-md">
                <p
                  className="text-xl font-bold tracking-wide"
                  style={{ fontFamily: "'Dancing Script', cursive, sans-serif" }}
                >
                  {about.profession ? `${about.profession} Journey` : 'Your University'}
                </p>
                <p className="text-[10px] tracking-widest uppercase font-semibold text-white/80 mt-0.5">
                  {education[0]?.institution || 'Academic Excellence'}
                </p>
              </div>
            </div>
          </div>

          {/* 3 STACKED VINTAGE CLOCKS ON THE RIGHT EDGE */}
          <div className="absolute top-1 -right-2 flex flex-col gap-1.5 z-20">
            {/* Clock 1: Antique White Face with Ring */}
            <div className="w-11 h-11 rounded-full bg-[#fbf9f4] border-2 border-[#8c7853] shadow-md flex items-center justify-center relative">
              {/* Pocket watch top loop */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-2 rounded-t-full border-2 border-[#8c7853]" />
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <circle cx="17" cy="17" r="15" stroke="#a38f65" strokeWidth="0.8" fill="#fdfbf7" />
                <text x="17" y="7" textAnchor="middle" fontSize="4" fontFamily="serif" fill="#2c2420">XII</text>
                <text x="27" y="18" textAnchor="middle" fontSize="4" fontFamily="serif" fill="#2c2420">III</text>
                <text x="17" y="29" textAnchor="middle" fontSize="4" fontFamily="serif" fill="#2c2420">VI</text>
                <text x="7" y="18" textAnchor="middle" fontSize="4" fontFamily="serif" fill="#2c2420">IX</text>
                {/* Clock hands */}
                <line x1="17" y1="17" x2="17" y2="9" stroke="#1f1815" strokeWidth="1" strokeLinecap="round" />
                <line x1="17" y1="17" x2="23" y2="17" stroke="#1f1815" strokeWidth="0.8" strokeLinecap="round" />
                <circle cx="17" cy="17" r="1.2" fill="#72101b" />
              </svg>
            </div>

            {/* Clock 2: Cream Vintage Dial with Sub-dials */}
            <div className="w-11 h-11 rounded-full bg-[#faebd7] border-2 border-[#735c39] shadow-md flex items-center justify-center relative">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <circle cx="17" cy="17" r="15" stroke="#735c39" strokeWidth="1" fill="#f5e5cf" />
                <circle cx="17" cy="22" r="3.5" stroke="#735c39" strokeWidth="0.5" strokeDasharray="1 1" />
                <line x1="17" y1="17" x2="12" y2="11" stroke="#2c2420" strokeWidth="1" strokeLinecap="round" />
                <line x1="17" y1="17" x2="22" y2="13" stroke="#2c2420" strokeWidth="0.8" strokeLinecap="round" />
                <circle cx="17" cy="17" r="1.2" fill="#2c2420" />
              </svg>
            </div>

            {/* Clock 3: Ornate Brass Pocket Watch */}
            <div className="w-11 h-11 rounded-full bg-[#f4ecd8] border-2 border-[#5a462b] shadow-md flex items-center justify-center relative">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <circle cx="17" cy="17" r="15" stroke="#5a462b" strokeWidth="1.2" fill="#eee1c7" />
                <circle cx="17" cy="17" r="11" stroke="#8a7350" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
                <line x1="17" y1="17" x2="17" y2="8" stroke="#111" strokeWidth="1" strokeLinecap="round" />
                <line x1="17" y1="17" x2="24" y2="19" stroke="#111" strokeWidth="0.8" strokeLinecap="round" />
                <circle cx="17" cy="17" r="1.2" fill="#5a462b" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM SECTION:
          LEFT: LANGUAGES & SKILLS (AND EXPERIENCE IF PRESENT)
          RIGHT: DUSTY ROSE EDUCATION CARD
          ========================================================================= */}
      <div className="px-9 mt-4 flex justify-between items-start relative z-10 flex-1">
        
        {/* --- LOWER LEFT COLUMN: LANGUAGES & SKILLS --- */}
        <div className="w-[370px] space-y-5 pr-4">
          
          {/* LANGUAGES SECTION */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[#72101b] font-bold text-lg select-none">{'\\ \\'}</span>
              <h2
                className="text-2xl font-bold text-[#1f1a17]"
                style={{ fontFamily: "'Dancing Script', cursive, sans-serif" }}
              >
                Languages
              </h2>
            </div>

            <div className="space-y-2.5 pt-1 pl-2">
              {displayLanguages.map((lang, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-semibold text-[#2c2420]">
                  <span className="w-16">{lang.name}</span>
                  {/* Deep burgundy progress bar */}
                  <div className="flex-1 mx-3 h-2.5 bg-[#d8ccb8] rounded-full overflow-hidden p-[1px]">
                    <div
                      className="h-full bg-[#72101b] rounded-full"
                      style={{ width: lang.percentage }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[#443833]">{lang.percentage}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SKILLS SECTION */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5">
              <h2
                className="text-2xl font-bold text-[#1f1a17]"
                style={{ fontFamily: "'Dancing Script', cursive, sans-serif" }}
              >
                Skills
              </h2>
              <span className="text-[#72101b] font-bold text-lg select-none">=</span>
            </div>

            <ul className="space-y-1.5 pl-2 pt-1">
              {displaySkills.map((sk) => (
                <li key={sk.id} className="flex items-center gap-2 text-xs font-medium text-[#2c2420]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#72101b] flex-shrink-0" />
                  <span>{sk.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* EXPERIENCE ENTRIES (IF PRESENT) */}
          {experience.length > 0 && (
            <div className="pt-2 border-t border-[#d8ccb8]/60 space-y-2">
              <h3
                className="text-xl font-bold text-[#1f1a17]"
                style={{ fontFamily: "'Dancing Script', cursive, sans-serif" }}
              >
                Experience
              </h3>
              <div className="space-y-2 pl-2">
                {experience.slice(0, 2).map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="font-bold text-[#1f1a17]">{exp.title}</div>
                    <div className="text-[11px] text-[#55463f] italic">
                      {exp.company} • {exp.period}
                    </div>
                    {exp.responsibilities && (
                      <p className="text-[10.5px] text-[#2c2420] mt-0.5 leading-snug">
                        {exp.responsibilities}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN: DUSTY ROSE "EDUCATION" CARD --- */}
        <div className="w-[340px] relative">
          <div className="bg-[#bc807a] p-5 pt-4 rounded-xs shadow-[0_5px_16px_rgba(0,0,0,0.16)] text-white relative">
            
            {/* FLOATING CREAM PILL BADGE FOR "EDUCATION" */}
            <div className="flex justify-center -mt-8 mb-4">
              <div className="bg-[#fcfaf5] px-8 py-1 rounded-full shadow-md border border-[#e4d5c4]">
                <h2
                  className="text-2xl font-bold text-[#1f1a17]"
                  style={{ fontFamily: "'Dancing Script', cursive, sans-serif" }}
                >
                  Education
                </h2>
              </div>
            </div>

            {/* Education list entries */}
            <div className="space-y-4">
              {education.length > 0 ? (
                education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5 border-b border-white/20 pb-3 last:border-none last:pb-0">
                    <div className="text-sm font-bold tracking-wide text-white">
                      {edu.degree}
                    </div>
                    <div className="text-xs text-[#faedea] italic">
                      {edu.institution}
                    </div>
                    <div className="text-xs font-semibold text-white/90 mt-0.5">
                      {edu.year}
                    </div>
                    {edu.description && (
                      <div className="mt-1 inline-block bg-white/25 px-2.5 py-0.5 rounded text-[10.5px] text-white font-medium">
                        {edu.description}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                /* Fallback sample matching the reference layout */
                <>
                  <div className="space-y-0.5 border-b border-white/20 pb-3">
                    <div className="text-sm font-bold tracking-wide text-white">
                      Bachelors of Education
                    </div>
                    <div className="text-xs text-[#faedea] italic">
                      University of lorem
                    </div>
                    <div className="text-xs font-semibold text-white/90">
                      2024–2028
                    </div>
                    <div className="mt-1 inline-block bg-white/25 px-2.5 py-0.5 rounded text-[10.5px] text-white font-medium">
                      Current cgpa: 3.98/4 • 3rd Sem
                    </div>
                  </div>

                  <div className="space-y-0.5 border-b border-white/20 pb-3">
                    <div className="text-sm font-bold tracking-wide text-white">
                      Intermediate (Pre medical)
                    </div>
                    <div className="text-xs text-[#faedea] italic">
                      Your College name
                    </div>
                    <div className="text-xs font-semibold text-white/90">
                      2021–2023
                    </div>
                    <div className="mt-1 inline-block bg-white/25 px-2.5 py-0.5 rounded text-[10.5px] text-white font-medium">
                      Marks: 958/1100
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-sm font-bold tracking-wide text-white">
                      Matriculation (Science)
                    </div>
                    <div className="text-xs text-[#faedea] italic">
                      Your School name
                    </div>
                    <div className="text-xs font-semibold text-white/90">
                      2010–2021
                    </div>
                    <div className="mt-1 inline-block bg-white/25 px-2.5 py-0.5 rounded text-[10.5px] text-white font-medium">
                      Marks: 1020/1100
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          DECORATIVE VINTAGE BUTTERFLY & BOTANICAL ON RIGHT
          ========================================================================= */}
      {/* Palm leaf frond on right */}
      <div className="absolute right-0 bottom-24 pointer-events-none z-10">
        <svg width="110" height="150" viewBox="0 0 110 150" fill="none" className="opacity-95">
          <path d="M100 140 Q60 80 10 20" stroke="#2d422f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M85 110 Q100 95 110 105 Q95 115 82 112" fill="#38523b" />
          <path d="M75 95 Q92 77 105 85 Q88 97 72 97" fill="#2d422f" />
          <path d="M64 80 Q82 58 95 64 Q78 80 61 82" fill="#3e5a41" />
          <path d="M52 64 Q70 40 82 46 Q65 62 49 66" fill="#2d422f" />
          <path d="M40 46 Q56 24 68 31 Q52 46 38 48" fill="#38523b" />
        </svg>
      </div>

      {/* Detailed Vintage Sketch Butterfly resting on bottom edge */}
      <div className="absolute right-12 bottom-12 z-20 pointer-events-none drop-shadow-md rotate-[-8deg]">
        <svg width="150" height="100" viewBox="0 0 150 100" fill="none">
          {/* Left Wing Top */}
          <path
            d="M72 50 C55 20, 20 15, 12 35 C6 50, 30 65, 72 56 Z"
            fill="#808a7e"
            stroke="#2b312b"
            strokeWidth="1.5"
          />
          {/* Left Wing Veins */}
          <path d="M72 50 Q35 30 15 35 M72 50 Q30 45 18 52 M72 50 Q45 58 35 62" stroke="#2b312b" strokeWidth="0.8" />
          
          {/* Left Wing Bottom */}
          <path
            d="M72 56 C50 65, 25 75, 35 90 C45 98, 65 85, 74 62 Z"
            fill="#6d756b"
            stroke="#2b312b"
            strokeWidth="1.5"
          />
          {/* Left bottom veins */}
          <path d="M72 58 Q48 78 38 88 M72 58 Q58 84 50 92" stroke="#2b312b" strokeWidth="0.8" />

          {/* Right Wing Top */}
          <path
            d="M78 50 C95 20, 130 15, 138 35 C144 50, 120 65, 78 56 Z"
            fill="#808a7e"
            stroke="#2b312b"
            strokeWidth="1.5"
          />
          {/* Right Wing Veins */}
          <path d="M78 50 Q115 30 135 35 M78 50 Q120 45 132 52 M78 50 Q105 58 115 62" stroke="#2b312b" strokeWidth="0.8" />

          {/* Right Wing Bottom */}
          <path
            d="M78 56 C100 65, 125 75, 115 90 C105 98, 85 85, 76 62 Z"
            fill="#6d756b"
            stroke="#2b312b"
            strokeWidth="1.5"
          />
          {/* Right bottom veins */}
          <path d="M78 58 Q102 78 112 88 M78 58 Q92 84 100 92" stroke="#2b312b" strokeWidth="0.8" />

          {/* Butterfly Body & Antennae */}
          <ellipse cx="75" cy="55" rx="3" ry="14" fill="#222" />
          <circle cx="75" cy="40" r="2.5" fill="#222" />
          <path d="M74 38 Q66 26 62 25" stroke="#222" strokeWidth="1" strokeLinecap="round" />
          <path d="M76 38 Q84 26 88 25" stroke="#222" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      {/* =========================================================================
          TORN PAPER BOTTOM FOOTER WITH BURGUNDY BASE & CONTACT INFO
          ========================================================================= */}
      <div className="relative mt-8 select-none">
        {/* Layer 1: Ripped White Paper Edge */}
        <svg
          className="w-full h-10 block -mb-4 relative z-0"
          viewBox="0 0 794 40"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40 L0 18 Q50 26 110 16 Q180 30 250 14 Q320 28 390 12 Q470 25 550 16 Q630 32 710 14 Q760 22 794 15 L794 40 Z"
            fill="#ffffff"
          />
        </svg>

        {/* Layer 2: Deep Crimson/Burgundy Ripped Base Footer */}
        <div className="relative z-10 bg-[#72101b] pt-4 pb-4 px-9">
          <svg
            className="w-full h-7 absolute -top-5 left-0"
            viewBox="0 0 794 30"
            preserveAspectRatio="none"
          >
            <path
              d="M0 30 L0 12 Q60 24 130 10 Q210 26 290 8 Q370 22 450 12 Q530 25 610 8 Q690 22 794 10 L794 30 Z"
              fill="#72101b"
            />
          </svg>

          {/* Footer Contact Details */}
          <div className="flex justify-between items-center text-xs text-white/90 font-medium pt-1">
            <div className="flex items-center gap-4 text-[11px] text-white/80">
              {about.phone && <span>{about.phone}</span>}
              {about.location && <span>• {about.location}</span>}
            </div>

            {/* Email Address right aligned as shown in reference */}
            <div className="font-mono text-xs text-white tracking-wider">
              {displayEmail}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
