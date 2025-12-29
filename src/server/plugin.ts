import { Plugin } from '@nocobase/server';

export class PluginLinkTemplateServer extends Plugin {
  async afterAdd() {
    this.log.info('[link-template][server] afterAdd');
  }

  async beforeLoad() {
    this.log.info('[link-template][server] beforeLoad');
  }

  async load() {
    this.log.info('[link-template][server] load');
  }

  async install() {
    this.log.info('[link-template][server] install');
  }

  async afterEnable() {
    this.log.info('[link-template][server] afterEnable');
  }

  async afterDisable() {
    this.log.info('[link-template][server] afterDisable');
  }

  async remove() {
    this.log.info('[link-template][server] remove');
  }
}

export default PluginLinkTemplateServer;
