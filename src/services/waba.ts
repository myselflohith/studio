/**
 * Represents the details of a WhatsApp Business Account (WABA) template.
 */
export interface WabaTemplate {
  /**
   * The name of the template.
   */
  name: string;
  /**
   * The category of the template (e.g., marketing, transactional).
   */
  category: string;
  /**
   * The status of the template (e.g., approved, pending, rejected).
   */
  status: string;
}

/**
 * Asynchronously retrieves the details of a WABA template.
 *
 * @param templateName The name of the template to retrieve.
 * @returns A promise that resolves to a WabaTemplate object containing the template details.
 */
export async function getWabaTemplateDetails(templateName: string): Promise<WabaTemplate> {
  // TODO: Implement this by calling an API.

  return {
    name: 'sample_template',
    category: 'transactional',
    status: 'approved',
  };
}
