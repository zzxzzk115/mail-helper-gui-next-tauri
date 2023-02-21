import { fetch, Body } from "@tauri-apps/api/http";
const { Campaign, Gophish, Group, Page, SMTP, Template, User } = require("@zzxzzk115/gophish-api");

export default class MailHelperCore {

  constructor(config) {
    this.gophish_api_key = config.gophish_api_key;
    this.gophish_host = config.gophish_host;
    this.smtp_host = config.smtp_host;
    this.smtp_user_name = config.smtp_user_name;
    this.smtp_user_password = config.smtp_user_password;
    this.ignore_certificate_errors = config.ignore_certificate_errors;

    this.gophish = new Gophish({ api_key: this.gophish_api_key, host: this.gophish_host });
    this.campaignContext = null;
    console.log(this);
  }

  init() {
    Gophish.fetch_handler = fetch;
    Gophish.body_packer = Body.json;
    this.now = new Date().toISOString();
    this.campaignContext = new Campaign();
    this.campaignContext.name = `Campaign: ${this.now}`;
  }

  async addSMTP(sender_email, sender_name) {
    if (!this.isContextValid()) {
      throw "Campain Context is invalid.";
    }
    var smtp = new SMTP();
    smtp.name = `SMTP: ${this.now}`;
    smtp.host = this.smtp_host;
    if (sender_name) {
      smtp.from_address = `${sender_name} <${sender_email}>`;
    } else {
      smtp.from_address = sender_email;
    }
    smtp.ignore_cert_errors = this.ignore_certificate_errors;
    smtp.username = this.smtp_user_name;
    smtp.password = this.smtp_user_password;
    const createdSMTP = await this.gophish.smtp.post(smtp);
    console.log(createdSMTP);
    this.campaignContext.smtp = createdSMTP;
  }

  async addGroup(userInfos) {
    if (!this.isContextValid()) {
      throw "Campain Context is invalid.";
    }
    var group = new Group();
    group.name = `Group: ${this.now}`;
    userInfos.forEach(userInfo => {
      var user = new User();
      user.first_name = userInfo.first_name;
      user.last_name = userInfo.last_name;
      user.email = userInfo.email;
      group.targets.push(user);
    });
    const createdGroup = await this.gophish.groups.post(group);
    console.log(createdGroup);
    this.campaignContext.groups.push(createdGroup);
  }

  async addTemplate(subject, content, attachments) {
    if (!this.isContextValid()) {
      throw "Campain Context is invalid.";
    }
    var template = new Template();
    if (attachments) {
      template.attachments = template.attachments.concat(attachments);
    }
    if (content === '') {
      content = ' ';
    }
    template.name = `Template: ${this.now}`;
    template.html = content;
    template.subject = subject;
    const createdTemplate = await this.gophish.templates.post(template);
    console.log(createdTemplate);
    this.campaignContext.template = createdTemplate;
  }

  async addEmptyPage() {
    if (!this.isContextValid()) {
      throw "Campain Context is invalid.";
    }
    var page = new Page();
    page.name = `Page: ${this.now}`;
    page.html = '';
    const createdPage = await this.gophish.pages.post(page);
    console.log(createdPage);
    this.campaignContext.page = createdPage;
  }

  async send() {
    if (!this.isContextValid()) {
      throw "Campain Context is invalid.";
    }
    return await this.gophish.campaigns.post(this.campaignContext);
  }

  async clean() {
    if (!this.isContextValid()) {
      throw "Campain Context is invalid.";
    }
    await this.gophish.pages.delete(this.campaignContext.page?.id);
    await this.gophish.templates.delete(this.campaignContext.template?.id);
    this.campaignContext.groups.forEach(async group => {
      await this.gophish.groups.delete(group.id);
    });
    await this.gophish.smtp.delete(this.campaignContext.smtp?.id);
    await this.gophish.campaigns.delete(this.campaignContext.id);
  }

  isContextValid() {
    return this.campaignContext !== null;
  }
}