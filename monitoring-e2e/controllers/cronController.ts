import schedule from 'node-schedule';
import { getMonitorTestLinks, validateAppSecret } from './clarisaController';
import { evaluateUrl } from './biFrontController';

let sites: Site[] = [];
let previousSites: Site[] = [];
// let iterator = 0;
const crons: Map<number, schedule.Job> = new Map();
export const mainCron = () =>
  schedule.scheduleJob('*/8 * * * * *', async () => {
    const appSecretValidated = await validateAppSecret();
    if (!appSecretValidated) return;
    const list = await getMonitorTestLinks();
    sites = (list?.data as Site[]) || [];
    // if (iterator === 2) {
    //   //find site with id 1 and change de url
    //   const site = sites.find(site => site.id === 1);
    //   if (site) {
    //     site.link = 'https://www.google.com';
    //   }
    // }

    // if (iterator === 1) {
    //   //find site with id 1 and change de url
    //   const site = sites.find(site => site.id === 2);
    //   if (site) {
    //     site.name = 'test';
    //   }
    // }
    updateCrons();
    // iterator++;
  });

const updateCrons = () => {
  const sitesToUpdate = sites.filter(site => {
    const previousSite = previousSites.find(prev => prev.id === site.id);
    return !previousSite || JSON.stringify(previousSite) !== JSON.stringify(site);
  });

  const sitesToCancel = previousSites.filter(prev => !sites.find(site => site.id === prev.id));

  // Cancel the crons for sites that are removed or changed
  for (const site of sitesToCancel) {
    const cron = crons.get(site.id);
    if (cron) {
      cron.cancel();
      crons.delete(site.id);
    }
  }

  // Recreate crons for the updated sites
  for (const site of sitesToUpdate) {
    const existingCron = crons.get(site.id);
    if (existingCron) {
      existingCron.cancel();
      crons.delete(site.id);
    }
    createCron(site);
  }

  // Update previousSites to the current state
  previousSites = [...sites];
};

const createCron = (site: Site) => {
  const { cron_expression, link } = site;
  const cron = schedule.scheduleJob(cron_expression, async () => {
    await evaluateUrl(link, site);
  });
  crons.set(site.id, cron);
};

export interface Site {
  id: number;
  name: string;
  link: string;
  cron_expression: string;
  html_tag: string;
  html_tag_attribute: string;
  html_tag_attribute_value: string;
  auditableFields: AuditableFields;
}

interface AuditableFields {
  created_at: string;
  updated_at: string;
  is_active: number;
  created_by: number;
  updated_by: null;
  modification_justification: null;
}
