/**
 * turndown の型定義
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'turndown' {
  interface TurndownServiceOptions {
    headingStyle?: 'setext' | 'atx';
    hr?: string;
    bulletListMarker?: '-' | '+' | '*';
    codeBlockStyle?: 'indented' | 'fenced';
    fence?: '```' | '~~~';
    emDelimiter?: '_' | '*';
    strongDelimiter?: '__' | '**';
    linkStyle?: 'inlined' | 'referenced';
    linkReferenceStyle?: 'full' | 'collapsed' | 'shortcut';
    preformattedCode?: boolean;
  }

  class TurndownService {
    constructor(options?: TurndownServiceOptions);
    turndown(html: string): string;
    use(plugin: any): this;
    addRule(key: string, rule: any): this;
    keep(filter: string | string[]): this;
    remove(filter: string | string[]): this;
    escape(str: string): string;
  }

  export = TurndownService;
}