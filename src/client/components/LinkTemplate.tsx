import React, { useMemo } from 'react';
import { useRecord } from '@nocobase/client';
import { useFieldSchema } from '@formily/react';

function applyTemplate(template: string, record: any) {
  return (template || '').replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
    const value = key.split('.').reduce((acc: any, k: string) => acc?.[k], record);
    return value == null ? '' : String(value);
  });
}

export type LinkTemplateProps = {
  linkTemplate?: string;
  linkTextTemplate?: string;
  record?: any;
};

export const LinkTemplate: React.FC<LinkTemplateProps> = (props) => {
  const recordFromContext = useRecord();
  const fieldSchema = useFieldSchema();

  const template =
    props.linkTemplate ??
    fieldSchema?.['x-component-props']?.linkTemplate ??
    (fieldSchema as any)?.['x-link-template'] ??
    '';
  const textTemplate =
    props.linkTextTemplate ??
    fieldSchema?.['x-component-props']?.linkTextTemplate ??
    (fieldSchema as any)?.['x-link-text-template'] ??
    '';

  const record = props.record ?? recordFromContext ?? {};

  const href = useMemo(() => applyTemplate(template, record || {}), [template, record]);
  const text = useMemo(() => (textTemplate ? applyTemplate(textTemplate, record || {}) : href), [
    textTemplate,
    record,
    href,
  ]);

  if (!href) return null;

  return (
    <a href={href} target="_blank" rel="noreferrer">
      {text}
    </a>
  );
};
