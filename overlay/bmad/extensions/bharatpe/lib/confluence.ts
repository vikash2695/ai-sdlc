import { renderMetadataBlock, type MetadataBlock, type PublishResult } from "./contracts";

export interface ConfluencePage {
  id: string;
  url: string;
  title: string;
  content: string;
}

export interface CreateConfluencePageInput {
  title: string;
  content: string;
  spaceKey?: string;
  parentPageId?: string;
}

export interface ConfluenceApi {
  getPageByUrl(url: string): Promise<ConfluencePage>;
  createPage(input: CreateConfluencePageInput): Promise<PublishResult>;
  findPageByTitle?(title: string, spaceKey?: string): Promise<ConfluencePage | null>;
}

export async function getPage(api: ConfluenceApi, url: string): Promise<ConfluencePage> {
  if (!url?.trim()) {
    throw new Error("Confluence page URL is required");
  }
  return api.getPageByUrl(url);
}

export async function createPage(
  api: ConfluenceApi,
  title: string,
  content: string,
  opts: {
    spaceKey?: string;
    parentPageId?: string;
    metadata?: MetadataBlock;
    idempotent?: boolean;
  } = {},
): Promise<PublishResult> {
  if (!title.trim()) throw new Error("Confluence page title is required");
  if (!content.trim()) throw new Error("Confluence page content is required");

  if (opts.idempotent && api.findPageByTitle) {
    const existing = await api.findPageByTitle(title, opts.spaceKey);
    if (existing) {
      return { url: existing.url, id: existing.id };
    }
  }

  const payload = opts.metadata
    ? `${renderMetadataBlock(opts.metadata)}\n\n${content}`
    : content;

  return api.createPage({
    title,
    content: payload,
    parentPageId: opts.parentPageId,
    spaceKey: opts.spaceKey,
  });
}
