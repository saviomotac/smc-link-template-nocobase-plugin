import React, { useEffect, useMemo } from 'react';
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
  linkTarget?: '_blank' | '_self' | string;
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
  const target =
    props.linkTarget ??
    fieldSchema?.['x-component-props']?.linkTarget ??
    (fieldSchema as any)?.['x-link-target'] ??
    '_blank';

  const record = props.record ?? recordFromContext ?? {};

  const href = useMemo(() => applyTemplate(template, record || {}), [template, record]);
  const text = useMemo(() => (textTemplate ? applyTemplate(textTemplate, record || {}) : href), [
    textTemplate,
    record,
    href,
  ]);
  const recordId = record?.id;

  useEffect(() => {
    if (!href) return;
    //console.info('[link-template][client] LinkTemplate render', { href, text, recordId });
  }, [href, text, recordId]);

  if (!href) return null;

  const rel = target === '_blank' ? 'noreferrer' : undefined;

  return (
    <a href={href} target={target} rel={rel}>
      {text}
    </a>
  );
};
