export interface TermsSection {
  id: string;
  title: string;
  pageTitle?: string; // For PageHeader (clean title)
  description?: string;
  accordionItems: AccordionItem[];
}

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  description?: string; // Optional intro paragraph for sections with sub-sections
  subsections?: SubSection[];
}

export interface SubSection {
  title: string;
  content: string;
  type?: 'bullet' | 'paragraph';
  titleStyle?: 'bold' | 'italic' | 'normal';
  links?: Array<{
    text: string;
    href: string;
    className?: string;
  }>;
  paragraphs?: string[]; // For multiple paragraphs with automatic spacing
  contentWithLinks?: Array<{
    type: 'text' | 'link';
    content?: string;
    link?: {
      text: string;
      href: string;
      className?: string;
    };
  }>; // For content with embedded links
}

export interface TermsNavigationItem {
  id: string;
  title: string;
  href: string;
  description?: string;
}

export interface WaiverSection {
  id: string;
  title: string;
  content?: string;
  type?: 'paragraph' | 'numbered-list';
  items?: string[];
} 