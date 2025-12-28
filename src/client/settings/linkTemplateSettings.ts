import { Field } from '@formily/core';
import { useField, useFieldSchema } from '@formily/react';
import { SchemaSettings, useColumnSchema, useDesignable } from '@nocobase/client';
import { tStr, useT } from '../locale';

const createLinkTemplateSettings = (name: string) =>
  new SchemaSettings({
    name,
    items: [
      {
        name: 'configureLink',
        type: 'modal',
        useComponentProps() {
          const t = useT();
          const field = useField<Field>();
          const schema = useFieldSchema();
          const { fieldSchema: tableColumnSchema } = useColumnSchema();
          const fieldSchema = tableColumnSchema || schema;
          const { dn } = useDesignable();

          return {
            title: t('Configure link'),
            schema: {
              type: 'object',
              properties: {
                linkTemplate: {
                  title: tStr('URL template'),
                  default: fieldSchema?.['x-component-props']?.linkTemplate,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: 'http://www.link.com.br/{{numero_doc}}',
                  },
                },
                linkTextTemplate: {
                  title: tStr('Link text (optional)'),
                  default: fieldSchema?.['x-component-props']?.linkTextTemplate,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: 'Abrir {{numero_doc}}',
                  },
                },
              },
            },
            onSubmit(values) {
              const nextComponentProps = {
                ...(fieldSchema?.['x-component-props'] || {}),
                component: 'LinkTemplate',
                linkTemplate: values.linkTemplate,
                linkTextTemplate: values.linkTextTemplate,
              };

              fieldSchema['x-component-props'] = nextComponentProps;
              field.componentProps = nextComponentProps;

              dn.emit('patch', {
                schema: {
                  'x-uid': fieldSchema['x-uid'],
                  'x-component-props': nextComponentProps,
                },
              });
              dn.refresh();
            },
          };
        },
      },
    ],
  });

export const linkTemplateComponentFieldSettings = createLinkTemplateSettings('fieldSettings:component:LinkTemplate');

// Backward compatibility: some schemas may already reference this `x-settings` name.
export const linkTemplateLegacySchemaSettings = createLinkTemplateSettings('linkTemplateSettings');
