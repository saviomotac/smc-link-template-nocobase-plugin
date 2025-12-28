import { Plugin, useIsFieldReadPretty } from '@nocobase/client';
import { LinkTemplate } from './components/LinkTemplate';
import { linkTemplateComponentFieldSettings, linkTemplateLegacySchemaSettings } from './settings/linkTemplateSettings';
import { tStr } from './locale';

export class PluginLinkTemplateClient extends Plugin {
  async load() {
    this.app.addComponents({ LinkTemplate });
    this.app.schemaSettingsManager.add(linkTemplateComponentFieldSettings);
    this.app.schemaSettingsManager.add(linkTemplateLegacySchemaSettings);

    const linkTemplateComponentOption = {
      label: tStr('Link'),
      value: 'LinkTemplate',
      useVisible() {
        return useIsFieldReadPretty();
      },
      useProps() {
        return {
          linkTemplate: '',
          linkTextTemplate: '',
        };
      },
    };

    // Make it available on common field interfaces so it can be used in Details and Table columns.
    [
      'input',
      'textarea',
      'email',
      'phone',
      'url',
      'number',
      'integer',
      'percent',
      'createdAt',
      'updatedAt',
    ].forEach((interfaceName) => {
      this.app.addFieldInterfaceComponentOption(interfaceName, linkTemplateComponentOption);
    });
  }
}

export default PluginLinkTemplateClient;
