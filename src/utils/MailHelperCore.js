import { fetch, Body } from "@tauri-apps/api/http";
import { Campaign, Gophish, Group, Page, SMTP, Template, User } from "@zzxzzk115/gophish-api";

Gophish.fetch_handler = fetch;
Gophish.body_packer = Body.json;

export default class MailHelperCore {

  constructor(config) {
    this.smtp_host = config.smtp_host;
    this.smtp_user_name = config.smtp_user_name;
    this.smtp_user_password = confg.smtp_user_password;
    this.ignore_certificate_errors = config.ignore_certificate_errors;

    this.gophish = new Gophish({api_key: this.gophish_api_key, host: this.gophish_host});
    this.campaignContext = null;
  }

  init() {
    this.campaignContext = new Campaign();
    this.campaignContext.name = `Campaign: ${now}`;
  }

  async send() {
    if (this.campaignContext) {
      const result = await this.gophish.campaigns.post(this.campaignContext);
      return result;
    }
  }

  async sendEmail(sender_name,
    sender_email,
    subject,
    recipient_first_name,
    recipient_last_name,
    recipient_email,
    email_content,
    email_attachment) {
      const gophish = this.gophish_client;
      var now = new Date().toISOString();

      // Create a Sending Profile
      var smtp = new SMTP();
      smtp.name = `SMTP: ${now}`;
      smtp.host = this.smtp_host;
      if (sender_name) {
        smtp.from_address = `${sender_name} <${sender_email}>`;
      } else {
        smtp.from_address = sender_email;
      }
      smtp.ignore_cert_errors = this.ignore_certificate_errors;
      smtp.username = this.smtp_user_name;
      smtp.smtp_user_password = this.smtp_user_password;
      const createdSMTP = await gophish.smtp.post(smtp);

      // Create a new Group
      var group = new Group();
      group.name = `Group: ${now}`;
      var user = new User();
      user.first_name = recipient_first_name;
      user.last_name = recipient_last_name;
      user.email = recipient_email;
      group.targets.push(user);
      const createdGroup = await gophish.groups.post(group);

      // Create a new Email Template
      var template = new Template();
      if (email_attachment) {
        template.attachments.push(email_attachment);
      }
      if (email_content === '') {
        email_content = ' ';
      }
      template.name = `Template: ${now}`;
      template.html = email_content;
      template.subject = subject;
      const createdTemplate = await gophish.templates.post(template);

      // Create a new empty Landing Page
      var page = new Page();
      page.name = `Page: ${now}`;
      page.html = '';
      const createdPage = await gophish.pages.post(page);

      // Create a new Campaign
      var campaign = new Campaign();
      campaign.name = `Campaign: ${now}`;
      campaign.groups.push(createdGroup);
      campaign.page = createdPage;
      campaign.template = createdTemplate;
      campaign.smtp = createdSMTP;
      const createdCampaign = await gophish.campaigns.post(campaign);

      // Clean up
      await gophish.smtp.delete(createdSMTP.id);
      await gophish.groups.delete(createdGroup.id);
      await gophish.templates.delete(createdTemplate.id);
      await gophish.pages.delete(createdPage.id);
      await gophish.campaigns.delete(createdCampaign.id);
  }
}