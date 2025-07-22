'use client';

import type { AccordionItem } from '~/lib/data/terms-conditions';

interface Props {
  accordionItems: AccordionItem[];
}

export function TermsContent({ accordionItems }: Props) {
  return (
    <div className="space-y-8">
      {accordionItems.map((item) => (
        <section className="space-y-4" key={item.id}>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
            {item.title}
          </h2>
          
          {item.subsections ? (
            <div className="text-lg text-gray-700 leading-relaxed">
              {item.description ? (
                <p className="mb-4">{item.description}</p>
              ) : null}
              {item.subsections.map((subsection, index) => (
                <div className="mb-6" key={index}>
                  {(subsection.type === 'bullet' || (!subsection.type && !subsection.content)) ? (
                    <div>
                      <div className="flex items-start">
                        <span className="text-gray-900 mr-2">•</span>
                        <span className="text-gray-900" dangerouslySetInnerHTML={{ __html: subsection.title || '' }} />
                      </div>
                    </div>
                  ) : (
                    <div>
                      {subsection.title ? (
                        <div className="mb-2">
                          {subsection.titleStyle === 'italic' && (
                            <em className="text-gray-900">{subsection.title}</em>
                          )}
                          {subsection.titleStyle === 'normal' && (
                            <span className="text-gray-900 underline">{subsection.title}</span>
                          )}
                          {subsection.titleStyle !== 'italic' && subsection.titleStyle !== 'normal' && (
                            <strong className="text-gray-900">{subsection.title}</strong>
                          )}
                        </div>
                      ) : null}
                      {subsection.paragraphs ? (
                        <div>
                          {subsection.paragraphs.map((paragraph, pIndex) => (
                            <div className={pIndex > 0 ? 'mt-4' : ''} key={pIndex}>
                              {paragraph}
                              {subsection.links && pIndex === (subsection.paragraphs?.length || 0) - 1 && (
                                <span>
                                  <span> </span>
                                  {subsection.links.map((link, linkIndex) => (
                                    <span key={linkIndex}>
                                      <a 
                                        className={link.className || 'text-pink-600 hover:text-pink-700 underline'}
                                        href={link.href} 
                                      >
                                        {link.text}
                                      </a>
                                      {linkIndex < (subsection.links?.length || 0) - 1 && <span>, </span>}
                                    </span>
                                  ))}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span>
                          {subsection.contentWithLinks ? (
                            <>
                              {subsection.contentWithLinks.map((contentItem, itemIndex) => (
                                <span key={itemIndex}>
                                  {contentItem.type === 'text' && (
                                    <span dangerouslySetInnerHTML={{ __html: contentItem.content || '' }} />
                                  )}
                                  {contentItem.type === 'link' && contentItem.link && (
                                    <a 
                                      className={contentItem.link.className || 'text-pink-600 hover:text-pink-700 underline'}
                                      href={contentItem.link.href}
                                    >
                                      {contentItem.link.text}
                                    </a>
                                  )}
                                </span>
                              ))}
                            </>
                          ) : (
                            <>
                              <span dangerouslySetInnerHTML={{ __html: subsection.content || '' }} />
                              {subsection.links && (
                                <span>
                                  <span> </span>
                                  {subsection.links.map((link, linkIndex) => (
                                    <span key={linkIndex}>
                                      <a 
                                        className={link.className || 'text-pink-600 hover:text-pink-700 underline'}
                                        href={link.href}
                                      >
                                        {link.text}
                                      </a>
                                      {linkIndex < (subsection.links?.length || 0) - 1 && <span>, </span>}
                                    </span>
                                  ))}
                                </span>
                              )}
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-lg text-gray-700 leading-relaxed">
              {item.description ? (
                <p className="mb-4">{item.description}</p>
              ) : null}
              <div dangerouslySetInnerHTML={{ __html: item.content }} />
            </div>
          )}
        </section>
      ))}
    </div>
  );
} 