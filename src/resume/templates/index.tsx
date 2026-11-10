import React from 'react';
import type { FormDataType } from '../types';
import { TemplateModern } from './TemplateModern';
import { TemplateProfessional } from './TemplateProfessional';
import { TemplateCreative } from './TemplateCreative';
import { TemplateMinimal } from './TemplateMinimal';

export {
  TemplateModern,
  TemplateProfessional,
  TemplateCreative,
  TemplateMinimal
};

export interface ResumeRendererProps {
  templateId: string;
  data: FormDataType;
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({ templateId, data }) => {
  switch (templateId) {
    case 'professional':
      return <TemplateProfessional data={data} />;
    case 'modern':
      return <TemplateModern data={data} />;
    case 'creative':
      return <TemplateCreative data={data} />;
    case 'minimal':
      return <TemplateMinimal data={data} />;
    default:
      return <TemplateProfessional data={data} />;
  }
};
